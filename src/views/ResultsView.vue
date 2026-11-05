<template>
  <section class="space-y-6" @click="cerrarMenusFlotantes">
    <header class="flex items-center justify-between">
      <div>
        <h2 class="text-xl font-bold text-zinc-900 dark:text-white tracking-tight">Registro de Marcas</h2>
        <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Cargar evaluaciones y consultar el historial.</p>
      </div>
      <span class="text-xs font-mono text-zinc-600 dark:text-zinc-400 bg-zinc-200 dark:bg-zinc-900 px-3 py-1.5 rounded-lg border border-zinc-300 dark:border-zinc-800">
        {{ resultados.length }} cargadas
      </span>
    </header>

    <!-- Formulario Limpio -->
    <div class="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5">
      <form @submit.prevent="ejecutarGuardadoResultado" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          <!-- ATLETA -->
          <div class="relative" @click.stop>
            <label class="block text-xs font-bold text-zinc-600 dark:text-zinc-400 mb-1">Atleta</label>
            <input 
              type="text"
              v-model="busquedaAtletaCombobox"
              @focus="mostrarMenuAtletas = true"
              @input="alEscribirAtleta"
              placeholder="Buscar por nombre o DNI..."
              required
              class="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-zinc-500"
            />
            <div 
              v-if="mostrarMenuAtletas" 
              class="absolute z-40 left-0 right-0 mt-1 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-xl max-h-48 overflow-y-auto divide-y divide-zinc-100 dark:divide-zinc-900"
            >
              <div 
                v-for="atl in atletasComboboxFiltrados" 
                :key="atl.id"
                @click="seleccionarAtleta(atl)"
                class="px-3 py-2 text-xs hover:bg-zinc-100 dark:hover:bg-zinc-900 cursor-pointer flex items-center justify-between"
              >
                <span class="text-zinc-900 dark:text-white font-medium">{{ atl.nombre }} {{ atl.apellido }}</span>
                <span class="text-[10px] font-mono text-zinc-500">{{ atl.dni }}</span>
              </div>
              <div v-if="atletasComboboxFiltrados.length === 0" class="px-3 py-2 text-xs text-zinc-400 italic text-center">
                Sin resultados
              </div>
            </div>
          </div>

          <!-- PRUEBA -->
          <div class="relative" @click.stop>
            <label class="block text-xs font-bold text-zinc-600 dark:text-zinc-400 mb-1">Prueba</label>
            <input 
              type="text"
              v-model="busquedaPruebaCombobox"
              :disabled="!formularioMarca.atleta_id"
              @focus="mostrarMenuPruebas = true"
              @input="alEscribirPrueba"
              placeholder="Seleccionar prueba..."
              required
              class="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-zinc-500 disabled:opacity-50"
            />
            <div 
              v-if="mostrarMenuPruebas && formularioMarca.atleta_id" 
              class="absolute z-40 left-0 right-0 mt-1 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-xl max-h-48 overflow-y-auto divide-y divide-zinc-100 dark:divide-zinc-900"
            >
              <div 
                v-for="pru in pruebasComboboxFiltradas" 
                :key="pru.id"
                @click="seleccionarPrueba(pru)"
                class="px-3 py-2 text-xs hover:bg-zinc-100 dark:hover:bg-zinc-900 cursor-pointer flex items-center justify-between"
              >
                <span class="text-zinc-900 dark:text-white">{{ pru.nombre }}</span>
                <span class="text-[10px] font-mono text-zinc-500">{{ pru.tipo_metrica }}</span>
              </div>
            </div>
          </div>

          <!-- FECHA -->
          <div>
            <label class="block text-xs font-bold text-zinc-600 dark:text-zinc-400 mb-1">Fecha</label>
            <input 
              v-model="formularioMarca.fecha" 
              type="date" 
              required
              class="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-500 font-mono" 
            />
          </div>
        </div>

        <!-- Métrica -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-zinc-200 dark:border-zinc-800/60">
          <div>
            <label class="block text-xs font-bold text-zinc-600 dark:text-zinc-400 mb-1">
              Marca
            </label>

            <div v-if="!pruebaSeleccionada || pruebaSeleccionada.tipo_metrica === 'tiempo'" class="grid grid-cols-3 gap-2 font-mono">
              <input v-model.number="tiempoMinutos" type="number" min="0" placeholder="Min" class="bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-900 dark:text-white text-center focus:outline-none focus:border-zinc-500" />
              <input v-model.number="tiempoSegundos" type="number" min="0" max="59" placeholder="Seg" required class="bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-900 dark:text-white text-center focus:outline-none focus:border-zinc-500" />
              <input v-model.number="tiempoCentesimas" type="number" min="0" max="99" placeholder="Cent" required class="bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-900 dark:text-white text-center focus:outline-none focus:border-zinc-500" />
            </div>

            <input 
              v-else-if="pruebaSeleccionada.tipo_metrica === 'distancia'"
              v-model.number="valorDistancia" 
              type="number" 
              step="0.01"
              min="0"
              placeholder="Metros (ej: 7.45)"
              required
              class="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-500 font-mono"
            />

            <input 
              v-else-if="pruebaSeleccionada.tipo_metrica === 'peso'"
              v-model.number="valorPeso" 
              type="number" 
              step="0.5"
              min="0"
              placeholder="Kg (ej: 120.5)"
              required
              class="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-500 font-mono"
            />

            <input 
              v-else-if="pruebaSeleccionada.tipo_metrica === 'puesto'"
              v-model.number="valorPuesto" 
              type="number" 
              min="1"
              placeholder="Puesto obtenido (ej: 1, 2, 3)"
              required
              class="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-500 font-mono"
            />
          </div>

          <!-- DETALLE / COMPETENCIA (Inhabilitado cuando es métrica de puesto) -->
          <div>
            <label class="block text-xs font-bold text-zinc-600 dark:text-zinc-400 mb-1">
              Competencia / Detalle
              <span v-if="esMetricaPuesto" class="text-[10px] font-normal text-zinc-400 dark:text-zinc-500 ml-1">
                (No aplica para pruebas por posición)
              </span>
              <span v-else class="text-[10px] font-normal text-zinc-400 dark:text-zinc-500 ml-1">
                (Opcional)
              </span>
            </label>
            <input 
              v-model="formularioMarca.competencia" 
              type="text" 
              :disabled="esMetricaPuesto"
              :placeholder="esMetricaPuesto ? 'Definido por la prueba / evento' : 'Ej: Torneo Apertura, Selectivo'" 
              class="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-500 disabled:opacity-40 disabled:cursor-not-allowed" 
            />
          </div>
        </div>

        <div class="flex justify-end pt-2">
          <button 
            type="submit" 
            class="bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-950 font-medium text-xs px-4 py-2 rounded-lg transition-colors"
          >
            Guardar Marca
          </button>
        </div>
      </form>
    </div>

    <!-- Tabla Historial -->
    <div class="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs text-zinc-700 dark:text-zinc-300">
          <thead class="bg-zinc-100 dark:bg-zinc-900/60 text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 border-b border-zinc-200 dark:border-zinc-800 select-none">
            <tr>
              <th class="px-5 py-3.5">Fecha</th>
              <th class="px-5 py-3.5">Atleta</th>
              <th class="px-5 py-3.5">Prueba</th>
              <th class="px-5 py-3.5">Marca</th>
              <th class="px-5 py-3.5">Detalle</th>
              <th class="px-5 py-3.5 text-right">Acción</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-zinc-200 dark:divide-zinc-800/60 font-sans">
            <tr v-if="resultados.length === 0">
              <td colspan="6" class="px-5 py-10 text-center text-zinc-400">
                No hay marcas registradas.
              </td>
            </tr>
            <tr 
              v-for="res in ultimosResultados" 
              :key="res.id" 
              class="hover:bg-zinc-50 dark:hover:bg-zinc-900/40 transition-colors"
            >
              <td class="px-5 py-3.5 font-mono text-zinc-500 dark:text-zinc-400">{{ res.fecha }}</td>
              <td class="px-5 py-3.5 font-semibold text-zinc-900 dark:text-white">{{ res.atleta_nombre }} {{ res.atleta_apellido }}</td>
              <td class="px-5 py-3.5 text-zinc-700 dark:text-zinc-300">{{ res.prueba_nombre }}</td>
              <td class="px-5 py-3.5 font-mono font-bold text-zinc-900 dark:text-white">{{ res.marca_texto }}</td>
              <td class="px-5 py-3.5 text-zinc-500 dark:text-zinc-400">{{ res.competencia || '—' }}</td>
              <td class="px-5 py-3.5 text-right">
                <button 
                  @click="confirmarEliminarMarca(res.id)"
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
import { ref, computed, watch, onMounted } from "vue";
import { useAthletesData } from "../composables/useAthletesData";
import { useSportsData } from "../composables/useSportsData";
import { useNotification } from "../composables/useNotification";
import { useConfirm } from "../composables/useConfirm";

