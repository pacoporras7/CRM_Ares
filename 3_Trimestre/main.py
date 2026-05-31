"""
API REST - CRM XTART
Modulo: Entornos de Desarrollo (ED)
Descripcion: API con Flask que sirve los datos del CRM en formato JSON
"""

from flask import Flask, jsonify
from flask_cors import CORS
import sqlite3
import os

app = Flask(__name__)
CORS(app)

DB_PATH = os.path.join(os.path.dirname(__file__), "crm.db")


def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


@app.route("/")
def index():
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


@app.route("/comerciales")
def get_comerciales():
    conn = get_db()
    rows = conn.execute("SELECT * FROM comerciales ORDER BY nombre").fetchall()
    conn.close()
    return jsonify([dict(r) for r in rows])


@app.route("/clientes-potenciales")
def get_clientes_potenciales():
    conn = get_db()
    rows = conn.execute("""
        SELECT cp.*,
               c.nombre || ' ' || c.apellidos AS nombre_comercial
        FROM clientes_potenciales cp
        LEFT JOIN comerciales c ON cp.id_comercial = c.id
        ORDER BY cp.fecha_contacto DESC
    """).fetchall()
    conn.close()
    return jsonify([dict(r) for r in rows])


@app.route("/clientes")
def get_clientes():
    conn = get_db()
    rows = conn.execute("SELECT * FROM clientes ORDER BY razon_social").fetchall()
    conn.close()
    return jsonify([dict(r) for r in rows])


@app.route("/pedidos")
def get_pedidos():
    conn = get_db()
    rows = conn.execute("""
        SELECT p.*,
               cl.razon_social AS nombre_cliente,
               co.nombre || ' ' || co.apellidos AS nombre_comercial
        FROM pedidos p
        LEFT JOIN clientes cl ON p.id_cliente = cl.id
        LEFT JOIN comerciales co ON p.id_comercial = co.id
        ORDER BY p.fecha DESC
    """).fetchall()
    conn.close()
    return jsonify([dict(r) for r in rows])


@app.route("/facturas")
def get_facturas():
    conn = get_db()
    rows = conn.execute("""
        SELECT f.*,
               cl.razon_social AS nombre_cliente
        FROM facturas f
        LEFT JOIN clientes cl ON f.id_cliente = cl.id
        ORDER BY f.fecha_emision DESC
    """).fetchall()
    conn.close()
    return jsonify([dict(r) for r in rows])


if __name__ == "__main__":
    app.run(debug=True, port=5000)