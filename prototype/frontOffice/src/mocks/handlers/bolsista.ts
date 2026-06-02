import { http, HttpResponse, delay } from 'msw';
import { getActiveScenario } from '../scenarios';

export const bolsistaHandlers = [
  http.get('/api/bolsistas/cpf/:cpf', async ({ params }) => {
    const scenario = getActiveScenario();

    if (scenario === 'bolsista-sistema-indisponivel') {
      await delay(4000);
      return HttpResponse.error();
    }

    if (scenario === 'bolsista-cpf-invalido-backend') {
      await delay(300);
      return HttpResponse.json(
        { erro: 'CPF informado possui dígito verificador inválido. Verifique e tente novamente.' },
        { status: 400 },
      );
    }

    if (scenario === 'bolsista-nao-cadastrado') {
      await delay(600);
      return HttpResponse.json(
        {
          erro: `Nenhum bolsista encontrado para o CPF ${params.cpf}. Verifique o CPF ou cadastre o pesquisador em Pessoas Físicas (M008) antes de indicar a bolsa.`,
        },
        { status: 404 },
      );
    }

    // bolsista-encontrado (happy path)
    await delay(700);
    return HttpResponse.json({
      nome: 'Marcela Starling',
      cpf: params.cpf,
      email: 'marcela.starling@ufes.br',
      instituicao: 'Universidade Federal do Espírito Santo (Ufes)',
      titulacao: 'Mestranda em Ciência da Computação',
    });
  }),
];
