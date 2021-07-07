"use strict";

const core = require('nerdamer/nerdamer.core');

const Connection = require('./connection.js');

const Layer = require('./layer.js');

const atan = require('./atah');

const restricctions = [];
const f = '';
const l = [];
const mejorResultado = 0;
const mejoresValores = [];
const mejorPunto = [];
const x_i = 0;
const y_i = 0;
const secureOutput = [];
const secureResult = 0;
const securePoint = [];
const ct = 0;
const pDelta = 0.1;
const c = 0;
const restrict = [];

class Network {
  constructor(numberOfLayers) {
    this.l = l;
    this.f = f;
    this.x_i = x_i;
    this.y_i = y_i;
    this.layers = numberOfLayers.map((length, index) => {
      const layer = new Layer(length); //l = Letra para el numero de variables 

      if (index === 0) {
        let letras = ['x', 'y', 'z', 't', 'v'];
        let c = 0;
        layer.neurons.forEach(neuron => {
          neuron.setLetra(letras[c]);
          l.push(letras[c]);
          c = c + 1;
        }); //Eliminar Letras repetidas en ecuaciones con recursividad.

        for (var i = l.length - 1; i >= 0; i--) {
          if (l.indexOf(l[i]) !== i) l.splice(i, 1);
        }
      } else {
        layer.neurons.forEach(neuron => {
          neuron.setBias(neuron.getRandomBias());
        });
      }

      return layer;
    });
    this.learningRate = 0.9; // multiply's against the input and the delta then adds to momentum

    this.iterations = 0;
    this.connectLayers();
    this.mejoresValores = mejoresValores;
    this.mejorResultado = mejorResultado;
    this.mejorPunto = mejorPunto;
    this.pDelta = pDelta;
    this.secureOutput = secureOutput;
    this.secureResult = secureResult;
    this.securePoint = securePoint;
    this.ct = ct;
    this.c = c;
    this.restrict = restrict;
    this.restricctions = restricctions;
  } //Funcion para Setear la Funcion Globalmente.


  setF(fn_) {
    this.f = fn_;
    return this.f;
  }

  toJSON() {
    return {
      learningRate: this.learningRate,
      iterations: this.iterations,
      layers: this.layers.map(l => l.toJSON())
    };
  }

  setLearningRate(value) {
    this.learningRate = value;
  }

  setIterations(val) {
    this.iterations = val;
  }

  connectLayers() {
    for (var layer = 1; layer < this.layers.length; layer++) {
      const thisLayer = this.layers[layer];
      const prevLayer = this.layers[layer - 1];

      for (var neuron = 0; neuron < prevLayer.neurons.length; neuron++) {
        for (var neuronInThisLayer = 0; neuronInThisLayer < thisLayer.neurons.length; neuronInThisLayer++) {
          const connection = new Connection(prevLayer.neurons[neuron], thisLayer.neurons[neuronInThisLayer]);
          prevLayer.neurons[neuron].addOutputConnection(connection);
          thisLayer.neurons[neuronInThisLayer].addInputConnection(connection);
        }
      }
    }
  }

  train(input, output) {
    this.activate(input, this.mejoresValores);
    this.runNeuralNetwork();
    this.calculateDelta(this.mejorResultado);
    this.adjustWeights();
    this.setIterations(this.iterations + 1);
  }

  activate(values, inputs) {
    // es_Igual = Variable booleana para determinar si se sobrepaso la primer iteracion, despues de input [1, 1]
    var es_Igual = values.length == inputs.length && values.every(function (element, index) {
      return element === inputs[index];
    });

    if (es_Igual == true) {
      this.layers[0].neurons.forEach((n, i) => {
        n.cleanOutput();
        n.valoresParciales = [];
        n.setOutput(this.mejoresValores[i]);
      });
    } else {
      this.layers[0].neurons.forEach((n, i) => {
        n.setOutput(values[i]);
      });
    }
  }

  run() {
    return this.runNeuralNetwork();
  }

