import { writable } from 'svelte/store';

let timeoutId;

export const notification = writable({ visible: false, message: '', type: '', seconds: 0 });

export function showNotification(message, type, seconds) {
    clearTimeout(timeoutId);

    notification.set({ visible: true, message, type, seconds });

    timeoutId = setTimeout(() => {
        notification.set({ visible: false, message: '', type: '', seconds: 0 });
    }, seconds ? seconds * 1000 : 1500);
}

export function clearNotification() {
    clearTimeout(timeoutId);
    notification.set({ visible: false, message: '', type: '', seconds: 0 });
}
