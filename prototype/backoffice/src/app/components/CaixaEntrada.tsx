import React, { useMemo, useState } from 'react';
import {
  Inbox,
  AlertCircle,
  CreditCard,
  FileCheck,
  ClipboardCheck,
  FileWarning,
  Handshake,
  Gavel,
  UserPlus,
  KeyRound,
  Plug,
  ArrowRight,
} from 'lucide-react';

type Cargo = 'financeiro' | 'tecnico' | 'gestor' | 'admin';
type Filtro = 'todos' | 'urgente' | 'semana' | 'vencidos';
type Prioridade = 'alta' | 'media' | 'baixa';

interface InboxItem {
  id: string;
  tipo: 'pagamento' | 'prestacao' | 'documento' | 'avaliacao' | 'parecer' | 'aprovacao' | 'parceria' | 'recurso' | 'usuario' | 'config' | 'integracao';
  titulo: string;
  contexto: string;
  prazoDias: number;
  prioridade: Prioridade;
  acaoLabel: string;
  destino?: string;
}

interface CaixaEntradaProps {
  isLight: boolean;
  onNavigate?: (destino: string) => void;
}

const cargoLabel: Record<Cargo, string> = {
  financeiro: 'Analista Financeiro',
  tecnico: 'Analista Técnico',
  gestor: 'Gestor / Diretor',
  admin: 'Administrador',
};

interface Fila {
  key: string;
  label: string;
  tipos: InboxItem['tipo'][];
}

const filasPorCargo: Record<Cargo, Fila[]> = {
  financeiro: [
    { key: 'pagamentos',  label: 'Pagamentos em validação',           tipos: ['pagamento'] },
    { key: 'prestacoes',  label: 'Prestações de contas pra revisar',  tipos: ['prestacao'] },
    { key: 'docsFiscais', label: 'Documentos fiscais inconsistentes', tipos: ['documento'] },
  ],
  tecnico: [
    { key: 'avaliacoes', label: 'Avaliações de mérito atribuídas',  tipos: ['avaliacao'] },
    { key: 'pareceres',  label: 'Pareceres devolvidos pra ajuste',  tipos: ['parecer'] },
  ],
  gestor: [
    { key: 'aprovacoes', label: 'Aprovações de alçada',     tipos: ['aprovacao', 'parceria'] },
    { key: 'recursos',   label: 'Vetos e decisões finais',  tipos: ['recurso'] },
  ],
  admin: [
    { key: 'usuarios',     label: 'Usuários aguardando perfil',  tipos: ['usuario'] },
    { key: 'configuracoes',label: 'Configurações expirando',     tipos: ['config'] },
    { key: 'integracoes',  label: 'Integrações com erro',        tipos: ['integracao'] },
  ],
};

