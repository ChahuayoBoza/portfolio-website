# Portafolio Profesional & Enterprise Architecture Showcase
**Jhonatan Moisés Chahuayo Boza | Senior Full-Stack Engineer & AWS Certified Solutions Architect**

Este repositorio contiene el código fuente completo del sitio web del portafolio profesional de Jhonatan Moisés Chahuayo Boza.

---

## 🚀 Pasos para subir este proyecto a GitHub y Netlify

### 1. Inicializar Git y subir a GitHub:
Abre tu terminal en la carpeta `portfolio-jmchb` y ejecuta:

```bash
git init
git add .
git commit -m "Initial commit: Modern Enterprise Portfolio with Interactive Demos"
git branch -M main
git remote add origin https://github.com/JMCHB/portfolio-website.git
git push -u origin main
```

*(Nota: Asegúrate de crear primero el repositorio `portfolio-website` en tu cuenta de GitHub).*

### 2. Conectar a Netlify:
1. Inicia sesión en tu cuenta de [Netlify](https://app.netlify.com/).
2. Selecciona **"Add new site"** ➡️ **"Import from an existing project"** ➡️ Selecciona **GitHub**.
3. Escoge el repositorio `portfolio-website`.
4. En los ajustes de despliegue:
   - **Publish directory:** `./` (la raíz del proyecto)
   - **Build command:** *(dejar en blanco)*
5. Haz clic en **Deploy Site**.
6. En la opción **Domain Management**, asigna tu subdominio existente: `jmchb.netlify.app`.

¡Listo! Tu portafolio se actualizará automáticamente con cada `git push`.
