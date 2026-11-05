<template>
  <div 
    v-if="modelValue" 
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-sm transition-opacity"
    @click.self="cerrar"
  >
    <div class="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
      <!-- Encabezado -->
      <div class="flex items-start justify-between">
        <div>
          <span class="text-[10px] font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 font-semibold">
            Acerca del Software
          </span>
          <h3 class="text-base font-bold text-zinc-900 dark:text-white tracking-tight mt-0.5">
            Gestión Deportiva Desktop
          </h3>
        </div>
        <button 
          @click="cerrar" 
          class="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 p-1 text-sm rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
        >
          ✕
        </button>
      </div>

      <!-- Ficha de Ingeniería -->
      <div class="bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800/80 rounded-xl p-4 space-y-2 text-xs">
        <p class="text-zinc-600 dark:text-zinc-400 leading-relaxed">
          Plataforma de alto rendimiento para el seguimiento atlético, análisis de curvas de evolución y control centralizado de marcas deportivas.
        </p>
        <div class="flex items-center gap-2 pt-1 font-mono text-[10px] text-zinc-500">
          <span class="px-2 py-0.5 bg-zinc-200 dark:bg-zinc-800 rounded text-zinc-800 dark:text-zinc-300">v1.0.0</span>
          <span>•</span>
          <span>Tauri + SQLite Local</span>
          <span>•</span>
          <span>Vue 3</span>
        </div>
      </div>

      <!-- Datos Profesionales -->
      <div class="border-t border-zinc-200 dark:border-zinc-800 pt-4 space-y-3">
        <div>
          <span class="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">Desarrollo e Ingeniería</span>
          <p class="text-sm font-bold text-zinc-900 dark:text-white mt-0.5">Santiago Rens</p>
          <p class="text-xs text-zinc-500 dark:text-zinc-400">Desarrollador de Software</p>
        </div>

        <!-- Botón de Contacto / Copiar Mail -->
        <div class="flex items-center justify-between bg-zinc-100 dark:bg-zinc-900 rounded-lg p-3 border border-zinc-200 dark:border-zinc-800">
          <div class="min-w-0 pr-2">
            <span class="text-[10px] text-zinc-400 uppercase tracking-wider block font-semibold">Contacto Directo</span>
            <span class="text-xs font-mono font-medium text-zinc-800 dark:text-zinc-200 truncate block">
              santiagorens29@gmail.com
            </span>
          </div>

          <button 
            @click="copiarEmail" 
            class="shrink-0 bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-950 font-medium text-xs px-3 py-1.5 rounded-md transition-colors"
          >
            {{ copiado ? '¡Copiado!' : 'Copiar' }}
          </button>
        </div>
      </div>

      <!-- Pie del Modal -->
      <div class="flex justify-end pt-1">
        <button 
          @click="cerrar" 
          class="bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          Cerrar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useNotification } from "../composables/useNotification";

defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(["update:modelValue"]);
const { notificar } = useNotification();
const copiado = ref(false);

function cerrar() {
  emit("update:modelValue", false);
  copiado.value = false;
}

async function copiarEmail() {
  try {
    await navigator.clipboard.writeText("santiagorens29@gmail.com");
    copiado.value = true;
    notificar("Email de contacto copiado al portapapeles.", "success");
    setTimeout(() => {
      copiado.value = false;
    }, 2500);
  } catch (err) {
    notificar("santiagorens29@gmail.com", "info");
  }
}
</script>