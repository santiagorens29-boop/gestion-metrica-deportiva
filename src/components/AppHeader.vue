<template>
  <header class="h-14 bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 px-6 flex items-center justify-between shrink-0 select-none transition-colors">
    
    <!-- Bloque Izquierdo: Buscador + Botón (Solo visible en la sección Atletas) -->
    <div v-if="vistaActual === 'atletas'" class="flex items-center gap-2.5">
      <div class="w-80">
        <input 
          :value="modelValue" 
          @input="$emit('update:modelValue', $event.target.value)"
          type="text" 
          placeholder="Buscar por nombre o DNI..." 
          class="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-zinc-500 font-sans"
        />
      </div>

      <button 
        @click="$emit('abrir-modal-nuevo')"
        type="button"
        class="bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-950 font-medium text-xs px-3.5 py-1.5 rounded-lg transition-colors whitespace-nowrap"
      >
        Nuevo Atleta
      </button>
    </div>

    <!-- Espaciador cuando no estamos en 'atletas' para mantener el toggle a la derecha -->
    <div v-else></div>

    <!-- Bloque Derecho: Toggle de Modo -->
    <div>
      <button 
        @click="alternarTema"
        type="button"
        class="text-xs font-mono text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 px-2.5 py-1.5 rounded-lg transition-colors"
      >
        {{ temaActual === 'dark' ? 'Modo Claro' : 'Modo Oscuro' }}
      </button>
    </div>

  </header>
</template>

<script setup>
import { useTheme } from "../composables/useTheme";

defineProps({
  modelValue: {
    type: String,
    default: ""
  },
  vistaActual: {
    type: String,
    required: true
  }
});

defineEmits(["update:modelValue", "abrir-modal-nuevo"]);

const { temaActual, alternarTema } = useTheme();
</script>