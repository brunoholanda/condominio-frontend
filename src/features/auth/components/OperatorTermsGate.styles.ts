import styled from 'styled-components';

export const Intro = styled.p`
  margin: 0 0 ${({ theme }) => theme.spacing(4)};
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.55;
`;

export const Identification = styled.div`
  margin-top: ${({ theme }) => theme.spacing(5)};
  padding-top: ${({ theme }) => theme.spacing(4)};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

export const Duties = styled.ul`
  display: flex;
  max-height: min(50vh, 420px);
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(2)};
  overflow-y: auto;
  margin: 0;
  padding-left: ${({ theme }) => theme.spacing(5)};
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.88rem;
  line-height: 1.5;
`;