const props = defineProps({
  precarga: {
    type: Object,
    default: null
  }
});

const { atletas, resultados, guardarResultado, eliminarResultado } = useAthletesData();
const { todasLasPruebas, normalizarTexto } = useSportsData();
const { notificar } = useNotification();
const { confirmar } = useConfirm();

const busquedaAtletaCombobox = ref("");
const mostrarMenuAtletas = ref(false);

const busquedaPruebaCombobox = ref("");
const mostrarMenuPruebas = ref(false);

const formularioMarca = ref({
  atleta_id: null,
  prueba_id: null,
  fecha: new Date().toISOString().split("T")[0],
  competencia: ""
});

const tiempoMinutos = ref(0);
const tiempoSegundos = ref(null);
const tiempoCentesimas = ref(null);
const valorDistancia = ref(null);
const valorPeso = ref(null);
const valorPuesto = ref(null);

function cerrarMenusFlotantes() {
  mostrarMenuAtletas.value = false;
  mostrarMenuPruebas.value = false;
}

const ultimosResultados = computed(() => [...resultados.value].reverse());

const atletasComboboxFiltrados = computed(() => {
  if (!busquedaAtletaCombobox.value.trim()) return atletas.value;
  const q = normalizarTexto(busquedaAtletaCombobox.value);
  return atletas.value.filter(
    (a) =>
      normalizarTexto(a.nombre).includes(q) ||
      normalizarTexto(a.apellido).includes(q) ||
      normalizarTexto(a.dni).includes(q)
  );
});

