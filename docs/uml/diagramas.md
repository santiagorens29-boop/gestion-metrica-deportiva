# Diagramas UML y Arquitectura del Sistema

A continuación se presentan los diagramas de modelado de software correspondientes a la aplicación de escritorio **Gestión Deportiva**.

---

## 1. Diagrama de Casos de Uso

Modela las interacciones principales del usuario (entrenador o preparador físico) con los módulos funcionales del sistema.

```mermaid
flowchart LR
    Actor((Entrenador / Usuario))

    subgraph Sistema ["Gestión Deportiva (Desktop)"]
        CU1["CU-01: Gestionar Atletas (CRUD)"]
        CU2["CU-02: Configurar Disciplinas y Pruebas"]
        CU3["CU-03: Registrar Marca / Evaluación"]
        CU4["CU-04: Analizar Evolución (Dashboard)"]
        CU5["CU-05: Exportar Reporte en PDF"]
        
        CU3 -.->|<<includes>>| CU4
        CU4 -.->|<<extends>>| CU5
    end

    Actor --> CU1
    Actor --> CU2
    Actor --> CU3
    Actor --> CU4
    Actor --> CU5
```

---

## 2. Diagrama Entidad-Relación (Modelo de Datos SQLite)

Estructura de la base de datos relacional local (`deportes.db`) con sus tablas, atributos, claves primarias (PK), foráneas (FK) y relaciones.

```mermaid
erDiagram
    ATLETAS ||--o{ RESULTADOS : "obtiene"
    DEPORTES ||--o{ PRUEBAS : "contiene"
    PRUEBAS ||--o{ RESULTADOS : "evalua"

    ATLETAS {
        int id PK
        string nombre
        string apellido
        string dni UK
        date fecha_nacimiento
        string telefono
        string disciplina
        string rutina
        string nivel_compromiso
        string estado
        datetime created_at
    }

    DEPORTES {
        int id PK
        string nombre UK
        string descripcion
    }

    PRUEBAS {
        int id PK
        int deporte_id FK
        string nombre
        string tipo_metrica
        string unidad_medida
    }

    RESULTADOS {
        int id PK
        int atleta_id FK
        int prueba_id FK
        real valor_numerico
        string valor_formateado
        date fecha
        string observaciones
        datetime created_at
    }
```