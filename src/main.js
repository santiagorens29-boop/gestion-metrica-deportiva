import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import { initDatabase } from "./database/db";

// Inicializa las tablas SQLite antes de montar la vista
initDatabase()
  .then(() => {
    console.log("Base de datos SQLite inicializada correctamente.");
    createApp(App).mount("#app");
  })
  .catch((err) => {
    console.error("Error al inicializar la base de datos:", err);
  });