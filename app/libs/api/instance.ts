import type {
    ApiErrorResponseData,
    ClientApiErrorCode,
} from '@kcs-project/pack/types/data';
import axios, { AxiosError } from 'axios';
import type {
    AxiosResponse,
    CreateAxiosDefaults,
} from 'axios';

import type { ApiResponseErrorCode } from '@/types/api';

type ApiErrorEnvelope = ApiErrorResponseData<ApiResponseErrorCode>;

// Constants/Variables
const loginRequiredErrorCodes = new Set<ApiResponseErrorCode>([
    'sessionInvalid',
    'unauthorized',
]);

// Functions
export function createApiAxiosInstance(config?: CreateAxiosDefaults) {
    const instance = axios.create(config);
    instance.interceptors.response.use(
        (response) => response,
        (error) => {
            if (!(error instanceof AxiosError)) throw error;
            const response = toFailureResponse(error);
            const { errorCode, requestId } = response.data;
            if (loginRequiredErrorCodes.has(errorCode)) assignUrlWithRedirectParamFromCurrentLocation('/auth/login/');
            else if (errorCode !== 'aborted' && !error.config?.silent) {
                const message = use$t(`errors.apiResponse.code.${errorCode}`);
                ElNotification.error(requestId ? `${message} (${requestId})` : message);
            }

            return response;
        },
    );

    return instance;
}

function isApiErrorEnvelope(data: unknown): data is ApiErrorEnvelope {
    return typeof data === 'object'
      && data !== null
      && (data as ApiErrorEnvelope).success === false
      && typeof (data as ApiErrorEnvelope).errorCode === 'string';
}

/**
 * Always resolves to a response whose `data` is the API error envelope: HTTP errors keep their response (with a
 * fallback envelope when the body is not one, e.g. a proxy error page), and failures without a response are
 * synthesized with status 0.
 */
function toFailureResponse(error: AxiosError): AxiosResponse<ApiErrorEnvelope> {
    const response: AxiosResponse<ApiErrorEnvelope> = error.response
        ? {
            ...error.response,
            data: isApiErrorEnvelope(error.response.data)
                ? error.response.data
                : {
                    errorCode: 'internalServerError',
                    success: false,
                },
        }
        : {
            config: error.config!,
            data: {
                errorCode: (axios.isCancel(error) ? 'aborted' : 'networkError') satisfies ClientApiErrorCode,
                success: false,
            },
            headers: {},
            status: 0,
            statusText: '',
        };

    response.error = error;
    return response;
}
