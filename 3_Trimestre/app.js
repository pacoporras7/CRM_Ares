// ============================================================
// CRM XTART - app.js
// Descripcion: carga datos desde la API Flask y los renderiza
// ============================================================

const API = "http://127.0.0.1:5000";

function badge(estado) {
  if (!estado) return "-";
  const e = estado.toLowerCase().replace(/\s+/g, "");
  const clases = {
    "nuevo":         "badge badge-nuevo",
    "enseguimiento": "badge badge-seguimiento",
    "convertido":    "badge badge-convertido",
    "perdido":       "badge badge-perdido",
    "activo":        "badge badge-activo",
    "inactivo":      "badge badge-inactivo",
    "pendiente":     "badge badge-pendiente",
    "cobrada":       "badge badge-cobrada",
    "vencida":       "badge badge-vencida",
    "anulada":       "badge badge-anulada",
    "servido":       "badge badge-servido",
    "encurso":       "badge badge-encurso",
  };
  const cls = clases[e] || "badge badge-inactivo";
  return `<span class="${cls}">${estado}</span>`;
}

async function cargarDatos(endpoint, renderFn) {
  try {
    const respuesta = await fetch(API + endpoint);
    if (!respuesta.ok) throw new Error("Error en la respuesta del servidor");
    const datos = await respuesta.json();
    renderFn(datos);
  } catch (error) {
    console.error("Error cargando " + endpoint, error);
  }
}

function renderComerciales(datos) {
  const tbody = document.getElementById("body-comerciales");
  if (datos.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" class="text-center py-4 text-gray-400">Sin datos</td></tr>';
    return;
  }
  tbody.innerHTML = datos.map(c => `
    <tr>
      <td>${c.id}</td>
      <td>${c.nombre}</td>
      <td>${c.apellidos}</td>
      <td>${c.email}</td>
      <td>${c.telefono || "-"}</td>
      <td>${c.zona || "-"}</td>
      <td>${c.fecha_alta || "-"}</td>
    </tr>
  `).join("");
}

function renderPotenciales(datos) {
  const tbody = document.getElementById("body-potenciales");
  if (datos.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8" class="text-center py-4 text-gray-400">Sin datos</td></tr>';
    return;
  }
  tbody.innerHTML = datos.map(p => `
    <tr>
      <td>${p.id}</td>
      <td>${p.nombre}</td>
      <td>${p.empresa || "-"}</td>
      <td>${p.email || "-"}</td>
      <td>${p.fuente || "-"}</td>
      <td>${badge(p.estado)}</td>
      <td>${p.fecha_contacto || "-"}</td>
      <td>${p.nombre_comercial || "-"}</td>
    </tr>
  `).join("");
}

function renderClientes(datos) {
  const tbody = document.getElementById("body-clientes");
  if (datos.length === 0) {
    tbody.innerHTML = '<tr><td colspan="9" class="text-center py-4 text-gray-400">Sin datos</td></tr>';
    return;
  }
  tbody.innerHTML = datos.map(c => `
    <tr>
      <td>${c.codigo || "-"}</td>
      <td>${c.razon_social}</td>
      <td>${c.nif || "-"}</td>
      <td>${c.contacto || "-"}</td>
      <td>${c.telefono || "-"}</td>
      <td>${c.email || "-"}</td>
      <td>${c.condiciones_pago || "-"}</td>
      <td>${c.descuento}%</td>
      <td>${badge(c.estado)}</td>
    </tr>
  `).join("");
}

function renderPedidos(datos) {
  const tbody = document.getElementById("body-pedidos");
  if (datos.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8" class="text-center py-4 text-gray-400">Sin datos</td></tr>';
    return;
  }
  tbody.innerHTML = datos.map(p => `
    <tr>
      <td>${p.id}</td>
      <td>${p.fecha}</td>
      <td>${p.nombre_cliente || "-"}</td>
      <td>${p.nombre_comercial || "-"}</td>
      <td>${badge(p.estado)}</td>
      <td>${parseFloat(p.base_imponible).toFixed(2)} €</td>
      <td>${p.iva}%</td>
      <td><strong>${parseFloat(p.total).toFixed(2)} €</strong></td>
    </tr>
  `).join("");
}

function renderFacturas(datos) {
  const tbody = document.getElementById("body-facturas");
  if (datos.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8" class="text-center py-4 text-gray-400">Sin datos</td></tr>';
    return;
  }
  tbody.innerHTML = datos.map(f => `
    <tr>
      <td>${f.numero}</td>
      <td>${f.nombre_cliente || "-"}</td>
      <td>${f.fecha_emision}</td>
      <td>${f.fecha_vencimiento}</td>
      <td>${parseFloat(f.base_imponible).toFixed(2)} €</td>
      <td>${f.iva}%</td>
      <td><strong>${parseFloat(f.total).toFixed(2)} €</strong></td>
      <td>${badge(f.estado)}</td>
    </tr>
  `).join("");
}

document.addEventListener("DOMContentLoaded", () => {
  cargarDatos("/comerciales",          renderComerciales);
  cargarDatos("/clientes-potenciales", renderPotenciales);
  cargarDatos("/clientes",             renderClientes);
  cargarDatos("/pedidos",              renderPedidos);
  cargarDatos("/facturas",             renderFacturas);
});
// ============================================================
// FILTRADO
// ============================================================
function filtrarTabla(idTabla, texto) {
  const tabla = document.getElementById(idTabla);
  const filas = tabla.getElementsByTagName("tr");
  const textoBusqueda = texto.toLowerCase();

  for (let i = 1; i < filas.length; i++) {
    const celdas = filas[i].getElementsByTagName("td");
    let encontrado = false;
    for (let j = 0; j < celdas.length; j++) {
      if (celdas[j].textContent.toLowerCase().includes(textoBusqueda)) {
        encontrado = true;
        break;
      }
    }
    filas[i].style.display = encontrado ? "" : "none";
  }
}

// ============================================================
// ORDENACION
// ============================================================
const estadoOrden = {};

function ordenarTabla(idTabla, columna) {
  const tabla = document.getElementById(idTabla);
  const tbody = tabla.querySelector("tbody");
  const filas = Array.from(tbody.querySelectorAll("tr"));

  const clave = idTabla + "_" + columna;
  const ascendente = !estadoOrden[clave];
  estadoOrden[clave] = ascendente;

  filas.sort((a, b) => {
    const celdaA = a.querySelectorAll("td")[columna]?.textContent.trim() || "";
    const celdaB = b.querySelectorAll("td")[columna]?.textContent.trim() || "";

    const numA = parseFloat(celdaA.replace(/[€%]/g, "").replace(",", "."));
    const numB = parseFloat(celdaB.replace(/[€%]/g, "").replace(",", "."));

    if (!isNaN(numA) && !isNaN(numB)) {
      return ascendente ? numA - numB : numB - numA;
    }
    return ascendente
      ? celdaA.localeCompare(celdaB, "es")
      : celdaB.localeCompare(celdaA, "es");
  });

  filas.forEach(f => tbody.appendChild(f));
}