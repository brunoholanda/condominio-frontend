import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(6)};
  max-width: 440px;
  margin: 0 auto;
  text-align: center;
`;

export const Icon = styled.span`
  display: grid;
  place-items: center;
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.accentSoft};
  color: ${({ theme }) => theme.colors.primary};
`;

export const Name = styled.h1`
  margin: 0;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 1.5rem;
`;

export const Subtitle = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(3)};
  width: 100%;
`;

export const SectionTitle = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-align: left;
  text-transform: uppercase;
`;

export const LinkButton = styled.a`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(3)};
  width: 100%;
  padding: ${({ theme }) => theme.spacing(4)};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  font-weight: 600;
  text-decoration: none;
  box-shadow: ${({ theme }) => theme.shadows.card};
  transition: transform 0.15s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

export const LinkIcon = styled.span`
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.accentSoft};
  color: ${({ theme }) => theme.colors.primary};
`;

export const LinkText = styled.span`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  min-width: 0;
  text-align: left;
  overflow-wrap: anywhere;
`;

export const LinkSubtitle = styled.small`
  color: ${({ theme }) => theme.colors.textMuted};
  font-weight: 400;
`;

export const LinkCategory = styled.small`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.72rem;
  font-weight: 500;
  letter-spacing: 0.02em;
  text-transform: uppercase;
`;
