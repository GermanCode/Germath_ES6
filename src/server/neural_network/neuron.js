const uid = require('./uid.js');
const core = require('nerdamer/nerdamer.core');
const nerdamer = require('nerdamer/all');
var t = '';
var fx1 = 0;
var fy1 = 0;

class Neuron {
  constructor() {
    this.inputConnections = [];
    this.outputConnections = [];
    this.bias = 0;
    // delta is used to store a percentage of change in the weight
    this.delta = 0;
    this.output = [];
    this.error = 0;
    this.id = uid();
    this.valoresParcialesO = [];
    this.resultadoParcialO = 0;
    this.valoresParciales = [];
    this.puntosParciales = [];
    this.resultadoGlobal = [];
    this.derivX = 0;
    this.derivY = 0;
    this.letra = '';
  }

  toJSON() {
    return {
      id: this.id,
      delta: this.delta,
      output: this.output,
      error: this.error,
      bias: this.bias,
      inputConnections: this.inputConnections.map(i => i.toJSON()),
      outputConnections: this.outputConnections.map(i => i.toJSON()),
      valoresParciales: this.valoresParciales,
      resultadoGlobal: this.resultadoGlobal,
      letra: this.letra
    }
  }

  getRandomBias() {
    const min = -1;
    const max = 1
    return Math.floor(Math.random() * (+max - +min)) + min;
  }

  addInputConnection(connection) {
    this.inputConnections.push(connection)
  }

  addOutputConnection(connection) {
    this.outputConnections.push(connection)
  }

  setBias(val) {
    this.bias = val
  }

  cleanOutput() {
    this.output = [];
  }

  cleanValoresParciales(val) {
    if (val === 0) {
      this.output = [];
      this.output = this.valoresParciales;
      console.log('Valores parciales para hideen: ', this.valoresParciales);
      this.valoresParciales = [];
    } else {
      this.output = [];
      this.output = this.valoresParciales;
      console.log('Valores parciales para output: ', this.valoresParciales[0]);
      this.valoresParcialesO.push(this.valoresParciales[0]);
      this.valoresParciales = [];

    }

  }

  cleanPuntosParciales(val) {
    if (val === 0) {
      this.output = [];
      this.output = this.puntosParciales;
      this.puntosParciales = []
    }

  }

  setOutput(val) {
    this.output.push(val);
    this.valoresParciales.push(val);
  }

  setDelta(val) {
    this.delta = val
  }

  setLetra(val) {
    this.letra = val
  }

  evaluador(ecc_x, ecc_y, vparciales) {
    //Evaluamos la derivada parcial de x.
    fx1 = ecc_x.evaluate({ x: vparciales[0] });
    fx1 = fx1.evaluate({ y: vparciales[1] });
    console.log('fx1: ', fx1.text());
    this.puntosParciales.push(fx1.text());

    //Evaluamos la derivada parcial de y.
    fy1 = ecc_y.evaluate({ y: vparciales[1] });
    fy1 = fy1.evaluate({ x: vparciales[0] });
    console.log('fy1: ', fy1.text());
    this.puntosParciales.push(fy1.text());
  }

  getT(n) {
    let arrp = [];
    if (n == 'a') {
      //Multiplicamos por t.
      var fx1_t = fx1.multiply(t);
      var fy1_t = fy1.multiply(t);

      //Agregamos el vector inicial.
      fx1_t = fx1_t.add(this.valoresParciales[0]);
      fy1_t = fy1_t.add(this.valoresParciales[1]);

      arrp = this.valoresParciales;
      console.log(n, arrp);
    } else {

      //Multiplicamos por t.
      var fx1_t = fx1.multiply(t);
      var fy1_t = fy1.multiply(t);

      arrp = this.valoresParciales[0];

      //Agregamos el vector inicial.
      fx1_t = fx1_t.add(arrp[0]);
      fy1_t = fy1_t.add(arrp[1]);

     // console.log(n, arrp);
    }

    var e = core('f(' + fx1_t + ' , ' + fy1_t + ')').toString();
    //console.log('esto es e2', e);

    //Derivamos con respecto a t
    var derivT = core.diff(e, 't');
    //console.log('esto es dT', derivT.text());
    var sol = core.solve(derivT, 't').toString();
    //console.log('este es el valor de sol ', sol);
    var resultSol = sol.replace(/[[\]]/g, '');
    //console.log(resultSol)
    var rt = core('simplify(' + resultSol + ')');
    //console.log('rt', rt.text());

    //Multiplicamos el valor de t por la derivada obtenida
    var x_i = core(arrp[0]);
    var y_i = core(arrp[1]);

    //console.log('x_i', x_i.text())

    x_i = x_i.add(fx1.multiply(rt));
    y_i = y_i.add(fy1.multiply(rt));

    var x_iR = '' + x_i;
    var y_iR = '' + y_i;

    //Reemplazamos los valores simbolicos
    var resultX = x_iR.replace(/[[\]]/g, '');
    var rx = nerdamer('simplify(' + resultX + ')');

    var resultY = y_iR.replace(/[[\]]/g, '');
    var ry = nerdamer('simplify(' + resultY + ')');

    //Asignacion de variables.
    x_i = rx;
    y_i = ry;

    arrp = [];
    arrp.push(parseFloat(x_i.text()));
    arrp.push(parseFloat(y_i.text()));
    this.cleanPuntosParciales(0);
    console.log('aqui van los nuevos puntos parciales')
    this.evaluador(this.derivX, this.derivY, arrp)

    this.valoresParciales = [];
    this.valoresParciales.push(parseFloat(x_i.text()));
    this.valoresParciales.push(parseFloat(y_i.text()));
    //Se calcula el valor final de la funcion maximizada.
  var valorfinal = core('f('+x_i+','+y_i+')');
  //this.resultadoGlobal = parseFloat(valorfinal.text());
  console.log('VAAAAAALOR FINAL', valorfinal.text());

  }

  getResultado(f, l, n) {
    //Seteamos la Funcion Original y el Arreglo de Variables
    core.setFunction('f', l, f);
    //Hacemos uso de la biblioteca Nerdamer para las derivadas paraciales
    this.derivX = core.diff(f, l[0]);
    this.derivY = 0;
    //Verificamos si es multivariada la funcion.
    if (f.indexOf('y') !== null) {
      this.derivY = core.diff(f, l[1]);
    } else {
      this.derivY = 0;
    }
    //Visualizamos por consola las derivadas
    //console.log('dX: ', this.derivX.text());
    //console.log('dY: ', this.derivY.text());

    //Generamos t symbol
    t = new nerdamer("t");
    console.log(t.text());

    //Nueva Funcion

    if (n == 'a') {
      //evaluamos las derivadas parciales de la funcion, con los valores parciales del nodo
      this.evaluador(this.derivX, this.derivY, this.valoresParciales);
      console.log('puntos parciales para hidden', this.puntosParciales);
      this.getT(n);
      //para hidden layers
      let result = parseFloat(core('f(' + this.puntosParciales + ')').toTeX('decimal'));
      this.resultadoGlobal[0] = result;
      

    } else {
      this.evaluador(this.derivX, this.derivY, this.valoresParciales[0]);
      console.log('puntos parciales para 6', this.puntosParciales);
      // para output layers
      let result = parseFloat(core('f(' + this.puntosParciales + ')').toTeX('decimal'));
      this.resultadoGlobal.push(result);
      this.getT(n);
    }

    return this.resultadoGlobal;
  }

  setError(val) {
    this.error = val
  }
}
module.exports = Neuron;