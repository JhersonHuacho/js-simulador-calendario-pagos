import { Credito } from './credito.js';

const PRESTAMO = prompt(">>> Ingrese el monto del préstamo"); // => numeric
const PLAZO = prompt(">>> Ingrese el plazo"); // => numeric
const TEA = 52.87; // => Porcentaje
const SEGURO_DESGRAVAMEN = 0.070; // => porcentaje

let credito = new Credito(PRESTAMO, PLAZO, TEA, SEGURO_DESGRAVAMEN);

let deseaContinuar = false;
let contador = 1;
let saldoCapital;

do {

  if (contador === 1) {

    let amortizacionCapitalPrimerMes = Number(credito.calculoAmortizacionMensual(credito.prestamo));
    saldoCapital = credito.prestamo - amortizacionCapitalPrimerMes;
    alert(`
    La Tasa Efectiva Mensual (TEA) es: ${credito.calculoTasaEfectivaMensual()} %
    La cuota fija a pagar mensual es de S/. ${credito.calculoCuotaFijaMensual()}
    El capital a pagar de la primera cuota es de: S/. ${amortizacionCapitalPrimerMes}
    El pago de intereses del primer mes será de S/. ${credito.calculoInteresCuota(credito.prestamo)}`);

    deseaContinuar = prompt("¿Desea continuar para ver los intereses de las siguientes cuotas?\n 0 => Para salir \n 1 => Para continuar.");
    deseaContinuar = Boolean(Number(deseaContinuar));
    contador++;
  } else {

    for (let cuota = 2; cuota <= credito.plazo; cuota++) {
      let interesCuota = Number(credito.calculoInteresCuota(saldoCapital));
      let amortizacionCapitalMensual = credito.calculoCuotaFijaMensual() - interesCuota;

      alert(`
      El capital a pagar en la cuota ${cuota} es de: S/. ${amortizacionCapitalMensual.toFixed(2)}
      El pago de intereses de la cuota ${cuota} será de S/. ${credito.calculoInteresCuota(saldoCapital)}
      La cuota fija a pagar de la cuota ${cuota} es de S/. ${credito.calculoCuotaFijaMensual()}`);

      saldoCapital = saldoCapital - amortizacionCapitalMensual;
      deseaContinuar = prompt("¿Desea continuar para ver el interes y pago de capital de la siguiente cuota?\n 0 => Para salir \n 1 => Para continuar.");
      deseaContinuar = Boolean(Number(deseaContinuar));
      if (!deseaContinuar) {
        break;
      }
    }

  }

  if (!deseaContinuar) {
    alert("Gracias por usar el simulador de calendario de crédito");
  }

} while (deseaContinuar);




