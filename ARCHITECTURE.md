# RGTV - ESPECIFICACIÓN MAESTRA DE ARQUITECTURA Y DESARROLLO

## Single Source of Truth (SSOT)

**Versión:** 2.0
**Estado:** Activo
**Objetivo:** Servir como documento rector para el desarrollo de RGTV mediante agentes IA (OpenCode, Claude Code, Cursor, Windsurf, Codex y similares).

---

# 1. VISIÓN DEL PROYECTO

RGTV es una aplicación IPTV moderna desarrollada completamente en el navegador, enfocada en rendimiento, mantenibilidad y experiencia de usuario.

La aplicación permitirá:

* Consumir listas IPTV públicas y privadas.
* Gestionar múltiples playlists.
* Reproducir streams HLS.
* Organizar canales por categorías, países e idiomas.
* Gestionar favoritos persistentes.
* Funcionar sin backend propio.
* Mantener rendimiento óptimo con listas superiores a 50.000 canales.

Toda la lógica deberá ejecutarse en el cliente.

No existirá:

* Backend propio.
* API REST propia.
* Base de datos externa.
* Procesamiento del lado servidor.

---

# 2. REGLAS OBLIGATORIAS PARA AGENTES IA

## Principios generales

Todo código generado deberá cumplir:

* SOLID
* DRY
* KISS
* Clean Architecture
* Domain Driven Design (DDD)
* Composition Pattern
* Atomic Design
* Functional Programming cuando sea apropiado

---

## Obligatorio

* TypeScript estricto
* React Functional Components
* React Hooks
* Tipado explícito
* Manejo de errores
* Tests automatizados
* Accesibilidad WCAG AA
* Responsive Design
* Mobile First
* Lazy Loading
* Virtualización de listas grandes

---

## Prohibido

* Uso de `any`
* Redux
* MobX
* Recoil
* Jotai
* Styled Components
* CSS Modules
* Manipulación manual del DOM
* Componentes React basados en clases
* Lógica de negocio dentro de componentes
* Componentes superiores a 300 líneas
* Dependencias innecesarias

---

# 3. STACK TECNOLÓGICO OFICIAL

## Framework

* React 19+
* Vite

## Lenguaje

* TypeScript

Configuración obligatoria:

```json
{
  "strict": true,
  "noImplicitAny": true,
  "noUncheckedIndexedAccess": true,
  "noFallthroughCasesInSwitch": true,
  "exactOptionalPropertyTypes": true
}
```

## Estado Global

* Zustand

## Estilos

* Tailwind CSS

## Reproductor

* hls.js

## Data Fetching

* TanStack Query

## Virtualización

* @tanstack/react-virtual

## Calidad

* ESLint
* Prettier
* Husky
* lint-staged

## Testing

* Vitest
* React Testing Library

## PWA

* vite-plugin-pwa

---

# 4. ESTRUCTURA DE CARPETAS OBLIGATORIA

```text
src/

├── core/
│
│   ├── channel/
│   │   ├── domain/
│   │   ├── application/
│   │   └── infrastructure/
│   │
│   ├── player/
│   │   ├── domain/
│   │   ├── application/
│   │   └── infrastructure/
│   │
│   ├── playlist/
│   │   ├── domain/
│   │   ├── application/
│   │   └── infrastructure/
│   │
│   └── shared/
│       ├── domain/
│       ├── utils/
│       └── types/
│
├── stores/
│
├── ui/
│   ├── components/
│   │   ├── atoms/
│   │   ├── molecules/
│   │   └── organisms/
│   │
│   ├── layouts/
│   ├── pages/
│   ├── hooks/
│   ├── providers/
│   ├── themes/
│   └── routes/
│
├── assets/
├── tests/
└── main.tsx
```

---

# 5. MODELO DE DOMINIO

## Channel

