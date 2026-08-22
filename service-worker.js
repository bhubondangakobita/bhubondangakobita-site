/* Bhubondanga PWA Service Worker v1 */
const VERSION='bd-pwa-v1-20260823';
const STATIC_CACHE=`${VERSION}-static`,PAGE_CACHE=`${VERSION}-pages`;
const PRECACHE=['./','./index.html','./settings.html','./register.html','./diary.html','./style.css','./app.js','./offline-db.js','./localization.js','./prayer-times.js','./diary-lock.js','./diary.js','./gift-box.js','./settings.js','./social-permissions.js','./manifest.webmanifest','./app-icon.svg','./compose-box.html','./feed.html','./profile.html','./founder-profile.html','./admin-profile.html'];
self.addEventListener('install',event=>{event.waitUntil((async()=>{const c=await caches.open(STATIC_CACHE);await Promise.allSettled(PRECACHE.map(x=>c.add(new Request(x,{cache:'reload'}))));self.skipWaiting()})())});
self.addEventListener('activate',event=>{event.waitUntil((async()=>{for(const k of await caches.keys())if(k!==STATIC_CACHE&&k!==PAGE_CACHE&&k.startsWith('bd-pwa-'))await caches.delete(k);await self.clients.claim()})())});
function bypass(req){const u=new URL(req.url);return req.method!=='GET'||/\.supabase\.co$/.test(u.hostname)||u.hostname==='api.aladhan.com'||u.hostname.includes('stripe.com')||u.pathname.startsWith('/api/gifts/');}
async function networkFirst(req){const cache=await caches.open(PAGE_CACHE);try{const r=await fetch(req);if(r&&r.ok)cache.put(req,r.clone());return r}catch(_){return await cache.match(req)||await caches.match('./index.html')||new Response('Offline',{status:503,headers:{'content-type':'text/plain'}})}}
async function staleWhileRevalidate(req){const cache=await caches.open(STATIC_CACHE),hit=await cache.match(req);const fetcher=fetch(req).then(r=>{if(r&&r.ok&&new URL(req.url).origin===self.location.origin)cache.put(req,r.clone());return r}).catch(()=>null);return hit||await fetcher||new Response('',{status:504})}
self.addEventListener('fetch',event=>{const req=event.request;if(bypass(req))return;if(req.mode==='navigate'){event.respondWith(networkFirst(req));return}const u=new URL(req.url);if(u.origin===self.location.origin)event.respondWith(staleWhileRevalidate(req))});
self.addEventListener('message',event=>{if(event.data==='SKIP_WAITING')self.skipWaiting()});
