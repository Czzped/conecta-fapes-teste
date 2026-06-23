#!/usr/bin/env python3
"""Constrói o Mapa de Capacidades a partir das fontes do repo.

Fontes:
  - docs/data/capacidades.yaml          (AUTORAL: nós, importância, impacto, status, arestas transversais)
  - docs/implementation/modules/**/ontology.yaml  (estrutural: entidades, eventos, imports/refs -> arestas)
  - docs/implementation/modules/**/EPIC-*.md      (entrega: epics, user stories, dependências de epic)

Saídas (geradas):
  - docs/data/epics.yaml                (snapshot legível dos epics)
  - docs/data/ontology_data.json        (snapshot do grafo estrutural)
  - docs/assets/mapa-capacidades.html   (app standalone com os dados embutidos)

Uso:
  python tools/build_capacidades.py     # regenera tudo
Também é chamado automaticamente no build do MkDocs (tools/mkdocs_hooks.py).
"""
import re, json, glob, os, collections, sys
from pathlib import Path
import yaml

REPO = Path(__file__).resolve().parent.parent
MODULES = REPO / "docs/implementation/modules"
DATA = REPO / "docs/data"
ASSETS = REPO / "docs/assets"
VALID = re.compile(r"^M0\d\d$")


# ------------------------------------------------------------------ ontology
def parse_ontology():
    files = sorted(glob.glob(str(MODULES / "**/ontology.yaml"), recursive=True))
    ns2mod, parsed = {}, {}

    def mod_from_path(p):
        m = re.search(r"/(M0\d\d)-", p)
        return m.group(1) if m else None

    for f in files:
        raw = re.sub(r"path:\s*path:", "path:", open(f).read())  # conserta 'path: path:'
        try:
            d = yaml.safe_load(raw) or {}
        except Exception as e:
            print(f"  WARN ontology {f}: {e}", file=sys.stderr); continue
        parsed[f] = d
        mod = (d.get("metadata") or {}).get("module") or mod_from_path(f)
        if d.get("namespace") and mod:
            ns2mod[d["namespace"]] = mod

    def ns_to_mod(q):
        if not isinstance(q, str): return None
        parts = q.replace("ref:", "").strip().split(".")
        for i in range(len(parts), 0, -1):
            c = ".".join(parts[:i])
            if c in ns2mod: return ns2mod[c]
        return None

    mods = collections.defaultdict(lambda: {"namespaces": set(), "entities": {},
            "events": [], "workflows": [], "deps": collections.Counter()})
    edges = collections.defaultdict(set)

    def add_edge(prov, cons, reason):
        if prov and cons and prov != cons and VALID.match(str(prov)) and VALID.match(str(cons)):
            edges[(prov, cons)].add(reason)
            mods[cons]["deps"][prov] += 1

    for f, d in parsed.items():
        mod = (d.get("metadata") or {}).get("module") or mod_from_path(f)
        if not mod or not VALID.match(mod): continue
        Mx = mods[mod]
        if d.get("namespace"): Mx["namespaces"].add(d["namespace"])
        for imp in (d.get("imports") or []):
            if isinstance(imp, dict):
                tgt = ns_to_mod(imp.get("namespace"))
                pm = re.search(r"(M0\d\d)-", str(imp.get("path") or ""))
                if pm: tgt = tgt or pm.group(1)
                if tgt: add_edge(tgt, mod, "import")
        for name, e in (d.get("entities") or {}).items():
            if not isinstance(e, dict): continue
            if name not in Mx["entities"]:
                Mx["entities"][name] = (e.get("description") or "").strip()[:140]
            for fld in (e.get("fields") or {}).values():
                if isinstance(fld, dict) and isinstance(fld.get("type"), str) and fld["type"].startswith("ref:"):
                    tgt = ns_to_mod(fld["type"])
                    if tgt and tgt != mod: add_edge(tgt, mod, "ref")
        for rel in (d.get("relationships") or []):
            if isinstance(rel, dict):
                for k in ("to", "from"):
                    tgt = ns_to_mod(rel.get(k))
                    if tgt and tgt != mod: add_edge(tgt, mod, "rel")
        ev = d.get("events")
        if isinstance(ev, list):
            for e in ev:
                if isinstance(e, dict):
                    nm = e.get("name") or e.get("id") or ""
                    if nm: Mx["events"].append({"nome": nm, "desc": (e.get("description") or "").strip()[:120]})
                elif isinstance(e, str):
                    Mx["events"].append({"nome": e, "desc": ""})
        wf = d.get("workflows")
        if isinstance(wf, dict): Mx["workflows"] += list(wf.keys())
        elif isinstance(wf, list):
            for w in wf:
                Mx["workflows"].append(w.get("name") or w.get("id") or "" if isinstance(w, dict) else w)

    out = {"modules": {}, "edges": []}
    for mod, Mx in sorted(mods.items()):
        out["modules"][mod] = {
            "entities": [{"nome": k, "desc": v} for k, v in Mx["entities"].items()],
            "events": Mx["events"],
            "workflows": sorted(set(w for w in Mx["workflows"] if w)),
            "deps": dict(Mx["deps"]),
        }
    out["edges"] = sorted([[p, c, sorted(r)] for (p, c), r in edges.items()])
    return out