```ts
export interface Channel {
  id: string;
  name: string;
  logo: string | null;
  url: string;
  country: string;
  category: string;
  language: string;
  isFavorite: boolean;
  origin:
    | "default_iptv_org"
    | "default_tdtchannels"
    | "custom";
}
```

---

## Playlist

```ts
export interface Playlist {
  id: string;
  name: string;
  url?: string;
  rawContent?: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}
```

---

## PlaybackState

```ts
export type PlaybackState =
  | "idle"
  | "loading"
  | "playing"
  | "paused"
  | "buffering"
  | "error";
```

---

# 6. CASOS DE USO OBLIGATORIOS

## Channel

### ParseM3UUseCase

Responsabilidades:

* Parsear listas M3U
* Parsear listas M3U8
* Normalizar datos
* Validar registros
* Generar IDs únicos
* Ignorar entradas inválidas

---

### SearchChannelsUseCase

Responsabilidades:

* Búsqueda por nombre
* Búsqueda parcial
* Búsqueda case-insensitive

---

### FilterChannelsUseCase

Responsabilidades:

* Filtrado por país
* Filtrado por categoría
* Filtrado por idioma
* Filtrado por favoritos

---

### ToggleFavoriteUseCase

Responsabilidades:

* Marcar favorito
* Quitar favorito
* Persistencia

---

# 7. REPOSITORIOS

## ChannelRepository

```ts
export interface ChannelRepository {
  getAll(): Promise<Channel[]>;
  saveAll(channels: Channel[]): Promise<void>;
}
```

---

## FavoriteRepository

```ts
export interface FavoriteRepository {
  getFavorites(): Promise<string[]>;
  saveFavorites(ids: string[]): Promise<void>;
}
```

---

# 8. SISTEMA DE ESTADO

Única solución permitida:

```bash
zustand
```

---

## Stores obligatorios

```text
stores/

├── player.store.ts
├── channels.store.ts
├── playlists.store.ts
├── settings.store.ts
└── favorites.store.ts
```

---

## Context API

Permitido únicamente para:

* Temas
* Providers
* Dependencias

No usar Context API para estado global.

---

# 9. INGESTA DE PLAYLISTS

## Fuentes por defecto

### IPTV-org

```text
https://iptv-org.github.io/iptv/index.m3u
```

### TDTChannels

```text
https://www.tdtchannels.com/lists/tv.m3u8
```

---

## Fuentes personalizadas

### URL remota

```text
https://miservidor.com/lista.m3u
```

### Texto pegado

```text
#EXTM3U
...
```

### Archivo local

```text
lista.m3u
```

Mediante:

```ts
FileReader
```

---

# 10. NORMALIZACIÓN DE DATOS

Si un campo no existe:

```ts
country = "Unknown";
category = "General";
language = "Unknown";
logo = null;
```

---

# 11. OPTIMIZACIÓN DE BÚSQUEDA

Generar índices en memoria:

```ts
channelsById

channelsByCountry

channelsByCategory

channelsByLanguage
```

Implementación:

```ts
Record<string, Channel[]>
```

---

# 12. RENDIMIENTO

La aplicación debe soportar:

* 50.000+ canales
* Scroll fluido
* Filtrado instantáneo
* Búsqueda en tiempo real

---

## Virtualización

Obligatorio:

```bash
@tanstack/react-virtual
```

Cuando existan más de:

```text
100 elementos visibles
```

---

## Lazy Loading

Todas las páginas deberán usar:

```tsx
React.lazy()
Suspense
```

---

# 13. REPRODUCTOR

## Motor HLS

Detección:

```ts
video.canPlayType(
  "application/vnd.apple.mpegurl"
)
```

Si existe soporte:

```ts
video.src = url;
```

Caso contrario:

```ts
const hls = new Hls();
```

---

## Eventos obligatorios

* Loading
* Playing
* Pause
* Buffering
* Error
* Ended

---

## Manejo de errores

Capturar:

* Network Error
* Media Error
* Manifest Error