  CalcularMejorO() {
    let temp = [];
    let arr = [];
    let res = [];
    arr = this.layers[2].neurons[0].resultadoGlobal;
    temp.push(this.layers[2].neurons[0]);
    this.mejorResultado = arr.reduce((acc, max) => acc > max ? acc : max);

    for (let i = 0; i < arr.length; i++) {
      res = temp.find(B => B.resultadoGlobal[i] === this.mejorResultado); //);

      if (res !== undefined) {
        this.layers[2].neurons[0].valoresParciales = [];
        this.layers[2].neurons[0].output = [];
        this.layers[2].neurons[0].output = res.valoresParcialesO[i]; // res.output;

        this.layers[2].neurons[0].puntosParciales = [];
        this.layers[2].neurons[0].puntosParciales = res.puntosParcialesO[i];

        if (this.layers[2].neurons[0].puntosParciales === undefined) {
          this.layers[2].neurons[0].puntosParciales = [];
          this.layers[2].neurons[0].puntosParciales = this.mejorPunto;
        }

        this.securePoint = res.puntosParcialesO[i];

        if (this.securePoint === undefined) {
          this.securePoint = this.mejorPunto;
        }

        this.layers[2].neurons[0].resultadoGlobal = [];
        this.layers[2].neurons[0].resultadoGlobal[0] = this.mejorResultado;
        this.mejoresValores = [];
      }
    }

    this.layers[2].neurons[0].valoresParcialesO = [];
    this.layers[2].neurons[0].puntosParcialesO = [];
  }

  CalcularMejor() {
    let temp = [];
    let arr = [];
    let obbj = {};

    for (var layer = 1; layer < this.layers.length; layer++) {
      for (var neuron = 0; neuron < this.layers[layer].neurons.length; neuron++) {
        arr.push(this.layers[layer].neurons[neuron].resultadoGlobal[0]);
        temp.push(this.layers[layer].neurons[neuron]);
      }
    }

    this.mejorResultado = arr.reduce((acc, max) => acc > max ? acc : max);
    let res = temp.find(B => B.resultadoGlobal[0] === this.mejorResultado);
    obbj.input = [];
    obbj.input = res.output;
    obbj.output = res.resultadoGlobal[0];
    this.mejoresValores = [];
    this.mejoresValores = obbj.input;
    this.mejorPunto = res.puntosParciales;
    this.PuntoSeguro();
  }

  CalcularErrorMinimo() {
    let arr = [];

    for (var layer = 1; layer < this.layers.length; layer++) {
      for (var neuron = 0; neuron < this.layers[layer].neurons.length; neuron++) {
        arr.push(this.layers[layer].neurons[neuron].error[0]);
        this.layers[layer].neurons[neuron].resultadoGlobal = [];
      }
    }

    let res = arr.reduce((acc, min) => acc > min ? min : acc);
    console.log('Error Mínimo: ', res);
    this.pDelta = res;
  }

  setRestrictions(restrictions) {
    for (let i = 0; i < restrictions.length; i++) {
      this.restrict.push(restrictions[i]);
    }
  }

  cleanRestrictions() {
    this.restrict = [];
    this.e = [];
  }

  evalRestrict(mejoresValores) {
    this.restricctions = [];

    for (let i = 0; i < mejoresValores.length; i++) {
      this.restricctions.push(parseFloat(core('' + this.restrict[i], {
        x: mejoresValores[0],
        y: mejoresValores[1]
      })));
    }
  }

  secure() {
    this.mejorResultado = 0;
    this.mejorResultado = this.secureResult;
    this.mejoresValores = [];
    this.mejoresValores = this.secureOutput;
    this.mejorPunto = [];
    this.mejorPunto = this.securePoint;
    this.securePoint = [];
  }

  jump() {
    this.secureResult = 0;
    this.secureResult = this.mejorResultado;
    this.secureOutput = [];
    this.secureOutput = this.mejoresValores;
    this.securePoint = [];
    this.securePoint = this.mejorPunto;
  }

  PuntoSeguro() {
    if (this.ct === 0) {
      this.secureOutput = [];
      this.secureOutput = this.mejoresValores;
      this.secureResult = this.mejorResultado;
      this.securePoint = this.mejorPunto;
      this.ct = 1;
    } else {
      if (this.restrict[0] == "") {
        if (this.mejorResultado > this.secureResult) {
          this.jump();
        } else {
          this.secure();
        }
      } else {
        this.evalRestrict(this.mejoresValores);

        if (this.mejorResultado > this.secureResult) {
          if (!this.restricctions.includes(0)) {
            this.jump();
          } else {
            this.secure();
          }
        } else {
          this.secure();
        }
      }
    }
  }

