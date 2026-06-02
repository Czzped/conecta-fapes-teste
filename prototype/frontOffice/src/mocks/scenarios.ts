export type ScenarioId =
  // CadastrarBolsista
  | 'bolsista-encontrado'
  | 'bolsista-nao-cadastrado'
  | 'bolsista-sistema-indisponivel'
  | 'bolsista-cpf-invalido-backend'
  // MyInfoPage — upload de documentos
  | 'doc-upload-ok'
  | 'doc-upload-formato-invalido'
  | 'doc-upload-tamanho-excedido'
  | 'doc-upload-sistema-indisponivel'
  // PrestacaoContasFinanceira — consulta NF-e
  | 'nfe-validada'
  | 'nfe-nao-encontrada'
  | 'nfe-chave-invalida'
  | 'serpro-indisponivel';

export interface ScenarioDef {
  label: string;
  epicRef: string;
  descricao: string;
  dadosTeste?: string;
}

export const SCENARIOS: Record<ScenarioId, ScenarioDef> = {
  // ── CadastrarBolsista ────────────────────────────────────────
  'bolsista-encontrado': {
    label: 'CPF encontrado',
    epicRef: 'EPIC-M009-001 — US-M009-001 (happy path)',
    descricao: 'Busca retorna bolsista cadastrado no sistema.',
    dadosTeste: 'CPF: 321.654.987-00',
  },
  'bolsista-nao-cadastrado': {
    label: 'CPF não cadastrado',
    epicRef: 'EPIC-M009-001 — Cenario: CPF nao encontrado',
    descricao: 'Bolsista não existe — orienta cadastrar em M008.',
    dadosTeste: 'CPF: 000.000.000-00',
  },
  'bolsista-sistema-indisponivel': {
    label: 'Sistema indisponível',
    epicRef: 'EPIC-M023-001 — Cenario: Provedor indisponivel',
    descricao: 'Timeout de 4s + mensagem de retry.',
    dadosTeste: 'CPF: qualquer — aguardar ~4s',
  },
  'bolsista-cpf-invalido-backend': {
    label: 'CPF rejeitado (backend)',
    epicRef: 'EPIC-M009-001 — Cenario: CPF com formato invalido',
    descricao: 'Backend rejeita CPF com dígito verificador inválido.',
    dadosTeste: 'CPF: 111.111.111-11',
  },

  // ── MyInfoPage ───────────────────────────────────────────────
  'doc-upload-ok': {
    label: 'Upload aceito',
    epicRef: 'EPIC-M009-002 — Cenario: Upload de documento valido',
    descricao: 'Documento enviado e aceito pelo sistema.',
    dadosTeste: 'Arquivo: qualquer PDF',
  },
  'doc-upload-formato-invalido': {
    label: 'Formato inválido',
    epicRef: 'EPIC-M009-002 — Cenario: Formato nao aceito',
    descricao: 'Arquivo enviado não é PDF — sistema rejeita e orienta.',
    dadosTeste: 'Arquivo: qualquer (ex: .jpg, .docx)',
  },
  'doc-upload-tamanho-excedido': {
    label: 'Arquivo muito grande',
    epicRef: 'EPIC-M009-002 — Cenario: Tamanho excedido',
    descricao: 'Arquivo acima de 5 MB — sistema bloqueia antes de enviar.',
    dadosTeste: 'Arquivo: qualquer (resposta imediata, sem verificar tamanho real)',
  },
  'doc-upload-sistema-indisponivel': {
    label: 'Armazenamento indisponível',
    epicRef: 'EPIC-M023-001 — Cenario: Provedor de armazenamento fora',
    descricao: 'MinIO/S3 fora — sistema sugere tentar novamente.',
    dadosTeste: 'Arquivo: qualquer — aguardar ~3s',
  },

  // ── PrestacaoContasFinanceira ────────────────────────────────
  'nfe-validada': {
    label: 'NF-e válida (SERPRO)',
    epicRef: 'EPIC-M014-005 — Cenario: NF-e encontrada e valida',
    descricao: 'Chave encontrada no SERPRO — preenche dados automaticamente.',
    dadosTeste: 'Chave (44 dígitos): 35260247960950150412550010000001211234567890',
  },
  'nfe-nao-encontrada': {
    label: 'NF-e não encontrada',
    epicRef: 'EPIC-M014-005 — Cenario: NF-e nao localizada',
    descricao: 'Chave não existe no SERPRO — orienta verificar emitente.',
    dadosTeste: 'Chave (44 dígitos): 35260247960950150412550010000001211234567890',
  },
  'nfe-chave-invalida': {
    label: 'Chave com formato inválido',
    epicRef: 'EPIC-M014-005 — Cenario: Chave com menos de 44 digitos',
    descricao: 'Chave com dígitos insuficientes — erro antes de chamar SERPRO.',
    dadosTeste: 'Chave (< 44 dígitos): 12345678',
  },
  'serpro-indisponivel': {
    label: 'SERPRO indisponível',
    epicRef: 'EPIC-M023-003 — Cenario: Provedor SERPRO fora',
    descricao: 'Timeout de 5s no SERPRO — sugere consulta manual.',
    dadosTeste: 'Chave (44 dígitos): 35260247960950150412550010000001211234567890 — aguardar ~5s',
  },
};

let activeScenario: ScenarioId = 'bolsista-encontrado';

export const getActiveScenario = () => activeScenario;
export const setActiveScenario = (id: ScenarioId) => { activeScenario = id; };
