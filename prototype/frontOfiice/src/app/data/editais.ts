export interface Edital {
  id: number;
  titulo: string;
  programa: string;
  area: string;
  prazo: string;
  status: string;
  vagas: number;
  valor: string;
  descricao: string;
  numero?: string;
}

export const editais: Edital[] = [
  {
    id: 1,
    titulo: 'Iniciação Científica 2025',
    programa: 'PIBIC',
    area: 'Carreira Científica',
    prazo: '30/04/2025',
    status: 'Ativo',
    vagas: 120,
    valor: 'R$ 7.000',
    numero: 'FAPES/SEDU Nº 17/2025',
    descricao: 'Programa de bolsas de iniciação científica para estudantes de graduação em parceria com universidades capixabas.',
  },
  {
    id: 2,
    titulo: 'Pesquisa e Inovação Tecnológica',
    programa: 'BPIG',
    area: 'Pesquisa',
    prazo: '15/05/2025',
    status: 'Ativo',
    vagas: 80,
    valor: 'R$ 1.200.000',
    numero: 'FAPES Nº 08/2025',
    descricao: 'Apoio a projetos de pesquisa aplicada voltados para inovação tecnológica nas empresas do Espírito Santo.',
  },
  {
    id: 3,
    titulo: 'Extensão Universitária',
    programa: 'ProExt',
    area: 'Extensão',
    prazo: '20/05/2025',
    status: 'Ativo',
    vagas: 60,
    valor: 'R$ 5.000',
    numero: 'FAPES Nº 12/2025',
    descricao: 'Fomento a projetos de extensão que promovam a integração entre universidade e comunidade local.',
  },
  {
    id: 4,
    titulo: 'Desenvolvimento Científico Regional',
    programa: 'DCR',
    area: 'Internacional',
    prazo: '10/06/2025',
    status: 'Ativo',
    vagas: 40,
    valor: 'R$ 18.000',
    numero: 'FAPES Nº 22/2025',
    descricao: 'Atração de pesquisadores para desenvolvimento de projetos científicos em instituições do interior do estado.',
  },
  {
    id: 5,
    titulo: 'Apoio a Grupos de Pesquisa',
    programa: 'Universal',
    area: 'Difusão do Conhecimento',
    prazo: '25/06/2025',
    status: 'Ativo',
    vagas: 200,
    valor: 'Até R$ 50.000',
    numero: 'FAPES Nº 31/2025',
    descricao: 'Apoio financeiro a grupos de pesquisa consolidados em todas as áreas do conhecimento.',
  },
  {
    id: 6,
    titulo: 'Pós-Doutorado em ES',
    programa: 'PRODOC',
    area: 'Inovação',
    prazo: '05/07/2025',
    status: 'Ativo',
    vagas: 25,
    valor: 'R$ 41.000',
    numero: 'FAPES Nº 44/2025',
    descricao: 'Bolsas de pós-doutorado para pesquisadores sênior em instituições públicas do Espírito Santo.',
  },
];
