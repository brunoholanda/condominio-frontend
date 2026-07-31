import type { ReactNode } from 'react';

import * as S from './FormSection.styles';

interface FormSectionProps {
  icon: ReactNode;
  title: string;
  description?: string;
  children: ReactNode;
}

/** Visual grouping that mirrors each block of the printed registration form. */
export function FormSection({ icon, title, description, children }: FormSectionProps) {
  return (
    <S.Section>
      <S.Header>
        <S.Icon aria-hidden>{icon}</S.Icon>
        <div>
          <S.Title>{title}</S.Title>
          {description ? <S.Description>{description}</S.Description> : null}
        </div>
      </S.Header>

      <S.Body>{children}</S.Body>
    </S.Section>
  );
}
