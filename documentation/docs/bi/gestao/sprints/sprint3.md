
# 3 - LEVANTAR INFRAESTRUTURA DE BI NO LEDS
Levantar a infraestrutura de BI no LEDS, contendo o banco Stage Data, Apache Airflow e Power BI conectados.

## Dados do Sprint
* **Goal**:  Levantar a infraestrutura de BI no LEDS, contendo o banco Stage Data, Apache Airflow e Power BI conectados.
* **Data Início**: 16/12/2024
* **Data Fim**: 20/12/2024
* **Status**: CLOSED
## Sprint Backlog

|Nome |Resposável |Data de Inicío | Data Planejada | Status|
|:----|:--------  |:-------:       | :----------:  | :---: |
|Validar as medidas e indicadores |Felipe Costabeber|09/12/2024|10/12/2024|TODO|
|Criar arquivos Python para ETL|Mateus Lannes |11/12/2024|12/12/2024|DONE|
|Criar arquivos Python para ETL|Felipe Costabeber|11/12/2024|12/12/2024|DONE|
|Transformar arquivos Python em DAGs|Mateus Lannes |11/12/2024|12/12/2024|DONE|
|Testar conexões|Mateus Lannes |12/12/2024|12/12/2024|DONE|
|Criar DAGs|Mateus Lannes |12/12/2024|12/12/2024|DOING|
|Testar repositório|Felipe Costabeber|12/12/2024|12/12/2024|DONE|
|Testar pipelines ETL|Mateus Lannes |12/12/2024|12/12/2024|DONE|
|Importar dados no Power BI|Mateus Lannes |12/12/2024|12/12/2024|DONE|
|Criar modelo de dados no Power BI|Mateus Lannes |12/12/2024|13/12/2024|DONE|
|Validar relatórios e gráficos no Power BI|Mateus Lannes |13/12/2024|13/12/2024|DONE|

# Análise de Dependências do Sprint

Análise gerada em: 14/01/2025, 15:22:28

## 🔍 Grafo de Dependências

```mermaid
graph BT
    classDef sprint fill:#a8e6cf,stroke:#333,stroke-width:2px;
    classDef done fill:#98fb98,stroke:#333,stroke-width:2px;
    classDef external fill:#ffd3b6,stroke:#333,stroke-width:1px;
    bi.identificarobjetivo.definirmedidasindicadores.pesquisar["🔍 bi.identificarobjetivo.definirmedidasindicadores.pesquisar<br>⚠️ Dependência Externa"]:::external
    bi.levantarinfraestruturaleds.configurarairflowetl.criardagsetl["🔍 bi.levantarinfraestruturaleds.configurarairflowetl.criardagsetl<br>⚠️ Dependência Externa"]:::external
    bi.levantarinfraestruturaleds.configurarairflowetl.criararquivopythonetl["🔍 bi.levantarinfraestruturaleds.configurarairflowetl.criararquivopythonetl<br>⚠️ Dependência Externa"]:::external
    bi.instalarairflow.configurarconexoes["🔍 bi.instalarairflow.configurarconexoes<br>⚠️ Dependência Externa"]:::external
    bi.instalarairflow.criardags["🔍 bi.instalarairflow.criardags<br>⚠️ Dependência Externa"]:::external
    bi.levantarinfraestruturaleds.conectarbancoaopowerbi.importardadosnopowerbi["🔍 bi.levantarinfraestruturaleds.conectarbancoaopowerbi.importardadosnopowerbi<br>⚠️ Dependência Externa"]:::external
    bi.levantarinfraestruturaleds.conectarbancoaopowerbi.criarmodelopowerbi["🔍 bi.levantarinfraestruturaleds.conectarbancoaopowerbi.criarmodelopowerbi<br>⚠️ Dependência Externa"]:::external
    definirmedidasindicadores.validar["📝 Tarefa: Validar as medidas e indicadores <br>📊 Estado: TODO<br>👤 Responsável: Felipe Costabeber"]:::sprint
    configurarairflowetl.criararquivopythonetl["📝 Tarefa: Criar arquivos Python para ETL<br>📊 Estado: DONE<br>👤 Responsável: Mateus Lannes "]:::done
    configurarairflowetl.criararquivopythonetl2["📝 Tarefa: Criar arquivos Python para ETL<br>📊 Estado: DONE<br>👤 Responsável: Felipe Costabeber"]:::done
    configurarairflowetl.criardagsetl["📝 Tarefa: Transformar arquivos Python em DAGs<br>📊 Estado: DONE<br>👤 Responsável: Mateus Lannes "]:::done
    configurarconexoes.testarconexoes["📝 Tarefa: Testar conexões<br>📊 Estado: DONE<br>👤 Responsável: Mateus Lannes "]:::done
    criardags.criardags["📝 Tarefa: Criar DAGs<br>📊 Estado: DOING<br>👤 Responsável: Mateus Lannes "]:::sprint
    subirrepositorio.testarrepositorio["📝 Tarefa: Testar repositório<br>📊 Estado: DONE<br>👤 Responsável: Felipe Costabeber"]:::done
    configurarairflowetl.testarpipelinesetl["📝 Tarefa: Testar pipelines ETL<br>📊 Estado: DONE<br>👤 Responsável: Mateus Lannes "]:::done
    conectarbancoaopowerbi.importardadosnopowerbi["📝 Tarefa: Importar dados no Power BI<br>📊 Estado: DONE<br>👤 Responsável: Mateus Lannes "]:::done
    conectarbancoaopowerbi.criarmodelopowerbi["📝 Tarefa: Criar modelo de dados no Power BI<br>📊 Estado: DONE<br>👤 Responsável: Mateus Lannes "]:::done
    conectarbancoaopowerbi.criarrelatoriospowerbi["📝 Tarefa: Validar relatórios e gráficos no Power BI<br>📊 Estado: DONE<br>👤 Responsável: Mateus Lannes "]:::done
    definirmedidasindicadores.validar -.-> bi.identificarobjetivo.definirmedidasindicadores.pesquisar
    configurarairflowetl.criararquivopythonetl -.-> bi.levantarinfraestruturaleds.configurarairflowetl.criardagsetl
    configurarairflowetl.criararquivopythonetl2 -.-> bi.levantarinfraestruturaleds.configurarairflowetl.criardagsetl
    configurarairflowetl.criardagsetl -.-> bi.levantarinfraestruturaleds.configurarairflowetl.criararquivopythonetl
    configurarconexoes.testarconexoes -.-> bi.instalarairflow.configurarconexoes
    subirrepositorio.testarrepositorio -.-> bi.instalarairflow.criardags
    configurarairflowetl.testarpipelinesetl -.-> bi.levantarinfraestruturaleds.configurarairflowetl.criardagsetl
    conectarbancoaopowerbi.criarmodelopowerbi -.-> bi.levantarinfraestruturaleds.conectarbancoaopowerbi.importardadosnopowerbi
    conectarbancoaopowerbi.criarrelatoriospowerbi -.-> bi.levantarinfraestruturaleds.conectarbancoaopowerbi.criarmodelopowerbi
```

