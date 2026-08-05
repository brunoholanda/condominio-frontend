import styled from 'styled-components';

export const Card = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  padding: ${({ theme }) => theme.spacing(4)};
  max-width: 760px;
`;

export const Section = styled.section`
  & + & {
    margin-top: ${({ theme }) => theme.spacing(5)};
    padding-top: ${({ theme }) => theme.spacing(5)};
    border-top: 1px solid ${({ theme }) => theme.colors.border};
  }
`;

export const SectionTitle = styled.h2`
  margin: 0 0 ${({ theme }) => theme.spacing(1)};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 1.05rem;
  font-weight: 600;
`;

export const SectionHint = styled.p`
  margin: 0 0 ${({ theme }) => theme.spacing(3)};
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.88rem;
  line-height: 1.45;
`;

export const SlugPreview = styled.div`
  margin-top: ${({ theme }) => theme.spacing(-1)};
  margin-bottom: ${({ theme }) => theme.spacing(3)};
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.82rem;

  code {
    padding: 0.1em 0.35em;
    border-radius: 4px;
    background: rgba(15, 39, 64, 0.06);
    font-size: 0.92em;
  }
`;

export const UnitCount = styled.div`
  margin-top: ${({ theme }) => theme.spacing(1)};
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.88rem;

  strong {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export const CoordsRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing(2)};
  flex-wrap: wrap;
`;

export const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: ${({ theme }) => theme.spacing(5)};
  padding-top: ${({ theme }) => theme.spacing(4)};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;
