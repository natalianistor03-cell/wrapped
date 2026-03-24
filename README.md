# 🌀 Wrapped Personal

Una aplicación web fullstack para registrar y visualizar tu año en datos — películas, libros, entrenamientos, lugares y estado de ánimo — con una historia animada al estilo Spotify Wrapped.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react) ![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite) ![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?logo=supabase&logoColor=white) ![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?logo=framer) ![React Router](https://img.shields.io/badge/React_Router-6-CA4245?logo=reactrouter)

---

## ✨ Características

- 🔐 Autenticación real con Supabase Auth
- 🎬 Registro de películas y series con valoración
- 📚 Registro de libros con autor y valoración
- 🏋️ Registro de entrenamientos con duración y calorías
- 🌍 Registro de lugares visitados con ciudad y país
- 💭 Registro de estado de ánimo diario con emoji
- ✨ Historia animada estilo Spotify Wrapped con tus stats del año
- 💎 Diseño Glassmorphism con fondo dinámico

---

## 🚀 Tecnologías utilizadas

- [React](https://react.dev/) — Librería de UI
- [Vite](https://vitejs.dev/) — Bundler y entorno de desarrollo
- [Supabase](https://supabase.com/) — Autenticación y base de datos PostgreSQL
- [React Router](https://reactrouter.com/) — Navegación entre páginas
- [Framer Motion](https://www.framer.com/motion/) — Animaciones
- [Google Fonts — Josefin Sans](https://fonts.google.com/specimen/Josefin+Sans) — Tipografía

---

## 📦 Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/tu-usuario/wrapped-personal.git
cd wrapped-personal
```

2. Instala las dependencias:
```bash
npm install
```

3. Crea un proyecto en [supabase.com](https://supabase.com) y ejecuta el SQL de configuración (ver abajo).

4. Crea un archivo `.env` en la raíz del proyecto:
```
VITE_SUPABASE_URL=tu_project_url
VITE_SUPABASE_ANON_KEY=tu_anon_key
```

5. Inicia el servidor de desarrollo:
```bash
npm run dev
```

6. Abre [http://localhost:5173](http://localhost:5173) en tu navegador.

---

## 🗄️ Configuración de Supabase

Ejecuta este SQL en el **SQL Editor** de tu proyecto de Supabase:

```sql
create table movies (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  title text not null,
  type text not null,
  rating int not null,
  date date not null,
  created_at timestamp default now()
);

create table books (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  title text not null,
  author text not null,
  rating int not null,
  date date not null,
  created_at timestamp default now()
);

create table workouts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  type text not null,
  duration int not null,
  calories int,
  date date not null,
  created_at timestamp default now()
);

create table places (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  city text not null,
  country text not null,
  date date not null,
  created_at timestamp default now()
);

create table moods (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  emoji text not null,
  note text,
  date date not null,
  created_at timestamp default now()
);

alter table movies enable row level security;
alter table books enable row level security;
alter table workouts enable row level security;
alter table places enable row level security;
alter table moods enable row level security;

create policy "Users can manage their own movies" on movies for all using (auth.uid() = user_id);
create policy "Users can manage their own books" on books for all using (auth.uid() = user_id);
create policy "Users can manage their own workouts" on workouts for all using (auth.uid() = user_id);
create policy "Users can manage their own places" on places for all using (auth.uid() = user_id);
create policy "Users can manage their own moods" on moods for all using (auth.uid() = user_id);
```

---

## 📁 Estructura del proyecto

```
wrapped-personal/
├── src/
│   ├── components/
│   │   └── Layout.jsx          → sidebar y navegación
│   ├── context/
│   │   └── AuthContext.jsx     → estado de autenticación
│   ├── lib/
│   │   └── supabase.js         → cliente de Supabase
│   ├── pages/
│   │   ├── Login.jsx           → registro e inicio de sesión
│   │   ├── Dashboard.jsx       → resumen con estadísticas
│   │   ├── Movies.jsx          → películas y series
│   │   ├── Books.jsx           → libros
│   │   ├── Workouts.jsx        → entrenamientos
│   │   ├── Places.jsx          → lugares visitados
│   │   ├── Mood.jsx            → estado de ánimo
│   │   └── Wrapped.jsx         → historia animada del año
│   ├── App.jsx
│   └── index.css
├── .env                        → variables de entorno (no subir a GitHub)
├── index.html
└── package.json
```

---

## 🧠 Conceptos practicados

- Autenticación con Supabase Auth
- Base de datos PostgreSQL en la nube
- Row Level Security — cada usuario solo ve sus datos
- `useState`, `useEffect`, `useContext`
- Context API para estado global de autenticación
- Rutas protegidas con React Router
- Animaciones con Framer Motion
- Diseño Glassmorphism con CSS

---

## 📸 Páginas

| Ruta | Descripción |
|---|---|
| `/login` | Registro e inicio de sesión |
| `/` | Dashboard con estadísticas generales |
| `/peliculas` | Registro de películas y series |
| `/libros` | Registro de libros |
| `/entrenamientos` | Registro de entrenamientos |
| `/lugares` | Registro de lugares visitados |
| `/animo` | Registro de estado de ánimo |
| `/wrapped` | Historia animada del año |

---

## 📄 Licencia

Este proyecto es de uso libre con fines educativos.
