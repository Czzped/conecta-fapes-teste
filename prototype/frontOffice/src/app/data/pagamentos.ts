// Fonte única dos pagamentos da Prestação de Contas Financeira.
// Movido de PrestacaoContasFinanceira.tsx para permitir lookup por `id` na rota
// de detalhe (/financeira/:paymentId), garantindo deep-link e refresh.

export interface Payment {
  id: number;
  tipo: string;
  operacao: string;
  classificacao: string;
  valor: string;
  data: string;
  cnpj: string;
  status: string;
  statusColor: { bg: string; color: string; border: string };
  [key: string]: any;
}

export const payments: Payment[] = [
  { id: 0, tipo: 'Boleto', operacao: 'DEBITO', classificacao: 'DESPESA', valor: 'R$ 3.456,70', data: '27/02/2026 - 09:35', cnpj: 'Magazine Luiza', status: 'Pendente', statusColor: { bg: 'rgba(249, 115, 22, 0.1)', color: 'rgb(249, 115, 22)', border: 'rgba(249, 115, 22, 0.3)' } },
  { id: 1, tipo: 'Crédito de terceiro', operacao: 'CREDITO', classificacao: 'ESTORNO', valor: 'R$ 4.567,90', data: '25/02/2026 - 10:05', cnpj: 'Magazine Luiza', status: 'Pendente', origemTerceiro: 'Magazine Luiza', statusColor: { bg: 'rgba(249, 115, 22, 0.1)', color: 'rgb(249, 115, 22)', border: 'rgba(249, 115, 22, 0.3)' } },
  { id: 2, tipo: 'Crédito de terceiro', operacao: 'CREDITO', classificacao: 'ESTORNO', valor: 'R$ 1.250,00', data: '24/02/2026 - 15:10', cnpj: 'Fornecedor Alfa', status: 'Em Validação', origemTerceiro: 'Fornecedor Alfa', debitoEstornado: 'TR-2026-041', creditoEstorno: 'TR-2026-052', prestacaoAssociada: 'PC-2026-013', situacaoPrestacao: 'Finalizada', modoAssociacao: 'Ajuste pós-prestação', situacaoDebito: 'Sem prestação de contas', efeitoLiquido: 'R$ 0,00', statusColor: { bg: 'rgba(59, 130, 246, 0.1)', color: 'rgb(59, 130, 246)', border: 'rgba(59, 130, 246, 0.3)' } },
  { id: 3, tipo: 'Pix recebido', operacao: 'CREDITO', classificacao: 'DEVOLUCAO', valor: 'R$ 400,00', data: '24/02/2026 - 16:35', cnpj: 'Paulo Sérgio Souza', documentoLabel: 'CPF', status: 'Validado', debitoOriginal: 'TR-2026-045', valorOriginal: 'R$ 1.250,00', valorDevolvido: 'R$ 400,00', valorResidual: 'R$ 850,00', prestacaoAssociada: 'PC-2026-013', modoAssociacao: 'Ajuste conciliatório', comprovanteObrigatorio: 'Pix de devolução', statusColor: { bg: 'rgba(34, 197, 94, 0.1)', color: 'rgb(34, 197, 94)', border: 'rgba(34, 197, 94, 0.3)' } },
  { id: 4, tipo: 'Pix', operacao: 'DEBITO', classificacao: 'DESPESA', valor: 'R$ 789,00', data: '23/02/2026 - 12:50', cnpj: 'Kalunga', status: 'Validado', statusColor: { bg: 'rgba(34, 197, 94, 0.1)', color: 'rgb(34, 197, 94)', border: 'rgba(34, 197, 94, 0.3)' } },
  { id: 5, tipo: 'Boleto', operacao: 'DEBITO', classificacao: 'DESPESA', valor: 'R$ 2.100,00', data: '22/02/2026 - 11:20', cnpj: 'Kalunga', status: 'Revisar', statusColor: { bg: 'rgba(234, 179, 8, 0.1)', color: 'rgb(234, 179, 8)', border: 'rgba(234, 179, 8, 0.3)' } },
  { id: 6, tipo: 'Boleto', operacao: 'DEBITO', classificacao: 'DESPESA', valor: 'R$ 1.890,50', data: '20/02/2026 - 11:45', cnpj: 'Americanas', status: 'Reprovado', statusColor: { bg: 'rgba(239, 68, 68, 0.1)', color: 'rgb(239, 68, 68)', border: 'rgba(239, 68, 68, 0.3)' } },
  { id: 7, tipo: 'Boleto', operacao: 'DEBITO', classificacao: 'DESPESA', valor: 'R$ 2.345,60', data: '19/02/2026 - 17:25', cnpj: 'Americanas', status: 'Em Validação', statusColor: { bg: 'rgba(59, 130, 246, 0.1)', color: 'rgb(59, 130, 246)', border: 'rgba(59, 130, 246, 0.3)' } },
  { id: 8, tipo: 'Pix', operacao: 'DEBITO', classificacao: 'DESPESA', valor: 'R$ 567,80', data: '18/02/2026 - 16:45', cnpj: 'Americanas', status: 'Validado', statusColor: { bg: 'rgba(34, 197, 94, 0.1)', color: 'rgb(34, 197, 94)', border: 'rgba(34, 197, 94, 0.3)' } },
  { id: 9, tipo: 'Pix', operacao: 'DEBITO', classificacao: 'DESPESA', valor: 'R$ 2.567,30', data: '15/02/2026 - 16:00', cnpj: 'Amazon', status: 'Pendente', statusColor: { bg: 'rgba(249, 115, 22, 0.1)', color: 'rgb(249, 115, 22)', border: 'rgba(249, 115, 22, 0.3)' } },
  { id: 10, tipo: 'Pix', operacao: 'DEBITO', classificacao: 'DESPESA', valor: 'R$ 5.234,20', data: '14/02/2026 - 08:40', cnpj: 'Amazon', status: 'Validado', statusColor: { bg: 'rgba(34, 197, 94, 0.1)', color: 'rgb(34, 197, 94)', border: 'rgba(34, 197, 94, 0.3)' } },
  { id: 11, tipo: 'Boleto', operacao: 'DEBITO', classificacao: 'DESPESA', valor: 'R$ 3.890,00', data: '12/02/2026 - 09:15', cnpj: 'Amazon', status: 'Em Validação', statusColor: { bg: 'rgba(59, 130, 246, 0.1)', color: 'rgb(59, 130, 246)', border: 'rgba(59, 130, 246, 0.3)' } },
  { id: 12, tipo: 'Boleto', operacao: 'DEBITO', classificacao: 'DESPESA', valor: 'R$ 1.320,45', data: '10/02/2026 - 14:20', cnpj: 'Casa do Cientista', status: 'Validado', statusColor: { bg: 'rgba(34, 197, 94, 0.1)', color: 'rgb(34, 197, 94)', border: 'rgba(34, 197, 94, 0.3)' } },
  { id: 13, tipo: 'Pix', operacao: 'DEBITO', classificacao: 'DESPESA', valor: 'R$ 845,90', data: '09/02/2026 - 11:05', cnpj: 'Papelaria Central', status: 'Revisar', statusColor: { bg: 'rgba(234, 179, 8, 0.1)', color: 'rgb(234, 179, 8)', border: 'rgba(234, 179, 8, 0.3)' } },
  { id: 14, tipo: 'Boleto', operacao: 'DEBITO', classificacao: 'DESPESA', valor: 'R$ 2.760,00', data: '07/02/2026 - 10:30', cnpj: 'Laboratório Vitória', status: 'Pendente', statusColor: { bg: 'rgba(249, 115, 22, 0.1)', color: 'rgb(249, 115, 22)', border: 'rgba(249, 115, 22, 0.3)' } },
];