# ------------------------------------------------------------------ epics
def parse_epics():
    files = sorted(glob.glob(str(MODULES / "**/EPIC-*.md"), recursive=True))

    def sect(txt, head):
        m = re.search(r"^##\s+" + re.escape(head) + r"\s*$(.*?)(?=^##\s|\Z)", txt, re.M | re.S | re.I)
        return m.group(1).strip() if m else ""

    def status_norm(s):
        s = s.strip().lower()
        if not s or s in ("—", "-", "#—"): return "todo"
        if "done" in s or "conclu" in s or "✅" in s: return "done"
        if "doing" in s or "progress" in s or "andamento" in s or "wip" in s: return "doing"
        return "todo"

    by_mod = collections.defaultdict(list)
    for f in files:
        txt = open(f).read()
        fid = re.search(r"(EPIC-(M0\d\d)-\d+)", os.path.basename(f))
        if not fid: continue
        eid, mod = fid.group(1), fid.group(2)
        ht = re.search(re.escape(eid) + r"\s*[:–—-]+\s*(.+)", txt)
        titulo = ht.group(1).strip() if ht else eid
        ms = re.search(r"\*\*Milestone\*\*\s*\|\s*\[?\s*(MS-\d+)", txt)
        milestone = ms.group(1) if ms else ""
        obj = re.sub(r"\s+", " ", sect(txt, "Objetivo")).strip()
        if obj: obj = re.split(r"(?<=[.;])\s", obj)[0][:160]
        dep_sec = sect(txt, "Dependencias") or sect(txt, "Dependências")

        def grab(label):
            mm = re.search(r"\*\*" + label + r"\*\*\s*:?\s*(.+)", dep_sec, re.I)
            line = mm.group(1) if mm else ""
            eps = sorted(set(re.findall(r"EPIC-M0\d\d-\d+", line)))
            line_wo = re.sub(r"EPIC-M0\d\d-\d+", "", line)
            mods = sorted(set(x for x in re.findall(r"\bM0\d\d\b", line_wo) if x != mod))
            return eps, mods

        dep_e, dep_m = grab("Depende de")
        hab_e, hab_m = grab("Habilita")
        us_sec = sect(txt, "User Stories")
        st_by_id = {}
        for row in re.findall(r"^\|\s*(US-M0\d\d-\d+)\s*\|(.+)$", us_sec, re.M):
            cells = [c.strip() for c in row[1].split("|") if c.strip()]
            st_by_id[row[0]] = status_norm(cells[-1] if cells else "")
        for uid in re.findall(r"^###\s+(US-M0\d\d-\d+)", us_sec, re.M):
            st_by_id.setdefault(uid, "todo")
        us = collections.Counter(st_by_id.values())
        by_mod[mod].append({
            "id": eid, "titulo": titulo, "objetivo": obj, "milestone": milestone,
            "depende_epics": dep_e, "depende_modulos": dep_m,
            "habilita_epics": hab_e, "habilita_modulos": hab_m,
            "us_total": len(st_by_id),
            "us": {"todo": us.get("todo", 0), "doing": us.get("doing", 0), "done": us.get("done", 0)},
        })
    return {m: sorted(by_mod[m], key=lambda e: e["id"]) for m in sorted(by_mod)}


