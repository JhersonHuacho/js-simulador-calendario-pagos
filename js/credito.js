class Credito {
  constructor(prestamo, plazo, tea, seguroDesgravamen) {
    this.prestamo = prestamo;
    this.plazo = plazo;
    this.tea = tea; // => Porcentaje
    this.seguro_desgravamen = seguroDesgravamen; // => Porcentaje
  }

  // Cálculo de la Tasa Efectiva Mensual - TEM
  calculoTasaEfectivaMensual() {
    // const tasaEfectivaMensual = (
    //   (Math.pow((1 + this.tea / 100), (30 / 360))) - 1
    // ) * 100;
    /**
     * ES2016 feature: exponentiation operator (**)
     */
    const tasaEfectivaMensual = (
      ((1 + this.tea / 100) ** (30 / 360)) - 1
    ) * 100;
    return tasaEfectivaMensual.toFixed(2);
  }

  // Cálculo de la Cuota Fija Mensual - Para el cálculo de la Cuota Fija Mensual se utiliza la TEM
  calculoCuotaFijaMensual() {
    const tasaEfectivaMensual = Number(this.calculoTasaEfectivaMensual()) / 100; // => porcentaje
    const cuotaFijaMensual = this.prestamo * (
      (
        tasaEfectivaMensual * ((1 + tasaEfectivaMensual) ** (this.plazo))
      ) / (
        ((1 + tasaEfectivaMensual) ** (this.plazo)) - 1
      )
    );
    return cuotaFijaMensual.toFixed(2);
  }

  // Cáculo del Interés de la cuota
  calculoInteresCuota(saldoCapital) {
    const tasaEfectivaMensual = Number(this.calculoTasaEfectivaMensual()) / 100;
    const interes = saldoCapital * tasaEfectivaMensual;
    return interes;
  }

  // Cálculo de la Amortización Mensual
  calculoAmortizacionMensual(saldoCapital) {
    const cuotaFijaMensual = Number(this.calculoCuotaFijaMensual());
    const interes = Number(this.calculoInteresCuota(saldoCapital));
    const amortizacionMensual = cuotaFijaMensual - interes;
    return amortizacionMensual.toFixed(2);
  }
}

export default Credito;
