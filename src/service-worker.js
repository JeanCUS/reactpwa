/* service worker */
import { precacheAndRoute } from 'workbox-precaching';
/* eslint-disable no-restricted-globals */
precacheAndRoute(self.__WB_MANIFEST || []);

// Nombre del caché
const CACHE_NAME = 'mi-pwa-cache';

// Archivos a ser almacenados en el caché
const urlsToCache = [
    "/",
    "/index.js",  // <-- Agregué una barra al inicio
    "/public/index.html",
    "/public/favicon.ico",
    "/logo.svg",  // <-- Agregué una barra al inicio
    "/index.css", // <-- Agregué una barra al inicio
    "/App.css"    // <-- Agregué una barra al inicio
];

// Instalación del Service Worker

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Recuperación de recursos desde el caché
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Devuelve la respuesta almacenada en caché si se encuentra.
        if (response) {
          return response;
        }

        // Si la respuesta no se encuentra en caché, busca en la red.
        return fetch(event.request);
      })
  );
});

// Eliminación de cachés antiguos durante la activación
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
/* eslint-enable no-restricted-globals */