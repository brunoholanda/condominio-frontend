import styled from 'styled-components';

export const Trigger = styled.button`
  display: inline;
  padding: 0;
  border: 0;
  background: none;
  color: inherit;
  font: inherit;
  text-decoration: underline;
  text-underline-offset: 2px;
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.colors.accent};
  }
`;

export const Intro = styled.p`
  margin: 0 0 ${({ theme }) => theme.spacing(4)};
  color: ${({ theme }) => theme.colors.textMuted};
`;

/** Scrolls inside the dialog so the actions stay reachable on small screens. */
export const Topics = styled.div`
  display: flex;
  max-height: min(60vh, 520px);
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(4)};
  overflow-y: auto;
  padding-right: ${({ theme }) => theme.spacing(2)};
`;

export const TopicTitle = styled.h3`
  margin: 0 0 ${({ theme }) => theme.spacing(1)};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 0.92rem;
`;

export const TopicText = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.88rem;
  line-height: 1.55;
`;

export const Version = styled.small`
  display: block;
  margin-top: ${({ theme }) => theme.spacing(4)};
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.75rem;
`;
