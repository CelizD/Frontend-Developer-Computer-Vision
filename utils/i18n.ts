import { Lang } from '../types/global.d'; // Asume que has movido los tipos a esta ubicación.

// --- Internacionalización (i18n) - Traducciones ---

const translations = {
  es: {
    // Login
    login: {
      title: "AsistenciaCV",
      subtitle: "Bienvenido al panel administrativo",
      username: "Usuario",
      password: "Contraseña",
      submit: "Ingresar",
      loggingIn: "Ingresando...",
      error: "Usuario o contraseña incorrectos.",
      demo: "Prueba con: admin/admin",
      forgot: "¿Olvidó su contraseña?",
      // Recuperación
      recoverTitle: "Recuperar Contraseña",
      recoverStep1: "Paso 1: Ingrese su usuario",
      recoverStep2: "Paso 2: Ingrese el código",
      sendCode: "Enviar Código de Recuperación",
      code: "Código de Recuperación (simulado: 12345)",
      newPassword: "Nueva Contraseña",
      confirmNewPassword: "Confirmar Nueva Contraseña",
      resetPassword: "Restablecer Contraseña",
      backToLogin: "Volver a Inicio de Sesión",
    },
    // Sidebar
    sidebar: {
      title: "AsistenciaCV",
      subtitle: "Panel administrativo",
      dashboard: "Dashboard",
      cameras: "Cámaras",
      analytics: "Analítica",
      reports: "Reportes",
      logs: "Registro",
      settings: "Ajustes",
      help: "Ayuda",
      profile: "Perfil",
      user: "Usuario",
      admin: "Administrador",
      operator: "Operador",
      viewer: "Visor",
      logout: "Cerrar sesión",
    },
    // Vistas (Títulos de header)
    views: {
      dashboard: "Resumen",
      dashboardDesc: "Visión general de asistencia y cámaras",
      cameras: "Cámaras",
      camerasDesc: "Vistas en vivo y mapas de calor",
      analytics: "Analítica Avanzada",
      analyticsDesc: "Analizar tendencias y patrones de asistencia",
      reports: "Reportes",
      reportsDesc: "Generar y descargar reportes de asistencia",
      logs: "Registro de Eventos",
      logsDesc: "Historial de alertas y eventos del sistema",
      settings: "Ajustes",
      settingsDesc: "Configuración del sistema (Solo Admin)",
      profile: "Mi Perfil",
      profileDesc: "Gestionar su información personal y contraseña",
      help: "Ayuda y Documentación",
      helpDesc: "Descripción de roles de usuario y guías rápidas",
    },
    // Ayuda
    help: {
      title: "Guía de Roles de Usuario",
      adminTitle: "Administrador",
      adminDesc: "Control total del sistema. Puede gestionar aulas, ver todos los páneles, y configurar los ajustes del sistema, incluyendo umbrales de alerta y notificaciones.",
      operatorTitle: "Operador",
      operatorDesc: "Puede monitorear el sistema, ver cámaras, analítica y generar reportes. No puede acceder a 'Ajustes' para cambiar la configuración del sistema.",
      viewerTitle: "Visor",
      viewerDesc: "Rol de solo lectura. Puede monitorear el dashboard principal y las cámaras. No puede generar reportes, ver analítica avanzada ni acceder a 'Ajustes'.",
    },
    // Perfil
    profile: {
      userInfo: "Información de Usuario",
      username: "Nombre de usuario",
      role: "Rol",
      fullName: "Nombre Completo",
      email: "Email",
      updateInfo: "Actualizar Información",
      changePass: "Cambiar Contraseña",
      currentPass: "Contraseña Actual",
      newPass: "Nueva Contraseña",
      confirmPass: "Confirmar Nueva Contraseña",
      updatePass: "Actualizar Contraseña",
      saveChanges: "Guardar Cambios",
    },
    // Dashboard
    dashboard: {
      globalAttendance: "Asistencia global",
      online: "Online",
      paused: "Pausado",
      pause: "⏸️ Pausar",
      resume: "▶️ Reanudar",
      attendanceChart: "Asistencia por aula",
      loadingChart: "Cargando gráfico...",
      trendChart: "Tendencia de Asistencia (Últimos 7 Días)",
      noCharts: "Gráficos ocultos. Puede activarlos en 'Ajustes'.",
      camera: "Cámara",
      roomList: "Lista de aulas",
      occupied: "ocupadas",
    },
    // Cámaras
    cameras: {
      videos: "Videos",
      heatmaps: "Heatmaps",
      seats: "Asientos",
      noSignal: "SIN SEÑAL",
      lowLight: "LUZ BAJA",
      status: {
        online: "Online",
        offline: "Offline",
        lowLight: "Luz Baja",
      },
    },
    // Analítica
    analytics: {
      filter: "Filtrar Datos",
      startDate: "Fecha de Inicio",
      endDate: "Fecha de Fin",
      filterRoom: "Filtrar por Aula",
      allRooms: "Todas las Aulas",
      peakHours: "Horas Pico de Asistencia (Promedio)",
      weeklyAvg: "Asistencia Promedio Semanal",
    },
    // Reportes
    reports: {
      generate: "Generar Reporte de Asistencia",
      button: "Generar y Descargar CSV (Vista Actual)",
      csvHeaders: "Aula,Ocupados,Total,Porcentaje,Estado",
    },
    // Registro
    logs: {
      noEvents: "No hay eventos registrados.",
      search: "Buscar en registros...",
      allLevels: "Todos los niveles",
      level: "Nivel",
      info: "Info",
      warn: "Aviso",
      alert: "Alerta",
    },
    // Ajustes
    settings: {
      general: "Configuración General",
      threshold: "Umbral de Alerta de Ocupación (%)",
      defaultSeats: "Asientos por Defecto (Nuevas Aulas)",
      theme: "Tema",
      themeDark: "Oscuro",
      themeLight: "Claro",
      language: "Idioma",
      notifications: "Notificaciones",
      notifEmail: "Email para Alertas",
      notifToggle: "Habilitar notificaciones por email",
      customize: "Personalizar Dashboard",
      showAttendance: "Mostrar Asistencia por Aula",
      showTrend: "Mostrar Gráfico de Tendencia",
      manage: "Gestionar Aulas",
      addPlaceholder: "Nombre de la nueva aula",
      currentRooms: "Aulas Actuales",
      seatsSuffix: "asientos",
      confirmDelete: "¿Estás seguro de que quieres eliminar {room}?",
      manageUsers: "Gestionar Usuarios",
      userList: "Lista de Usuarios",
      addUser: "Añadir Usuario",
      username: "Usuario",
      password: "Contraseña",
      role: "Rol",
      selectRole: "Seleccionar rol...",
    },
    // Modal Editar
    editModal: {
      title: "Editar Aula",
      roomName: "Nombre del Aula",
      totalSeats: "Total de Asientos",
      cancel: "Cancelar",
      save: "Guardar",
    },
    // Modal Editar Usuario
    editUserModal: {
      title: "Editar Usuario",
      username: "Nombre de Usuario",
      role: "Rol",
    },
    // Tour
    tour: {
      skip: "Saltar tour",
      prev: "Anterior",
      next: "Siguiente",
      finish: "Finalizar",
      step1: {
        title: "¡Bienvenido a AsistenciaCV!",
        text: "Este es un rápido tour para mostrarte las funciones clave. Puedes saltarlo en cualquier momento.",
      },
      step2: {
        title: "Navegación Principal",
        text: "A la izquierda está el menú de navegación. Te permite cambiar entre el 'Dashboard', 'Cámaras', 'Reportes' y 'Ajustes'.",
      },
      step3: {
        title: "Datos en Vivo",
        text: "El dashboard recibe datos en tiempo real. Puedes usar el botón 'Pausar' ⏸️ en la esquina superior derecha para congelar los datos y analizarlos.",
      },
      step4: {
        title: "Alertas y Registro",
        text: "Recibirás alertas visuales y sonoras. Puedes revisar todas las alertas pasadas en la pestaña 'Registro'.",
      },
      step5: {
        title: "Configuración (Admin)",
        text: "En 'Ajustes', puedes añadir o eliminar aulas, cambiar el tema y configurar los umbrales de alerta. ¡Todo listo!",
      },
    },
    // Alertas y Eventos
    alert: {
      cameraOffline: "Cámara en {room} está 'Offline'.",
      lowLight: "Cámara en {room} reporta 'Luz Baja'.",
      cameraOnline: "Cámara en {room} está 'Online'.",
      highOccupancy: "{room} alcanzó {percentage}% de ocupación.",
      roomAdded: "Aula '{room}' añadida.",
      roomDeleted: "Aula '{room}' eliminada.",
      systemAlert: "Alerta del Sistema",
      systemWarning: "Aviso del Sistema",
      systemInfo: "Información del Sistema",
      recoveryNotImplemented: "Función de recuperación no implementada. Contacte al administrador.",
      userAdded: "Usuario '{username}' añadido.",
      userDeleted: "Usuario '{username}' eliminado.",
      userUpdated: "Usuario '{username}' actualizado.",
      userExists: "El usuario '{username}' ya existe.",
      cannotDeleteSelf: "No puedes eliminar tu propia cuenta de usuario.",
      // Alertas de Recuperación
      userNotFound: "Usuario no encontrado.",
      invalidCode: "Código de recuperación incorrecto.",
      passwordMismatch: "Las contraseñas no coinciden.",
      passwordSuccess: "¡Contraseña restablecida! Ya puede iniciar sesión.",
    },
    // Gráficos
    charts: {
      attendanceLabel: "% Asistencia",
      trendLabel: "Tendencia de Asistencia Global",
      peakHoursLabel: "% Ocupación Promedio",
      weeklyLabel: "Asistencia Promedio (%)",
      days: {
        ago6: "Hace 6 días",
        ago5: "Hace 5 días",
        ago4: "Hace 4 días",
        ago3: "Hace 3 días",
        ago2: "Ayer",
        today: "Hoy",
        mon: "Lunes",
        tue: "Martes",
        wed: "Miércoles",
        thu: "Jueves",
        fri: "Viernes",
        sat: "Sábado",
      },
      hours: {
        h8: "8am",
        h10: "10am",
        h12: "12pm",
        h14: "2pm",
        h16: "4pm",
        h18: "6pm",
      },
    },
  },
  en: {
    login: {
      title: "AsistenciaCV",
      subtitle: "Welcome to the admin panel",
      username: "Username",
      password: "Password",
      submit: "Login",
      loggingIn: "Logging in...",
      error: "Incorrect username or password.",
      demo: "Try: admin/admin",
      forgot: "Forgot password?",
      // Recuperación
      recoverTitle: "Recover Password",
      recoverStep1: "Step 1: Enter your username",
      recoverStep2: "Step 2: Enter your code",
      sendCode: "Send Recovery Code",
      code: "Recovery Code (simulated: 12345)",
      newPassword: "New Password",
      confirmNewPassword: "Confirm New Password",
      resetPassword: "Reset Password",
      backToLogin: "Back to Login",
    },
    sidebar: {
      title: "AsistenciaCV",
      subtitle: "Admin Panel",
      dashboard: "Dashboard",
      cameras: "Cameras",
      analytics: "Analytics",
      reports: "Reports",
      logs: "Logs",
      settings: "Settings",
      help: "Help",
      profile: "Profile",
      user: "User",
      admin: "Administrator",
      operator: "Operator",
      viewer: "Viewer",
      logout: "Log out",
    },
    views: {
      dashboard: "Summary",
      dashboardDesc: "Overview of attendance and cameras",
      cameras: "Cameras",
      camerasDesc: "Live views and heatmaps",
      analytics: "Advanced Analytics",
      analyticsDesc: "Analyze attendance trends and patterns",
      reports: "Reports",
      reportsDesc: "Generate and download attendance reports",
      logs: "Event Log",
      logsDesc: "History of system alerts and events",
      settings: "Settings",
      settingsDesc: "System configuration (Admin only)",
      profile: "My Profile",
      profileDesc: "Manage your personal information and password",
      help: "Help & Documentation",
      helpDesc: "User role descriptions and quick guides",
    },
    help: {
      title: "User Roles Guide",
      adminTitle: "Administrator",
      adminDesc: "Full control of the system. Can manage classrooms, view all panels, and configure system settings, including alert thresholds and notifications.",
      operatorTitle: "Operator",
      operatorDesc: "Can monitor the system, view cameras, analytics, and generate reports. Cannot access 'Settings' to change system configuration.",
      viewerTitle: "Viewer",
      viewerDesc: "Read-only role. Can monitor the main dashboard and cameras. Cannot export reports, view advanced analytics, or access 'Settings'.",
    },
    profile: {
      userInfo: "User Information",
      username: "Username",
      role: "Role",
      fullName: "Full Name",
      email: "Email",
      updateInfo: "Update Information",
      changePass: "Change Password",
      currentPass: "Current Password",
      newPass: "New Password",
      confirmPass: "Confirm New Password",
      updatePass: "Update Password",
      saveChanges: "Save Changes",
    },
    dashboard: {
      globalAttendance: "Global Attendance",
      online: "Online",
      paused: "Paused",
      pause: "⏸️ Pause",
      resume: "▶️ Resume",
      attendanceChart: "Attendance by Classroom",
      loadingChart: "Loading chart...",
      trendChart: "Attendance Trend (Last 7 Days)",
      noCharts: "Charts are hidden. You can enable them in 'Settings'.",
      camera: "Camera",
      roomList: "Classroom List",
      occupied: "occupied",
    },
    cameras: {
      videos: "Videos",
      heatmaps: "Heatmaps",
      seats: "Seats",
      noSignal: "NO SIGNAL",
      lowLight: "LOW LIGHT",
      status: {
        online: "Online",
        offline: "Offline",
        lowLight: "Low Light",
      },
    },
    analytics: {
      filter: "Filter Data",
      startDate: "Start Date",
      endDate: "End Date",
      filterRoom: "Filter by Classroom",
      allRooms: "All Classrooms",
      peakHours: "Peak Attendance Hours (Average)",
      weeklyAvg: "Weekly Average Attendance",
    },
    reports: {
      generate: "Generate Attendance Report",
      button: "Generate and Download CSV (Current View)",
      csvHeaders: "Classroom,Occupied,Total,Percentage,Status",
    },
    logs: {
      noEvents: "No events registered.",
      search: "Search logs...",
      allLevels: "All levels",
      level: "Level",
      info: "Info",
      warn: "Warning",
      alert: "Alert",
    },
    settings: {
      general: "General Configuration",
      threshold: "Occupancy Alert Threshold (%)",
      defaultSeats: "Default Seats (New Classrooms)",
      theme: "Theme",
      themeDark: "Dark",
      themeLight: "Light",
      language: "Language",
      notifications: "Notifications",
      notifEmail: "Email for Alerts",
      notifToggle: "Enable email notifications",
      customize: "Customize Dashboard",
      showAttendance: "Show Attendance by Classroom",
      showTrend: "Show Trend Chart",
      manage: "Manage Classrooms",
      addPlaceholder: "Name of the new classroom",
      currentRooms: "Current Classrooms",
      seatsSuffix: "seats",
      confirmDelete: "Are you sure you want to delete {room}?",
      manageUsers: "Manage Users",
      userList: "User List",
      addUser: "Add User",
      username: "Username",
      password: "Password",
      role: "Role",
      selectRole: "Select role...",
    },
    editModal: {
      title: "Edit Classroom",
      roomName: "Classroom Name",
      totalSeats: "Total Seats",
      cancel: "Cancel",
      save: "Save",
    },
    editUserModal: {
      title: "Edit User",
      username: "Username",
      role: "Role",
    },
    tour: {
      skip: "Skip tour",
      prev: "Previous",
      next: "Next",
      finish: "Finish",
      step1: {
        title: "Welcome to AsistenciaCV!",
        text: "This is a quick tour to show you the key features. You can skip it at any time.",
      },
      step2: {
        title: "Main Navigation",
        text: "On the left is the navigation menu. It lets you switch between 'Dashboard', 'Cameras', 'Reports', and 'Settings'.",
      },
      step3: {
        title: "Live Data",
        text: "The dashboard receives data in real-time. You can use the 'Pause' ⏸️ button in the top right to freeze the data for analysis.",
      },
      step4: {
        title: "Alerts and Logs",
        text: "You will receive visual and audio alerts. You can review all past alerts in the 'Logs' tab.",
      },
      step5: {
        title: "Configuration (Admin)",
        text: "In 'Settings', you can add or remove classrooms, change the theme, and set alert thresholds. All set!",
      },
    },
    alert: {
      cameraOffline: "Camera in {room} is 'Offline'.",
      lowLight: "Camera in {room} reports 'Low Light'.",
      cameraOnline: "Camera in {room} is 'Online'.",
      highOccupancy: "{room} reached {percentage}% occupancy.",
      roomAdded: "Classroom '{room}' added.",
      roomDeleted: "Classroom '{room}' deleted.",
      systemAlert: "System Alert",
      systemWarning: "System Warning",
      systemInfo: "System Information",
      recoveryNotImplemented: "Recovery function not implemented. Please contact administrator.",
      userAdded: "User '{username}' added.",
      userDeleted: "User '{username}' deleted.",
      userUpdated: "User '{username}' updated.",
      userExists: "User '{username}' already exists.",
      cannotDeleteSelf: "You cannot delete your own user account.",
      // Alertas de Recuperación
      userNotFound: "User not found.",
      invalidCode: "Incorrect recovery code.",
      passwordMismatch: "Passwords do not match.",
      passwordSuccess: "Password reset! You can now log in.",
    },
    charts: {
      attendanceLabel: "% Attendance",
      trendLabel: "Global Attendance Trend",
      peakHoursLabel: "Avg Occupancy %",
      weeklyLabel: "Average Attendance (%)",
      days: {
        ago6: "6 days ago",
        ago5: "5 days ago",
        ago4: "4 days ago",
        ago3: "3 days ago",
        ago2: "Yesterday",
        today: "Today",
        mon: "Monday",
        tue: "Tuesday",
        wed: "Wednesday",
        thu: "Thursday",
        fri: "Friday",
        sat: "Saturday",
      },
      hours: {
        h8: "8am",
        h10: "10am",
        h12: "12pm",
        h14: "2pm",
        h16: "4pm",
        h18: "6pm",
      },
    },
  },
};