Mostrar mensajes amigables.

---

# 14. FULLSCREEN

Obligatorio:

```ts
playerContainer.requestFullscreen();
```

Nunca aplicar fullscreen al elemento video.

---

# 15. PERSISTENCIA

## LocalStorage

Claves oficiales

```text
rgtv_favorites
rgtv_playlists
rgtv_settings
rgtv_theme
rgtv_last_channel
```

---

# 16. SISTEMA DE TEMAS

Tema controlado por:

```html
<html data-theme="dark-slate">
```

---

## Variables CSS

```css
--color-accent-primary
--color-accent-secondary
--color-background
--color-surface
--color-border
--color-text-primary
--color-text-secondary
```

---

## Temas mínimos

* Dark Slate
* Dark Emerald
* Dark Violet
* Dark Cyan

---

# 17. GLASSMORPHISM

Todos los paneles deberán utilizar:

```css
bg-slate-900/40
backdrop-blur-md
border
border-white/10
shadow-xl
rounded-xl
```

---

# 18. PWA

La aplicación debe ser instalable.

Obligatorio:

* Manifest
* Service Worker
* Offline Cache

---

## Comportamiento Offline

Una vez descargada una playlist:

* Debe permanecer accesible sin conexión.
* Debe poder navegarse sin internet.
* Los streams seguirán dependiendo de la conectividad del proveedor.

---

# 19. CONFIGURACIÓN DE PROXY CORS

La aplicación permitirá configurar:

```text
https://mi-proxy.com/
```

Resultado:

```text
https://mi-proxy.com/https://stream.com/live.m3u8
```

---

## Servicio obligatorio

```ts
ProxyUrlBuilder
```

Responsabilidad:

* Detectar si existe proxy.
* Construir URL final.
* Mantener compatibilidad con streams directos.

---

# 20. ACCESIBILIDAD

Obligatorio:

* Navegación por teclado
* Focus visible
* Contraste WCAG AA
* ARIA labels
* Lectores de pantalla
* Navegación sin mouse

---

# 21. TESTING

Cobertura mínima:

```text
80%
```

---

## Tests obligatorios

* ParseM3UUseCase
* ToggleFavoriteUseCase
* SearchChannelsUseCase
* FilterChannelsUseCase
* PlayerService
* ProxyUrlBuilder

---

# 22. SEGURIDAD

Nunca ejecutar:

* Scripts embebidos
* HTML sin sanitizar
* URLs inseguras

Validar:

* URLs de playlists
* URLs de streams
* Entradas del usuario

---

# 23. SEO

Aunque sea SPA:

* Meta tags
* Open Graph
* Manifest
* Favicons

Objetivo:

```text
Lighthouse >= 90
```

---

# 24. CRITERIOS DE ACEPTACIÓN

La aplicación se considerará terminada cuando:

* Soporte playlists de más de 50.000 canales.
* Mantenga más de 60 FPS.
* Reproduzca streams HLS correctamente.
* Permita favoritos persistentes.
* Permita múltiples playlists.
* Funcione como PWA.
* Obtenga Lighthouse ≥ 90.
* Mantenga cobertura de tests ≥ 80%.
* No existan errores TypeScript.
* No existan errores ESLint.

---

# 25. INSTRUCCIÓN FINAL PARA AGENTES IA

Antes de generar código:

1. Leer completamente este documento.
2. Respetar estrictamente la arquitectura definida.
3. No crear archivos fuera de la estructura establecida.
4. No introducir dependencias no autorizadas.
5. Mantener TypeScript estricto.
6. Priorizar rendimiento y mantenibilidad.
7. Reutilizar código existente antes de crear nuevo código.
8. Crear tests para toda lógica de negocio.
9. Evitar duplicación de código.
10. Si existe conflicto entre implementación y especificación, prevalece esta especificación.
11. Todo código generado debe considerarse código de producción.
