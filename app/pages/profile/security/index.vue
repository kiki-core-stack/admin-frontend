<template>
    <div
        v-loading="isLoadingOverview"
        class="h-full"
    >
        <div class="lt-md:p-3 h-full overflow-auto p-4">
            <div class="grid grid-cols-1 items-start gap-4 lg:grid-cols-2">
                <div class="flex flex-col gap-4">
                    <template v-if="overview">
                        <profile-security-change-password-form
                            :has-password="overview.hasPassword"
                            :requires-current-password="overview.passwordChangeRequiresCurrentPassword"
                        />
                        <profile-security-two-factor-card
                            :has-second-factor="hasSecondFactor"
                            :two-factor="overview.twoFactor"
                            @changed="onChanged"
                        />
                        <profile-security-recovery-code-card
                            :has-second-factor="hasSecondFactor"
                            :recovery-codes-remaining="overview.recoveryCodesRemaining"
                            @changed="onChanged"
                        />
                    </template>
                </div>
                <div
                    v-if="overview"
                    class="flex flex-col gap-4"
                >
                    <profile-security-totp-card
                        :totp-confirmed-at="overview.totpConfirmedAt"
                        @changed="onChanged"
                    />
                    <profile-security-passkey-card
                        v-if="overview.passkeySupported"
                        :passkeys="overview.passkeys"
                        @changed="onChanged"
                    />
                </div>
            </div>
        </div>
        <profile-security-recovery-codes-dialog ref="profileSecurityRecoveryCodesDialogRef" />
    </div>
</template>

<script lang="ts" setup>
import type { AuthSecurityOverviewData } from '@kcs-project/pack/types/data/auth';

// Constants/Refs/Variables
const isLoadingOverview = ref(false);
const overview = ref<AuthSecurityOverviewData>();
const profileSecurityRecoveryCodesDialogRef = useTemplateRef('profileSecurityRecoveryCodesDialogRef');
pageHeadTabsController.registerCurrentPageHeadTab('安全性');

// Computed properties
// Mirrors the backend: passkeys only count as a second factor when the realm supports them.
const hasSecondFactor = computed(() => {
    if (!overview.value) return false;
    return !!overview.value.totpConfirmedAt || (overview.value.passkeySupported && overview.value.passkeys.length > 0);
});

// Functions
async function loadOverview() {
    isLoadingOverview.value = true;
    const data = (await ProfileSecurityApi.use().getOverview()).data.data;
    isLoadingOverview.value = false;
    if (data) overview.value = data;
}

async function onChanged(recoveryCodes?: string[]) {
    if (recoveryCodes?.length) profileSecurityRecoveryCodesDialogRef.value?.open(recoveryCodes);
    await loadOverview();
}

// Hooks
onActivated(loadOverview);
</script>
