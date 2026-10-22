// ===== Facturador 2.0 · Semana 2 =====
// Estructuras de control (if, switch, for) y funciones

// 1. Constantes
const IVA = 0.15; // IVA vigente en Ecuador: 15 %

// 2. Elementos del DOM
const inputProducto = document.querySelector("#producto");
const inputPrecio = document.querySelector("#precio");
const inputCantidad = document.querySelector("#cantidad");
const selectEnvio = document.querySelector("#envio");
const selectCuotas = document.querySelector("#cuotas");
const btnCalcular = document.querySelector("#btnCalcular");
const resultado = document.querySelector("#resultado");

// 3. Funciones: cada una hace UNA sola tarea

// Función flecha: da formato de dinero a un número
const formatoDinero = (valor) => `$${valor.toFixed(2)}`;

// if: devuelve un mensaje de error, o "" si todo está bien
function validarDatos(producto, precio, cantidad) {
  if (producto === "") {
    return "Escribe el nombre del producto.";
  }
  if (isNaN(precio) || precio <= 0) {
    return "El precio debe ser mayor que 0.";
  }
  if (!Number.isInteger(cantidad) || cantidad < 1) {
    return "La cantidad debe ser un número entero desde 1.";
  }
  return "";
}

// if / else if / else: porcentaje de descuento según la cantidad
function porcentajeDescuento(cantidad) {
  if (cantidad >= 10) {
    return 0.10; // 10 % desde 10 unidades
  } else if (cantidad >= 5) {
    return 0.05; // 5 % desde 5 unidades
  } else {
    return 0;    // sin descuento
  }
}

// switch: costo de envío según la opción elegida
function costoEnvio(tipo) {
  switch (tipo) {
    case "retiro":
      return 0;
    case "cuenca":
      return 2.5;
    case "nacional":
      return 6;
    default:
      return 0;
  }
}

// return: calcula el IVA de una base imponible
function calcularIVA(base) {
  return base * IVA;
}

// for: genera las filas de la tabla de cuotas
function generarTablaCuotas(total, numeroCuotas) {
  const valorCuota = total / numeroCuotas;
  let filas = "";
  for (let i = 1; i <= numeroCuotas; i++) {
    filas += `<tr><td>Cuota ${i}</td><td>${formatoDinero(valorCuota)}</td></tr>`;
  }
  return `<table><tr><th>Cuota</th><th>Valor</th></tr>${filas}</table>`;
}

// 4. Función principal: une todas las demás
function calcularFactura() {
  // ENTRADA
  const producto = inputProducto.value.trim();
  const precio = Number(inputPrecio.value);
  const cantidad = Number(inputCantidad.value);
  const tipoEnvio = selectEnvio.value;
  const numeroCuotas = Number(selectCuotas.value);

  // VALIDACIÓN
  const error = validarDatos(producto, precio, cantidad);
  if (error !== "") {
    resultado.innerHTML = `<p class="error">⚠️ ${error}</p>`;
    return;
  }

  // PROCESO
  const subtotal = precio * cantidad;
  const descuento = subtotal * porcentajeDescuento(cantidad);
  const envio = costoEnvio(tipoEnvio);
  const baseImponible = subtotal - descuento + envio;
  const valorIva = calcularIVA(baseImponible);
  const total = baseImponible + valorIva;

  // Operador ternario: texto según haya o no descuento
  const textoDescuento = descuento > 0 ? `- ${formatoDinero(descuento)}` : "No aplica";

  // SALIDA
  let html = `
    <p><strong>${producto}</strong> × ${cantidad}</p>
    <div class="linea"><span>Subtotal</span><span>${formatoDinero(subtotal)}</span></div>
    <div class="linea descuento"><span>Descuento</span><span>${textoDescuento}</span></div>
    <div class="linea"><span>Envío</span><span>${formatoDinero(envio)}</span></div>
    <div class="linea"><span>IVA (15 %)</span><span>${formatoDinero(valorIva)}</span></div>
    <div class="linea total"><span>Total</span><span>${formatoDinero(total)}</span></div>
  `;

  if (numeroCuotas > 1) {
    html += generarTablaCuotas(total, numeroCuotas);
  }

  resultado.innerHTML = html;
}

// 5. Evento
btnCalcular.addEventListener("click", calcularFactura);