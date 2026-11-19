import { initializeAuthenticatedSession } from '@/libs/auth';

export default defineNuxtPlugin(() => {
    initializeAuthenticatedSession();
});
