<div align="center">

# 💻 Frontend Developer – Computer Vision Attendance System  
### 🧠 Sistema de Asistencia Automatizado con Visión por Computadora

![Banner](https://github.com/CelizD/Frontend-Developer-Computer-Vision/assets/banner-demo.png)

---

</div>

## 🧾 Descripción / Description
El **Frontend** de este proyecto proporciona una interfaz web moderna e intuitiva para el **Sistema de Asistencia Automatizado con Visión por Computadora**, que permite monitorear en tiempo real la ocupación de sillas en los salones de clase.

This **Frontend** provides a modern and intuitive web interface for the **Automated Attendance System using Computer Vision**, enabling real-time classroom seat occupancy monitoring.

---

## 🎯 Objetivos / Objectives

| Español 🇪🇸 | English 🇬🇧 |
|-------------|-------------|
| 📊 Visualizar métricas de asistencia en tiempo real | 📊 Display real-time attendance metrics |
| 🪑 Mostrar ocupación de sillas mediante heatmaps | 🪑 Show seat occupancy through heatmaps |
| 📈 Generar reportes automáticos y gráficos de asistencia | 📈 Generate automatic attendance reports |
| ⚙️ Integrar con el backend mediante APIs REST | ⚙️ Integrate seamlessly with the backend REST API |

---

## 🧩 Stack Tecnológico / Tech Stack

### 🚀 **Frontend**
- ⚛️ React.js + TypeScript  
- 💅 HTML5 / CSS3 / JavaScript (ES6+)  
- 📊 Chart.js → Gráficos de asistencia  
- 🎨 Material UI / Bootstrap → Componentes y estilo  
- 🌐 Axios → Conexión con API  
- 🧭 React Router → Navegación  
- 🧰 Git + GitHub → Control de versiones  

### 🧠 **Backend (Integración)**
- Python (FastAPI o Django)
- PostgreSQL
- OpenCV + YOLO (detección de objetos)

---

## 🖼️ Vista Previa / Dashboard Preview

### 🔹 **Dashboard Principal**
Visualización de métricas en tiempo real, porcentajes de ocupación y alertas de baja asistencia.  
*(Ejemplo visual simulado)*

![Dashboard](https://raw.githubusercontent.com/CelizD/Frontend-Developer-Computer-Vision/main/preview/dashboard-sample.png)

---

### 🔹 **Heatmap de Ocupación**
Mapa de calor que indica qué sillas están ocupadas o vacías en el aula.  

| 🟢 = Ocupada | ⚪ = Vacía |
|--------------|------------|
| 🟢 🟢 ⚪ ⚪ 🟢 | 🟢 ⚪ 🟢 ⚪ 🟢 |
| ⚪ ⚪ 🟢 🟢 ⚪ | ⚪ ⚪ ⚪ 🟢 ⚪ |

*(Representación visual del análisis de visión por computadora)*

---

### 🔹 **Gráficos de Tendencia**
Reportes automáticos con **Chart.js** para visualizar asistencia histórica.

![Chart Preview](https://raw.githubusercontent.com/CelizD/Frontend-Developer-Computer-Vision/main/preview/attendance-chart.png)

---

## ⚙️ Instalación / Installation

```bash
# 1️⃣ Clonar el repositorio
git clone https://github.com/CelizD/Frontend-Developer-Computer-Vision.git
cd Frontend-Developer-Computer-Vision

# 2️⃣ Instalar dependencias
npm install

# 3️⃣ Ejecutar el servidor de desarrollo
npm start

