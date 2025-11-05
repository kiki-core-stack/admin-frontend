import type { Arrayable } from 'type-fest';

import type { AdminPermissionPattern } from '@/types/admin';

export type SidebarMenuItem =
  ({
      basePath: `${string}/`;
      children: SidebarMenuItem[];
      title: string;
  }
  | {
      path: `${string}/`;
      title: string;
  })
  & { requiredPermissions: Arrayable<AdminPermissionPattern> };