// --- Funciones de Internacionalización ---

/**
 * Reemplaza los placeholders en una cadena con los argumentos proporcionados.
 * Ejemplo: interpolate("Hola {name}", { name: "Mundo" }) => "Hola Mundo"
 */
export const interpolate = (str: string, args?: Record<string, string>) => {
  if (!args) return str;
  return str.replace(/{(\w+)}/g, (_, key) => args[key] || key);
};

/**
 * Función principal que devuelve la función de traducción (t).
 * Utiliza un fallback al inglés si la clave no se encuentra en el idioma seleccionado.
 */
export const getT = (lang: Lang) => {
  return (key: string, args?: Record<string, string>) => {
    const keys = key.split('.');
    let val = translations[lang] as any;
    try {
      for (const k of keys) {
        val = val[k];
      }
      if (typeof val !== 'string') throw new Error();
      return interpolate(val, args);
    } catch (e) {
      // Fallback to English
      try {
        val = translations['en'] as any;
        for (const k of keys) {
          val = val[k];
        }
        if (typeof val !== 'string') return key; // Return key if not found in EN either
        return interpolate(val, args);
      } catch (e2) {
        return key;
      }
    }
  };
};

// --- Exporta todo lo relacionado con i18n ---
export const i18n = {
  translations,
  getT,
  interpolate,
};

