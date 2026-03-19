# 🚀 Cómo poner la app en producción

## Lo que necesitas
- Un ordenador con Node.js instalado (si no lo tienes: https://nodejs.org → descarga LTS)
- Una cuenta en GitHub (gratis: https://github.com)
- Una cuenta en Vercel (gratis: https://vercel.com — puedes hacer login con GitHub)

---

## Paso 1 · Descargar el proyecto

Descarga la carpeta `plan-bebe.zip` que te he preparado y descomprímela.

Dentro verás esta estructura:
```
plan-bebe/
├── index.html        ← Página principal (con meta tags para que parezca una app)
├── package.json      ← Dependencias del proyecto
├── vite.config.js    ← Configuración de Vite
├── .gitignore
├── src/
│   ├── main.jsx      ← Punto de entrada React
│   └── App.jsx       ← 👈 TODA la app está aquí
└── DEPLOY.md         ← Este archivo
```

---

## Paso 2 · Probar en local (opcional pero recomendado)

Abre una terminal en la carpeta del proyecto y ejecuta:

```bash
npm install
npm run dev
```

Se abrirá en http://localhost:5173. Comprueba que todo funciona.

---

## Paso 3 · Subir a GitHub

### Opción A: Desde la terminal
```bash
cd plan-bebe
git init
git add .
git commit -m "Plan alimentación bebé"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/plan-bebe.git
git push -u origin main
```

### Opción B: Desde GitHub.com (más fácil)
1. Ve a https://github.com/new
2. Nombre del repo: `plan-bebe`
3. Déjalo público o privado (da igual para Vercel)
4. Haz clic en "Create repository"
5. Arrastra todos los archivos del proyecto a la página del repo
6. Haz clic en "Commit changes"

---

## Paso 4 · Desplegar en Vercel (la magia)

1. Ve a https://vercel.com y haz login con GitHub
2. Haz clic en **"Add New..." → "Project"**
3. Busca y selecciona el repo `plan-bebe`
4. Vercel detecta automáticamente que es un proyecto Vite
5. Haz clic en **"Deploy"**
6. En ~30 segundos tendrás una URL tipo: **`plan-bebe.vercel.app`**

¡Ya está en producción! 🎉

---

## Paso 5 · Que tu pareja lo use como "app" en el móvil

### iPhone (Safari)
1. Abre `plan-bebe.vercel.app` en Safari
2. Toca el botón de compartir (cuadrado con flecha ↑)
3. Toca **"Añadir a pantalla de inicio"**
4. Ponle nombre "Mi Bebé" → Añadir
5. Aparece en la home como una app con el icono 🍼

### Android (Chrome)
1. Abre la URL en Chrome
2. Toca los tres puntos ⋮
3. Toca **"Añadir a pantalla de inicio"**
4. Confirmar

Al abrirla desde la home, se ve a pantalla completa sin barra de navegador. Parece una app nativa.

---

## Paso 6 · Actualizar la app (si quieres cambiar algo)

1. Edita el archivo `src/App.jsx` en tu ordenador
2. Haz commit y push a GitHub:
```bash
git add .
git commit -m "Cambio X"
git push
```
3. Vercel detecta el cambio y redespliega automáticamente en ~30 seg
4. Tu pareja no tiene que hacer nada — la próxima vez que abra la app verá la versión nueva

---

## Extras opcionales

### Cambiar la URL
En el dashboard de Vercel → Settings → Domains, puedes:
- Cambiar el subdominio gratis: `mi-bebe.vercel.app`
- Conectar un dominio propio si tienes uno

### Dominio personalizado barato
Si quieres una URL tipo `plan-bebe.es`:
- Compra un dominio en Namecheap (~8€/año)
- Conéctalo en Vercel → Settings → Domains → Add
- Vercel configura HTTPS automáticamente

---

## 🔧 Si algo falla

| Problema | Solución |
|----------|----------|
| `npm install` falla | Comprueba que tienes Node.js 18+ (`node -v`) |
| La página sale en blanco | Abre la consola del navegador (F12) y mira el error |
| Vercel no detecta el proyecto | Asegúrate de que `package.json` está en la raíz del repo |
| Quiero cambiar la fecha de nacimiento | Edita la línea `const BIRTH = new Date(2025, 9, 4)` en App.jsx (ojo: los meses empiezan en 0, así que 9 = octubre) |
| Quiero cambiar la fecha de inicio | Edita `const START = new Date(2026, 3, 4)` (3 = abril) |
