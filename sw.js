// Service worker mínimo — só existe para o navegador permitir "instalar" o app.
// Não faz cache agressivo porque o app depende de dados sempre atualizados do Firebase.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', () => {}); // necessário existir para contar como PWA instalável