**Legenda:**
- 🟢 Verde Claro: Issues no sprint
- 🟢 Verde Escuro: Issues concluídas
- 🟡 Laranja: Dependências externas ao sprint
- ➡️ Linha sólida: Dependência no sprint
- ➡️ Linha pontilhada: Dependência externa

## 📋 Sugestão de Execução das Issues

| # | Título | Status | Responsável | Dependências |
|---|--------|--------|-------------|---------------|
| 1 |Validar as medidas e indicadores  | TODO | Felipe Costabeber | bi.identificarobjetivo.definirmedidasindicadores.pesquisar⚠️ |
| 2 |Criar arquivos Python para ETL | DONE | Mateus Lannes  | bi.levantarinfraestruturaleds.configurarairflowetl.criardagsetl⚠️ |
| 3 |Criar arquivos Python para ETL | DONE | Felipe Costabeber | bi.levantarinfraestruturaleds.configurarairflowetl.criardagsetl⚠️ |
| 4 |Transformar arquivos Python em DAGs | DONE | Mateus Lannes  | bi.levantarinfraestruturaleds.configurarairflowetl.criararquivopythonetl⚠️ |
| 5 |Testar conexões | DONE | Mateus Lannes  | bi.instalarairflow.configurarconexoes⚠️ |
| 6 |Criar DAGs | DOING | Mateus Lannes  | 🆓 |
| 7 |Testar repositório | DONE | Felipe Costabeber | bi.instalarairflow.criardags⚠️ |
| 8 |Testar pipelines ETL | DONE | Mateus Lannes  | bi.levantarinfraestruturaleds.configurarairflowetl.criardagsetl⚠️ |
| 9 |Importar dados no Power BI | DONE | Mateus Lannes  | 🆓 |
| 10 |Criar modelo de dados no Power BI | DONE | Mateus Lannes  | bi.levantarinfraestruturaleds.conectarbancoaopowerbi.importardadosnopowerbi⚠️ |
| 11 |Validar relatórios e gráficos no Power BI | DONE | Mateus Lannes  | bi.levantarinfraestruturaleds.conectarbancoaopowerbi.criarmodelopowerbi⚠️ |

**Legenda das Dependências:**
- 🆓 Sem dependências
- ✅ Issue concluída
- ⚠️ Dependência externa ao sprint



## Cumulative Flow
![ Cumulative Flow](./charts/cfd-sprint3.svg)


