import type { Arrayable } from 'type-fest';

import type { PermissionPattern } from '@/types/permission';

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
  & { requiredPermissions: Arrayable<PermissionPattern> };
