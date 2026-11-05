<template>
  <aside class="w-56 bg-zinc-50 dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 flex flex-col justify-between shrink-0 select-none transition-colors">
    <div class="p-4 space-y-6">
      <!-- Marca / Logo -->
      <div class="px-2 pt-1">
        <h1 class="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-white">
          Gestión Deportiva
        </h1>
      </div>

      <!-- Navegación -->
      <nav class="space-y-1">
        <button 
          @click="$emit('cambiar-vista', 'dashboard')"
          :class="[
            'w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors text-left',
            vistaActual === 'dashboard' 
              ? 'bg-zinc-200/70 dark:bg-zinc-900 text-zinc-900 dark:text-white font-semibold' 
              : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900/50 hover:text-zinc-900 dark:hover:text-white'
          ]"
        >
          <span>Dashboard</span>
        </button>

        <button 
          @click="$emit('cambiar-vista', 'atletas')"
          :class="[
            'w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors text-left',
            vistaActual === 'atletas' || vistaActual === 'perfil'
              ? 'bg-zinc-200/70 dark:bg-zinc-900 text-zinc-900 dark:text-white font-semibold' 
              : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900/50 hover:text-zinc-900 dark:hover:text-white'
          ]"
        >
          <span>Atletas</span>
        </button>

        <button 
          @click="$emit('cambiar-vista', 'marcas')"
          :class="[
            'w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors text-left',
            vistaActual === 'marcas' 
              ? 'bg-zinc-200/70 dark:bg-zinc-900 text-zinc-900 dark:text-white font-semibold' 
              : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900/50 hover:text-zinc-900 dark:hover:text-white'
          ]"
        >
          <span>Registro de Marcas</span>
        </button>

        <button 
          @click="$emit('cambiar-vista', 'disciplinas')"
          :class="[
            'w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors text-left',
            vistaActual === 'disciplinas' 
              ? 'bg-zinc-200/70 dark:bg-zinc-900 text-zinc-900 dark:text-white font-semibold' 
              : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900/50 hover:text-zinc-900 dark:hover:text-white'
          ]"
        >
          <span>Disciplinas y Pruebas</span>
        </button>
      </nav>
    </div>

    <!-- Pie del Sidebar: Firma Destacada y Clickeable -->
    <div class="p-3 border-t border-zinc-200 dark:border-zinc-800/80">
      <button 
        @click="mostrarModalAcerca = true"
        class="w-full text-left p-2.5 rounded-lg bg-zinc-100/60 hover:bg-zinc-200/80 dark:bg-zinc-900/40 dark:hover:bg-zinc-900 transition-colors group border border-zinc-200/50 dark:border-zinc-800/50"
        title="Ver información y contacto del desarrollador"
      >
        <div class="flex items-center justify-between">
          <span class="text-[10px] font-mono text-zinc-400 dark:text-zinc-500">v1.0.0</span>
          <span class="text-[10px] text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300">Info ↗</span>
        </div>
        <p class="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1">
          Desarrollado por
        </p>
        <p class="text-xs font-bold text-zinc-900 dark:text-white tracking-wide mt-0.5">
          Santiago Rens
        </p>
      </button>
    </div>

    <!-- Modal Profesional -->
    <AboutModal v-model="mostrarModalAcerca" />
  </aside>
</template>

<script setup>
import { ref } from "vue";
import AboutModal from "./AboutModal.vue";

defineProps({
  vistaActual: {
    type: String,
    required: true
  }
});

defineEmits(["cambiar-vista"]);

const mostrarModalAcerca = ref(false);
</script>