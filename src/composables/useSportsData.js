import { ref } from "vue";
import { getDB } from "../database/db";

const deportes = ref([]);
const todasLasPruebas = ref([]);

export function useSportsData() {
  function normalizarTexto(txt) {
    return (txt || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim()
      .toLowerCase();
  }

  function capitalizarTexto(txt) {
    const limpio = (txt || "").trim();
    return limpio.charAt(0).toUpperCase() + limpio.slice(1);
  }

  async function cargarDeportesYPruebas() {
    try {
      const db = await getDB();
      deportes.value = await db.select("SELECT * FROM deportes ORDER BY nombre ASC;");
      todasLasPruebas.value = await db.select("SELECT * FROM pruebas ORDER BY nombre ASC;");
    } catch (error) {
      console.error("Error al cargar deportes y pruebas:", error);
    }
  }

  async function crearDeporte(nombre) {
    const nombreLimpio = (nombre || "").trim();
    if (!nombreLimpio) return { ok: false, msg: "El nombre no puede estar vacío." };

    const yaExiste = deportes.value.some(
      (d) => normalizarTexto(d.nombre) === normalizarTexto(nombreLimpio)
    );
    if (yaExiste) {
      return { ok: false, msg: `El deporte "${nombreLimpio}" ya existe en el sistema.` };
    }

    try {
      const db = await getDB();
      await db.execute("INSERT INTO deportes (nombre) VALUES ($1);", [
        capitalizarTexto(nombreLimpio)
      ]);
      await cargarDeportesYPruebas();
      return { ok: true };
    } catch (error) {
      console.error("Error al guardar deporte:", error);
      return { ok: false, msg: "Error al registrar deporte en SQLite." };
    }
  }

  async function eliminarDeporte(deporte) {
    try {
      const db = await getDB();
      const atletasAsociados = await db.select(
        "SELECT COUNT(*) as total FROM atletas WHERE deporte_id = $1;",
        [deporte.id]
      );

      if (atletasAsociados[0].total > 0) {
        return {
          ok: false,
          msg: `No es posible eliminar "${deporte.nombre}" porque tiene ${atletasAsociados[0].total} atleta(s) asignado(s).\nReasigná o eliminá primero a esos atletas.`
        };
      }

      await db.execute("DELETE FROM deportes WHERE id = $1;", [deporte.id]);
      await cargarDeportesYPruebas();
      return { ok: true };
    } catch (error) {
      console.error("Error al eliminar deporte:", error);
      return { ok: false, msg: "Error al intentar eliminar el deporte." };
    }
  }

  async function crearPrueba(deporteId, nombre, tipoMetrica) {
    const nombreLimpio = (nombre || "").trim();
    if (!deporteId || !nombreLimpio) {
      return { ok: false, msg: "Deporte y nombre de prueba son obligatorios." };
    }

    const pruebasDelDeporte = todasLasPruebas.value.filter(
      (p) => p.deporte_id === deporteId
    );
    const yaExiste = pruebasDelDeporte.some(
      (p) => normalizarTexto(p.nombre) === normalizarTexto(nombreLimpio)
    );

    if (yaExiste) {
      return { ok: false, msg: `La prueba "${nombreLimpio}" ya existe dentro de esta disciplina.` };
    }

    try {
      const db = await getDB();
      await db.execute(
        "INSERT INTO pruebas (deporte_id, nombre, tipo_metrica) VALUES ($1, $2, $3);",
        [deporteId, capitalizarTexto(nombreLimpio), tipoMetrica]
      );
      await cargarDeportesYPruebas();
      return { ok: true };
    } catch (error) {
      console.error("Error al guardar prueba:", error);
      return { ok: false, msg: "Error al registrar la prueba en SQLite." };
    }
  }

  async function eliminarPrueba(prueba) {
    try {
      const db = await getDB();
      const marcasAsociadas = await db.select(
        "SELECT COUNT(*) as total FROM resultados WHERE prueba_id = $1;",
        [prueba.id]
      );

      if (marcasAsociadas[0].total > 0) {
        return {
          ok: false,
          msg: `No se puede eliminar "${prueba.nombre}" porque tiene ${marcasAsociadas[0].total} marca(s) registrada(s) en el historial.`
        };
      }

      await db.execute("DELETE FROM pruebas WHERE id = $1;", [prueba.id]);
      await cargarDeportesYPruebas();
      return { ok: true };
    } catch (error) {
      console.error("Error al eliminar prueba:", error);
      return { ok: false, msg: "Error al intentar eliminar la prueba." };
    }
  }

  return {
    deportes,
    todasLasPruebas,
    cargarDeportesYPruebas,
    crearDeporte,
    eliminarDeporte,
    crearPrueba,
    eliminarPrueba,
    normalizarTexto,
    capitalizarTexto
  };
}