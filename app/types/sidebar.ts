import type { Arrayable } from 'type-fest';

import type { AdminPermissionRequirement } from '@/types/permission';

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
  & { requiredPermissions: Arrayable<'ignore' | AdminPermissionRequirement> };
