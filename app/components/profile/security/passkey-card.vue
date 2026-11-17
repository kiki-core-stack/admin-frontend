<template>
    <div class="dark:bg-dark lt-md:p-3 rounded-[10px] bg-white p-4">
        <div class="flex items-center justify-between gap-4">
            <p class="fs-20px">
                密碼金鑰
            </p>
            <el-button
                :disabled="!isPasskeySupported"
                :loading="isRegistering"
                @click="addPasskey"
            >
                新增
            </el-button>
        </div>
        <p class="text-gray mt-2">
            使用裝置的指紋、臉部辨識、螢幕鎖定或安全金鑰完成雙重驗證。
        </p>
        <el-alert
            v-if="!isPasskeySupported"
            class="mt-4"
            title="此瀏覽器不支援密碼金鑰，請改用其他瀏覽器或裝置新增。"
            type="warning"
            :closable="false"
            show-icon
        />
        <el-table
            class="mt-4"
            empty-text="尚未新增密碼金鑰"
            row-key="id"
            table-layout="auto"
            :data="passkeys"
            border
            stripe
        >
            <el-table-column
                label="名稱"
                prop="name"
            />
            <el-table-column
                label="類型"
                :formatter="(row: AuthPasskeyData) => row.deviceType === 'multiDevice' ? '多裝置同步' : '單一裝置'"
            />
            <el-table-datetime-column label="建立時間" />
            <el-table-datetime-column
                empty-text="尚未使用"
                label="最後使用時間"
                prop="lastUsedAt"
            />
            <el-table-column
                align="center"
                label="操作"
            >
                <template #default="{ row }">
                    <div class="flex-middle gap-btns">
                        <el-action-btn @click="renamePasskey(row as AuthPasskeyData)">
                            重新命名
                        </el-action-btn>
                        <el-action-btn
                            type="danger"
                            @click="confirmRemovePasskey(row as AuthPasskeyData)"
                        >
                            移除
                        </el-action-btn>
                    </div>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script lang="ts" setup>
import type { AuthPasskeyData } from '@kcs-project/pack/types/data/auth';

import {
    isPasskeySupported,
    promptPasskeyName,
    registerPasskey,
} from '@/libs/auth/passkey';

// Define props, models and emits
defineProps<{ passkeys: AuthPasskeyData[] }>();
const emit = defineEmits<{ (e: 'changed', recoveryCodes?: string[]): void }>();

// Constants/Refs/Variables
const isRegistering = ref(false);

// Functions
const confirmRemovePasskey = createElMessageBoxConfirmHandler<AuthPasskeyData>({
    boxOptions: { type: 'warning' },
    confirm: async (row) => (await ProfileSecurityPasskeyApi.use().remove(row.id)).data.success,
    loadingText: '移除中...',
    message: (row) => `確定要移除密碼金鑰「${row.name}」嗎？移除後若沒有其他驗證器或密碼金鑰，雙重驗證會一併關閉，救援碼也會失效。`,
    onSuccess: () => {
        ElNotification.success('移除成功');
        emit('changed');
    },
});

async function addPasskey() {
    isRegistering.value = true;
    const result = await registerPasskey();
    isRegistering.value = false;
    if (!result) return;
    ElNotification.success('新增成功');
    emit('changed', result.recoveryCodes);
}

async function renamePasskey(row: AuthPasskeyData) {
    const name = await promptPasskeyName('重新命名密碼金鑰', row.name);
    if (name === undefined || name === row.name) return;
    const response = await ProfileSecurityPasskeyApi.use().rename(row.id, name);
    if (!response.data.success) return;
    ElNotification.success('重新命名成功');
    emit('changed');
}
</script>
