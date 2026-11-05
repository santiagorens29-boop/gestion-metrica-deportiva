import { ref } from "vue";

const notificaciones = ref([]);

export function useNotification() {
  function notificar(mensaje, tipo = "info") {
    const id = Date.now() + Math.random();

    notificaciones.value.push({
      id,
      mensaje,
      tipo // 'success' | 'error' | 'info'
    });

    // Se remueve automáticamente a los 3 segundos
    setTimeout(() => {
      notificaciones.value = notificaciones.value.filter((n) => n.id !== id);
    }, 3000);
  }

  return {
    notificaciones,
    notificar
  };
}