/**
 * Aviso de privacidade do formulário, escrito para o morador que assina.
 *
 * O texto vive em um único módulo porque a mesma informação aparece no
 * consentimento, no rodapé e na área restrita: uma alteração aqui vale para
 * todas as telas e evita versões divergentes do que foi prometido ao titular.
 */

export const DATA_CONTROLLER = 'Condomínio Porto Imperial';

/**
 * Canal do titular. Sem um endereço configurado sobra o balcão da
 * administração, que sempre existe — nunca um e-mail inventado.
 */
export const PRIVACY_CONTACT =
  import.meta.env.VITE_PRIVACY_CONTACT?.trim() || 'a administração do condomínio';

export const PRIVACY_NOTICE_VERSION = 'Versão 1 · julho de 2026';

export const CONSENT_TEXT =
  `Autorizo o ${DATA_CONTROLLER} a tratar os dados deste formulário apenas para o controle e a organização do condomínio, ` +
  'nos termos do aviso de privacidade. Declaro que as demais pessoas informadas aqui — moradores, funcionários e contatos de ' +
  'emergência — foram avisadas deste cadastro e que, no caso de menores de idade, sou o responsável por elas.';

export interface PrivacyTopic {
  title: string;
  text: string;
}

export const PRIVACY_TOPICS: readonly PrivacyTopic[] = [
  {
    title: 'Quem trata os dados',
    text:
      `O ${DATA_CONTROLLER} é o controlador das informações enviadas neste formulário. ` +
      `Dúvidas, pedidos e reclamações sobre privacidade devem ser dirigidos a ${PRIVACY_CONTACT}.`,
  },
  {
    title: 'Para que os dados são usados',
    text:
      'Somente para o controle e a organização do condomínio: manter o cadastro das unidades atualizado, saber quem responde ' +
      'por cada apartamento, localizar alguém em caso de emergência e organizar a convivência. Os dados não são vendidos, ' +
      'cedidos para fins comerciais nem usados em publicidade.',
  },
  {
    title: 'Base legal',
    text:
      'O tratamento se apoia no seu consentimento (art. 7º, I da Lei 13.709/2018) e, no que for indispensável à organização do ' +
      'condomínio, na execução de obrigação legal e no legítimo interesse (art. 7º, II e IX). O consentimento pode ser revogado ' +
      'a qualquer momento.',
  },
  {
    title: 'Quais dados são coletados',
    text:
      'Identificação do titular (nome, RG, CPF, e-mail, telefones, unidade, vínculo e data da mudança), contato de emergência, ' +
      'proprietário ou administradora quando a unidade é alugada, demais moradores, funcionários da unidade, veículos, animais ' +
      'de estimação e a assinatura manuscrita do formulário.',
  },
  {
    title: 'Dados de outras pessoas',
    text:
      'Parte do formulário fala de terceiros: familiares, funcionários e contatos de emergência. Informe apenas quem realmente ' +
      'mora ou trabalha na unidade, avise essas pessoas sobre o cadastro e, tratando-se de menores de idade, preencha na ' +
      'condição de responsável legal.',
  },
  {
    title: 'Quem tem acesso',
    text:
      'Administração, síndico e portaria, cada um no limite do que a função exige, e autoridades públicas quando a lei ' +
      'determinar. O acesso depende de conta individual com senha, e não há transferência dos dados para fora do país.',
  },
  {
    title: 'Por quanto tempo ficam guardados',
    text:
      'Enquanto durar o vínculo da pessoa com a unidade e, depois disso, pelo prazo necessário para o condomínio cumprir suas ' +
      'obrigações legais e se defender em eventual processo. Vencido o prazo, o cadastro é eliminado.',
  },
  {
    title: 'Seus direitos',
    text:
      'A qualquer momento você pode confirmar a existência do tratamento, acessar, corrigir, anonimizar, bloquear ou eliminar ' +
      'os dados, pedir portabilidade, saber com quem foram compartilhados e revogar o consentimento (art. 18 da LGPD). ' +
      `Basta procurar ${PRIVACY_CONTACT}, sem qualquer prejuízo para você ou para a sua unidade.`,
  },
];
