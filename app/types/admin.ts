import type {
    AdminPermission,
    AdminPermissionGroup,
} from '@/generated/static/types/admin/permission';

export type AdminPermissionPattern =
  | 'ignore'
  | `!${AdminPermissionGroup}.*`
  | `!${AdminPermission}`
  | `${AdminPermissionGroup}.*`
  | AdminPermission
  | (string & {});