const itensPorCargo: Record<Cargo, InboxItem[]> = {
  financeiro: [
    { id: 'f1', tipo: 'pagamento',  titulo: '12 pagamentos em validação',                  contexto: 'Conecta Fapes',                       prazoDias: 2,  prioridade: 'alta',  acaoLabel: 'Validar lote',     destino: 'financeira' },
    { id: 'f2', tipo: 'prestacao',  titulo: '3 prestações de contas pra revisar',          contexto: 'Outras Iniciativas',                  prazoDias: 5,  prioridade: 'alta',  acaoLabel: 'Abrir lista',       destino: 'financeira' },
    { id: 'f3', tipo: 'documento',  titulo: '5 documentos fiscais inconsistentes',         contexto: 'Notas Magazine Luiza · Kalunga',      prazoDias: 1,  prioridade: 'alta',  acaoLabel: 'Revisar',           destino: 'documentos' },
    { id: 'f4', tipo: 'pagamento',  titulo: 'Boleto Magazine Luiza · R$ 3.456,70',         contexto: 'Conecta Fapes · vence hoje',          prazoDias: 0,  prioridade: 'alta',  acaoLabel: 'Validar',           destino: 'financeira' },
    { id: 'f5', tipo: 'pagamento',  titulo: 'Pix Amazon · R$ 5.234,20',                    contexto: 'Outra Iniciativa Exemplo',            prazoDias: 3,  prioridade: 'media', acaoLabel: 'Validar',           destino: 'financeira' },
    { id: 'f6', tipo: 'documento',  titulo: 'Recibo Kalunga sem CNPJ válido',              contexto: 'Mais uma Iniciativa Exemplo',         prazoDias: -1, prioridade: 'alta',  acaoLabel: 'Solicitar correção', destino: 'documentos' },
    { id: 'f7', tipo: 'prestacao',  titulo: 'Conciliação bancária de fevereiro',           contexto: 'Conta corrente FAPES',                prazoDias: 7,  prioridade: 'media', acaoLabel: 'Iniciar',           destino: 'financeira' },
    { id: 'f8', tipo: 'documento',  titulo: 'Relatório financeiro mensal pendente',        contexto: 'Encerramento de fevereiro',           prazoDias: 10, prioridade: 'baixa', acaoLabel: 'Gerar relatório',    destino: 'financeira' },
  ],
  tecnico: [
    { id: 't1', tipo: 'avaliacao', titulo: '4 avaliações de mérito atribuídas',          contexto: 'Edital 003/2026 · Inovação',          prazoDias: 4,  prioridade: 'alta',  acaoLabel: 'Avaliar agora',     destino: 'tecnica' },
    { id: 't2', tipo: 'parecer',   titulo: '2 pareceres devolvidos pra ajuste',           contexto: 'Coordenação técnica · Edital 002',    prazoDias: 2,  prioridade: 'alta',  acaoLabel: 'Ajustar parecer',    destino: 'tecnica' },
    { id: 't3', tipo: 'avaliacao', titulo: 'Avaliação Projeto Bioma Capixaba',           contexto: 'Conecta Fapes · proposta #1284',      prazoDias: 6,  prioridade: 'media', acaoLabel: 'Abrir proposta',    destino: 'tecnica' },
    { id: 't4', tipo: 'parecer',   titulo: 'Reunião do comitê técnico',                  contexto: 'Edital 003/2026 · presencial',        prazoDias: 3,  prioridade: 'media', acaoLabel: 'Ver agenda',        destino: 'tecnica' },
    { id: 't5', tipo: 'avaliacao', titulo: 'Parecer consolidado Edital 002',             contexto: 'Coordenação · entrega final',         prazoDias: 8,  prioridade: 'baixa', acaoLabel: 'Consolidar',         destino: 'tecnica' },
    { id: 't6', tipo: 'parecer',   titulo: 'Convite a avaliador externo · Profa. Y. Dias', contexto: 'Edital 004/2026',                    prazoDias: 10, prioridade: 'baixa', acaoLabel: 'Confirmar',          destino: 'tecnica' },
  ],
  gestor: [
    { id: 'g1', tipo: 'aprovacao', titulo: 'Aprovação de edital · R$ 2,5 mi',            contexto: 'Programa Inovação 2026',              prazoDias: 0,  prioridade: 'alta',  acaoLabel: 'Aprovar',            destino: 'editais' },
    { id: 'g2', tipo: 'recurso',   titulo: 'Recurso administrativo · decisão final',     contexto: 'Projeto #1248 · Conecta Fapes',       prazoDias: 2,  prioridade: 'alta',  acaoLabel: 'Decidir',            destino: 'editais' },
    { id: 'g3', tipo: 'parceria',  titulo: 'Parceria FAPES × USP aguardando assinatura', contexto: 'Termo de cooperação técnica',         prazoDias: 5,  prioridade: 'alta',  acaoLabel: 'Assinar',            destino: 'parceria' },
    { id: 'g4', tipo: 'aprovacao', titulo: 'Aprovação de alçada · R$ 850 mil',           contexto: 'Conecta Fapes · captação extra',      prazoDias: 4,  prioridade: 'media', acaoLabel: 'Revisar',            destino: 'editais' },
    { id: 'g5', tipo: 'aprovacao', titulo: 'Resolução 042/2026 · veto ou homologação',   contexto: 'Conselho deliberativo',               prazoDias: 7,  prioridade: 'media', acaoLabel: 'Decidir',            destino: 'planejamento' },
    { id: 'g6', tipo: 'aprovacao', titulo: 'Relatório executivo trimestral',             contexto: 'Q1/2026 · revisão final',             prazoDias: 14, prioridade: 'baixa', acaoLabel: 'Revisar',            destino: 'planejamento' },
  ],
  admin: [
    { id: 'a1', tipo: 'usuario',     titulo: '5 usuários aguardando perfil',            contexto: 'Solicitações há 3 dias',              prazoDias: -3, prioridade: 'alta',  acaoLabel: 'Atribuir perfil',    destino: 'pessoas' },
    { id: 'a2', tipo: 'config',      titulo: 'Certificado SSL do backoffice expirando',  contexto: 'Vence em 5 dias',                     prazoDias: 5,  prioridade: 'alta',  acaoLabel: 'Renovar',            destino: 'configuracoes' },
    { id: 'a3', tipo: 'integracao',  titulo: 'Integração Receita Federal com erro',     contexto: 'Falhando há 2 dias · timeout',        prazoDias: -2, prioridade: 'alta',  acaoLabel: 'Investigar',         destino: 'configuracoes' },
    { id: 'a4', tipo: 'config',      titulo: 'Backup semanal não executado',            contexto: 'Última execução: ontem 02:00',        prazoDias: -1, prioridade: 'media', acaoLabel: 'Disparar agora',     destino: 'configuracoes' },
    { id: 'a5', tipo: 'config',      titulo: 'Auditoria de logs · Janeiro',             contexto: 'Compliance interno',                  prazoDias: 10, prioridade: 'media', acaoLabel: 'Abrir auditoria',    destino: 'configuracoes' },
    { id: 'a6', tipo: 'config',      titulo: 'Atualização de termos de uso',            contexto: 'Versão 2.3 · jurídico aprovou',       prazoDias: 12, prioridade: 'baixa', acaoLabel: 'Publicar',           destino: 'configuracoes' },
  ],
};

