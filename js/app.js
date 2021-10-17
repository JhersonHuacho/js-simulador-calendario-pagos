import { Credito } from './credito.js';

let deseaContinuar = false;

const getSpace = (headerTableKey, creditoKey) => {
  return "  ".repeat((headerTableKey.length - creditoKey.toString().length) < 0
    ? creditoKey.toString().length - headerTableKey.length
    : headerTableKey.length - creditoKey.toString().length);
}

const generarCalendario = (headerTable, calendario) => {
    const headTable = `| ${headerTable.nroCuota} | ${headerTable.capital} | ${headerTable.interes} | ${headerTable.cuota} | ${headerTable.saldo} |`;

    let calendarioTemplate = calendario.map(rowCuota => {
    let { nroCuota, capital, interes, cuota, saldo } = rowCuota;
    let espacioNroCuota = nroCuota.toString().length === 1 ? new Array(headerTable.nroCuota.length - 1).join("  ") : new Array(headerTable.nroCuota.length - 2).join("  ");
    let espacioCapital = getSpace(headerTable.capital, capital);
    let espacioInteres = getSpace(headerTable.interes, interes);
    let espacioCuota = getSpace(headerTable.cuota, cuota);
    let espacioSaldo = getSpace(headerTable.saldo, saldo);
    const row = `| ${nroCuota}${espacioNroCuota} | ${capital}${espacioCapital} | ${interes}${espacioInteres} | ${cuota}${espacioCuota} | ${saldo}${espacioSaldo}`;
    return row;
  });

  let bodyTable = "";

  calendarioTemplate.forEach(row => {
    bodyTable += `${row} \n`;
  });

  const tableContent = `${headTable} \n${bodyTable}`;

  return tableContent;
}

do {

  const PRESTAMO = prompt(">>> Ingrese el monto del préstamo"); // => numeric
  const PLAZO = prompt(">>> Ingrese el plazo"); // => numeric
  const TEA = 52.87; // => Porcentaje
  const SEGURO_DESGRAVAMEN = 0.070; // => porcentaje

  let credito = new Credito(PRESTAMO, PLAZO, TEA, SEGURO_DESGRAVAMEN);
  let saldoCapital = Number(credito.prestamo);
  let calendario = [];
  const headerTable = {
    nroCuota: "Nº de cuota",
    capital: "CAPITAL",
    interes: "INTERES",
    cuota: "CUOTA",
    saldo: "SALDO"
  }

  let rowCalendario = {
    nroCuota: 0,
    capital: 0,
    interes: 0,
    cuota: 0,
    saldo: saldoCapital.toFixed(2)
  };

  for (let cuota = 0; cuota <= credito.plazo; cuota++) {
    if (cuota === 0) {
      calendario.push(rowCalendario);
      continue;
    }
    let interesCuota = Number(credito.calculoInteresCuota(saldoCapital));
    let amortizacionCapitalMensual = credito.calculoCuotaFijaMensual() - interesCuota;

    saldoCapital = saldoCapital - amortizacionCapitalMensual;

    rowCalendario = {
      nroCuota: cuota,
      capital: amortizacionCapitalMensual.toFixed(2),
      interes: interesCuota.toFixed(2),
      cuota: credito.calculoCuotaFijaMensual(),
      saldo: saldoCapital.toFixed(2)
    }

    calendario.push(rowCalendario);
  }

  console.log(headerTable.nroCuota.length);

  let tableContent = generarCalendario(headerTable, calendario);
  alert(`>> La Tasa Efectiva Mensual (TEA) es: ${credito.calculoTasaEfectivaMensual()} %\n>> Cronograma de Pagos:  \n\n${tableContent}`);

  const tipoOrdenar = prompt("¿Selecciona uno de los tipos de ordenamiento de las cuotas?\n 1=> Ordenar ascendentemente \n 2=> Ordenar descendenmente");

  const calendarioOrdenado = calendario.sort((a, b) => {
    if (a.nroCuota > b.nroCuota) {
      return Number(tipoOrdenar) === 1 ? 1 : -1;
    }
    if (a.nroCuota < b.nroCuota) {
      return Number(tipoOrdenar) === 1 ? -1 : 1;
    }
    return 0
  });

  tableContent = generarCalendario(headerTable, calendarioOrdenado);
  alert(`>> La Tasa Efectiva Mensual (TEA) es: ${credito.calculoTasaEfectivaMensual()} %\n>> Cronograma de Pagos:  \n\n${tableContent}`);

  deseaContinuar = prompt("¿Desea continuar para ver otro cronograma?\n 0 => Para salir \n 1 => Para continuar.");
  deseaContinuar = Boolean(Number(deseaContinuar));

  if (!deseaContinuar) {
    alert("Gracias por usar el simulador de calendario de crédito");
  }

} while (deseaContinuar);