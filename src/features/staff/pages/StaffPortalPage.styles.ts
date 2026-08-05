import styled from 'styled-components';

export const Page = styled.div`
  min-height: 100dvh;
  max-width: 480px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing(3)};
  background: linear-gradient(180deg, #e8f0ea 0%, #f7f5f1 40%, #f7f5f1 100%);
`;

export const Header = styled.header`
  margin-bottom: ${({ theme }) => theme.spacing(3)};
  text-align: center;
`;

export const Brand = styled.h1`
  margin: 0;
  font-size: 1.6rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: ${({ theme }) => theme.colors.text};
`;

export const Subtitle = styled.p`
  margin: 4px 0 0;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const Card = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radii.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => theme.spacing(3)};
  box-shadow: 0 10px 30px rgba(20, 40, 30, 0.06);
`;

export const Welcome = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${({ theme }) => theme.spacing(2)};

  strong {
    display: block;
  }

  span {
    color: ${({ theme }) => theme.colors.textMuted};
    font-size: 0.9rem;
  }
`;

export const ModuleGrid = styled.div`
  display: grid;
  gap: 12px;
`;

export const ModuleCard = styled.button`
  display: flex;
  align-items: center;
  gap: 14px;
  width: 100%;
  padding: 16px;
  text-align: left;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surface};
  cursor: pointer;
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 4px 14px rgba(20, 40, 30, 0.08);
  }
`;

export const ModuleIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  flex-shrink: 0;
  border-radius: ${({ theme }) => theme.radii.md};
  background: #e8f0ea;
  color: ${({ theme }) => theme.colors.primary};
`;

export const ModuleText = styled.span`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;

  strong {
    font-size: 1rem;
    color: ${({ theme }) => theme.colors.text};
  }

  span {
    font-size: 0.85rem;
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;

export const ModuleTopBar = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`;

export const ModuleTitle = styled.h2`
  margin: 0;
  flex: 1;
  font-size: 1.15rem;
  font-weight: 600;
`;

export const LocationBox = styled.div<{ $ok: boolean }>`
  display: flex;
  gap: 10px;
  padding: 12px;
  margin-bottom: 16px;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ $ok }) => ($ok ? '#eaf6ee' : '#fff4e5')};
  border: 1px solid ${({ $ok }) => ($ok ? '#b7dfc4' : '#f0d2a0')};

  p {
    margin: 4px 0 0;
    font-size: 0.9rem;
  }
`;

export const CameraArea = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: ${({ theme }) => theme.radii.md};
  background: #111;
  aspect-ratio: 3 / 4;

  video,
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`;

export const CameraActions = styled.div`
  margin-top: 12px;
`;

export const Hint = styled.p`
  margin: 12px 0 0;
  text-align: center;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.9rem;
`;

export const List = styled.div`
  display: grid;
  gap: 10px;
`;

export const ListItem = styled.div`
  display: grid;
  gap: 8px;
  padding: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surface};
`;

export const ListItemTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;

  strong {
    font-size: 0.95rem;
  }
`;

export const ListMeta = styled.p`
  margin: 0;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const ListActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

export const Empty = styled.p`
  margin: 0;
  padding: 24px 8px;
  text-align: center;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const Toolbar = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
`;
