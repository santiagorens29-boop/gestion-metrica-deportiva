<template>
  <div class="flex h-screen w-screen bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 overflow-hidden font-sans transition-colors">
    <!-- Sidebar Izquierdo -->
    <AppSidebar 
      :vista-actual="vistaActual" 
      @cambiar-vista="vistaActual = $event" 
    />

    <!-- Área Principal de la Aplicación -->
    <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
      <!-- Header Superior -->
      <AppHeader 
        v-model="filtroBusqueda" 
        :vista-actual="vistaActual"
        @abrir-modal-nuevo="abrirModalNuevoAtleta" 
      />

      <!-- Contenido Dinámico de las Vistas -->
      <main class="flex-1 overflow-y-auto p-8">
        <DashboardView 
          v-if="vistaActual === 'dashboard'" 
        />

        <AthletesView 
          v-else-if="vistaActual === 'atletas'" 
          :filtro="filtroBusqueda"
          @ver-perfil="abrirPerfilAtleta"
          @editar-atleta="abrirModalEditarAtleta"
        />

        <AthleteProfileView 
          v-else-if="vistaActual === 'perfil'" 
          :atleta="atletaSeleccionado"
          @volver="vistaActual = 'atletas'"
          @cargar-marca-directa="irACargarMarca"
        />

        <ResultsView 
          v-else-if="vistaActual === 'marcas'" 
          :precarga="precargaMarca"
        />

        <SportsView 
          v-else-if="vistaActual === 'disciplinas'" 
        />
      </main>
    </div>

    <!-- Modal Formulario de Atleta -->
    <AthleteModal 
      v-model="mostrarModalAtleta" 
      :atleta-inicial="atletaParaEditar"
      @guardado-exitoso="cerrarModalAtleta"
    />

    <!-- Sistema Global de Confirmación (Modales) -->
    <ConfirmModal />

    <!-- Sistema Global de Notificaciones (Toasts) -->
    <ToastNotification />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import AppSidebar from "./components/AppSidebar.vue";
import AppHeader from "./components/AppHeader.vue";
import AthleteModal from "./components/AthleteModal.vue";
import ConfirmModal from "./components/ConfirmModal.vue";
import ToastNotification from "./components/ToastNotification.vue";

import DashboardView from "./views/DashboardView.vue";
import AthletesView from "./views/AthletesView.vue";
import AthleteProfileView from "./views/AthleteProfileView.vue";
import ResultsView from "./views/ResultsView.vue";
import SportsView from "./views/SportsView.vue";

import { initDatabase } from "./database/db";
import { useAthletesData } from "./composables/useAthletesData";
import { useSportsData } from "./composables/useSportsData";

const vistaActual = ref("dashboard");
const filtroBusqueda = ref("");

const atletaSeleccionado = ref(null);
const precargaMarca = ref(null);

const mostrarModalAtleta = ref(false);
const atletaParaEditar = ref(null);

const { cargarAtletasYResultados } = useAthletesData();
const { cargarDeportesYPruebas } = useSportsData();

onMounted(async () => {
  try {
    // 1. Inicializa y asegura esquema SQLite
    await initDatabase();

    // 2. Ejecuta las dos cargas masivas en simultáneo
    await Promise.all([
      cargarDeportesYPruebas(),
      cargarAtletasYResultados()
    ]);
  } catch (error) {
    console.error("Error al inicializar la base de datos:", error);
  }
});

function abrirPerfilAtleta(atleta) {
  atletaSeleccionado.value = atleta;
  vistaActual.value = "perfil";
}

function irACargarMarca(datos) {
  precargaMarca.value = datos;
  vistaActual.value = "marcas";
}

function abrirModalNuevoAtleta() {
  atletaParaEditar.value = null;
  mostrarModalAtleta.value = true;
}

function abrirModalEditarAtleta(atleta) {
  atletaParaEditar.value = atleta;
  mostrarModalAtleta.value = true;
}

function cerrarModalAtleta() {
  mostrarModalAtleta.value = false;
  atletaParaEditar.value = null;
}
</script>