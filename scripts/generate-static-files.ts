// Generates the static type files derived from the backend (run before `nuxt dev`; needs the dev backend running).
import { generateApiErrorCodeTypesFile } from '@kcs-project/pack/libs/codegen/api-error-code-types-file';
import { generateManagementPermissionTypesFile } from '@kcs-project/pack/libs/codegen/management-permission-types-file';
import { Path } from '@kikiutils/shared/classes/path';
import { checkAndGetEnvValue } from '@kikiutils/shared/env';

const apiBaseUrl = checkAndGetEnvValue('API_BASE_URL');
const generatedStaticTypesDirPath = new Path(import.meta.dirname, '../app/generated/static/types');

await Promise.all([
    generateApiErrorCodeTypesFile({
        apiBaseUrl,
        targetFilePath: generatedStaticTypesDirPath.join('api-error-code.ts').toString(),
    }),
    generateManagementPermissionTypesFile({
        apiBaseUrl,
        managementType: 'admin',
        targetFilePath: generatedStaticTypesDirPath.join('admin', 'permission.ts').toString(),
    }),
]);
