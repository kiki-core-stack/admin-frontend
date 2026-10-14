import { writeManagementPermissionTypesFile } from '@kcs-project/pack/libs/management/permission-types-file';
import type { ManagementType } from '@kcs-project/pack/types';
import { Path } from '@kikiutils/shared/classes/path';
import { checkAndGetEnvValue } from '@kikiutils/shared/env';

const apiBaseUrl = checkAndGetEnvValue('API_BASE_URL');
const baseGeneratedStaticTypesDirPath = new Path(import.meta.dirname, '../app/generated/static/types');
const managementType: ManagementType = 'admin';

const response = await fetch(`${apiBaseUrl}/api/${managementType}/admin/permission/list`);
const responseData = await response.json();
if (!responseData.success) throw new Error(`Failed to get ${managementType} admin permission list`);
await writeManagementPermissionTypesFile(
    managementType,
    responseData.data,
    baseGeneratedStaticTypesDirPath.join(managementType, 'permission.ts').toString(),
);
