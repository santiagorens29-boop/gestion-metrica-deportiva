<template>
  <div class="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none select-none max-w-sm w-full">
    <TransitionGroup name="toast">
      <div 
        v-for="item in notificaciones" 
        :key="item.id"
        :class="[
          'pointer-events-auto px-4 py-3 rounded-xl border text-xs shadow-lg flex items-center gap-3 transition-all duration-200',
          item.tipo === 'error' 
            ? 'bg-zinc-950 dark:bg-zinc-900 border-red-500/40 text-red-400' 
            : item.tipo === 'success'
              ? 'bg-zinc-950 dark:bg-zinc-900 border-zinc-700 text-zinc-100'
              : 'bg-zinc-950 dark:bg-zinc-900 border-zinc-800 text-zinc-300'
        ]"
      >
        <!-- Indicador de tipo sutil -->
        <span 
          :class="[
            'w-1.5 h-1.5 rounded-full shrink-0',
            item.tipo === 'error' ? 'bg-red-500' : 'bg-white'
          ]"
        ></span>

        <span class="font-medium leading-tight">{{ item.mensaje }}</span>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { useNotification } from "../composables/useNotification";

const { notificaciones } = useNotification();
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.25s ease-out;
}

.toast-enter-from {
  opacity: 0;
  transform: translateY(10px) scale(0.95);
}

.toast-leave-to {
  opacity: 0;
  transform: translateY(-5px) scale(0.95);
}
</style>