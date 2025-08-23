import { trabajadores } from '../../data/trabajadores.repository.js';

function formatearRUT(rut) {
  rut = (rut || '').replace(/[^\dkK]/g, '');
  if (rut.length < 2) return rut;

  let cuerpo = rut.slice(0, -1).slice(0, 8);
  let dv = rut.slice(-1).toUpperCase();

  let cuerpoFormateado = '';
  while (cuerpo.length > 3) {
    cuerpoFormateado = '.' + cuerpo.slice(-3) + cuerpoFormateado;
    cuerpo = cuerpo.slice(0, -3);
  }
  cuerpoFormateado = cuerpo + cuerpoFormateado;
  return `${cuerpoFormateado}-${dv}`;
}

function validarRUT(rut) {
  return /^\d{2}\.\d{3}\.\d{3}-[\dkK]$/.test(rut);
}
const rutInput = document.getElementById('rut');

rutInput.addEventListener('input', () => {
  rutInput.value = limitar12(formatearRUT(rutInput.value));
  rutInput.selectionStart = rutInput.selectionEnd = rutInput.value.length;
});

rutInput.addEventListener('blur', () => {
  rutInput.value = limitar12(formatearRUT(rutInput.value));
});

function limitar12(v) {
  return (v || '').slice(0, 12);
}

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
    window.location.href = 'MainView.html';
  } else {
    mensajeError.textContent = '⚠️ RUT o PIN incorrectos';
  }
});
