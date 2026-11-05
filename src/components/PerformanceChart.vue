<template>
  <div class="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm">
    <div class="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3 mb-4">
      <div>
        <h3 class="font-bold text-zinc-900 dark:text-white text-xs uppercase tracking-wider">Curva de Rendimiento</h3>
        <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
          {{ prueba ? prueba.nombre : 'Seleccioná una prueba' }}
        </p>
      </div>

      <div class="flex items-center gap-3">
        <span class="text-xs font-mono text-zinc-500">
          {{ marcas.length }} registros
        </span>

        <!-- Botón Exportar PDF -->
        <button
          v-if="marcas.length > 0 && atleta"
          @click="manejarExportarPDF"
          class="flex items-center gap-1.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-medium px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 transition-colors"
          title="Descargar informe completo en PDF"
        >
          <span>Descargar PDF</span>
        </button>
      </div>
    </div>

    <div class="relative h-64 w-full flex items-center justify-center">
      <canvas v-show="marcas.length > 0" ref="chartCanvas"></canvas>
      <div v-if="marcas.length === 0" class="text-xs text-zinc-400">
        Sin marcas registradas para graficar.
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, onBeforeUnmount, nextTick } from "vue";
import Chart from "chart.js/auto";
import { exportarReporteAtletaPDF } from "../utils/pdfExport";
import { useNotification } from "../composables/useNotification";

const props = defineProps({
  marcas: {
    type: Array,
    default: () => []
  },
  prueba: {
    type: Object,
    default: null
  },
  atleta: {
    type: Object,
    default: null
  }
});

const chartCanvas = ref(null);
let chartInstance = null;
let observerTema = null;
const { notificar } = useNotification();

async function renderizarGrafico() {
  await nextTick();
  if (!chartCanvas.value) return;

  if (chartInstance) {
    chartInstance.destroy();
    chartInstance = null;
  }

  if (!props.marcas || props.marcas.length === 0) return;

  const ctx = chartCanvas.value.getContext("2d");
  const isDark = document.documentElement.classList.contains("dark");

  const labels = props.marcas.map((m) => m.fecha);
  const data = props.marcas.map((m) => Number(m.marca_valor));

  const metrica = (props.prueba?.tipo_metrica || props.marcas[0]?.tipo_metrica || "").toLowerCase();
  const esMetricaInversa = metrica === "tiempo" || metrica === "puesto" || String(props.marcas[0]?.marca_texto || "").includes(":");

  const colorTrazo = isDark ? "#ffffff" : "#18181b";
  const colorFondoCurva = isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(24, 24, 27, 0.05)";
  const colorBordePunto = isDark ? "#09090b" : "#ffffff";
  const colorGrillas = isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)";
  const colorLetras = isDark ? "#a1a1aa" : "#52525b";

  chartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: props.prueba?.nombre || "Marca",
          data,
          borderColor: colorTrazo,
          borderWidth: 2,
          backgroundColor: colorFondoCurva,
          fill: true,
          tension: 0.15,
          pointBackgroundColor: colorTrazo,
          pointBorderColor: colorBordePunto,
          pointBorderWidth: 1.5,
          pointRadius: 4,
          pointHoverRadius: 6
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: isDark ? "#09090b" : "#ffffff",
          titleColor: isDark ? "#f4f4f5" : "#09090b",
          bodyColor: isDark ? "#f4f4f5" : "#09090b",
          borderColor: isDark ? "#27272a" : "#e4e4e7",
          borderWidth: 1,
          padding: 8,
          cornerRadius: 6,
          titleFont: { size: 11, weight: "bold" },
          bodyFont: { family: "monospace", size: 11 },
          callbacks: {
            label: function (context) {
              const r = props.marcas[context.dataIndex];
              return ` ${r.marca_texto || r.marca_valor}`;
            }
          }
        }
      },
      scales: {
        x: {
          grid: { color: colorGrillas },
          ticks: { color: colorLetras, font: { family: "monospace", size: 10 } }
        },
        y: {
          reverse: esMetricaInversa,
          grid: { color: colorGrillas },
          ticks: { color: colorLetras, font: { family: "monospace", size: 10 } }
        }
      }
    }
  });
}

async function manejarExportarPDF() {
  try {
    const resultado = await exportarReporteAtletaPDF({
      atleta: props.atleta,
      prueba: props.prueba,
      marcas: props.marcas
    });

    if (resultado.ok) {
      notificar(`Informe generado: ${resultado.nombreArchivo}`, "success");
    } else {
      notificar(resultado.msg || "Error al exportar PDF.", "error");
    }
  } catch (error) {
    console.error("Error exportando PDF:", error);
    notificar("Ocurrió un error inesperado al generar el PDF.", "error");
  }
}

watch(() => [props.marcas, props.prueba], () => renderizarGrafico(), { deep: true });

onMounted(() => {
  renderizarGrafico();

  observerTema = new MutationObserver(async () => {
    await renderizarGrafico();
  });

  observerTema.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"]
  });
});

onBeforeUnmount(() => {
  if (chartInstance) chartInstance.destroy();
  if (observerTema) observerTema.disconnect();
});
</script>