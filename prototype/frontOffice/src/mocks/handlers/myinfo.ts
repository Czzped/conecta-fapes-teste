import { http, HttpResponse, delay } from 'msw';
import { getActiveScenario } from '../scenarios';

export const myInfoHandlers = [
  http.post('/api/documentos/upload', async ({ request }) => {
    const scenario = getActiveScenario();

    if (scenario === 'doc-upload-tamanho-excedido') {
      return HttpResponse.json(
        { erro: 'O arquivo excede o limite de 5 MB. Reduza o tamanho ou comprima o PDF antes de enviar.' },
        { status: 413 },
      );
    }

    if (scenario === 'doc-upload-formato-invalido') {
      await delay(400);
      return HttpResponse.json(
        { erro: 'Formato não aceito. Envie o documento em PDF. Formatos aceitos: .pdf' },
        { status: 422 },
      );
    }

    if (scenario === 'doc-upload-sistema-indisponivel') {
      await delay(3000);
      return HttpResponse.error();
    }

    // doc-upload-ok (happy path)
    await delay(900);
    return HttpResponse.json({
      id: Math.floor(Math.random() * 10000),
      status: 'Em Validação',
      dataEnvio: new Date().toLocaleDateString('pt-BR'),
      mensagem: 'Documento recebido com sucesso. Aguarde a validação pela equipe técnica.',
    });
  }),
];
