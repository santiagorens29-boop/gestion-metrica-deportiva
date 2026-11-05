import Database from "@tauri-apps/plugin-sql";

let dbInstance = null;

export async function getDB() {
  if (!dbInstance) {
    dbInstance = await Database.load("sqlite:deportes.db");
  }
  return dbInstance;
}

export async function initDatabase() {
  const db = await getDB();

  // 1. Tabla de configuración / control de inicialización
  await db.execute(`
    CREATE TABLE IF NOT EXISTS sistema_config (
      clave TEXT PRIMARY KEY,
      valor TEXT
    );
  `);

  // 2. Tabla de Deportes
  await db.execute(`
    CREATE TABLE IF NOT EXISTS deportes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL UNIQUE
    );
  `);

  // 3. Tabla de Atletas
  await db.execute(`
    CREATE TABLE IF NOT EXISTS atletas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      apellido TEXT NOT NULL,
      dni TEXT UNIQUE NOT NULL,
      fecha_nacimiento TEXT,
      telefono TEXT,
      deporte_id INTEGER,
      rutina_entrenamiento TEXT,
      nivel_compromiso TEXT DEFAULT 'Excelente',
      observaciones_actitud TEXT,
      estado TEXT DEFAULT 'Activo',
      FOREIGN KEY (deporte_id) REFERENCES deportes(id) ON DELETE SET NULL
    );
  `);

  // Migraciones seguras
  try { await db.execute("ALTER TABLE atletas ADD COLUMN rutina_entrenamiento TEXT;"); } catch (e) {}
  try { await db.execute("ALTER TABLE atletas ADD COLUMN fecha_nacimiento TEXT;"); } catch (e) {}
  try { await db.execute("ALTER TABLE atletas ADD COLUMN nivel_compromiso TEXT DEFAULT 'Excelente';"); } catch (e) {}
  try { await db.execute("ALTER TABLE atletas ADD COLUMN observaciones_actitud TEXT;"); } catch (e) {}

  // 4. Tabla de Pruebas
  await db.execute(`
    CREATE TABLE IF NOT EXISTS pruebas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      deporte_id INTEGER NOT NULL,
      nombre TEXT NOT NULL,
      tipo_metrica TEXT NOT NULL,
      FOREIGN KEY (deporte_id) REFERENCES deportes(id) ON DELETE CASCADE
    );
  `);

  // 5. Tabla de Resultados
  await db.execute(`
    CREATE TABLE IF NOT EXISTS resultados (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      atleta_id INTEGER NOT NULL,
      prueba_id INTEGER NOT NULL,
      fecha TEXT NOT NULL,
      competencia TEXT,
      marca_valor REAL NOT NULL,
      marca_texto TEXT,
      FOREIGN KEY (atleta_id) REFERENCES atletas(id) ON DELETE CASCADE,
      FOREIGN KEY (prueba_id) REFERENCES pruebas(id) ON DELETE CASCADE
    );
  `);

  // Verificamos si la semilla inicial ya fue ejecutada alguna vez
  const sembrado = await db.select("SELECT valor FROM sistema_config WHERE clave = 'datos_semilla_cargados';");

  if (sembrado.length === 0) {
    // Solo se ejecuta en el PRIMER inicio del software
    const deportesBase = [
      'Natación',
      'Atletismo',
      'Kayak'
    ];

    for (const dep of deportesBase) {
      try {
        await db.execute("INSERT OR IGNORE INTO deportes (nombre) VALUES ($1);", [dep]);
      } catch (e) {}
    }

    const listaDeportes = await db.select("SELECT id, nombre FROM deportes;");
    const depMap = {};
    listaDeportes.forEach(d => { depMap[d.nombre] = d.id; });

    const pruebasBase = [
      { dep: 'Natación', nombre: '50m Libre', metrica: 'tiempo' },
      { dep: 'Natación', nombre: '100m Libre', metrica: 'tiempo' },
      { dep: 'Natación', nombre: '100m Mariposa', metrica: 'tiempo' },
      { dep: 'Natación', nombre: '100m Espalda', metrica: 'tiempo' },
      { dep: 'Natación', nombre: '100m Pecho', metrica: 'tiempo' }
    ];

    for (const p of pruebasBase) {
      const depId = depMap[p.dep];
      if (depId) {
        await db.execute(
          "INSERT INTO pruebas (deporte_id, nombre, tipo_metrica) VALUES ($1, $2, $3);",
          [depId, p.nombre, p.metrica]
        );
      }
    }

    // Registramos que ya se sembraron los datos base para no volver a hacerlo nunca más
    await db.execute("INSERT INTO sistema_config (clave, valor) VALUES ('datos_semilla_cargados', 'true');");
  }

  return db;
}