const tipoIcon: Record<InboxItem['tipo'], React.ComponentType<{ size?: number; color?: string }>> = {
  pagamento:  CreditCard,
  prestacao:  FileCheck,
  documento:  FileWarning,
  avaliacao:  ClipboardCheck,
  parecer:    ClipboardCheck,
  aprovacao:  Gavel,
  parceria:   Handshake,
  recurso:    Gavel,
  usuario:    UserPlus,
  config:     KeyRound,
  integracao: Plug,
};

const formatPrazo = (dias: number): { texto: string; vencido: boolean; hoje: boolean } => {
  if (dias < 0) return { texto: `vencido há ${Math.abs(dias)}d`, vencido: true,  hoje: false };
  if (dias === 0) return { texto: 'vence hoje',                 vencido: false, hoje: true };
  if (dias === 1) return { texto: 'vence amanhã',               vencido: false, hoje: false };
  return { texto: `vence em ${dias}d`, vencido: false, hoje: false };
};

export const CaixaEntrada: React.FC<CaixaEntradaProps> = ({ isLight, onNavigate }) => {
  const [cargo, setCargo] = useState<Cargo>('financeiro');
  const [filtro, setFiltro] = useState<Filtro>('todos');

  const T = {
    bgPage:        isLight ? '#f6f8fb' : '#0b1222',
    bgCard:        isLight ? '#ffffff' : 'rgba(255,255,255,0.04)',
    cardBorder:    isLight ? '#e2e8f0' : 'rgba(255,255,255,0.1)',
    textPrimary:   isLight ? '#0f172a' : '#ffffff',
    textSecondary: isLight ? '#475569' : 'rgba(255,255,255,0.7)',
    textMuted:     isLight ? '#94a3b8' : 'rgba(255,255,255,0.5)',
    chipBg:        isLight ? '#f1f5f9' : 'rgba(255,255,255,0.06)',
    chipBgActive:  '#00c1af',
    chipTextActive:'#0f172b',
    iconBg:        isLight ? '#f0fdfa' : 'rgba(0,193,175,0.12)',
    iconColor:     '#00c1af',
    danger:        '#ef4444',
    warning:       '#f59e0b',
    hover:         isLight ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.04)',
  };

  const aplicaFiltro = (itens: InboxItem[]): InboxItem[] => {
    switch (filtro) {
      case 'urgente':  return itens.filter(i => i.prazoDias <= 2 && i.prazoDias >= 0);
      case 'semana':   return itens.filter(i => i.prazoDias > 2 && i.prazoDias <= 7);
      case 'vencidos': return itens.filter(i => i.prazoDias < 0);
      default:         return itens;
    }
  };

  const filasRender = useMemo(() => {
    const base = itensPorCargo[cargo];
    return filasPorCargo[cargo].map((fila) => {
      const itensDaFila = base.filter((i) => fila.tipos.includes(i.tipo));
      return {
        ...fila,
        itensTotal: itensDaFila.length,
        itensFiltrados: aplicaFiltro(itensDaFila),
      };
    });
  }, [cargo, filtro]);

  const contadores = useMemo(() => {
    const base = itensPorCargo[cargo];
    return {
      todos:    base.length,
      urgente:  base.filter(i => i.prazoDias <= 2 && i.prazoDias >= 0).length,
      semana:   base.filter(i => i.prazoDias > 2 && i.prazoDias <= 7).length,
      vencidos: base.filter(i => i.prazoDias < 0).length,
    };
  }, [cargo]);

  const totalFiltrado = filasRender.reduce((acc, f) => acc + f.itensFiltrados.length, 0);

  const filtros: { key: Filtro; label: string; count: number }[] = [
    { key: 'todos',    label: 'Tudo',         count: contadores.todos },
    { key: 'urgente',  label: 'Urgente',      count: contadores.urgente },
    { key: 'semana',   label: 'Esta semana',  count: contadores.semana },
    { key: 'vencidos', label: 'Vencidos',     count: contadores.vencidos },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: T.bgPage, paddingTop: '88px', paddingLeft: '32px', paddingRight: '32px', paddingBottom: '40px', transition: 'background-color 0.3s' }}>
      <div className="mx-auto" style={{ maxWidth: '1080px' }}>
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center" style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: T.iconBg }}>
              <Inbox size={20} color={T.iconColor} />
            </div>
            <h1 style={{ fontFamily: 'var(--font-family)', fontSize: '28px', fontWeight: 700, color: T.textPrimary, margin: 0 }}>
              Caixa de Entrada
            </h1>
          </div>
          <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: T.textSecondary, margin: 0 }}>
            Suas pendências do dia, ordenadas por prazo. A lista muda conforme o cargo selecionado.
          </p>
        </div>

        {/* Seletor de cargo */}
        <div className="mb-6">
          <span style={{ fontFamily: 'var(--font-family)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.05em', color: T.textMuted, textTransform: 'uppercase' }}>
            Visualizar como
          </span>
          <div className="flex flex-wrap gap-2 mt-2">
            {(Object.keys(cargoLabel) as Cargo[]).map((c) => {
              const ativo = cargo === c;
              return (
                <button
                  key={c}
                  onClick={() => { setCargo(c); setFiltro('todos'); }}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '999px',
                    border: ativo ? '1px solid #00c1af' : `1px solid ${T.cardBorder}`,
                    backgroundColor: ativo ? T.chipBgActive : T.chipBg,
                    color: ativo ? T.chipTextActive : T.textSecondary,
                    fontFamily: 'var(--font-family)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: ativo ? 600 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  {cargoLabel[c]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap items-center gap-1 mb-6" style={{ borderBottom: `1px solid ${T.cardBorder}`, paddingBottom: '4px' }}>
          {filtros.map(({ key, label, count }) => {
            const ativo = filtro === key;
            return (
              <button
                key={key}
                onClick={() => setFiltro(key)}
                style={{
                  padding: '10px 14px',
                  border: 'none',
                  borderBottom: ativo ? '2px solid #00c1af' : '2px solid transparent',
                  backgroundColor: 'transparent',
                  color: ativo ? T.textPrimary : T.textSecondary,
                  fontFamily: 'var(--font-family)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: ativo ? 600 : 500,
                  cursor: 'pointer',
                  marginBottom: '-1px',
                  transition: 'color 0.15s, border-color 0.15s',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                {label}
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: '22px',
                  height: '20px',
                  padding: '0 6px',
                  borderRadius: '999px',
                  backgroundColor: ativo ? T.chipBgActive : T.chipBg,
                  color: ativo ? T.chipTextActive : T.textMuted,
                  fontSize: '11px',
                  fontWeight: 700,
                }}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Filas agrupadas por tipo de tarefa */}
        {totalFiltrado === 0 ? (
          <div style={{ padding: '64px 24px', textAlign: 'center', borderRadius: '12px', border: `1px dashed ${T.cardBorder}`, backgroundColor: T.bgCard }}>
            <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-base)', fontWeight: 600, color: T.textPrimary, margin: '0 0 6px 0' }}>
              Você está em dia.
            </p>
            <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: T.textSecondary, margin: 0 }}>
              Nada pendente nesse filtro.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {filasRender.map((fila) => (
              <section key={fila.key}>
                {/* Cabeçalho da fila */}
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '12px' }}>
                  <h2 style={{ fontFamily: 'var(--font-family)', fontSize: '15px', fontWeight: 700, color: T.textPrimary, margin: 0, letterSpacing: '-0.01em' }}>
                    {fila.label}
                  </h2>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: '24px',
                    height: '22px',
                    padding: '0 8px',
                    borderRadius: '999px',
                    backgroundColor: T.chipBg,
                    color: T.textSecondary,
                    fontFamily: 'var(--font-family)',
                    fontSize: '11px',
                    fontWeight: 700,
                  }}>
                    {fila.itensFiltrados.length}{filtro !== 'todos' && fila.itensFiltrados.length !== fila.itensTotal ? `/${fila.itensTotal}` : ''}
                  </span>
                </div>

                {/* Itens da fila ou empty da fila */}
                {fila.itensFiltrados.length === 0 ? (
                  <div style={{ padding: '20px', borderRadius: '10px', border: `1px dashed ${T.cardBorder}`, backgroundColor: 'transparent' }}>
                    <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: T.textMuted, margin: 0 }}>
                      Nenhum item nesse filtro.
                    </p>
                  </div>
                ) : (
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {fila.itensFiltrados.map((item) => {
                      const Icon = tipoIcon[item.tipo];
                      const prazo = formatPrazo(item.prazoDias);
                      const prazoColor = prazo.vencido ? T.danger : prazo.hoje ? T.warning : T.textSecondary;

                      return (
                        <li
                          key={item.id}
                          style={{
                            display: 'grid',
                            gridTemplateColumns: '40px minmax(0, 1fr) auto auto',
                            alignItems: 'center',
                            gap: '16px',
                            padding: '14px 18px',
                            borderRadius: '12px',
                            border: `1px solid ${T.cardBorder}`,
                            backgroundColor: T.bgCard,
                            transition: 'background-color 0.15s, border-color 0.15s',
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = T.hover; e.currentTarget.style.borderColor = 'rgba(0,193,175,0.32)'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = T.bgCard; e.currentTarget.style.borderColor = T.cardBorder; }}
                        >
                          <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: T.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Icon size={18} color={T.iconColor} />
                          </div>

                          <div style={{ minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                              <span style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-base)', fontWeight: 600, color: T.textPrimary, lineHeight: 1.3 }}>
                                {item.titulo}
                              </span>
                              {item.prioridade === 'alta' && (
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '2px 8px', borderRadius: '999px', backgroundColor: 'rgba(239,68,68,0.12)', color: T.danger, fontSize: '11px', fontWeight: 700 }}>
                                  <AlertCircle size={12} />
                                  alta
                                </span>
                              )}
                            </div>
                            <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: T.textSecondary, margin: '4px 0 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {item.contexto}
                            </p>
                          </div>

                          <span style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', fontWeight: 600, color: prazoColor, whiteSpace: 'nowrap' }}>
                            {prazo.texto}
                          </span>

                          <button
                            onClick={() => item.destino && onNavigate?.(item.destino)}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '8px 14px',
                              borderRadius: '8px',
                              border: '1px solid rgba(0,193,175,0.4)',
                              backgroundColor: 'transparent',
                              color: '#00c1af',
                              fontFamily: 'var(--font-family)',
                              fontSize: 'var(--text-sm)',
                              fontWeight: 600,
                              cursor: 'pointer',
                              transition: 'background-color 0.15s, border-color 0.15s',
                              whiteSpace: 'nowrap',
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(0,193,175,0.1)'; e.currentTarget.style.borderColor = '#00c1af'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.borderColor = 'rgba(0,193,175,0.4)'; }}
                          >
                            {item.acaoLabel}
                            <ArrowRight size={14} />
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
