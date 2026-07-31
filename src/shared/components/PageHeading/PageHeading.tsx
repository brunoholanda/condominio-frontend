import type { ReactNode } from 'react';

import * as S from './PageHeading.styles';

interface PageHeadingProps {
  title: string;
  description?: string;
  actions?: ReactNode;
}

export function PageHeading({ title, description, actions }: PageHeadingProps) {
  return (
    <S.Wrapper>
      <div>
        <S.Title>{title}</S.Title>
        {description ? <S.Description>{description}</S.Description> : null}
      </div>
      {actions ? <S.Actions>{actions}</S.Actions> : null}
    </S.Wrapper>
  );
}
