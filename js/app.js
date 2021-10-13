const PRESTAMO = prompt(">>> Ingrese el monto del préstamo"); // => numeric
const PLAZO = prompt(">>> Ingrese el plazo"); // => numeric
const TEA = 52.87; // => Porcentaje
const SEGURO_DESGRAVAMEN = 0.070; // => porcentaje

// Cálculo de la Tasa Efectiva Mensual - TEM
const calculoTasaEfectivaMensual = () => {  
  let tasaEfectivaMensual = ((Math.pow((1 + TEA/100), (30/360)))-1) * 100;
  return tasaEfectivaMensual.toFixed(2);
}

// Cálculo de la Cuota Fija Mensual - Para el cálculo de la Cuota Fija Mensual se utiliza la TEM
const calculoCuotaFijaMensual = () => {
  let tasaEfectivaMensual = Number(calculoTasaEfectivaMensual()); // => porcentaje
  tasaEfectivaMensual = tasaEfectivaMensual / 100;
  let cuotaFijaMensual = PRESTAMO * ( (tasaEfectivaMensual*(Math.pow(1+tasaEfectivaMensual,12))) / ((Math.pow(1+tasaEfectivaMensual, 12)) - 1) )
  return cuotaFijaMensual.toFixed(2);
}

// Cáculo del Interés de la cuota
const calculoInteresCuota = (saldoCapital) => {
  let tasaEfectivaMensual = Number(calculoTasaEfectivaMensual()) / 100;  
  let interes = saldoCapital * tasaEfectivaMensual;
  return interes.toFixed(2);
}

// Cálculo de la Amortización Mensual
const calculoAmortizacionMensual = (saldoCapital) => {
  let cuotaFijaMensual = Number(calculoCuotaFijaMensual());
  let interes = Number(calculoInteresCuota(saldoCapital));  
  let amortizacionMensual = cuotaFijaMensual - interes;
  return amortizacionMensual.toFixed(2);
}

let deseaContinuar = false;
let contador = 1;
let saldoCapital;

do {

  if (contador === 1) {
    
    let amortizacionCapitalPrimerMes = Number(calculoAmortizacionMensual(PRESTAMO));
    saldoCapital = PRESTAMO - amortizacionCapitalPrimerMes;
    alert(`
    La Tasa Efectiva Mensual (TEA) es: ${calculoTasaEfectivaMensual()} %
    La cuota fija a pagar mensual es de S/. ${calculoCuotaFijaMensual()}
    El capital a pagar de la primera cuota es de: S/. ${amortizacionCapitalPrimerMes}
    El pago de intereses del primer mes será de S/. ${calculoInteresCuota(PRESTAMO)}`);

    deseaContinuar = prompt("¿Desea continuar para ver los intereses de las siguientes cuotas?\n 0 => Para salir \n 1 => Para continuar.");
    deseaContinuar = Boolean(Number(deseaContinuar));
    contador++;
  } else {

    for (let cuota = 2; cuota <= PLAZO; cuota++) {
      let interesCuota = Number(calculoInteresCuota(saldoCapital));
      let amortizacionCapitalMensual = calculoCuotaFijaMensual() - interesCuota;
      
      alert(`
      El capital a pagar en la cuota ${cuota} es de: S/. ${amortizacionCapitalMensual.toFixed(2)}
      El pago de intereses de la cuota ${cuota} será de S/. ${calculoInteresCuota(saldoCapital)}
      La cuota fija a pagar de la cuota ${cuota} es de S/. ${calculoCuotaFijaMensual()}`);
      
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




