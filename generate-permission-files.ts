import { join } from 'node:path';

import { writeManagementPermissionTypesFile } from '@kiki-core-stack/pack/libs/management/permission-types-file';
import type { ManagementType } from '@kiki-core-stack/pack/types';
import { checkAndGetEnvValue } from '@kikiutils/shared/env';
import { generateWithNestedRandomLength } from '@kikiutils/shared/random';
import { nanoid } from 'nanoid';

const apiBaseUrl = checkAndGetEnvValue('API_BASE_URL');
const baseGeneratedStaticTypesDirPath = join(import.meta.dirname, 'app/generated/static/types');
const managementType: ManagementType = 'admin';
const response = await fetch(
    `${apiBaseUrl}/api/${managementType}/admin/permission/list`,
    {
        headers: {
            'x-nonce': generateWithNestedRandomLength(nanoid, 21, 24, 29, 32),
            'x-timestamp': Date.now().toString(),
        },
    },
);

const responseData = await response.json();
if (!responseData.success) throw new Error(`Failed to get ${managementType} admin permission list`);
await writeManagementPermissionTypesFile(
    managementType,
    responseData.data,
    join(baseGeneratedStaticTypesDirPath, managementType, 'permission.ts'),
);
