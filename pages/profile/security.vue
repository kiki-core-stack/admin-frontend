<template>
    <div>
        <div class="flex flex-col gap-1 lg:flex-row ">
            <profile-security-change-password-form />
            <profile-security-two-factor-authentication-block />
        </div>
    </div>
</template>

<script lang="ts" setup>
useHead({ title: '安全性' });

// Hooks
onActivated(async () => tabsController.ensure('安全性', window.location.pathname));
</script>