# ------------------------------------------------------------------ merge
def merge(cap, onto, epics):
    mods = {}
    for m in cap["modulos"]:
        mods[m["id"]] = {
            "id": m["id"], "nome": m["nome"], "dominio": m["dominio"], "nivel": m["nivel"],
            "transversal": 1 if m.get("transversal") else 0, "status": m.get("status", "especificado"),
            "importancia": m["importancia"], "impacto": m["impacto"], "proposito": m["proposito"],
            "ent": m.get("entidades_chave") or [], "hab": [], "dep": [],
        }
    edge = {}
    for m in cap["modulos"]:
        for h in (m.get("habilita") or []):
            edge.setdefault((m["id"], h["modulo"]), {"tipo": h["tipo"], "fontes": set()})["fontes"].add("autoral")
    for prov, cons, _r in onto["edges"]:
        edge.setdefault((prov, cons), {"tipo": "dados", "fontes": set()})["fontes"].add("ontologia")
    for (prov, cons), e in edge.items():
        if prov not in mods or cons not in mods: continue
        fonte = "+".join(sorted(e["fontes"]))
        mods[prov]["hab"].append({"to": cons, "tipo": e["tipo"], "fonte": fonte})
        mods[cons]["dep"].append({"to": prov, "tipo": e["tipo"], "fonte": fonte})
    adj = collections.defaultdict(list)
    for (p, c) in edge:
        if p in mods and c in mods: adj[p].append(c)

    def reach(s):
        seen, st = set(), [s]
        while st:
            for t in adj.get(st.pop(), []):
                if t not in seen: seen.add(t); st.append(t)
        return seen

    for mid, Mx in mods.items():
        Mx["alcance"] = len(reach(mid))
        o = onto["modules"].get(mid, {})
        Mx["ontologia"] = {"entidades": o.get("entities", [])[:24],
                           "eventos": o.get("events", [])[:20], "workflows": o.get("workflows", [])}
        Mx["epics"] = epics.get(mid, [])
        us = collections.Counter()
        for e in Mx["epics"]:
            for k, v in (e.get("us") or {}).items(): us[k] += v
        Mx["epics_resumo"] = {"epics": len(Mx["epics"]), "us_total": sum(us.values()),
                              "todo": us["todo"], "doing": us["doing"], "done": us["done"]}
    return {"meta": cap["meta"], "dominios": cap["dominios"], "niveis": cap["niveis"],
            "escalas": cap["escalas"], "modulos": [mods[k] for k in sorted(mods, key=lambda x: int(x[1:]))]}


def main():
    cap = yaml.safe_load(open(DATA / "capacidades.yaml"))
    onto = parse_ontology()
    epics = parse_epics()
    DATA.mkdir(parents=True, exist_ok=True)
    ASSETS.mkdir(parents=True, exist_ok=True)
    yaml.safe_dump({"epics_por_modulo": epics}, open(DATA / "epics.yaml", "w"),
                   allow_unicode=True, sort_keys=False, width=100)
    json.dump(onto, open(DATA / "ontology_data.json", "w"), ensure_ascii=False, indent=1)
    full = merge(cap, onto, epics)
    tmpl = (ASSETS / "mapa-capacidades.tmpl.html").read_text()
    js = "const DATA=" + json.dumps(full, ensure_ascii=False, separators=(",", ":")) + ";"
    (ASSETS / "mapa-capacidades.html").write_text(tmpl.replace("//__DATA__", js))
    n_ep = sum(len(v) for v in epics.values())
    print(f"[capacidades] {len(full['modulos'])} módulos · {len(onto['edges'])} arestas ontology · {n_ep} epics -> docs/assets/mapa-capacidades.html")


if __name__ == "__main__":
    main()
