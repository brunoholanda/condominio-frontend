/**
 * Deveres de quem opera a área restrita. Ficam separados do aviso de
 * privacidade porque a plateia é outra: aqui não se explica o que o condomínio
 * faz com os dados, e sim o que o operador pode e não pode fazer com eles.
 */

export const OPERATOR_TERMS_TITLE = 'Termo de responsabilidade no uso de dados pessoais';

export const OPERATOR_TERMS_INTRO =
  'Os cadastros desta área contêm dados pessoais de moradores, familiares e funcionários — nome, RG, CPF, telefones, ' +
  'endereço da unidade e assinatura — protegidos pela Lei 13.709/2018 (LGPD). Antes de continuar, confirme que você entende ' +
  'as regras abaixo.';

export const OPERATOR_DUTIES: readonly string[] = [
  'Consulte os dados apenas para o controle e a organização do condomínio. Qualquer outra finalidade é uso indevido.',
  'Não fotografe, copie, imprima ou encaminhe os cadastros para quem não tem acesso a esta área, inclusive por mensagem ou e-mail.',
  'O PDF exportado é documento confidencial: guarde-o em local seguro e apague quando não precisar mais dele.',
  'Sua conta é pessoal e intransferível. Não empreste a senha nem deixe a sessão aberta em computador compartilhado.',
  'Consultas, exportações e exclusões ficam registradas com a identificação de quem as realizou.',
  'Avise a administração imediatamente diante de qualquer suspeita de vazamento, perda ou acesso indevido.',
  'O uso indevido responsabiliza você e o condomínio nas esferas civil, administrativa e criminal.',
];

export const OPERATOR_TERMS_ACCEPT = 'Li e entendi minhas responsabilidades';

export const OPERATOR_CPF_NOTICE =
  'Informe seu CPF uma única vez: é ele que liga esta conta a uma pessoa e responde pelo tratamento dos dados dos ' +
  'moradores. Depois de registrado, só a administração pode corrigi-lo.';

/** Lembrete curto, para ficar sempre à vista nas telas com dados pessoais. */
export const OPERATOR_REMINDER =
  'Você está vendo dados pessoais protegidos pela LGPD. Use-os apenas para o controle e a organização do condomínio, ' +
  'não os compartilhe fora desta área e lembre-se de que consultas, exportações e exclusões ficam registradas.';

/** Antes de abrir a edição: o cadastro é uma declaração assinada pelo morador. */
export const EDIT_WARNING =
  'Você vai abrir para alteração dados pessoais protegidos pela Lei 13.709/2018 (LGPD). O cadastro é uma declaração ' +
  'assinada pelo morador: corrija somente o que ele pediu, confira cada campo antes de salvar e não preencha informações ' +
  'por conta própria. Se você trocar o proprietário ou inquilino (outro CPF), o cadastro anterior fica arquivado por 5 anos ' +
  '(acesso restrito a síndico/gestor) e depois é eliminado automaticamente. A alteração fica registrada com a sua identificação.';

/** Cabeçalho da consulta somente leitura, onde a ficha inteira fica exposta. */
export const VIEW_ONLY_NOTICE =
  'Consulta somente leitura: nada nesta tela altera o cadastro. A abertura da ficha completa fica registrada com a sua ' +
  'identificação, e os dados não devem ser fotografados, copiados ou repassados para fora desta área.';

export const EXPORT_WARNING =
  'O PDF traz nome, RG, CPF, telefones e a assinatura de cada morador, além dos dados de familiares e funcionários da ' +
  'unidade. Ao baixar, você passa a ser responsável pela guarda do arquivo: mantenha-o em local seguro, não o repasse a ' +
  'terceiros e apague-o assim que cumprir a finalidade.';
