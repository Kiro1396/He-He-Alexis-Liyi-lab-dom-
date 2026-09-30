# Laboratorio Guiado: DOM y Validación de Formularios

## Integrantes del Grupo
* **Estudiante 1:** Alexis He
* **Estudiante 2:** Liyi He
* **Grupo:** 1SF133
* **Asignatura:** Ingeniería Web
* **Profesora:** Dra. Elba Valderrama Bahamóndez

## Enlaces de Entrega
* **Repositorio de GitHub:** https://github.com/Kiro1396/He-He-Alexis-Liyi-lab-dom-
* **Sitio Web Publicado (GitHub Pages):** https://kiro1396.github.io/He-He-Alexis-Liyi-lab-dom-/inscripcion/

## Captura
### Captura de validaciones
<img width="438" height="908" alt="Captura de pantalla 2026-09-30 013244" src="https://github.com/user-attachments/assets/587d5801-d1d7-4c3e-8350-31ac3c031fd6" />

### Captura de la inscripcion
<img width="394" height="940" alt="Captura de pantalla 2026-09-30 023614" src="https://github.com/user-attachments/assets/e1dc2976-6c5b-4dde-b916-776a9ba4f399" />

## Respuestas a las Preguntas de Control

### 1. ¿Qué devuelve `document.querySelector('.inexistente')` y qué pasa si luego escribes `.textContent = 'x'`?
**R=** Devuelve null. Si intentas asignar la propiedad .textContent = 'x' a un valor nulo, el navegador se romperá y arrojará el error TypeError: Cannot set properties of null. Por esta razón, siempre es una buena práctica validar si el elemento existe antes de alterarlo.

### 2. Si agregas 100 tareas nuevas a la lista, ¿cuántos manejadores de clic tiene la página con delegación? ¿Y sin delegación?
**R=** 
-Con delegación: Sigue teniendo un solo manejador.
-Sin delegación: Tendrías que registrar 100 manejadores individuales. Olvidar quitarlos al eliminar elementos suele causar fugas de memoria en la página.

### 3. ¿Por qué el manejador de `blur` se registra con `true` como tercer argumento?
**R=** Porque el evento blur no burbujea (no sube de forma natural por el árbol de HTML). Al colocar true, le indicas a JavaScript que escuche el evento en la fase de captura, permitiendo que un único escuchador en la etiqueta "<form>" atrape la salida de cualquier casilla del formulario de forma centralizada.
