<template>
    <el-dialog
        title="驗證身分"
        width="min(400px, 90vw)"
        :model-value="!!request"
        align-center
        append-to-body
        center
        destroy-on-close
        @close="request?.resolve()"
    >
        <p class="text-gray mb-4 text-center">
            此操作需要再次驗證您的身分。
        </p>
        <auth-factor-proof-form
            v-if="request"
            :factors="request.factors"
            :get-passkey-options="() => AuthApi.use().getVerificationPasskeyOptions()"
            :submit="verify"
        />
    </el-dialog>
</template>

<script lang="ts" setup>
import { pendingAuthVerificationRequest as request } from '@/libs/auth/verification';
import type { AuthFactorProofData } from '@/types/data/auth';

// Functions
async function verify(proof: AuthFactorProofData) {
    const pendingRequest = request.value;
    if (!pendingRequest) return false;
    const response = await AuthApi.use().createVerification(pendingRequest.operation, proof);
    if (!response.data.data) return false;
    pendingRequest.resolve(response.data.data.grant);
    return true;
}
</script>
