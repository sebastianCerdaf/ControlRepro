import { trabajadores } from './BDTrabajadores.js';

// Función para formatear RUT automáticamente mientras se escribe
function formatearRUT(rut) {
  rut = rut.replace(/\D/g, ''); // Solo números
  let cuerpo = rut.slice(0, -1);
  let dv = rut.slice(-1);

  cuerpo = cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  return cuerpo + "-" + dv;
}

// Validación de formato de RUT chileno simple
function validarRUT(rut) {
  return /^\d{1,2}\.\d{3}\.\d{3}-[\dkK]$/.test(rut);
}

// Evento en el input del RUT para formatear
const rutInput = document.getElementById('rut');
rutInput.addEventListener('input', () => {
  const cursor = rutInput.selectionStart;
  rutInput.value = formatearRUT(rutInput.value);
  rutInput.setSelectionRange(cursor, cursor);
});

// Validación del formulario
document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const rut = rutInput.value.trim();
  const pin = document.getElementById('pin').value.trim();
  const mensajeError = document.getElementById('mensajeError');

  if (!validarRUT(rut)) {
    mensajeError.textContent = '❌ RUT no válido';
    return;
  }

  const trabajador = trabajadores.find(t => t.rut === rut && t.pin === pin);

  if (trabajador) {
    localStorage.setItem('usuarioActual', JSON.stringify(trabajador));
    window.location.href = 'index.html';
  } else {
    mensajeError.textContent = '⚠️ RUT o PIN incorrectos';
  }
});
