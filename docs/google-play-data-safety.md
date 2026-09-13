# Guía Paso a Paso: Formulario de Seguridad de los Datos (Data Safety)
## Google Play Console — Escuela de Inglés Americana (`com.elp.app`)

Este documento contiene las respuestas exactas que debes seleccionar en el cuestionario de **Seguridad de los datos** (*Data Safety*) en Google Play Console para evitar inconsistencias o rechazos en la revisión.

---

### Paso 1: Información General sobre la Recopilación y Seguridad

| Pregunta de Google Play Console | Tu Respuesta | Justificación Técnica |
| :--- | :--- | :--- |
| **¿Tu aplicación recopila o comparte alguno de los tipos de datos de usuario obligatorios?** | **Sí** | La app guarda el email de autenticación y el progreso de estudio en Supabase. |
| **¿Todos los datos de usuario que recopila tu aplicación se cifran en tránsito?** | **Sí** | Todo el tráfico entre la app y Supabase se realiza mediante HTTPS / TLS 1.3. |
| **¿Proporcionas un mecanismo para que los usuarios soliciten que se eliminen sus datos?** | **Sí** | Se provee mecanismo de eliminación de cuenta y correo de contacto en la Política de Privacidad. |
| **Enlace de solicitud de eliminación de datos (URL):** | *URL de tu política o formulario (ej. https://tudominio.com/privacy#eliminacion o correo de soporte)* | Obligatorio por Google Play para permitir solicitudes externas de borrado. |

---

### Paso 2: Selección de Tipos de Datos Recopilados

Marca **ÚNICAMENTE** las siguientes categorías:

#### 1. Información personal (*Personal info*)
* Marca la casilla: **Dirección de correo electrónico** (*Email address*)
* Marca la casilla: **IDs de usuario** (*User IDs*)

#### 2. Actividad de la aplicación (*App activity*)
* Marca la casilla: **Interacciones con la aplicación** (*App interactions*)

*(Deja todas las demás categorías DESMARCADAS: Ubicación, Información financiera, Salud, Mensajes, Fotos, Audio, Contactos, etc.).*

---

### Paso 3: Detalle por cada Tipo de Dato Seleccionado

Cuando la consola te pida detallar cada dato seleccionado, responde con las siguientes opciones:

---

#### A) Dirección de correo electrónico (*Email address*)
* **¿Se recopila o se comparte?**
  * Selecciona: **Recopilado** (*Collected*)
  * *NO marcar "Compartido".*
* **¿Se procesan estos datos de forma efímera?**
  * Selecciona: **No** (se almacena de forma persistente en Supabase mientras la cuenta esté activa).
* **¿Estos datos son obligatorios para el uso de la aplicación o los usuarios pueden decidir si se recopilan?**
  * Selecciona: **Los datos son obligatorios** (*Data collection is required*) para crear la cuenta y sincronizar.
* **¿Por qué se recopilan estos datos? (Finalidades):**
  * Marca: **Funcionalidad de la aplicación** (*App functionality*)
  * Marca: **Gestión de cuentas** (*Account management*)

---

#### B) IDs de usuario (*User IDs*)
* **¿Se recopila o se comparte?**
  * Selecciona: **Recopilado** (*Collected*)
  * *NO marcar "Compartido".*
* **¿Se procesan de forma efímera?**
  * Selecciona: **No**.
* **¿Son obligatorios?**
  * Selecciona: **Los datos son obligatorios** (*Data collection is required*).
* **Finalidades:**
  * Marca: **Funcionalidad de la aplicación** (*App functionality*)
  * Marca: **Gestión de cuentas** (*Account management*)

---

#### C) Interacciones con la aplicación (*App interactions*)
*(Aplica al historial de repaso SRS, tarjetas dominadas y rachas diarias).*
* **¿Se recopila o se comparte?**
  * Selecciona: **Recopilado** (*Collected*)
  * *NO marcar "Compartido".*
* **¿Se procesan de forma efímera?**
  * Selecciona: **No** (se guardan para mantener el cálculo de repetición espaciada en el tiempo).
* **¿Son obligatorios?**
  * Selecciona: **Los datos son obligatorios** (*Data collection is required* para el funcionamiento del método).
* **Finalidades:**
  * Marca: **Funcionalidad de la aplicación** (*App functionality*)
  * Marca: **Personalización** (*Personalization*)

---

### Paso 4: Resumen para la Ficha Pública

Al finalizar el cuestionario, Google Play generará un resumen público que dirá exactamente lo que genera confianza en los usuarios:

* ✅ **Cifrado en tránsito:** Los datos se transfieren a través de una conexión segura.
* ✅ **Puedes solicitar que se eliminen los datos:** El desarrollador proporciona un modo de solicitar el borrado de la información.
* ✅ **No se comparten datos con terceros:** Tus datos nunca se venden ni se ceden a terceros para publicidad.
* 📋 **Datos recopilados:** Correo electrónico, IDs de usuario y actividad en la app (progreso de estudio).
