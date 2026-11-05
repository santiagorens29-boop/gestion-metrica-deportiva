import { ref, onMounted } from "vue";

const temaActual = ref("dark");

export function useTheme() {
  function aplicarTema(nuevoTema) {
    temaActual.value = nuevoTema;
    localStorage.setItem("gd_app_theme", nuevoTema);

    if (nuevoTema === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }

  function alternarTema() {
    aplicarTema(temaActual.value === "dark" ? "light" : "dark");
  }

  onMounted(() => {
    const guardado = localStorage.getItem("gd_app_theme") || "dark";
    aplicarTema(guardado);
  });

  return {
    temaActual,
    alternarTema,
    aplicarTema
  };
}