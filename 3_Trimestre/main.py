# ============================================================
# main.py — API REST del CRM XTART
# Modulo: Entornos de Desarrollo (ED)
# Descripcion: servidor Flask que expone los datos de la base
#              de datos SQLite en formato JSON mediante endpoints
# ============================================================

# Importamos Flask para crear el servidor web y jsonify para
# convertir los datos Python en respuestas JSON automaticamente
from flask import Flask, jsonify

# Importamos CORS para permitir que el HTML (servido en otro
# puerto por Live Server) pueda hacer peticiones fetch a la API
from flask_cors import CORS

# Modulo estandar de Python para conectar con bases de datos SQLite
import sqlite3

# Modulo estandar de Python para trabajar con rutas del sistema de archivos
import os

# Creamos la aplicacion Flask. __name__ le dice a Flask donde
# buscar los recursos relativos a este archivo
app = Flask(__name__)

# Activamos CORS en toda la aplicacion para que el navegador
# no bloquee las peticiones fetch del index.html a esta API
CORS(app)

# Construimos la ruta absoluta al archivo crm.db usando la
# ubicacion de este propio archivo (main.py) como referencia.
# Asi funciona aunque se ejecute desde cualquier directorio.
DB_PATH = os.path.join(os.path.dirname(__file__), "crm.db")


def get_db():
    """Abre y devuelve una conexion a la base de datos SQLite."""

    # Abrimos la conexion al archivo crm.db en la ruta calculada
    conn = sqlite3.connect(DB_PATH)

    # row_factory convierte cada fila del resultado en un
    # diccionario {columna: valor} en vez de una tupla anonima.
    # Esto nos permite hacer dict(row) despues para serializar a JSON
    conn.row_factory = sqlite3.Row

    # Devolvemos la conexion lista para usar
    return conn


# ---- ENDPOINT RAIZ ----
# Decorador que registra la funcion como manejador de GET /
@app.route("/")
def index():
    # Devuelve un JSON informativo con el nombre, version
    # y lista de endpoints disponibles en la API
    return jsonify({
        "mensaje": "API CRM XTART funcionando correctamente",
        "version": "1.0",
        "endpoints": [
            "/comerciales",
            "/clientes-potenciales",
            "/clientes",
            "/pedidos",
            "/facturas"
        ]
    })


# ---- ENDPOINT COMERCIALES ----
# Maneja peticiones GET a /comerciales
@app.route("/comerciales")
def get_comerciales():
    # Abrimos conexion a la base de datos
    conn = get_db()

    # Ejecutamos la consulta SQL que selecciona todos los
    # comerciales ordenados alfabeticamente por nombre
    rows = conn.execute("SELECT * FROM comerciales ORDER BY nombre").fetchall()

    # Cerramos la conexion para liberar recursos
    conn.close()

    # Convertimos cada fila (sqlite3.Row) a diccionario y
    # devolvemos la lista completa serializada como JSON
    return jsonify([dict(r) for r in rows])


# ---- ENDPOINT CLIENTES POTENCIALES ----
# Maneja peticiones GET a /clientes-potenciales
@app.route("/clientes-potenciales")
def get_clientes_potenciales():
    # Abrimos conexion a la base de datos
    conn = get_db()

    # Consulta con JOIN: une clientes_potenciales con comerciales
    # para incluir el nombre completo del comercial asignado.
    # LEFT JOIN garantiza que aparezcan potenciales sin comercial asignado.
    # Ordenamos por fecha de contacto descendente (mas recientes primero)
    rows = conn.execute("""
        SELECT cp.*,
               c.nombre || ' ' || c.apellidos AS nombre_comercial
        FROM clientes_potenciales cp
        LEFT JOIN comerciales c ON cp.id_comercial = c.id
        ORDER BY cp.fecha_contacto DESC
    """).fetchall()

    # Cerramos la conexion
    conn.close()

    # Devolvemos la lista de potenciales como JSON
    return jsonify([dict(r) for r in rows])


# ---- ENDPOINT CLIENTES ----
# Maneja peticiones GET a /clientes
@app.route("/clientes")
def get_clientes():
    # Abrimos conexion a la base de datos
    conn = get_db()

    # Seleccionamos todos los clientes ordenados por razon social
    rows = conn.execute("SELECT * FROM clientes ORDER BY razon_social").fetchall()

    # Cerramos la conexion
    conn.close()

    # Devolvemos la lista de clientes como JSON
    return jsonify([dict(r) for r in rows])


# ---- ENDPOINT PEDIDOS ----
# Maneja peticiones GET a /pedidos
@app.route("/pedidos")
def get_pedidos():
    # Abrimos conexion a la base de datos
    conn = get_db()

    # Consulta con dos JOINs: une pedidos con clientes (para
    # obtener razon_social) y con comerciales (para obtener
    # nombre completo). Ordenamos por fecha descendente.
    rows = conn.execute("""
        SELECT p.*,
               cl.razon_social AS nombre_cliente,
               co.nombre || ' ' || co.apellidos AS nombre_comercial
        FROM pedidos p
        LEFT JOIN clientes cl ON p.id_cliente = cl.id
        LEFT JOIN comerciales co ON p.id_comercial = co.id
        ORDER BY p.fecha DESC
    """).fetchall()

    # Cerramos la conexion
    conn.close()

    # Devolvemos la lista de pedidos como JSON
    return jsonify([dict(r) for r in rows])


# ---- ENDPOINT FACTURAS ----
# Maneja peticiones GET a /facturas
@app.route("/facturas")
def get_facturas():
    # Abrimos conexion a la base de datos
    conn = get_db()

    # Consulta con JOIN: une facturas con clientes para
    # incluir la razon social en cada factura.
    # Ordenamos por fecha de emision descendente.
    rows = conn.execute("""
        SELECT f.*,
               cl.razon_social AS nombre_cliente
        FROM facturas f
        LEFT JOIN clientes cl ON f.id_cliente = cl.id
        ORDER BY f.fecha_emision DESC
    """).fetchall()

    # Cerramos la conexion
    conn.close()

    # Devolvemos la lista de facturas como JSON
    return jsonify([dict(r) for r in rows])


# ---- ARRANQUE DEL SERVIDOR ----
# Este bloque solo se ejecuta si lanzamos el archivo directamente
# con "python main.py". Si se importa como modulo no se ejecuta.
if __name__ == "__main__":
    # Arrancamos el servidor Flask en el puerto 5000.
    # debug=True recarga el servidor automaticamente al guardar cambios
    # y muestra errores detallados en el navegador durante el desarrollo
    app.run(debug=True, port=5000)