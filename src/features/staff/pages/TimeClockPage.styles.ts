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
  border-radius: ${({ theme }) => theme.radius.lg};
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

export const LocationBox = styled.div<{ $ok: boolean }>`
  display: flex;
  gap: 10px;
  padding: 12px;
  margin-bottom: 16px;
  border-radius: ${({ theme }) => theme.radius.md};
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
  border-radius: ${({ theme }) => theme.radius.md};
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
