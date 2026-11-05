<template>
  <section v-if="atleta" class="space-y-6">
    <!-- Barra Superior -->
    <div class="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4">
      <button 
        @click="$emit('volver')"
        class="text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 px-3 py-1.5 rounded-lg border border-zinc-300 dark:border-zinc-800 transition-colors"
      >
        ← Volver al Padrón
      </button>
      
      <button 
        @click="$emit('cargar-marca-directa', { atleta, prueba: pruebaActiva })"
        class="bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-950 font-medium text-xs px-4 py-2 rounded-lg transition-colors"
      >
        + Cargar Marca
      </button>
    </div>

    <!-- Ficha Técnica -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 space-y-3">
        <div>
          <span class="text-[11px] font-mono text-zinc-500 uppercase">{{ atleta.deporte_nombre }}</span>
          <h2 class="text-xl font-bold text-zinc-900 dark:text-white mt-0.5">{{ atleta.nombre }} {{ atleta.apellido }}</h2>
        </div>
        <div class="text-xs text-zinc-600 dark:text-zinc-400 space-y-1">
          <p>DNI: <span class="font-mono text-zinc-900 dark:text-zinc-200">{{ atleta.dni }}</span></p>
          <p>Edad: <span class="font-mono text-zinc-900 dark:text-zinc-200">{{ calcularEdad(atleta.fecha_nacimiento) ? `${calcularEdad(atleta.fecha_nacimiento)} años` : 'Sin fecha registrada' }}</span></p>
          <p>Compromiso: <span class="text-zinc-900 dark:text-zinc-200 font-semibold">{{ atleta.nivel_compromiso || 'Excelente' }}</span></p>
        </div>
      </div>

      <div class="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 space-y-2">
        <h3 class="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Esquema y Horarios</h3>
        <p class="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed font-sans">
          {{ atleta.rutina_entrenamiento || 'No se registraron horarios de entrenamiento.' }}
        </p>
      </div>

      <div class="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 space-y-2">
        <h3 class="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Foco y Actitud</h3>
        <p class="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed italic">
          {{ atleta.observaciones_actitud ? `"${atleta.observaciones_actitud}"` : 'Sin observaciones registradas.' }}
        </p>
      </div>
    </div>

    <!-- Selector de Pruebas Sobrio -->
    <div class="space-y-3">
      <div class="flex items-center justify-between gap-4">
        <input 
          v-model="busquedaPrueba"
          type="text" 
          placeholder="Filtrar subdisciplinas..." 
          class="w-72 bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-900 dark:text-zinc-200 placeholder-zinc-400 focus:outline-none focus:border-zinc-500 font-sans"
        />
        <span class="text-xs text-zinc-500 font-mono">
          {{ pruebasFiltradas.length }} prueba(s)
        </span>
      </div>

      <div class="flex gap-2 overflow-x-auto pb-1">
        <button 
          v-for="pru in pruebasFiltradas" 
          :key="pru.id"
          @click="pruebaActiva = pru"
          :class="[
            'px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors border',
            pruebaActiva?.id === pru.id
              ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border-zinc-900 dark:border-white'
              : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-300 dark:border-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-800'
          ]"
        >
          {{ pru.nombre }}
        </button>
      </div>
    </div>

    <!-- KPIs Numéricos Limpios -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4">
        <span class="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Mejor Marca</span>
        <p class="text-2xl font-bold text-zinc-900 dark:text-white mt-1 font-mono">
          {{ mejorMarca?.marca_texto || '—' }}
        </p>
        <span v-if="mejorMarca" class="text-[11px] text-zinc-500 font-mono mt-0.5 block">
          {{ mejorMarca.fecha }} {{ mejorMarca.competencia ? `· ${mejorMarca.competencia}` : '' }}
        </span>
      </div>

      <div class="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4">
        <span class="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Última Marca</span>
        <p class="text-2xl font-bold text-zinc-900 dark:text-white mt-1 font-mono">
          {{ ultimaMarca?.marca_texto || '—' }}
        </p>
        <span v-if="ultimaMarca" class="text-[11px] text-zinc-500 font-mono mt-0.5 block">
          Fecha: {{ ultimaMarca.fecha }}
        </span>
      </div>

      <div class="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4">
        <span class="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Total Mediciones</span>
        <p class="text-2xl font-bold text-zinc-900 dark:text-white mt-1 font-mono">
          {{ marcasPruebaActiva.length }}
        </p>
      </div>
    </div>

    <!-- Gráfico -->
    <PerformanceChart 
      :marcas="marcasPruebaActiva" 
      :prueba="pruebaActiva" 
      :atleta="atleta"
    />
  </section>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import PerformanceChart from "../components/PerformanceChart.vue";
import { useSportsData } from "../composables/useSportsData";
import { useAthletesData } from "../composables/useAthletesData";

const props = defineProps({
  atleta: {
    type: Object,
    required: true
  }
});

defineEmits(["volver", "cargar-marca-directa"]);

const { todasLasPruebas, normalizarTexto } = useSportsData();
const { resultados, calcularEdad } = useAthletesData();

const busquedaPrueba = ref("");
const pruebaActiva = ref(null);

const pruebasDelAtleta = computed(() => {
  if (!props.atleta || !props.atleta.deporte_id) return [];
  return todasLasPruebas.value.filter((p) => p.deporte_id === props.atleta.deporte_id);
});

const pruebasFiltradas = computed(() => {
  if (!busquedaPrueba.value.trim()) return pruebasDelAtleta.value;
  const q = normalizarTexto(busquedaPrueba.value);
  return pruebasDelAtleta.value.filter((p) => normalizarTexto(p.nombre).includes(q));
});

const marcasPruebaActiva = computed(() => {
  if (!props.atleta || !pruebaActiva.value) return [];
  return resultados.value
    .filter(
      (r) => r.atleta_id === props.atleta.id && r.prueba_id === pruebaActiva.value.id
    )
    .sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
});

const mejorMarca = computed(() => {
  if (marcasPruebaActiva.value.length === 0) return null;
  const tipo = pruebaActiva.value.tipo_metrica;
  if (tipo === "distancia" || tipo === "peso") {
    return marcasPruebaActiva.value.reduce(
      (max, r) => (r.marca_valor > max.marca_valor ? r : max),
      marcasPruebaActiva.value[0]
    );
  }
  return marcasPruebaActiva.value.reduce(
    (min, r) => (r.marca_valor < min.marca_valor ? r : min),
    marcasPruebaActiva.value[0]
  );
});

const ultimaMarca = computed(() => {
  if (marcasPruebaActiva.value.length === 0) return null;
  return marcasPruebaActiva.value[marcasPruebaActiva.value.length - 1];
});

watch(
  pruebasDelAtleta,
  (nuevasPruebas) => {
    if (!pruebaActiva.value || !nuevasPruebas.some((p) => p.id === pruebaActiva.value.id)) {
      pruebaActiva.value = nuevasPruebas[0] || null;
    }
  },
  { immediate: true }
);
</script>