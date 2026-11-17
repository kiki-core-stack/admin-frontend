<template>
    <div class="w-[400px] max-w-full">
        <Head>
            <Title>QR Code 登入</Title>
        </Head>
        <h1 class="fs-32px">
            QR Code 登入
        </h1>
        <template v-if="state === 'pending' && info">
            <p class="mt-4">
                是否允許以下裝置登入您的帳號？
            </p>
            <el-descriptions
                class="mt-4 w-full"
                :column="1"
                border
            >
                <el-descriptions-item label="裝置">
                    {{ parseUserAgentToDeviceInfo(info.userAgent) }}
                </el-descriptions-item>
                <el-descriptions-item label="IP">
                    {{ info.ip || '未知' }}
                </el-descriptions-item>
                <el-descriptions-item label="請求時間">
                    {{ formatDate(info.createdAt) }}
                </el-descriptions-item>
            </el-descriptions>
            <p class="text-gray mt-4">
                核准後，該裝置將以您的身分登入。若這不是您本人的操作，請拒絕。
            </p>
            <div class="gap-btns mt-4 flex justify-center">
                <el-button
                    type="danger"
                    @click="decide(false)"
                >
                    拒絕
                </el-button>
                <el-button @click="decide(true)">
                    允許登入
                </el-button>
            </div>
        </template>
        <template v-else-if="state !== 'pending'">
            <p class="mt-4">
                {{ stateToMessageMap[state] }}
            </p>
            <el-button
                class="mt-4"
                @click="navigateTo('/', { replace: true })"
            >
                返回
            </el-button>
        </template>
        <status-overlay
            ref="statusOverlayRef"
            initial-status="loading"
            initial-status-text="載入中..."
        />
    </div>
</template>

<script lang="ts" setup>
import type { AuthQrCodeLoginInfoData } from '@kcs-project/pack/types/data/auth';

import { parseUserAgentToDeviceInfo } from '@/libs/user-agent';

definePageMeta({
    keepalive: false,
    layout: 'middle-block',
});

// Constants/Refs/Variables
const info = ref<AuthQrCodeLoginInfoData>();
const route = useRoute();
const state = ref<'approved' | 'expired' | 'pending' | 'rejected'>('pending');
const stateToMessageMap = {
    approved: '已允許登入，該裝置將自動完成登入。',
    expired: 'QR Code 已失效，請在要登入的裝置上重新取得。',
    rejected: '已拒絕此登入請求。',
} as const;

const statusOverlayRef = useTemplateRef('statusOverlayRef');

// Computed properties

// The token of the scanned QR code (see `toQrCodeLoginApprovalUrl`).
const qrToken = computed(() => route.hash.slice(1));

// Functions
async function decide(approved: boolean) {
    if (!statusOverlayRef.value || statusOverlayRef.value.isVisible) return;
    statusOverlayRef.value.showLoading('處理中...');
    const api = AuthApi.use();
    const token = qrToken.value;
    const response = await (approved ? api.approveQrCodeLogin(token) : api.rejectQrCodeLogin(token));
    // Another QR code was scanned meanwhile: this result belongs to the previous one.
    if (token !== qrToken.value) return;
    statusOverlayRef.value.hide();
    if (response.data.success) state.value = approved ? 'approved' : 'rejected';
    else if (response.data.errorCode === 'qrCodeLoginExpired') state.value = 'expired';
}

async function loadInfo() {
    const token = qrToken.value;
    statusOverlayRef.value?.showLoading('載入中...');
    const loadedInfo = token ? (await AuthApi.use().getQrCodeLoginInfo(token, { silent: true })).data.data : undefined;
    if (token !== qrToken.value) return;
    info.value = loadedInfo;
    state.value = loadedInfo ? 'pending' : 'expired';
    statusOverlayRef.value?.hide();
}

// Watchers

// Scanning another QR code while on this page only changes the fragment.
watch(qrToken, loadInfo);

// Hooks
onMounted(loadInfo);
</script>
