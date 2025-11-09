<div align="center">

# 💻 Frontend Developer – Computer Vision Attendance System  
### 🧠 Sistema de Asistencia Automatizado con Visión por Computadora  


---

### 🏷️ Tecnologías Principales / Main Technologies  

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
**![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)**
![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)
![MIT License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

</div>

---

<div align="center" style="background-color:#0d1117; color:#c9d1d9; padding:20px; border-radius:12px;">

## 🧾 Descripción / Description  

El **Frontend** de este proyecto ofrece una interfaz **moderna**, **responsiva** e **intuitiva** para el  
**Sistema de Asistencia Automatizado con Visión por Computadora**, que permite monitorear en tiempo real  
la **ocupación de sillas** en salones de clase mediante análisis de video con **IA** y **Computer Vision**.  

This **Frontend** provides a clean, responsive, and intuitive web interface for the  
**Automated Attendance System using Computer Vision**, enabling real-time seat occupancy monitoring  
powered by **AI** and **video analytics**.  

</div>

---

## 🎯 Objetivos / Objectives  

| 🇪🇸 Español | 🇬🇧 English |
|:-----------:|:-----------:|
| 📊 Visualizar métricas de asistencia en tiempo real | 📊 Display real-time attendance metrics |
| 🪑 Mostrar ocupación de sillas mediante heatmaps dinámicos | 🪑 Show seat occupancy through dynamic heatmaps |
| 📈 Generar reportes automáticos con gráficos estadísticos | 📈 Generate automated statistical reports |
| ⚙️ Integrar con el backend mediante APIs REST seguras | ⚙️ Integrate seamlessly with secure REST APIs |

---

## 🧩 Stack Tecnológico / Tech Stack  

| 💻 **Frontend** | 🧠 **Backend (Integración)** |
|-----------------|-----------------------------|
| ⚛️ **React.js + TypeScript** | 🐍 **Python (FastAPI / Django)** |
| 💅 **Tailwind CSS** – Utilidades para diseño adaptable | 🧮 **PostgreSQL** |
| 📊 **Chart.js** (vía `react-chartjs-2`) – Gráficos de asistencia | 🎯 **OpenCV + YOLO** – Detección de ocupación |
| 💻 **Servicios/Contexto Simulados** – Manejo de datos CRUD y API Mock | 🔗 **REST API** para integración |
| 🔄 **React Context & Hooks** – Gestión de estado y simulación de datos | 🧠 **Modelo de Visión Artificial** entrenado |
| 🧭 **React Router** – Navegación SPA | |

</div>

---

## 🖥️ Vista Previa / Dashboard Preview  

### 🔹 **Dashboard Principal**  
Visualización en tiempo real de **porcentaje de ocupación**, **métricas de asistencia** y **alertas visuales**.  


---

### 🔹 **Heatmap de Ocupación**  
Representación tipo **mapa de calor** de sillas ocupadas o vacías.  

| 🟢 = Ocupada | ⚪ = Vacía |
|--------------|------------|
| 🟢 🟢 ⚪ ⚪ 🟢 | 🟢 ⚪ 🟢 ⚪ 🟢 |
| ⚪ ⚪ 🟢 🟢 ⚪ | ⚪ ⚪ ⚪ 🟢 ⚪ |

*(Simulación generada con módulo de Computer Vision – OpenCV/YOLO)*  

---

### 🔹 **Gráficos de Tendencia**  
Visualización histórica del registro de asistencia mediante **Chart.js**,  
para detectar patrones o fluctuaciones.  

---

## ⚙️ Instalación / Installation  


# 1️⃣ Clonar el repositorio
git clone https://github.com/CelizD/Frontend-Developer-Computer-Vision.git
cd Frontend-Developer-Computer-Vision

# 2️⃣ Instalar dependencias
npm install

# 3️⃣ Ejecutar el servidor de desarrollo
npm start

## 📂 Estructura del Proyecto / Project Structure

```text
📦 Frontend-Developer-Computer-Vision
├── 📄 .gitignore
├── 📄 package.json
├── 📄 package-lock.json
├── 📄 tsconfig.json
├── 📁 src
│   ├── 📄 App.tsx          # Componente principal que orquesta el Context y el Layout
│   ├── 📁 components       # Componentes reutilizables
│   │   ├── 📄 PageHeader.tsx   # Encabezado genérico de las vistas
│   │   ├── 📄 Toast.tsx        # Componente para notificaciones flotantes
│   │   ├── 📁 charts       # Gráficos específicos (AttendanceChart, TrendChart)
│   │   ├── 📁 dashboard    # Componentes específicos del Dashboard (MetricCards, RoomSelector)
│   │   ├── 📁 layout       # Componentes de la estructura principal (Sidebar, MobileHeader)
│   │   ├── 📁 modals       # Modales de edición y Tour (EditUserModal, TourModal)
│   │   ├── 📁 settings     # Componentes para la vista de Ajustes (ManageUsers, ManageRooms)
│   │   └── 📁 ui           # Componentes de UI genéricos (Toggles, Skeletons, Iconos)
│   ├── 📁 context          # Gestión de estado global
│   │   └── 📄 AppContext.tsx   # Contiene toda la lógica de estado y Handlers
│   ├── 📁 hooks            # Lógica reutilizable de React (Custom Hooks)
│   │   ├── 📄 useLocalStorage.tsx
│   │   └── 📄 useAnalyticsChartData.ts # Hook para datos de gráficos de Analítica
│   ├── 📁 services         # Simulación de la capa de Backend (Mock API)
│   │   ├── 📄 authService.ts     # Lógica simulada de login/logout
│   │   └── 📄 webSocketService.ts# Simulación de datos en vivo (Live Metrics/Events)
│   ├── 📁 types            # Definiciones de TypeScript
│   │   ├── 📄 global.d.ts      # Definición de AppContextType y modelos de datos
│   │   └── 📄 defaults.ts      # Valores por defecto para el estado inicial (ej. DEFAULT_USERS)
│   ├── 📁 utils            # Funciones auxiliares
│   │   ├── 📄 i18n.ts            # Lógica de traducción
│   │   └── 📄 sound.ts           # Control de sonido de alertas
│   └── 📁 views            # Vistas principales/Páginas
│       ├── 📁 auth         # Vistas de Autenticación
│       │   ├── 📄 LoginScreen.tsx
│       │   └── 📄 RecoveryScreen.tsx
│       ├── 📄 Analytics.tsx    # Vista de métricas históricas y alertas
│       ├── 📄 CamarasView.tsx  # Vista de cámaras y feeds
│       ├── 📄 DashboardView.tsx# Dashboard principal
│       ├── 📄 Help.tsx
│       ├── 📄 Logs.tsx
│       ├── 📄 NotFound.tsx
│       ├── 📄 Profile.tsx
│       ├── 📄 RegistroView.tsx
│       ├── 📄 Reportes.tsx     # Vista de generación de reportes CSV
│       └── 📄 Settings.tsx     # Vista de configuración principal
└── ...
```
## 🧑‍💻 Contribución / Contributing
🍴 Forkea este repositorio 
🌱 Crea una rama: git checkout -b feature/nueva-funcion 
💬 Realiza tus cambios y haz commit: git commit -m "Añadir nueva función" 
🚀 Envía tus cambios: git push origin feature/nueva-funcion 
🔁 Abre un Pull Request

## 🧠 Autores / Authors
| 👤 Nombre | 💼 Rol | 🔗 GitHub |
|:---:|:---:|:---:|
| **Celiz D.** | **Frontend Developer** | [@CelizD](https://github.com/CelizD) |

## 🌌 Licencia / License
Distribuido bajo la licencia MIT. Libre para uso académico y profesional.

<div align="center" style="background-color:#0d1117; color:#c9d1d9; padding:25px; border-radius:16px;"> ✨ "La visión artificial no reemplaza al humano, lo potencia."

– Equipo Computer Vision Attendance System 💡

</div>
