import Credito from './credito.js';

let listCalendarios = [];

const form = document.querySelector('form');

// Cuando el html esta cargado
const cargarHistorialCronogramas = (paramStorageListCalendario) => {
  if (paramStorageListCalendario !== null) {
    const tbody = document.querySelector('.table-historial tbody');
    tbody.innerHTML = '';

    for (let index = 0; index < paramStorageListCalendario.length; index += 1) {
      const tr = document.createElement('tr');

      Object.entries(paramStorageListCalendario[index]).forEach(([key, value]) => {
        const td = document.createElement('td');
        td.innerText = value;
        // console.log(key);
        if (key === 'calendario') {
          td.innerText = 'ver';
          tr.appendChild(td);
        } else {
          tr.appendChild(td);
        }
      });
      tbody.appendChild(tr);
    }
  }
};

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

const generarCronograma = (paramPrestamo, paramPlazo, paramTea) => {
  const SEGURO_DESGRAVAMEN = 0.070; // => porcentaje
  const credito = new Credito(paramPrestamo, paramPlazo, paramTea, SEGURO_DESGRAVAMEN);
  let saldoCapital = Number(credito.prestamo);
  const calendario = [];
  let rowCalendario = {
    nroCuota: 0,
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

      rowCalendario = {
        nroCuota: cuota,
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

  cargarHistorialCronogramas(listCalendarios);
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

  generarCronograma(inputPrestamo.value, inputPlazo.value, inputTea.value);

  inputPrestamo.value = '';
  inputPlazo.value = '';
  inputTea.value = '';
}

form.addEventListener('submit', calcularCronograma);

window.addEventListener('load', () => {
  const storageListCalendario = localStorage.getItem('listCalendario');
  cargarHistorialCronogramas(JSON.parse(storageListCalendario));
});
