import { Users } from 'lucide-react';

import * as S from './SingleFormNotice.styles';

/**
 * O cadastro é por apartamento, não por pessoa. Sem dizer isso logo no começo,
 * cada morador preenche o seu e o segundo esbarra no aviso de unidade já
 * cadastrada, depois de digitar a ficha inteira.
 */
export function SingleFormNotice() {
  return (
    <S.Notice
      type="info"
      showIcon
      icon={<Users size={18} />}
      message="Um formulário por apartamento"
      description="Basta um morador da unidade preencher este cadastro. Quem preencher informa os próprios
        dados e, na seção “Demais moradores da unidade”, todas as outras pessoas que moram no mesmo
        apartamento — elas não precisam preencher um formulário separado."
    />
  );
}
