import type { TablePaginationConfig, TableProps } from 'antd';

type MobileTableBase = Pick<TableProps, 'size' | 'scroll'>;

/**
 * Defaults shared by admin tables so they stay usable on phones.
 * Pass `pagination` to merge page/total/onChange without calling the helper twice.
 */
export function mobileTableProps(
  isMobile: boolean,
  pagination?: TablePaginationConfig,
): MobileTableBase & { pagination: TablePaginationConfig } {
  return {
    size: isMobile ? 'small' : 'middle',
    scroll: { x: 'max-content' },
    pagination: {
      simple: isMobile,
      showSizeChanger: !isMobile,
      ...pagination,
    },
  };
}

/** Full-bleed drawers/modals on small screens. */
export function mobileOverlayWidth(isMobile: boolean, desktopWidth: number): number | string {
  return isMobile ? '100%' : desktopWidth;
}
