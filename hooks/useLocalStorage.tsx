import React, { useState } from "react";

/**
 * Hook personalizado para persistir el estado en el localStorage del navegador.
 *
 * @template T Tipo del valor a almacenar.
 * @param key La clave bajo la cual se almacenará el valor en localStorage.
 * @param initialValue El valor inicial a usar si no hay nada en localStorage.
 * @returns [storedValue, setValue] Tupla con el valor actual y la función para actualizarlo.
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, React.Dispatch<React.SetStateAction<T>>] {

  // Estado interno inicializado desde localStorage si existe, o con initialValue
  const [storedValue, setStoredValue] = useState<T>(() => {
    // Evita errores en entornos donde no existe window (SSR)
    if (typeof window === "undefined") {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error leyendo localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Función para actualizar el estado y sincronizarlo con localStorage
  const setValue: React.Dispatch<React.SetStateAction<T>> = (value) => {
    try {
      // Soporta funciones de actualización al estilo de useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);

      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error guardando en localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}
