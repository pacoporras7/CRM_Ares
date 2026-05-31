// ============================================================
// app.js — Logica del panel web CRM XTART
// Modulo: Lenguajes de Marcas (LM)
// Descripcion: hace fetch a la API Flask, renderiza las tablas
//              y gestiona los filtros y la ordenacion por columnas
// ============================================================


// URL base de la API Flask.
// Todas las peticiones se construyen concatenando esta constante con la ruta
const API = "http://127.0.0.1:5000";


// ============================================================
// badge(estado)
// Convierte un texto de estado en una etiqueta HTML coloreada.
// Ejemplo: badge("activo") devuelve <span class="badge badge-activo">activo</span>
// ============================================================
function badge(estado) {

  // Si el valor viene vacio, null o undefined devolvemos un guion
  if (!estado) return "-";

  // Normalizamos el texto: todo en minusculas y sin espacios
  // "en seguimiento" → "enseguimiento" para que coincida con la clave del objeto
  const e = estado.toLowerCase().replace(/\s+/g, "");

  // Tabla de conversion: clave normalizada → clase CSS del badge
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

  // Buscamos la clase. Si el estado no existe en la tabla usamos badge-inactivo
  const cls = clases[e] || "badge badge-inactivo";

  // Devolvemos el HTML completo del badge con el texto original del estado
  return `<span class="${cls}">${estado}</span>`;
}


// ============================================================
// chip(texto)
// Devuelve una etiqueta pequena de color cian para codigos y zonas
// Ejemplo: chip("CLI001") → <span class="chip">CLI001</span>
// ============================================================
function chip(texto) {
  if (!texto) return "-"; // Si no hay texto devolvemos guion
  return `<span class="chip">${texto}</span>`;
}


// ============================================================
// cargarDatos(endpoint, renderFn)
// Funcion asincrona generica que hace fetch a la API y renderiza.
// Es asincrona (async/await) porque las peticiones de red tardan
// y no podemos bloquear el navegador esperando la respuesta.
// Parametros:
//   endpoint — ruta relativa, ej: "/comerciales"
//   renderFn — funcion que recibe los datos y pinta la tabla
// ============================================================
async function cargarDatos(endpoint, renderFn) {
  try {
    // fetch() hace una peticion HTTP GET a la URL completa
    // await pausa esta funcion hasta que llega la respuesta (sin bloquear el navegador)
    const respuesta = await fetch(API + endpoint);

    // Si el servidor responde con un codigo de error (4xx, 5xx) lanzamos excepcion
    if (!respuesta.ok) throw new Error("Error HTTP: " + respuesta.status);

    // .json() convierte el texto JSON de la respuesta en un objeto/array JavaScript
    // await pausa de nuevo hasta que termina de parsear
    const datos = await respuesta.json();

    // Llamamos a la funcion especifica que pintara esta tabla
    renderFn(datos);

  } catch (error) {
    // Si la API no esta arrancada o hay error de red llegamos aqui
    // Lo mostramos en la consola del navegador (F12 → Console)
    console.error("Error cargando " + endpoint + ":", error);
  }
}


// ============================================================
// renderComerciales(datos)
// Recibe el array de comerciales que devuelve la API y
// genera el HTML de las filas de la tabla #tabla-comerciales
// ============================================================
function renderComerciales(datos) {

  // Obtenemos el elemento <tbody> donde insertaremos las filas
  const tbody = document.getElementById("body-comerciales");

  // Si el array viene vacio mostramos un mensaje en la tabla
  if (datos.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:40px;color:#475569;">Sin datos disponibles</td></tr>';
    return; // Salimos de la funcion, no hay nada mas que hacer
  }

  // Actualizamos el numero del stat card en el hero con la cantidad real
  document.getElementById("stat-comerciales").textContent = datos.length;

  // Generamos una <tr> por cada comercial usando .map() y template literals
  // .map() transforma cada objeto del array en una cadena HTML
  // .join("") une todas las cadenas en una sola sin separador
  tbody.innerHTML = datos.map(c => `
    <tr>
      <td style="color:#475569;">${c.id}</td>
      <td style="color:#f1f5f9; font-weight:600;">${c.nombre}</td>
      <td>${c.apellidos}</td>
      <td class="email">${c.email}</td>
      <td>${c.telefono || "-"}</td>
      <td>${chip(c.zona)}</td>
      <td style="color:#475569;">${c.fecha_alta || "-"}</td>
    </tr>
  `).join("");
  // c.telefono || "-" → si telefono es null/undefined muestra "-"
}


