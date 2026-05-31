# CRM XTART - Proyecto Intermodular 1º DAM

Proyecto intermodular del tercer trimestre de 1º DAM — XTART Formación Profesional, Madrid.

## Descripcion

Sistema de gestion de relaciones con clientes (CRM) que incluye:
- Gestion de comerciales
- Gestion de clientes potenciales
- Gestion de clientes formales
- Gestion de pedidos
- Gestion de facturas

## Estructura del proyecto
CRM_ARES/
├── 3_Trimestre/
│   ├── index.html     → Interfaz web del CRM (Modulo LM)
│   ├── main.py        → API REST con Flask (Modulo ED)
│   ├── crear_bd.py    → Script para generar la base de datos SQLite
│   └── app.js         → Logica JavaScript de la web
└── README.md
## Entorno de desarrollo

| Herramienta          | Detalle                                  |
|----------------------|------------------------------------------|
| Sistema Operativo    | Windows 11                               |
| IDE                  | Visual Studio Code 1.122.0               |
| Lenguaje web         | HTML5 + CSS3 + JavaScript ES6+           |
| Framework CSS        | Tailwind CSS 3 (CDN)                     |
| Lenguaje API         | Python 3.12                              |
| Framework API        | Flask + Flask-CORS                       |
| Base de datos        | SQLite 3 (archivo crm.db, no versionado) |
| Control de versiones | Git + GitHub                             |

## Como ejecutar el proyecto

### Paso 1 - Generar la base de datos
```bash
python 3_Trimestre/crear_bd.py
```

### Paso 2 - Instalar dependencias
```bash
python -m pip install flask flask-cors
```

### Paso 3 - Arrancar la API
```bash
python 3_Trimestre/main.py
```

La API estara disponible en: `http://127.0.0.1:5000`

### Paso 4 - Abrir la web

Abre `3_Trimestre/index.html` con Live Server de VS Code.

## Endpoints de la API

| Endpoint                  | Descripcion                      |
|---------------------------|----------------------------------|
| GET /                     | Informacion de la API            |
| GET /comerciales          | Lista todos los comerciales      |
| GET /clientes-potenciales | Lista los clientes potenciales   |
| GET /clientes             | Lista los clientes formales      |
| GET /pedidos              | Lista todos los pedidos          |
| GET /facturas             | Lista todas las facturas         |