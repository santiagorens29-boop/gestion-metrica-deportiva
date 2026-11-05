<template>
  <section class="space-y-6">
    <header>
      <h2 class="text-xl font-bold text-zinc-900 dark:text-white tracking-tight">Panel de Control</h2>
      <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Resumen general y últimas marcas registradas.</p>
    </header>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5">
        <span class="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Atletas Registrados</span>
        <p class="text-3xl font-bold text-zinc-900 dark:text-white mt-2 font-mono">{{ atletas.length }}</p>
      </div>

      <div class="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5">
        <span class="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Disciplinas Activas</span>
        <p class="text-3xl font-bold text-zinc-900 dark:text-white mt-2 font-mono">{{ deportes.length }}</p>
      </div>

      <div class="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5">
        <span class="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Marcas Cargadas</span>
        <p class="text-3xl font-bold text-zinc-900 dark:text-white mt-2 font-mono">{{ resultados.length }}</p>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 space-y-3">
        <h3 class="font-bold text-zinc-900 dark:text-white text-xs uppercase tracking-wider border-b border-zinc-200 dark:border-zinc-800 pb-2">
          Atletas por Disciplina
        </h3>
        <div class="space-y-1.5 max-h-64 overflow-y-auto">
          <div 
            v-for="dep in deportes" 
            :key="dep.id" 
            class="flex items-center justify-between py-2 px-3 rounded-lg bg-zinc-50 dark:bg-zinc-900/50 text-xs text-zinc-800 dark:text-zinc-300"
          >
            <span>{{ dep.nombre }}</span>
            <span class="font-mono text-zinc-500">{{ contarAtletasPorDeporte(dep.id) }}</span>
          </div>
          <p v-if="deportes.length === 0" class="text-xs text-zinc-400 py-4 text-center">
            No hay disciplinas registradas.
          </p>
        </div>
      </div>

      <div class="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 space-y-3">
        <h3 class="font-bold text-zinc-900 dark:text-white text-xs uppercase tracking-wider border-b border-zinc-200 dark:border-zinc-800 pb-2">
          Últimas Evaluaciones
        </h3>
        <div class="space-y-1.5 max-h-64 overflow-y-auto">
          <div 
            v-for="res in ultimosResultados" 
            :key="res.id" 
            class="flex items-center justify-between py-2 px-3 rounded-lg bg-zinc-50 dark:bg-zinc-900/50 text-xs"
          >
            <div>
              <p class="font-semibold text-zinc-900 dark:text-white">{{ res.atleta_nombre }} {{ res.atleta_apellido }}</p>
              <p class="text-[11px] text-zinc-500">{{ res.prueba_nombre }}</p>
            </div>
            <div class="text-right">
              <span class="font-mono font-bold text-zinc-900 dark:text-zinc-200">{{ res.marca_texto }}</span>
              <p class="text-[10px] font-mono text-zinc-400">{{ res.fecha }}</p>
            </div>
          </div>
          <p v-if="resultados.length === 0" class="text-xs text-zinc-400 py-4 text-center">
            No hay evaluaciones registradas.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";
import { useSportsData } from "../composables/useSportsData";
import { useAthletesData } from "../composables/useAthletesData";

const { deportes } = useSportsData();
const { atletas, resultados } = useAthletesData();

const ultimosResultados = computed(() => [...resultados.value].reverse());

function contarAtletasPorDeporte(deporteId) {
  return atletas.value.filter((a) => a.deporte_id === deporteId).length;
}
</script>