function alEscribirAtleta() {
  mostrarMenuAtletas.value = true;
  formularioMarca.value.atleta_id = null;
  formularioMarca.value.prueba_id = null;
  busquedaPruebaCombobox.value = "";
}

function seleccionarAtleta(atleta) {
  formularioMarca.value.atleta_id = atleta.id;
  busquedaAtletaCombobox.value = `${atleta.nombre} ${atleta.apellido}`;
  mostrarMenuAtletas.value = false;
  formularioMarca.value.prueba_id = null;
  busquedaPruebaCombobox.value = "";
}

const pruebasComboboxFiltradas = computed(() => {
  if (!formularioMarca.value.atleta_id) return [];
  const atleta = atletas.value.find((a) => a.id === formularioMarca.value.atleta_id);
  if (!atleta || !atleta.deporte_id) return [];

  let lista = todasLasPruebas.value.filter((p) => p.deporte_id === atleta.deporte_id);
  if (busquedaPruebaCombobox.value.trim()) {
    const q = normalizarTexto(busquedaPruebaCombobox.value);
    lista = lista.filter((p) => normalizarTexto(p.nombre).includes(q));
  }
  return lista;
});

function alEscribirPrueba() {
  mostrarMenuPruebas.value = true;
  formularioMarca.value.prueba_id = null;
}

