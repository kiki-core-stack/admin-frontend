import { initializeAuthenticatedSession } from '@/libs/session';

export default defineNuxtPlugin(() => {
    initializeAuthenticatedSession();
});
