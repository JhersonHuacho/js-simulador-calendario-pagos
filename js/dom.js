import Credito from './credito.js';

let listCalendarios = [];

const form = document.querySelector('form');

// Proceso de generar calendario
const generarCalendarioHtml = (calendario) => {
  const tbody = document.querySelector('.table-cronograma tbody');
  tbody.innerHTML = '';
  for (let index = 0; index < calendario.length; index += 1) {
    const tr = document.createElement('tr');

    Object.entries(calendario[index]).forEach(([, value]) => {
      const td = document.createElement('td');
      td.innerText = value;
      tr.appendChild(td);
    });

    tbody.appendChild(tr);
  }
};

const generarCronograma = (paramCredito) => {
  const {
    prestamo: paramPrestamo,
    plazo: paramPlazo,
    tea: paramTea,
    fechaDesembolso: paramFechaDesembolso,
  } = paramCredito;
  const SEGURO_DESGRAVAMEN = 0.070; // => porcentaje
  const credito = new Credito(paramPrestamo, paramPlazo, paramTea, SEGURO_DESGRAVAMEN);
  let saldoCapital = Number(credito.prestamo);
  const calendario = [];
  // new Date() en javascript me resta un dia
  const fechaDesembolso = new Date(paramFechaDesembolso);
  fechaDesembolso.setMinutes(fechaDesembolso.getMinutes() + fechaDesembolso.getTimezoneOffset());
  // fin new Date() en javascript me resta un dia:
  let rowCalendario = {
    nroCuota: 0,
    fechaVencimiento: fechaDesembolso.toLocaleDateString(),
    capital: 0,
    interes: 0,
    cuota: 0,
    saldo: saldoCapital.toFixed(2),
  };

  for (let cuota = 0; cuota <= credito.plazo; cuota += 1) {
    if (cuota === 0) {
      calendario.push(rowCalendario);
    } else {
      const interesCuota = Number(credito.calculoInteresCuota(saldoCapital));
      const amortizacionCapitalMensual = credito.calculoCuotaFijaMensual() - interesCuota;

      saldoCapital -= amortizacionCapitalMensual;

      // Obtener fecha de vencimiento
      const fechaVencimiento = new Date(paramFechaDesembolso);
      const diaActual = fechaVencimiento.getDate();
      const diaTranscurrido = diaActual + (30 * cuota);
      fechaVencimiento.setDate(diaTranscurrido);
      // fin Obtener fecha de vencimiento

      rowCalendario = {
        nroCuota: cuota,
        fechaVencimiento: fechaVencimiento.toLocaleDateString(),
        capital: amortizacionCapitalMensual.toFixed(2),
        interes: interesCuota.toFixed(2),
        cuota: credito.calculoCuotaFijaMensual(),
        saldo: saldoCapital.toFixed(2),
      };

      calendario.push(rowCalendario);
    }
  }

  generarCalendarioHtml(calendario);

  const storageCalendrio = localStorage.getItem('listCalendario');

  if (storageCalendrio !== null) {
    listCalendarios = JSON.parse(storageCalendrio);
  }

  const newSingleCalendario = {
    id: listCalendarios.length + 1,
    prestamo: paramPrestamo,
    plazo: paramPlazo,
    tea: paramTea,
    calendario,
  };

  listCalendarios.push(newSingleCalendario);
  localStorage.setItem('listCalendario', JSON.stringify(listCalendarios));
};

function validarInput(paramInput, index) {
  let validar = true;
  const mensaje = document.querySelectorAll('.mensaje')[index];

  if (paramInput.value === '') {
    mensaje.classList.remove('none');
    mensaje.classList.add('block');
    validar = false;
  } else {
    mensaje.classList.remove('block');
    mensaje.classList.add('none');
  }

  return validar;
}

function calcularCronograma(event) {
  event.preventDefault();
  const inputPrestamo = document.querySelector('#prestamo');
  const inputPlazo = document.querySelector('#plazo');
  const inputTea = document.querySelector('#tea');
  // const inputMoneda = document.querySelector('#moneda');
  const inputFechaDesembolso = document.querySelector('#fechaDesembolso');

  let validar = true;

  if (validarInput(inputPrestamo, 0) === false) {
    validar = false;
  }

  if (validarInput(inputPlazo, 1) === false) {
    validar = false;
  }

  if (validarInput(inputTea, 2) === false) {
    validar = false;
  }

  if (validar === false) {
    return;
  }

  const credito = {
    prestamo: inputPrestamo.value,
    plazo: inputPlazo.value,
    tea: inputTea.value,
    fechaDesembolso: inputFechaDesembolso.value,
  };

  generarCronograma(credito);

  inputPrestamo.value = '';
  inputPlazo.value = '';
  inputTea.value = '';
  inputFechaDesembolso.value = '';
}

window.addEventListener('load', () => {
  form.addEventListener('submit', calcularCronograma);
});