function seleccionarPrueba(prueba) {
  formularioMarca.value.prueba_id = prueba.id;
  busquedaPruebaCombobox.value = prueba.nombre;
  mostrarMenuPruebas.value = false;

  // Si es prueba de puesto, limpiamos el campo competencia para no guardar basura
  if (prueba.tipo_metrica === "puesto") {
    formularioMarca.value.competencia = "";
  }
}

const pruebaSeleccionada = computed(() => {
  if (!formularioMarca.value.prueba_id) return null;
  return todasLasPruebas.value.find((p) => p.id === formularioMarca.value.prueba_id) || null;
});

// Comprueba si la prueba elegida es por posición/rango
const esMetricaPuesto = computed(() => {
  return pruebaSeleccionada.value?.tipo_metrica === "puesto";
});

async function ejecutarGuardadoResultado() {
  if (!formularioMarca.value.atleta_id || !formularioMarca.value.prueba_id || !pruebaSeleccionada.value) {
    notificar("Por favor seleccioná un atleta y una prueba válidos.", "error");
    return;
  }

  let marca_valor = 0;
  let marca_texto = "";
  const tipo = pruebaSeleccionada.value.tipo_metrica;

  if (tipo === "tiempo") {
    const min = tiempoMinutos.value || 0;
    const seg = tiempoSegundos.value || 0;
    const cent = tiempoCentesimas.value || 0;

    marca_valor = min * 60 + seg + cent / 100;
    marca_texto = `${String(min).padStart(2, "0")}:${String(seg).padStart(2, "0")}.${String(cent).padStart(2, "0")}`;
  } else if (tipo === "distancia") {
    marca_valor = parseFloat(valorDistancia.value);
    marca_texto = `${marca_valor.toFixed(2)} m`;
  } else if (tipo === "peso") {
    marca_valor = parseFloat(valorPeso.value);
    marca_texto = `${marca_valor.toFixed(1)} kg`;
  } else if (tipo === "puesto") {
    marca_valor = parseInt(valorPuesto.value, 10);
    marca_texto = `${marca_valor}°`;
  }

  const res = await guardarResultado({
    atleta_id: formularioMarca.value.atleta_id,
    prueba_id: formularioMarca.value.prueba_id,
    fecha: formularioMarca.value.fecha,
    competencia: esMetricaPuesto.value ? null : formularioMarca.value.competencia,
    marca_valor,
    marca_texto
  });

  if (res.ok) {
    notificar(`Marca (${marca_texto}) registrada correctamente.`, "success");
    tiempoMinutos.value = 0;
    tiempoSegundos.value = null;
    tiempoCentesimas.value = null;
    valorDistancia.value = null;
    valorPeso.value = null;
    valorPuesto.value = null;
    formularioMarca.value.competencia = "";
  } else {
    notificar(res.msg || "Error al guardar la evaluación.", "error");
  }
}

async function confirmarEliminarMarca(id) {
  const acepto = await confirmar({
    titulo: "Eliminar Registro de Marca",
    mensaje: "¿Estás seguro de que deseás eliminar este registro de marca del historial?"
  });

  if (acepto) {
    const res = await eliminarResultado(id);
    if (res.ok) {
      notificar("Registro de marca eliminado.", "info");
    } else {
      notificar(res.msg || "Error al eliminar el registro.", "error");
    }
  }
}

function procesarPrecarga(p) {
  if (p && p.atleta) {
    formularioMarca.value.atleta_id = p.atleta.id;
    busquedaAtletaCombobox.value = `${p.atleta.nombre} ${p.atleta.apellido}`;

    if (p.prueba) {
      formularioMarca.value.prueba_id = p.prueba.id;
      busquedaPruebaCombobox.value = p.prueba.nombre;
      if (p.prueba.tipo_metrica === "puesto") {
        formularioMarca.value.competencia = "";
      }
    } else {
      formularioMarca.value.prueba_id = null;
      busquedaPruebaCombobox.value = "";
    }
  }
}

watch(() => props.precarga, (nuevaPrecarga) => procesarPrecarga(nuevaPrecarga), { deep: true });
onMounted(() => procesarPrecarga(props.precarga));
</script>