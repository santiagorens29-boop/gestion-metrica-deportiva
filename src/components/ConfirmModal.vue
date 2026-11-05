<template>
  <div 
    v-if="estadoModal.visible" 
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 select-none"
  >
    <div class="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl w-full max-w-sm overflow-hidden shadow-2xl p-5 space-y-4">
      
      <!-- Cabecera -->
      <div class="space-y-1">
        <h3 class="font-bold text-zinc-900 dark:text-white text-sm">
          {{ estadoModal.titulo }}
        </h3>
        <p class="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
          {{ estadoModal.mensaje }}
        </p>
      </div>

      <!-- Botones de Acción -->
      <div class="flex justify-end gap-2 pt-2">
        <button 
          @click="responder(false)"
          type="button" 
          class="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
        >
          Cancelar
        </button>

        <button 
          @click="responder(true)"
          type="button" 
          class="px-3.5 py-1.5 rounded-lg text-xs font-medium bg-red-600 hover:bg-red-700 text-white transition-colors"
        >
          Eliminar
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { useConfirm } from "../composables/useConfirm";

const { estadoModal, responder } = useConfirm();
</script>