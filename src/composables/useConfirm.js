import { ref } from "vue";

const estadoModal = ref({
  visible: false,
  titulo: "Confirmar acción",
  mensaje: "",
  resolverPromesa: null
});

export function useConfirm() {
  function confirmar({ titulo = "Confirmar acción", mensaje }) {
    return new Promise((resolve) => {
      estadoModal.value = {
        visible: true,
        titulo,
        mensaje,
        resolverPromesa: resolve
      };
    });
  }

  function responder(resultado) {
    if (estadoModal.value.resolverPromesa) {
      estadoModal.value.resolverPromesa(resultado);
    }
    estadoModal.value.visible = false;
    estadoModal.value.resolverPromesa = null;
  }

  return {
    estadoModal,
    confirmar,
    responder
  };
}