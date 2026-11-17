<template>
    <div class="w-[400px] max-w-full">
        <Head>
            <Title>設定雙重驗證</Title>
        </Head>
        <h1 class="fs-32px">
            設定雙重驗證
        </h1>
        <p class="text-gray mt-4">
            此帳號必須使用雙重驗證。請先綁定驗證器或密碼金鑰，完成後才能繼續使用。
        </p>
        <div class="mt-4 flex flex-col gap-2">
            <el-button
                class="m-0!"
                @click="profileSecurityTotpSetupDialogRef?.open()"
            >
                綁定驗證器
            </el-button>
            <el-button
                v-if="isPasskeyAvailable"
                class="m-0!"
                :loading="isRegisteringPasskey"
                @click="addPasskey"
            >
                新增密碼金鑰
            </el-button>
            <el-button
                class="m-0!"
                @click="logout()"
            >
                {{ $t('common.logout') }}
            </el-button>
        </div>
        <profile-security-totp-setup-dialog
            ref="profileSecurityTotpSetupDialogRef"
            @confirmed="onSecondFactorAdded"
        />
        <profile-security-recovery-codes-dialog
            ref="profileSecurityRecoveryCodesDialogRef"
            @closed="leave"
        />
    </div>
</template>

<script lang="ts" setup>
import { logout } from '@/libs/auth';
import {
    isPasskeySupported,
    registerPasskey,
} from '@/libs/auth/passkey';

definePageMeta({
    keepalive: false,
    layout: 'middle-block',
});

// Constants/Refs/Variables
const isPasskeyAvailable = ref(false);
const isRegisteringPasskey = ref(false);
const profileSecurityRecoveryCodesDialogRef = useTemplateRef('profileSecurityRecoveryCodesDialogRef');
const profileSecurityTotpSetupDialogRef = useTemplateRef('profileSecurityTotpSetupDialogRef');

// Functions
async function addPasskey() {
    isRegisteringPasskey.value = true;
    const result = await registerPasskey();
    isRegisteringPasskey.value = false;
    if (result) onSecondFactorAdded(result.recoveryCodes);
}

/**
 * The session became a normal one; reload into the app, where the profile and the permissions are loaded again.
 */
function leave() {
    globalThis.location.assign(normalizeRedirectPath(useRoute().query.redirect));
}

function onSecondFactorAdded(recoveryCodes?: string[]) {
    if (recoveryCodes?.length) profileSecurityRecoveryCodesDialogRef.value?.open(recoveryCodes);
    else leave();
}

// Hooks
onMounted(async () => {
    const overview = (await ProfileSecurityApi.use().getOverview()).data.data;
    isPasskeyAvailable.value = isPasskeySupported && !!overview?.passkeySupported;
});
</script>
