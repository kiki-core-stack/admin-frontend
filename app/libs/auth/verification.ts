import type { AuthVerificationRequiredErrorData } from '@kcs-project/pack/types/api';

interface AuthVerificationRequest extends AuthVerificationRequiredErrorData {
    /**
     * Settles the request with the one-time grant, or nothing when the admin canceled.
     */
    resolve: (grant?: string) => void;
}

// Constants/Refs/Variables

/**
 * The verification being asked for; shown by the verification dialog mounted in `app.vue`.
 */
export const pendingAuthVerificationRequest = shallowRef<AuthVerificationRequest>();
let lastRequest: Promise<unknown> = Promise.resolve();

// Functions

/**
 * Asks the admin to verify for a high-risk operation and resolves to the one-time grant, or nothing when canceled.
 * Called by the API layer when a request fails with `verificationRequired`; requests are asked one at a time.
 */
export async function requestAuthVerification(data: AuthVerificationRequiredErrorData) {
    const request = lastRequest.then(async () => await new Promise<string | undefined>((resolve) => {
        const pendingRequest: AuthVerificationRequest = {
            ...data,
            // Settles once and only clears itself: a late response of a canceled request must not drop the request
            // that is being asked by then.
            resolve: (grant) => {
                if (pendingAuthVerificationRequest.value !== pendingRequest) return;
                pendingAuthVerificationRequest.value = undefined;
                resolve(grant);
            },
        };

        pendingAuthVerificationRequest.value = pendingRequest;
    }));

    lastRequest = request;
    return await request;
}
