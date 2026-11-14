// Generates the backend-derived files in app/generated (run before `nuxt dev`; needs the dev backend running).
import { generateApiErrorCodeFile } from '@kcs-project/pack/libs/codegen/api-error-code-file';
import { generateManagementPermissionFile } from '@kcs-project/pack/libs/codegen/management-permission-file';
import { Path } from '@kikiutils/shared/classes/path';
import { checkAndGetEnvValue } from '@kikiutils/shared/env';

const apiBaseUrl = checkAndGetEnvValue('API_BASE_URL');
const generatedDirPath = new Path(import.meta.dirname, '../app/generated');

await Promise.all([
    generateApiErrorCodeFile({
        apiBaseUrl,
        targetFilePath: generatedDirPath.join('api-error-code.ts').toString(),
    }),
    generateManagementPermissionFile({
        apiBaseUrl,
        managementType: 'admin',
        targetFilePath: generatedDirPath.join('admin', 'permission.ts').toString(),
    }),
]);
