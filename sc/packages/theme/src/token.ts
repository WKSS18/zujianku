export interface ScToken {
  headerHeight: number;
  sidebarWidth: number;
  sidebarCollapsedWidth: number;
  pageContentPadding: number;
}

export const defaultScToken: ScToken = {
  headerHeight: 56,
  sidebarWidth: 240,
  sidebarCollapsedWidth: 64,
  pageContentPadding: 24,
};
