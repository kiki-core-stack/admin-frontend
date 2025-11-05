import type {
    AdminPermission,
    AdminPermissionGroup,
} from '@/generated/static/types/admin/permission';

export type PermissionPattern =
  | 'ignore'
  | `!${AdminPermissionGroup}.*`
  | `!${AdminPermission}`
  | `${AdminPermissionGroup}.*`
  | AdminPermission
  | (string & {});
