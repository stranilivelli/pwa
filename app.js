// Registrazione Service Worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
        .then(reg => console.log('[SW] Registrato', reg))
        .catch(err => console.log('[SW] Errore registrazione', err));
}

// Prompt installazione PWA
let deferredPrompt;

window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    deferredPrompt = e;
    console.log('[PWA] Prompt disponibile');
    const btn = document.getElementById('btn-install');
    if (btn) btn.style.display = 'inline-block';
});

document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('btn-install');
    if (btn) {
        btn.addEventListener('click', () => {
            if (!deferredPrompt) return;
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then(choice => {
                console.log('[PWA] Scelta utente:', choice.outcome);
                deferredPrompt = null;
                btn.style.display = 'none';
            });
        });
    }
});

window.addEventListener('appinstalled', () => {
    console.log('[PWA] App installata!');
});
