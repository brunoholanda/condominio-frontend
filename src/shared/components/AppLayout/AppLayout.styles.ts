import { NavLink } from 'react-router-dom';
import styled, { css } from 'styled-components';

/** On phones every entry shares the row and keeps a comfortable tap target. */
const mobileNavEntry = css`
  ${({ theme }) => theme.media.down.md} {
    flex: 1 1 auto;
    justify-content: center;
    min-height: 44px;
    padding-inline: ${({ theme }) => theme.spacing(2)};
    font-size: 0.82rem;
  }
`;

export const Shell = styled.div`
  display: flex;
  min-height: 100%;
  flex-direction: column;
`;

export const Header = styled.header`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing(4)};
  padding: ${({ theme }) => `${theme.spacing(4)} ${theme.spacing(6)}`};
  background: ${({ theme }) => theme.colors.primary};
  box-shadow: ${({ theme }) => theme.shadows.header};

  ${({ theme }) => theme.media.down.md} {
    gap: ${({ theme }) => theme.spacing(3)};
    padding: ${({ theme }) => `${theme.spacing(3)} ${theme.spacing(4)}`};
  }
`;

export const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(3)};
`;

export const BrandIcon = styled.span`
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.accent};
  color: ${({ theme }) => theme.colors.primary};
`;

export const BrandTitle = styled.strong`
  display: block;
  color: #fff;
  font-size: 1.05rem;
  letter-spacing: 0.02em;

  ${({ theme }) => theme.media.down.md} {
    font-size: 0.95rem;
  }
`;

export const BrandSubtitle = styled.span`
  display: block;
  color: ${({ theme }) => theme.colors.accentSoft};
  font-size: 0.8rem;
`;

export const Nav = styled.nav`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2)};

  ${({ theme }) => theme.media.down.md} {
    width: 100%;
    gap: ${({ theme }) => theme.spacing(1)};
  }
`;

export const NavItem = styled(NavLink)`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2)};
  padding: ${({ theme }) => `${theme.spacing(2)} ${theme.spacing(4)}`};
  border-radius: ${({ theme }) => theme.radii.sm};
  color: ${({ theme }) => theme.colors.accentSoft};
  font-size: 0.9rem;
  font-weight: 500;
  text-decoration: none;
  transition:
    background 0.2s ease,
    color 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryHover};
    color: #fff;
  }

  &.active {
    background: ${({ theme }) => theme.colors.accent};
    color: ${({ theme }) => theme.colors.primary};
  }

  ${mobileNavEntry}
`;

export const NavButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2)};
  padding: ${({ theme }) => `${theme.spacing(2)} ${theme.spacing(4)}`};
  border: 0;
  border-radius: ${({ theme }) => theme.radii.sm};
  background: transparent;
  color: ${({ theme }) => theme.colors.accentSoft};
  font: inherit;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition:
    background 0.2s ease,
    color 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryHover};
    color: #fff;
  }

  ${mobileNavEntry}
`;

export const UserName = styled.span`
  max-width: 180px;
  overflow: hidden;
  color: #fff;
  font-size: 0.85rem;
  text-overflow: ellipsis;
  white-space: nowrap;

  ${({ theme }) => theme.media.down.md} {
    max-width: 100%;
    flex: 1 1 auto;
    padding-inline: ${({ theme }) => theme.spacing(2)};
    font-size: 0.8rem;
  }
`;

export const Main = styled.main`
  width: min(1120px, 100%);
  flex: 1;
  margin: 0 auto;
  padding: ${({ theme }) => `${theme.spacing(8)} ${theme.spacing(5)}`};

  ${({ theme }) => theme.media.down.md} {
    padding: ${({ theme }) => `${theme.spacing(5)} ${theme.spacing(4)}`};
  }
`;

export const Footer = styled.footer`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(1)};
  padding: ${({ theme }) => theme.spacing(5)};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.8rem;
  text-align: center;

  > span {
    max-width: 720px;
    line-height: 1.5;
  }
`;

export const Copyright = styled.small`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 0.78rem;
  font-weight: 500;
`;