// ============================================================
// renderPotenciales(datos)
// Renderiza la tabla de clientes potenciales con badge de estado
// ============================================================
function renderPotenciales(datos) {

  const tbody = document.getElementById("body-potenciales");

  if (datos.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;padding:40px;color:#475569;">Sin datos disponibles</td></tr>';
    return;
  }

  // Actualizamos el contador del hero
  document.getElementById("stat-potenciales").textContent = datos.length;

  tbody.innerHTML = datos.map(p => `
    <tr>
      <td style="color:#475569;">${p.id}</td>
      <td style="color:#f1f5f9; font-weight:600;">${p.nombre}</td>
      <td>${p.empresa || "-"}</td>
      <td class="email">${p.email || "-"}</td>
      <td>${p.fuente || "-"}</td>
      <td>${badge(p.estado)}</td>
      <td style="color:#475569;">${p.fecha_contacto || "-"}</td>
      <td>${p.nombre_comercial || "-"}</td>
    </tr>
  `).join("");
  // badge(p.estado) devuelve el HTML del badge con el color del estado
}


// ============================================================
// renderClientes(datos)
// Renderiza la tabla de clientes formales
// ============================================================
function renderClientes(datos) {

  const tbody = document.getElementById("body-clientes");

  if (datos.length === 0) {
    tbody.innerHTML = '<tr><td colspan="9" style="text-align:center;padding:40px;color:#475569;">Sin datos disponibles</td></tr>';
    return;
  }

  // Actualizamos el contador del hero
  document.getElementById("stat-clientes").textContent = datos.length;

  tbody.innerHTML = datos.map(c => `
    <tr>
      <td>${chip(c.codigo)}</td>
      <td style="color:#f1f5f9; font-weight:600;">${c.razon_social}</td>
      <td style="color:#475569;">${c.nif || "-"}</td>
      <td>${c.contacto || "-"}</td>
      <td>${c.telefono || "-"}</td>
      <td class="email">${c.email || "-"}</td>
      <td>${c.condiciones_pago || "-"}</td>
      <td style="font-weight:700;">${c.descuento}%</td>
      <td>${badge(c.estado)}</td>
    </tr>
  `).join("");
}


// ============================================================
// renderPedidos(datos)
// Renderiza la tabla de pedidos con importes formateados a 2 decimales
// ============================================================
function renderPedidos(datos) {

  const tbody = document.getElementById("body-pedidos");

  if (datos.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;padding:40px;color:#475569;">Sin datos disponibles</td></tr>';
    return;
  }

  // Actualizamos el contador del hero
  document.getElementById("stat-pedidos").textContent = datos.length;

  tbody.innerHTML = datos.map(p => `
    <tr>
      <td style="color:#475569;">${p.id}</td>
      <td style="color:#475569;">${p.fecha}</td>
      <td style="color:#f1f5f9; font-weight:600;">${p.nombre_cliente || "-"}</td>
      <td>${p.nombre_comercial || "-"}</td>
      <td>${badge(p.estado)}</td>
      <td>${parseFloat(p.base_imponible).toFixed(2)} €</td>
      <td style="color:#475569;">${p.iva}%</td>
      <td class="amount">${parseFloat(p.total).toFixed(2)} €</td>
    </tr>
  `).join("");
  // parseFloat() convierte el string a numero
  // .toFixed(2) formatea con exactamente 2 decimales: 1452 → "1452.00"
}


// ============================================================
// renderFacturas(datos)
// Renderiza la tabla de facturas con importes y badge de estado
// ============================================================
function renderFacturas(datos) {

  const tbody = document.getElementById("body-facturas");

  if (datos.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;padding:40px;color:#475569;">Sin datos disponibles</td></tr>';
    return;
  }

  // Actualizamos el contador del hero
  document.getElementById("stat-facturas").textContent = datos.length;

  tbody.innerHTML = datos.map(f => `
    <tr>
      <td style="color:#f1f5f9; font-weight:700;">${f.numero}</td>
      <td>${f.nombre_cliente || "-"}</td>
      <td style="color:#475569;">${f.fecha_emision}</td>
      <td style="color:#475569;">${f.fecha_vencimiento}</td>
      <td>${parseFloat(f.base_imponible).toFixed(2)} €</td>
      <td style="color:#475569;">${f.iva}%</td>
      <td class="amount">${parseFloat(f.total).toFixed(2)} €</td>
      <td>${badge(f.estado)}</td>
    </tr>
  `).join("");
}


// ============================================================
// DOMContentLoaded
// Este evento se dispara cuando el navegador ha terminado de
// leer y construir todo el HTML de la pagina.
// Sin este evento, el JavaScript podria intentar acceder a
// elementos del DOM que todavia no existen y daria error.
// ============================================================
document.addEventListener("DOMContentLoaded", () => {

  // Lanzamos las 5 peticiones a la API en paralelo.
  // Como son asincronas, no se esperan entre si, todas arrancan a la vez
  cargarDatos("/comerciales",          renderComerciales);
  cargarDatos("/clientes-potenciales", renderPotenciales);
  cargarDatos("/clientes",             renderClientes);
  cargarDatos("/pedidos",              renderPedidos);
  cargarDatos("/facturas",             renderFacturas);
});


