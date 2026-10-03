import { writeManagementPermissionTypesFile } from '@kcs-project/pack/libs/management/permission-types-file';
import type { ManagementType } from '@kcs-project/pack/types';
import { EnhancedDate } from '@kikiutils/shared/classes/enhanced-date';
import { Path } from '@kikiutils/shared/classes/path';
import { checkAndGetEnvValue } from '@kikiutils/shared/env';
import { generateWithNestedRandomLength } from '@kikiutils/shared/random';
import { nanoid } from 'nanoid';

const apiBaseUrl = checkAndGetEnvValue('API_BASE_URL');
const baseGeneratedStaticTypesDirPath = new Path(import.meta.dirname, 'app/generated/static/types');
const managementType: ManagementType = 'admin';
const response = await fetch(
    `${apiBaseUrl}/api/${managementType}/admin/permission/list`,
    {
        headers: {
            'x-nonce': generateWithNestedRandomLength(nanoid, 21, 24, 29, 32),
            'x-timestamp': EnhancedDate.now().toString(),
        },
    },
);

const responseData = await response.json();
if (!responseData.success) throw new Error(`Failed to get ${managementType} admin permission list`);
await writeManagementPermissionTypesFile(
    managementType,
    responseData.data,
    baseGeneratedStaticTypesDirPath.join(managementType, 'permission.ts').toString(),
);
