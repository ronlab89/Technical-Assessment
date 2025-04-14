# Technical Assessment Project

## 🌐 Demo

[https://technical-assessment-gy.vercel.app/](https://technical-assessment-gy.vercel.app/)

## 🔑 Accesos de prueba

Puedes iniciar sesión con cualquiera de los siguientes usuarios para probar la app según el rol:

| Rol             | Correo            | Contraseña |
| --------------- | ----------------- | ---------- |
| Project Manager | pm@test.com       | test2025\* |
| Cliente         | cliente@test.com  | test2025\* |
| Diseñador       | designer@test.com | test2025\* |

> Todos los usuarios son ficticios y fueron creados para efectos de demostración.

## 🚀 Tecnologías utilizadas

- **Next.js** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Shadcn/ui**
- **Zustand** (manejo de estado global)
- **react-hook-form** + **zod** (manejo de formularios y validaciones)
- **Sonner** (notificaciones)
- **Supabase** (Base de datos y backend como servicio)

## 🛠️ Requisitos previos

- Node.js v20.6.1 (o superior)
- pnpm, npm o yarn

## ⚙️ Variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto con el siguiente contenido:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima
```

Puedes obtener estos valores desde el panel de Supabase.

## 📁 Estructura del proyecto

```
src/
├── app/
│   ├── requests/
│   │   ├── columnsRequest.tsx
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── assets/
│   └── css/loader.css
├── components/        # Componentes reutilizables
├── hooks/             # Custom hooks
├── lib/               # Funciones auxiliares y cliente de Supabase
├── store/             # Estado global (Zustand)
└── middleware.ts      # Middleware de autenticación
```

## ▶️ Cómo ejecutar el proyecto localmente

1. Clona el repositorio:

```bash
git clone [url-del-repo]
cd [nombre-del-proyecto]
```

2. Instala las dependencias:

```bash
npm install
# o
yarn
# o
pnpm install
```

3. Crea el archivo `.env.local` como se indicó anteriormente.

4. Inicia el servidor de desarrollo:

```bash
npm run dev
```

5. Abre tu navegador en `http://localhost:3000`

## 🧠 Explicación técnica

Este proyecto presenta una interfaz para la gestión de solicitudes con múltiples roles de usuario y control de acceso basado en permisos. Fue desarrollado utilizando **Next.js App Router**, priorizando la modularidad, escalabilidad y una clara separación de responsabilidades.

- **Autenticación** y **persistencia de sesión** están integradas con Supabase.
- **Zustand** se usa para manejar el estado global de la aplicación, incluyendo la sesión, lista de proyectos y diseñadores.
- Los **formularios** se validan usando **react-hook-form** con **zod** para garantizar inputs limpios y correctos.
- **Tailwind CSS** se utiliza como sistema de estilos junto con componentes de **Shadcn/ui** para mantener consistencia y accesibilidad.
- La estructura modular permite escalar fácilmente la aplicación.

---
