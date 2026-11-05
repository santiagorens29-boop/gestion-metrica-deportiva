<template>
  <div 
    v-if="modelValue" 
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
  >
    <div class="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl w-full max-w-lg overflow-hidden shadow-2xl">
      <header class="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
        <h3 class="font-bold text-zinc-900 dark:text-white text-sm">
          {{ formulario.id ? 'Editar Legajo' : 'Registrar Nuevo Atleta' }}
        </h3>
        <button 
          @click="$emit('update:modelValue', false)" 
          class="text-zinc-400 hover:text-zinc-900 dark:hover:text-white text-sm"
        >
          ✕
        </button>
      </header>

      <form @submit.prevent="ejecutarGuardado" class="p-6 space-y-4">
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-bold text-zinc-600 dark:text-zinc-400 mb-1">Nombre</label>
            <input 
              v-model="formulario.nombre" 
              type="text" 
              required
              class="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-500" 
            />
          </div>
          <div>
            <label class="block text-xs font-bold text-zinc-600 dark:text-zinc-400 mb-1">Apellido</label>
            <input 
              v-model="formulario.apellido" 
              type="text" 
              required
              class="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-500" 
            />
          </div>
        </div>

        <div class="grid grid-cols-3 gap-3">
          <div>
            <label class="block text-xs font-bold text-zinc-600 dark:text-zinc-400 mb-1">DNI</label>
            <input 
              v-model="formulario.dni" 
              type="text" 
              required
              class="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-500 font-mono" 
            />
          </div>
          <div>
            <label class="block text-xs font-bold text-zinc-600 dark:text-zinc-400 mb-1">Nacimiento</label>
            <input 
              v-model="formulario.fecha_nacimiento" 
              type="date"
              class="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-500 font-mono" 
            />
          </div>
          <div>
            <label class="block text-xs font-bold text-zinc-600 dark:text-zinc-400 mb-1">
              Disciplina
            </label>
            <select 
              v-model="formulario.deporte_id"
              required
              :disabled="formulario.id !== null"
              class="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-500 disabled:opacity-50"
            >
              <option :value="null" disabled>Seleccionar</option>
              <option v-for="dep in deportes" :key="dep.id" :value="dep.id">{{ dep.nombre }}</option>
            </select>
          </div>
        </div>

        <div>
          <label class="block text-xs font-bold text-zinc-600 dark:text-zinc-400 mb-1">Compromiso</label>
          <select 
            v-model="formulario.nivel_compromiso"
            class="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-500"
          >
            <option value="Excelente">Excelente</option>
            <option value="Regular">Regular</option>
            <option value="En Alerta">En Alerta</option>
          </select>
        </div>

        <div>
          <label class="block text-xs font-bold text-zinc-600 dark:text-zinc-400 mb-1">
            Horarios de Entrenamiento
          </label>
          <textarea 
            v-model="formulario.rutina_entrenamiento" 
            rows="2"
            placeholder="Días y horarios..."
            class="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-lg p-3 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-500 resize-none font-sans"
          ></textarea>
        </div>

        <div>
          <label class="block text-xs font-bold text-zinc-600 dark:text-zinc-400 mb-1">
            Observaciones de Foco y Actitud
          </label>
          <textarea 
            v-model="formulario.observaciones_actitud" 
            rows="2"
            placeholder="Observaciones adicionales..."
            class="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-lg p-3 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-500 resize-none font-sans"
          ></textarea>
        </div>

        <div class="flex justify-end gap-2 pt-3 border-t border-zinc-200 dark:border-zinc-800">
          <button 
            type="button" 
            @click="$emit('update:modelValue', false)" 
            class="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            class="px-4 py-1.5 rounded-lg text-xs font-medium bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-950 transition-colors"
          >
            Guardar
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useSportsData } from "../composables/useSportsData";
import { useAthletesData } from "../composables/useAthletesData";
import { useNotification } from "../composables/useNotification";

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  atletaInicial: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(["update:modelValue", "guardado-exitoso"]);

const { deportes } = useSportsData();
const { guardarAtleta } = useAthletesData();
const { notificar } = useNotification();

const formulario = ref({
  id: null,
  nombre: "",
  apellido: "",
  dni: "",
  fecha_nacimiento: "",
  deporte_id: null,
  rutina_entrenamiento: "",
  nivel_compromiso: "Excelente",
  observaciones_actitud: ""
});

watch(
  () => props.atletaInicial,
  (nuevoAtleta) => {
    if (nuevoAtleta) {
      formulario.value = { ...nuevoAtleta };
    } else {
      formulario.value = {
        id: null,
        nombre: "",
        apellido: "",
        dni: "",
        fecha_nacimiento: "",
        deporte_id: deportes.value[0]?.id || null,
        rutina_entrenamiento: "",
        nivel_compromiso: "Excelente",
        observaciones_actitud: ""
      };
    }
  },
  { immediate: true }
);

async function ejecutarGuardado() {
  const esEdicion = formulario.value.id !== null;
  const res = await guardarAtleta(formulario.value);

  if (res.ok) {
    notificar(
      esEdicion ? "Legajo de atleta actualizado con éxito." : "Atleta registrado correctamente.", 
      "success"
    );
    emit("update:modelValue", false);
    emit("guardado-exitoso");
  } else {
    notificar(res.msg || "Ocurrió un error al guardar el atleta.", "error");
  }
}
</script>