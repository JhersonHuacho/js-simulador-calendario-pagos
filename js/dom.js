import Credito from './credito.js';

const form = document.querySelector('form');

const generarCalendarioHtml = (calendario) => {
  const tbody = document.querySelector('tbody');

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
};

function calcularCronograma(event) {
  event.preventDefault();
  const inputPrestamo = document.querySelector('#prestamo');
  const inputPlazo = document.querySelector('#plazo');
  const inputTea = document.querySelector('#tea');

  generarCronograma(inputPrestamo.value, inputPlazo.value, inputTea.value);
}

form.addEventListener('submit', calcularCronograma);
