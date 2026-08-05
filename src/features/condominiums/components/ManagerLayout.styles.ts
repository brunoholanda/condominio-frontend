import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

export const Shell = styled.div`
  display: flex;
  min-height: 100vh;
  min-height: 100dvh;
  flex-direction: column;
`;

export const Topbar = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing(3)};
  padding: ${({ theme }) => `${theme.spacing(3)} ${theme.spacing(6)}`};
  background: ${({ theme }) => theme.colors.primary};
  box-shadow: ${({ theme }) => theme.shadows.header};

  ${({ theme }) => theme.media.down.md} {
    padding: ${({ theme }) => `${theme.spacing(3)} ${theme.spacing(3)}`};
  }
`;

export const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(3)};
  min-width: 0;
`;

export const BrandIcon = styled.span`
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.accent};
  color: ${({ theme }) => theme.colors.primary};
`;

export const BrandTitle = styled.strong`
  display: block;
  overflow: hidden;
  color: #fff;
  font-size: 1rem;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const BrandSubtitle = styled.span`
  display: block;
  color: ${({ theme }) => theme.colors.accentSoft};
  font-size: 0.78rem;
`;

export const TopActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(1)};
  flex-shrink: 0;
`;

export const MenuButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  flex-shrink: 0;
  border: 0;
  border-radius: ${({ theme }) => theme.radii.sm};
  background: transparent;
  color: #fff;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryHover};
  }
`;

export const Body = styled.div`
  display: flex;
  flex: 1;
  min-height: 0;
`;

export const Sidebar = styled.nav`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(4)};
  width: 248px;
  flex-shrink: 0;
  padding: ${({ theme }) => theme.spacing(4)} ${({ theme }) => theme.spacing(3)};
  overflow-y: auto;
  background: ${({ theme }) => theme.colors.surface};
  border-right: 1px solid ${({ theme }) => theme.colors.border};
`;

export const DrawerNav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(4)};
`;

export const NavGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(0.5)};
`;

export const NavGroupLabel = styled.p`
  margin: 0;
  padding: ${({ theme }) => `0 ${theme.spacing(3)} ${theme.spacing(1)}`};
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

export const NavGroupItems = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const SidebarItem = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2)};
  min-height: 40px;
  padding: ${({ theme }) => `${theme.spacing(2)} ${theme.spacing(3)}`};
  border-radius: ${({ theme }) => theme.radii.sm};
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.88rem;
  font-weight: 500;
  text-decoration: none;
  transition:
    background 0.15s ease,
    color 0.15s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.background};
  }

  &.active {
    background: ${({ theme }) => theme.colors.primary};
    color: #fff;
  }
`;

export const IconButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing(2)};
  min-width: 44px;
  min-height: 44px;
  padding: ${({ theme }) => `${theme.spacing(2)} ${theme.spacing(3)}`};
  border: 0;
  border-radius: ${({ theme }) => theme.radii.sm};
  background: transparent;
  color: #fff;
  font: inherit;
  font-size: 0.85rem;
  cursor: pointer;
  transition: background 0.15s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryHover};
  }
`;

export const TopLink = styled.a`
  color: #fff;
  font-size: 0.85rem;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

export const SidebarLink = styled.a`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2)};
  min-height: 40px;
  padding: ${({ theme }) => `${theme.spacing(2)} ${theme.spacing(3)}`};
  border-radius: ${({ theme }) => theme.radii.sm};
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.88rem;
  font-weight: 500;
  text-decoration: none;
  transition: background 0.15s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.background};
  }
`;

export const Content = styled.main`
  flex: 1;
  min-width: 0;
  padding: ${({ theme }) => theme.spacing(6)};

  ${({ theme }) => theme.media.down.md} {
    padding: ${({ theme }) => theme.spacing(4)};
  }
`;

export const Loading = styled.div`
  display: grid;
  place-items: center;
  min-height: 60vh;
`;
