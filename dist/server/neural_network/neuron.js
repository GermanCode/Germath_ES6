"use strict";

const uid = require('./uid.js');

const core = require('nerdamer/nerdamer.core');

const nerdamer = require('nerdamer/all');

class Neuron {
  constructor() {
    this.inputConnections = [];
    this.outputConnections = [];
    this.bias = 0; // delta is used to store a percentage of change in the weight

    this.delta = 0;
    this.output = [];
    this.error = 0;
    this.id = uid();
    this.valoresParcialesO = [];
    this.resultadoParcialO = 0;
    this.valoresParciales = [];
    this.puntosParciales = [];
    this.resultadoGlobal = [];
    this.letra = '';
    this.dirChangeX = 0;
    this.dirChangeY = 0; //console.log(this.id);
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
    };
  }

  getRandomBias() {
    const min = -1;
    const max = 1;
    return Math.floor(Math.random() * (+max - +min)) + min;
  }

  addInputConnection(connection) {
    this.inputConnections.push(connection);
  }

  addOutputConnection(connection) {
    this.outputConnections.push(connection);
  }

  setBias(val) {
    this.bias = val;
  }

  cleanOutput() {
    this.output = [];
  }

  cleanValoresParciales(val) {
    if (val === 0) {
      this.output = [];
      this.output = this.valoresParciales;
      this.valoresParciales = [];
    } else {
      this.output = [];
      console.log('valoes parciales dentro de clean valores parciales', this.valoresParciales);
      this.output = this.valoresParciales;
      this.valoresParcialesO.push(this.valoresParciales[0]);
      this.valoresParciales = [];
    }
  }

  cleanPuntosParciales(val) {
    if (val === 0) {
      this.output = [];
      this.output = this.puntosParciales;
      this.puntosParciales = [];
    }
  }

  setOutput(val) {
    console.log('val en setoutput', val);
    this.output.push(val);
    this.valoresParciales.push(val);
    console.log('valores parciales setOutput', this.valoresParciales);
  }

  setDelta(val) {
    this.delta = val;
  }

  setLetra(val) {
    this.letra = val;
  }

  evaluador(ecc_x, ecc_y, vparciales) {
    //Evaluamos la derivada parcial de x.
    var fx1 = ecc_x.evaluate({
      x: vparciales[0]
    });
    fx1 = fx1.evaluate({
      y: vparciales[1]
    }); //console.log('fx1: ', fx1.text());

    this.puntosParciales.push(fx1.text()); //Evaluamos la derivada parcial de y.

    var fy1 = ecc_y.evaluate({
      y: vparciales[1]
    });
    fy1 = fy1.evaluate({
      x: vparciales[0]
    }); //.log('fy1', fy1.text());

    this.puntosParciales.push(fy1.text());
  }

  getResultado(f, l, n) {
    //Seteamos la Funcion Original y el Arreglo de Variables
    core.setFunction('f', l, f); //Hacemos uso de la biblioteca Nerdamer para las derivadas paraciales

    const derivX = core.diff(f, l[0]); //Verificamos si es multivariada la funcion.

    if (f.indexOf('y') !== null) {
      var derivY = core.diff(f, l[1]);
    } else {
      derivY = 0;
    } //Visualizamos por consola las derivadas
    //console.log('dX: ', derivX.text());
    //console.log('dY: ', derivY.text());
    //Generamos t symbol


    var t = new nerdamer("t");
    console.log(t.text());

    if (n == 'a') {
      //evaluamos las derivadas parciales de la funcion, con los valores parciales del nodo
      this.evaluador(derivX, derivY, this.valoresParciales);
      console.log('puntos parciales para hidden', this.puntosParciales); //para hidden layers

      let result = parseFloat(core('f(' + this.puntosParciales + ')').toTeX('decimal'));
      this.resultadoGlobal[0] = result;
    } else {
      this.evaluador(derivX, derivY, this.valoresParciales[0]);
      console.log('puntos parciales para 6', this.puntosParciales); // para output layers

      let result = parseFloat(core('f(' + this.puntosParciales + ')').toTeX('decimal'));
      this.resultadoGlobal.push(result);
    }

    return this.resultadoGlobal;
  }

  setError(val) {
    this.error = val;
  }

}

module.exports = Neuron;