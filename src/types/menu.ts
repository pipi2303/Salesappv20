import type { ComponentType } from 'react';

// Sidebar menu shape. Moved here from src/app/App.tsx as part of splitting the
// app shell into Sidebar/Header components (see src/app/config/menuConfig.ts
// for the actual menuGroups data, and src/app/components/layout/Sidebar.tsx
// for the component that renders these).

export type SubMenuItem = {
  id: string;
  name: string;
  component: ComponentType;
};

export type MenuItem = {
  id: string;
  name: string;
  icon: ComponentType<{ className?: string }>;
  component?: ComponentType;
  subMenus?: SubMenuItem[];
};

export type MenuGroup = {
  id: string;
  label: string;
  items: MenuItem[];
};
