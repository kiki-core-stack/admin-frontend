import type { ApiResponseData } from '@kcs-project/pack/types/data';
import type {
    AxiosError,
    AxiosResponse,
} from 'axios';

export type ApiRequestResult<T extends object | undefined = undefined, E extends string | undefined = undefined> =
  | ApiTransportFailure
  | AxiosResponse<ApiResponseData<T, E>>;

export type ApiResponseErrorCode = never;

export interface ApiTransportFailure {
    data?: undefined;
    error: AxiosError;
    status?: undefined;
}
