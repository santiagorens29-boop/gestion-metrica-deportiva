import { ref } from "vue";
import { getDB } from "../database/db";

// Estado reactivo compartido en toda la aplicación
const atletas = ref([]);
const resultados = ref([]);

export function useAthletesData() {
  /**
   * Calcula la edad cronológica exacta a partir de una fecha YYYY-MM-DD.
   */
  function calcularEdad(fechaNacimiento) {
    if (!fechaNacimiento) return null;
    const hoy = new Date();
    const cumple = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - cumple.getFullYear();
    const mes = hoy.getMonth() - cumple.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < cumple.getDate())) {
      edad--;
    }
    return edad >= 0 ? edad : null;
  }

  /**
   * Carga desde SQLite el listado completo de atletas (con el nombre de su deporte)
   * y todo el historial de resultados ordenados cronológicamente.
   */
  async function cargarAtletasYResultados() {
    try {
      const db = await getDB();
      atletas.value = await db.select(`
        SELECT a.*, d.nombre as deporte_nombre 
        FROM atletas a 
        LEFT JOIN deportes d ON a.deporte_id = d.id 
        ORDER BY a.id DESC;
      `);

      resultados.value = await db.select(`
        SELECT r.*, a.nombre as atleta_nombre, a.apellido as atleta_apellido, p.nombre as prueba_nombre, p.tipo_metrica
        FROM resultados r
        JOIN atletas a ON r.atleta_id = a.id
        JOIN pruebas p ON r.prueba_id = p.id
        ORDER BY r.fecha ASC, r.id ASC;
      `);
    } catch (error) {
      console.error("Error al cargar atletas y resultados desde SQLite:", error);
    }
  }

  /**
   * Inserta un nuevo atleta o actualiza uno existente según tenga o no `id`.
   */
  async function guardarAtleta(formulario) {
    try {
      const db = await getDB();
      if (formulario.id) {
        await db.execute(
          `UPDATE atletas 
           SET nombre = $1, apellido = $2, dni = $3, fecha_nacimiento = $4, 
               rutina_entrenamiento = $5, nivel_compromiso = $6, observaciones_actitud = $7 
           WHERE id = $8`,
          [
            formulario.nombre,
            formulario.apellido,
            formulario.dni,
            formulario.fecha_nacimiento || null,
            formulario.rutina_entrenamiento,
            formulario.nivel_compromiso || "Excelente",
            formulario.observaciones_actitud || null,
            formulario.id
          ]
        );
      } else {
        await db.execute(
          `INSERT INTO atletas (nombre, apellido, dni, fecha_nacimiento, deporte_id, rutina_entrenamiento, nivel_compromiso, observaciones_actitud) 
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [
            formulario.nombre,
            formulario.apellido,
            formulario.dni,
            formulario.fecha_nacimiento || null,
            formulario.deporte_id,
            formulario.rutina_entrenamiento,
            formulario.nivel_compromiso || "Excelente",
            formulario.observaciones_actitud || null
          ]
        );
      }
      await cargarAtletasYResultados();
      return { ok: true };
    } catch (error) {
      console.error("Error al guardar atleta:", error);
      return { ok: false, msg: "Error al guardar el atleta. Verificá que el DNI no esté duplicado." };
    }
  }

  /**
   * Elimina un atleta y, por cascada referencial en BD, todas sus marcas.
   */
  async function eliminarAtleta(id) {
    try {
      const db = await getDB();
      await db.execute("DELETE FROM atletas WHERE id = $1;", [id]);
      await cargarAtletasYResultados();
      return { ok: true };
    } catch (error) {
      console.error("Error al eliminar atleta:", error);
      return { ok: false, msg: "Error al intentar eliminar el atleta." };
    }
  }

  /**
   * Registra una nueva marca/evaluación deportiva.
   */
  async function guardarResultado(datosResultado) {
    try {
      const db = await getDB();
      await db.execute(
        `INSERT INTO resultados (atleta_id, prueba_id, fecha, competencia, marca_valor, marca_texto)
         VALUES ($1, $2, $3, $4, $5, $6);`,
        [
          datosResultado.atleta_id,
          datosResultado.prueba_id,
          datosResultado.fecha,
          datosResultado.competencia || null,
          datosResultado.marca_valor,
          datosResultado.marca_texto
        ]
      );
      await cargarAtletasYResultados();
      return { ok: true };
    } catch (error) {
      console.error("Error al guardar resultado:", error);
      return { ok: false, msg: "Error al registrar la marca en la base de datos." };
    }
  }

  /**
   * Elimina una marca del historial.
   */
  async function eliminarResultado(id) {
    try {
      const db = await getDB();
      await db.execute("DELETE FROM resultados WHERE id = $1;", [id]);
      await cargarAtletasYResultados();
      return { ok: true };
    } catch (error) {
      console.error("Error al eliminar resultado:", error);
      return { ok: false, msg: "Error al eliminar la marca." };
    }
  }

  return {
    atletas,
    resultados,
    calcularEdad,
    cargarAtletasYResultados,
    guardarAtleta,
    eliminarAtleta,
    guardarResultado,
    eliminarResultado
  };
}