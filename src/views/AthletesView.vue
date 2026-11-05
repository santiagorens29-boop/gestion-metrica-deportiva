<template>
  <section class="space-y-5">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-xl font-bold text-zinc-900 dark:text-white tracking-tight">Padrón de Atletas</h2>
        <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Listado general y administración de deportistas.</p>
      </div>
      <span class="text-xs font-mono text-zinc-600 dark:text-zinc-400 bg-zinc-200 dark:bg-zinc-900 px-3 py-1.5 rounded-lg border border-zinc-300 dark:border-zinc-800">
        {{ atletasFiltrados.length }} registrados
      </span>
    </div>

    <div class="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs text-zinc-700 dark:text-zinc-300">
          <thead class="bg-zinc-100 dark:bg-zinc-900/60 text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 border-b border-zinc-200 dark:border-zinc-800 select-none">
            <tr>
              <th class="px-5 py-3.5">Atleta</th>
              <th class="px-5 py-3.5">DNI</th>
              <th class="px-5 py-3.5">Edad</th>
              <th class="px-5 py-3.5">Disciplina</th>
              <th class="px-5 py-3.5">Compromiso</th>
              <th class="px-5 py-3.5 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-zinc-200 dark:divide-zinc-800/60 font-sans">
            <tr v-if="atletasFiltrados.length === 0">
              <td colspan="6" class="px-5 py-10 text-center text-zinc-400">
                No se encontraron atletas registrados.
              </td>
            </tr>

            <tr 
              v-for="atleta in atletasFiltrados" 
              :key="atleta.id" 
              class="hover:bg-zinc-50 dark:hover:bg-zinc-900/40 transition-colors"
            >
              <td class="px-5 py-3.5 font-semibold text-zinc-900 dark:text-white">
                {{ atleta.nombre }} {{ atleta.apellido }}
              </td>
              
              <td class="px-5 py-3.5 font-mono text-zinc-500 dark:text-zinc-400">
                {{ atleta.dni }}
              </td>

              <td class="px-5 py-3.5 font-mono text-zinc-700 dark:text-zinc-300">
                {{ calcularEdad(atleta.fecha_nacimiento) ? `${calcularEdad(atleta.fecha_nacimiento)} años` : '—' }}
              </td>

              <td class="px-5 py-3.5 text-zinc-700 dark:text-zinc-300">
                {{ atleta.deporte_nombre || 'Sin asignar' }}
              </td>

              <td class="px-5 py-3.5">
                <span class="text-zinc-800 dark:text-zinc-300 font-medium">
                  {{ atleta.nivel_compromiso || 'Excelente' }}
                </span>
              </td>

              <td class="px-5 py-3.5 text-right space-x-2">
                <button 
                  @click="$emit('ver-perfil', atleta)"
                  class="text-xs font-semibold text-zinc-900 dark:text-white hover:underline px-2 py-1"
                >
                  Ver Perfil
                </button>
                
                <button 
                  @click="$emit('editar-atleta', atleta)"
                  class="text-xs font-semibold text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:underline px-2 py-1"
                >
                  Editar
                </button>

                <button 
                  @click="confirmarEliminar(atleta)"
                  class="text-xs font-semibold text-red-600 dark:text-red-400 hover:underline px-2 py-1"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";
import { useAthletesData } from "../composables/useAthletesData";
import { useSportsData } from "../composables/useSportsData";
import { useNotification } from "../composables/useNotification";
import { useConfirm } from "../composables/useConfirm";

const props = defineProps({
  filtro: {
    type: String,
    default: ""
  }
});

defineEmits(["ver-perfil", "editar-atleta"]);

const { atletas, calcularEdad, eliminarAtleta } = useAthletesData();
const { normalizarTexto } = useSportsData();
const { notificar } = useNotification();
const { confirmar } = useConfirm();

const atletasFiltrados = computed(() => {
  if (!props.filtro.trim()) return atletas.value;
  const q = normalizarTexto(props.filtro);
  return atletas.value.filter(
    (a) =>
      normalizarTexto(a.nombre).includes(q) ||
      normalizarTexto(a.apellido).includes(q) ||
      normalizarTexto(a.dni).includes(q)
  );
});

async function confirmarEliminar(atleta) {
  const acepto = await confirmar({
    titulo: "Eliminar Atleta",
    mensaje: `¿Estás seguro de eliminar a ${atleta.nombre} ${atleta.apellido}? Se borrarán permanentemente todos sus registros y marcas asociadas.`
  });

  if (acepto) {
    const res = await eliminarAtleta(atleta.id);
    if (res.ok) {
      notificar(`Atleta "${atleta.nombre} ${atleta.apellido}" eliminado del padrón.`, "info");
    } else {
      notificar(res.msg || "Error al eliminar el atleta.", "error");
    }
  }
}
</script>