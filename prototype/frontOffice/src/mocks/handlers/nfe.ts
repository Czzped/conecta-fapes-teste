import { http, HttpResponse, delay } from 'msw';
import { getActiveScenario } from '../scenarios';

export const nfeHandlers = [
  http.get('/api/serpro/nfe/:chave', async ({ params }) => {
    const scenario = getActiveScenario();
    const chave = String(params.chave);

    if (scenario === 'nfe-chave-invalida' || chave.length !== 44) {
      return HttpResponse.json(
        { erro: `Chave de acesso deve conter exatamente 44 dígitos. Recebido: ${chave.length} dígitos.` },
        { status: 400 },
      );
    }

    if (scenario === 'serpro-indisponivel') {
      await delay(5000);
      return HttpResponse.error();
    }

    if (scenario === 'nfe-nao-encontrada') {
      await delay(800);
      return HttpResponse.json(
        { erro: 'NF-e não localizada no SERPRO. Verifique se a chave está correta ou se a nota foi emitida há menos de 24h.' },
        { status: 404 },
      );
    }

    // nfe-validada (happy path)
    await delay(1200);
    return HttpResponse.json({
      chave,
      emitente: 'Magazine Luiza S.A.',
      cnpjEmitente: '47.960.950/1504-12',
      dataEmissao: '27/02/2026',
      valor: 3456.70,
      descricao: 'Computador Notebook Dell Inspiron 15 3000',
      status: 'Autorizada',
    });
  }),
];