  runNeuralNetwork() {
    let f2 = 3;

    for (var layer = 1; layer < this.layers.length; layer++) {
      for (var neuron = 0; neuron < this.layers[layer].neurons.length; neuron++) {
        const bias = this.layers[layer].neurons[neuron].bias;
        var cont = 0;
        const connectionsValue = this.layers[layer].neurons[neuron].inputConnections;
        connectionsValue.map((s, i) => {
          const variables = [];

          if (layer === this.layers.length - 1) {
            let p = 0; // 'o' es una variable simbolica para determinar el numero de variables de la funcion
            // basados en el numero de neuronas de entrada en la primer capa.

            for (let o = 0; o < this.layers[0].neurons.length; o++) {
              let individualWeight = s.weight * s.from.output[o];
              variables.push(individualWeight);
            }

            this.layers[layer].neurons[neuron].cleanOutput();
            this.layers[layer].neurons[neuron].setOutput(variables); //pasamos a valores parciales el output

            this.layers[layer].neurons[neuron].getResultado(this.f, l, i); //Retorna el resultado Global y lo almacena en "p"

            p = this.layers[layer].neurons[neuron].resultadoGlobal[i];
            console.log('nodo ' + i + ' Neurona 6 - Salida', p);
            console.log('----------------------------------------------------------------------');
            return this.layers[layer].neurons[neuron].resultadoGlobal[0];
          } else {
            this.layers[layer].neurons[neuron].cleanOutput();
            let individualWeight = s.weight * s.from.output;
            this.layers[layer].neurons[neuron].setOutput(individualWeight);
            cont++;

            if (cont === this.layers[0].neurons.length) {
              let a = 'a';
              let p = 0;
              this.layers[layer].neurons[neuron].getResultado(this.f, l, a);
              p = this.layers[layer].neurons[neuron].resultadoGlobal[0]; //Para visualizacion del resultado.

              console.log('Neurona: ' + f2, p);
              f2++;
              console.log('--------------------------------------------------');
            }

            return this.layers[layer].neurons[neuron].resultadoGlobal[0];
          }
        });
      }
    }

    this.CalcularMejorO();
    return this.CalcularMejor();
  }

  calculateDelta(target
  /*this.mejorResultado*/
  ) {
    for (let layer = this.layers.length - 1; layer >= 1; layer--) {
      const currentLayer = this.layers[layer];

      for (let neuron = 0; neuron < currentLayer.neurons.length; neuron++) {
        const currentNeuron = currentLayer.neurons[neuron];
        let output = currentNeuron.resultadoGlobal[0];
        let pp = [];
        pp = currentNeuron.puntosParciales;
        let error = 0.001;

        for (let i = 0; i < pp.length; i++) {
          if (target === output) {
            if (parseFloat(pp[i]) > 0) {
              error = error * parseFloat(pp[i]);

              if (error > 10) {
                console.log('error muy grande', error);
                let e = atan(error);
                error = e;
                console.log('nuevo error', error);
              }

              currentNeuron.setError(error);
            } else {
              error = error * parseFloat(pp[i]);

              if (error < -10) {
                console.log('error muy negativo', error);
                let e = atan(error);
                error = e;
                console.log('nuevo error negativo', error);
              }

              currentNeuron.setError(error);
            }
          } else {
            if (parseFloat(pp[i]) > 0) {
              error = (target - output) / target;
              currentNeuron.setError(error + parseFloat(pp[i]));
            } else {
              error = (target - output) / target;
              currentNeuron.setError(error + parseFloat(pp[i]));
            }
          }
        }
      }
    }
  }

  cleanChange() {
    for (var layer = 0; layer < this.layers.length; layer++) {
      const currentLayer = this.layers[layer];

      for (var neuron = 0; neuron < this.layers[layer].neurons.length; neuron++) {
        const currentNeuron = currentLayer.neurons[neuron];

        for (let i = 0; i < currentNeuron.inputConnections.length; i++) {
          const currentConnection = currentNeuron.inputConnections[i];
          currentConnection.clearChange();
        }
      }
    }
  }

  adjustWeights() {
    for (let layer = 1; layer <= this.layers.length - 1; layer++) {
      const currentLayer = this.layers[layer];

      for (let neuron = 0; neuron < currentLayer.neurons.length; neuron++) {
        const currentNeuron = currentLayer.neurons[neuron];

        for (let i = 0; i < currentNeuron.inputConnections.length; i++) {
          const currentConnection = currentNeuron.inputConnections[i];
          var change = currentConnection.change;

          if (currentNeuron.error[i] === undefined) {
            currentNeuron.error[i] = 0.001;
          }

          change.splice(0, 0, this.learningRate * currentNeuron.error[i] + 1); //console.log('change', change);

          currentConnection.setChange(change);
          currentConnection.setWeight(currentConnection.weight * change[0]);
        }

        currentNeuron.cleanPuntosParciales(0);
      }
    }

    this.CalcularErrorMinimo();
    this.cleanE();
    this.cleanChange();
  }

  cleanE() {
    for (var layer = 0; layer < this.layers.length; layer++) {
      const currentLayer = this.layers[layer];

      for (var neuron = 0; neuron < this.layers[layer].neurons.length; neuron++) {
        const currentNeuron = currentLayer.neurons[neuron];
        currentNeuron.cleanError();
      }
    }
  }

}

module.exports = Network;