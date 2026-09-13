# Guía y Checklist de Assets Visuales para Google Play Store
## Escuela de Inglés Americana

---

### 1. Requisitos Técnicos Oficiales de Google Play

| Activo | Dimensiones Requeridas | Formato | Peso Máximo | Notas Importantes |
| :--- | :--- | :--- | :--- | :--- |
| **Icono de la App** | `512 x 512 px` | PNG (32-bit alfa) | 1.024 KB | **No redondear esquinas manualmente.** Google Play aplica automáticamente el radio de curvatura oficial. |
| **Gráfico Destacado (Feature Graphic)** | `1024 x 500 px` | PNG o JPEG | 15 MB | Es el banner principal de la ficha y de las recomendaciones. Mantener logos y textos en el tercio central. |
| **Capturas de Teléfono (Phone Screenshots)** | `1080 x 2400 px` (o `1080 x 1920 px`) | PNG o JPEG | 8 MB c/u | Mínimo 4 capturas, recomendado 5 a 6. Relación 9:16 vertical. |

---

### 2. Especificación de las 5 Capturas de Pantalla (Storytelling ASO)

Para maximizar la tasa de conversión en la tienda, cada captura de pantalla debe llevar un **título superior de alto impacto** (en fuente legible, sin saturar) y mostrar la pantalla real de la aplicación con la interfaz oscura (*Dark Elite*):

---

#### 📱 Captura 1: El Núcleo Pedagógico (Estudio SRS)
* **Pantalla en la app:** `Card.tsx` / Sesión de estudio diario con tarjeta SRS abierta mostrando botón de pronunciación y botones de evaluación (Difícil, Bien, Fácil).
* **Titular superior (Headline):**
  > **"Repetición Espaciada Inteligente"**
* **Subtítulo / Beneficio:**
  > *"Memoriza vocabulario de por vida en solo 10 minutos al día."*
* **Detalle visual:** Tarjeta con palabra clave (ej. `nevertheless`), transcripción fonética y botón de audio en azul acentuado.

---

#### 📱 Captura 2: El Banco de Palabras y Búsqueda Instantánea
* **Pantalla en la app:** `vocabulary.tsx` / Pestaña de Vocabulario con la barra de búsqueda activa mostrando el filtro por nivel (A1, A2, B1, B2).
* **Titular superior (Headline):**
  > **"+2.500 Palabras 100% Auditadas"**
* **Subtítulo / Beneficio:**
  > *"Búsqueda instantánea con filtro por niveles del MCER (A1 a B2)."*
* **Detalle visual:** Barra de búsqueda con término filtrado, contador de resultados y badges de nivel (`A1`, `B1`).

---

#### 📱 Captura 3: Lecturas Graduadas y Comprensión
* **Pantalla en la app:** `ReadingModal.tsx` o pantalla de lectura con texto en inglés, traducción desplegable y quiz de comprensión.
* **Titular superior (Headline):**
  > **"Lecturas en Contexto Real"**
* **Subtítulo / Beneficio:**
  > *"Desarrolla fluidez lectora y responde preguntas de comprensión."*
* **Detalle visual:** Texto graduado con vocabulario resaltado y preguntas interactivas de opción múltiple.

---

#### 📱 Captura 4: Gramática y Redacción Avanzada (B1/B2)
* **Pantalla en la app:** Ejercicio de gramática con huecos (`Fill the Blank`) o prompt de redacción de ensayo formal.
* **Titular superior (Headline):**
  > **"Gramática y Redacción Seria"**
* **Subtítulo / Beneficio:**
  > *"Desde estructuras esenciales hasta redacción de ensayos y correos."*
* **Detalle visual:** Oración con hueco interactivo, alternativas aceptadas y explicación pedagógica visible.

---

#### 📱 Captura 5: Progreso, Rachas y Hábitos
* **Pantalla en la app:** `progress.tsx` / Pantalla de progreso con gráfico de retención, racha diaria y tarjetas dominadas.
* **Titular superior (Headline):**
  > **"Mide tu Retención Real"**
* **Subtítulo / Beneficio:**
  > *"Sigue tu racha diaria y estudia sin internet (100% offline-first)."*
* **Detalle visual:** Contador de racha con llama dorada, tarjetas en estado *Dominadas* y gráfico de barras semanal.

---

### 3. Pautas de Diseño para el Gráfico Destacado (Feature Graphic: 1024x500 px)

* **Fondo:** `#0B0F17` (Negro pizarra institucional a juego con el tema de la app).
* **Elemento izquierdo:** Logo de Escuela de Inglés Americana con tipografía blanca nítida y el subtítulo *"El método serio para hispanohablantes"*.
* **Elemento derecho:** Dispositivo en perspectiva inclinada mostrando una tarjeta SRS brillante con acentos en azul (`#2563EB`) y verde esmeralda (`#10B981`).
* **Zona de seguridad:** Mantener todo el contenido gráfico importante a más de 100 px de los bordes izquierdo/derecho y 60 px de los bordes superior/inferior para evitar recortes en tablets o Google TV.
