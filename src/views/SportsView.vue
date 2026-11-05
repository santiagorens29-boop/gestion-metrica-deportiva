<template>
  <section class="space-y-6">
    <header class="flex items-center justify-between">
      <div>
        <h2 class="text-xl font-bold text-zinc-900 dark:text-white tracking-tight">Disciplinas y Pruebas</h2>
        <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Configuración de categorías deportivas y eventos.</p>
      </div>
      <span class="text-xs font-mono text-zinc-600 dark:text-zinc-400 bg-zinc-200 dark:bg-zinc-900 px-3 py-1.5 rounded-lg border border-zinc-300 dark:border-zinc-800">
        {{ deportes.length }} disciplinas
      </span>
    </header>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Form Deporte -->
      <div class="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 space-y-3">
        <h3 class="font-bold text-zinc-900 dark:text-white text-xs uppercase tracking-wider">Nueva Disciplina</h3>
        <form @submit.prevent="ejecutarCrearDeporte" class="space-y-3">
          <input 
            v-model="nuevoDeporteNombre" 
            type="text" 
            placeholder="Nombre de la disciplina..." 
            required
            class="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-zinc-500" 
          />
          <div class="flex justify-end">
            <button 
              type="submit"
              class="bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-950 font-medium text-xs px-3.5 py-1.5 rounded-lg transition-colors"
            >
              Guardar Disciplina
            </button>
          </div>
        </form>
      </div>

      <!-- Form Prueba -->
      <div class="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 space-y-3">
        <h3 class="font-bold text-zinc-900 dark:text-white text-xs uppercase tracking-wider">Nueva Subdisciplina / Prueba</h3>
        <form @submit.prevent="ejecutarCrearPrueba" class="space-y-3">
          <div class="grid grid-cols-2 gap-3">
            <select 
              v-model="nuevaPrueba.deporte_id" 
              required
              class="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-lg px-2.5 py-2 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-500"
            >
              <option :value="null" disabled>Disciplina</option>
              <option v-for="d in deportes" :key="d.id" :value="d.id">{{ d.nombre }}</option>
            </select>

            <select 
              v-model="nuevaPrueba.tipo_metrica" 
              required
              class="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-lg px-2.5 py-2 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-500"
            >
              <option value="tiempo">Tiempo (Menor es mejor)</option>
              <option value="distancia">Distancia (Mayor es mejor)</option>
              <option value="peso">Peso (Mayor es mejor)</option>
              <option value="puesto">Puesto (Menor es mejor)</option>
            </select>
          </div>

          <input 
            v-model="nuevaPrueba.nombre" 
            type="text" 
            placeholder="Nombre de la prueba..." 
            required
            class="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-zinc-500" 
          />

          <div class="flex justify-end">
            <button 
              type="submit"
              class="bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-950 font-medium text-xs px-3.5 py-1.5 rounded-lg transition-colors"
            >
              Guardar Prueba
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Listado Simple -->
    <div class="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 space-y-4">
      <h3 class="font-bold text-zinc-900 dark:text-white text-xs uppercase tracking-wider border-b border-zinc-200 dark:border-zinc-800 pb-2">
        Estructura Deportiva
      </h3>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div 
          v-for="dep in deportes" 
          :key="dep.id" 
          class="bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-lg p-3.5 space-y-2 flex flex-col justify-between"
        >
          <div>
            <div class="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-1.5 mb-2">
              <span class="text-xs font-bold text-zinc-900 dark:text-white uppercase">{{ dep.nombre }}</span>
              <button 
                @click="ejecutarEliminarDeporte(dep)"
                class="text-[11px] font-semibold text-red-600 dark:text-red-400 hover:underline"
              >
                Eliminar
              </button>
            </div>

            <div class="space-y-1 max-h-40 overflow-y-auto">
              <div 
                v-for="pru in todasLasPruebas.filter(p => p.deporte_id === dep.id)" 
                :key="pru.id" 
                class="flex items-center justify-between text-xs py-1 px-1.5 rounded hover:bg-zinc-200/50 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300"
              >
                <span>{{ pru.nombre }}</span>
                <button 
                  @click="ejecutarEliminarPrueba(pru)" 
                  class="text-[10px] text-zinc-400 hover:text-red-600 dark:hover:text-red-400"
                >
                  ✕
                </button>
              </div>

              <p 
                v-if="todasLasPruebas.filter(p => p.deporte_id === dep.id).length === 0" 
                class="text-[11px] text-zinc-400 italic py-1"
              >
                Sin pruebas cargadas.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from "vue";
import { useSportsData } from "../composables/useSportsData";
import { useNotification } from "../composables/useNotification";
import { useConfirm } from "../composables/useConfirm";

const { deportes, todasLasPruebas, crearDeporte, eliminarDeporte, crearPrueba, eliminarPrueba } = useSportsData();
const { notificar } = useNotification();
const { confirmar } = useConfirm();

const nuevoDeporteNombre = ref("");
const nuevaPrueba = ref({
  deporte_id: null,
  nombre: "",
  tipo_metrica: "tiempo"
});

async function ejecutarCrearDeporte() {
  const res = await crearDeporte(nuevoDeporteNombre.value);
  if (res.ok) {
    notificar(`Disciplina "${nuevoDeporteNombre.value}" creada correctamente.`, "success");
    nuevoDeporteNombre.value = "";
  } else {
    notificar(res.msg || "No se pudo crear la disciplina.", "error");
  }
}

async function ejecutarEliminarDeporte(deporte) {
  const acepto = await confirmar({
    titulo: "Eliminar Disciplina",
    mensaje: `¿Estás seguro de eliminar la disciplina "${deporte.nombre}"? Esta acción no se puede deshacer.`
  });

  if (acepto) {
    const res = await eliminarDeporte(deporte);
    if (res.ok) {
      notificar(`Disciplina "${deporte.nombre}" eliminada.`, "info");
    } else {
      notificar(res.msg || "Error al eliminar la disciplina.", "error");
    }
  }
}

async function ejecutarCrearPrueba() {
  const res = await crearPrueba(
    nuevaPrueba.value.deporte_id,
    nuevaPrueba.value.nombre,
    nuevaPrueba.value.tipo_metrica
  );
  if (res.ok) {
    notificar(`Prueba "${nuevaPrueba.value.nombre}" agregada correctamente.`, "success");
    nuevaPrueba.value.nombre = "";
  } else {
    notificar(res.msg || "No se pudo crear la prueba.", "error");
  }
}

async function ejecutarEliminarPrueba(prueba) {
  const acepto = await confirmar({
    titulo: "Eliminar Prueba",
    mensaje: `¿Estás seguro de eliminar la prueba "${prueba.nombre}"?`
  });

  if (acepto) {
    const res = await eliminarPrueba(prueba);
    if (res.ok) {
      notificar(`Prueba "${prueba.nombre}" eliminada.`, "info");
    } else {
      notificar(res.msg || "Error al eliminar la prueba.", "error");
    }
  }
}
</script>