// ============================================================
// filtrarTabla(idTabla, texto)
// Filtra las filas visibles de una tabla en tiempo real.
// Se llama desde el atributo onkeyup del input de busqueda.
// Parametros:
//   idTabla — id del <table> que queremos filtrar
//   texto   — lo que ha escrito el usuario en el buscador
// ============================================================
function filtrarTabla(idTabla, texto) {

  // Obtenemos la referencia al elemento <table>
  const tabla = document.getElementById(idTabla);

  // getElementsByTagName devuelve todas las filas <tr> de la tabla
  const filas = tabla.getElementsByTagName("tr");

  // Pasamos el texto a minusculas para buscar sin importar mayusculas
  const textoBusqueda = texto.toLowerCase();

  // Recorremos las filas empezando por la 1 (la 0 es la cabecera <thead>)
  for (let i = 1; i < filas.length; i++) {

    // Obtenemos todas las celdas <td> de esta fila
    const celdas = filas[i].getElementsByTagName("td");
    let encontrado = false;

    // Buscamos el texto en cada celda de la fila
    for (let j = 0; j < celdas.length; j++) {

      // textContent extrae el texto visible de la celda ignorando etiquetas HTML
      if (celdas[j].textContent.toLowerCase().includes(textoBusqueda)) {
        encontrado = true;
        break; // En cuanto encontramos una coincidencia dejamos de buscar en esta fila
      }
    }

    // Si encontrado es true mostramos la fila (display vacio = comportamiento normal)
    // Si es false la ocultamos con display:none
    filas[i].style.display = encontrado ? "" : "none";
  }
}


// ============================================================
// estadoOrden
// Objeto que actua como memoria de la ordenacion actual.
// Guarda si cada columna de cada tabla esta en orden
// ascendente (true) o descendente (false).
// Clave: "idTabla_numColumna", valor: true o false
// ============================================================
const estadoOrden = {};


// ============================================================
// ordenarTabla(idTabla, columna)
// Ordena las filas de una tabla al hacer clic en una cabecera.
// Alterna entre ascendente y descendente en cada clic.
// Detecta automaticamente si los datos son numericos o texto.
// Parametros:
//   idTabla — id del <table>
//   columna — indice numerico de la columna (0 = primera columna)
// ============================================================
function ordenarTabla(idTabla, columna) {

  // Obtenemos la tabla y su elemento <tbody>
  const tabla = document.getElementById(idTabla);
  const tbody = tabla.querySelector("tbody");

  // querySelectorAll devuelve un NodeList, lo convertimos a Array
  // para poder usar el metodo .sort() de los arrays
  const filas = Array.from(tbody.querySelectorAll("tr"));

  // Construimos la clave unica para recordar el estado de esta columna
  const clave = idTabla + "_" + columna;

  // Si antes era ascendente ahora sera descendente y viceversa
  // El operador ! invierte el valor booleano
  const ascendente = !estadoOrden[clave];

  // Guardamos el nuevo estado para el proximo clic
  estadoOrden[clave] = ascendente;

  // .sort() ordena el array in-place comparando pares de filas
  filas.sort((a, b) => {

    // Extraemos el texto de la celda en la columna indicada
    // ?. es optional chaining: si no existe la celda devuelve undefined en vez de error
    const celdaA = a.querySelectorAll("td")[columna]?.textContent.trim() || "";
    const celdaB = b.querySelectorAll("td")[columna]?.textContent.trim() || "";

    // Intentamos convertir a numero quitando los simbolos € y % y cambiando , por .
    const numA = parseFloat(celdaA.replace(/[€%]/g, "").replace(",", "."));
    const numB = parseFloat(celdaB.replace(/[€%]/g, "").replace(",", "."));

    // isNaN devuelve true si el valor NO es un numero valido
    // Si ambos son numeros validos ordenamos numericamente (1, 2, 10 en vez de 1, 10, 2)
    if (!isNaN(numA) && !isNaN(numB)) {
      return ascendente ? numA - numB : numB - numA;
      // Si numA - numB es negativo, a va antes que b (orden ascendente)
    }

    // Si no son numeros usamos localeCompare para ordenar texto correctamente en español
    // localeCompare respeta la ñ, los acentos y las mayusculas del español
    return ascendente
      ? celdaA.localeCompare(celdaB, "es")
      : celdaB.localeCompare(celdaA, "es");
  });

  // Reinsertamos las filas en el tbody en el nuevo orden.
  // appendChild mueve el nodo si ya existe en el DOM, por eso reordena la tabla
  filas.forEach(f => tbody.appendChild(f));
}