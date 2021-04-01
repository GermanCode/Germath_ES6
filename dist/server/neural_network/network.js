"use strict";

const core = require('nerdamer/nerdamer.core');

const Connection = require('./connection.js');

const Layer = require('./layer.js');

const f = '';
const l = [];
const mejorResultado = 0;
const mejoresValores = [];
const x_i = 0;
const y_i = 0;

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
    this.learningRate = 0.3; // multiply's against the input and the delta then adds to momentum

    this.momentum = 0.1; // multiply's against the specified "change" then adds to learning rate for change

    this.iterations = 0;
    this.connectLayers();
    this.mejoresValores = mejoresValores;
    this.mejorResultado = mejorResultado;
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
    this.activate(input, this.mejoresValores); // Forward propagate

    this.runInputSigmoid(); // backpropagate
    //this.calculateDeltasSigmoid(output)
    //this.adjustWeights()
    //console.log(this.layers.map(l => l.toJSON()))
    //this.setIterations(this.iterations + 1)
  }

  activate(values, h) {
    // es_Igual = Variable booleana para determinar si se sobrepaso la primer iteracion, despues de input [1, 1]
    var es_Igual = values.length == h.length && values.every(function (element, index) {
      return element === h[index];
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
    return this.runInputSigmoid();
  }

  CalcularMejorO() {
    let temp = [];
    let arr = [];
    let res = [];
    arr = this.layers[2].neurons[0].resultadoGlobal;
    temp.push(this.layers[2].neurons[0]);
    console.log('Array de ResultO', arr);
    this.mejorResultado = arr.reduce((acc, max) => acc > max ? acc : max);

    for (let i = 0; i < arr.length; i++) {
      res = temp.find(B => B.resultadoGlobal[i] === this.mejorResultado); //);

      if (res !== undefined) {
        this.layers[2].neurons[0].valoresParciales = [];
        this.layers[2].neurons[0].output = res.valoresParcialesO[i]; // res.output;

        this.layers[2].neurons[0].resultadoGlobal = [];
        this.layers[2].neurons[0].resultadoGlobal[0] = this.mejorResultado;
      }
    }

    this.layers[2].neurons[0].valoresParcialesO = [];
  }

  CalcularMejor() {
    let temp = [];
    let arr = [];
    let obbj = {};

    for (var layer = 0; layer < this.layers.length; layer++) {
      for (var neuron = 0; neuron < this.layers[layer].neurons.length; neuron++) {
        arr.push(this.layers[layer].neurons[neuron].resultadoGlobal[0]);
        temp.push(this.layers[layer].neurons[neuron]);
      }
    }

    this.mejorResultado = arr.reduce((acc, max) => acc > max ? acc : max);
    let res = temp.find(B => B.resultadoGlobal[0] === this.mejorResultado);
    obbj.input = res.output;
    obbj.output = res.resultadoGlobal[0];
    this.mejoresValores = obbj.input;
  }

  runInputSigmoid() {
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
            this.layers[layer].neurons[neuron].cleanValoresParciales(1);
            this.layers[layer].neurons[neuron].cleanPuntosParciales(0);
            return this.layers[layer].neurons[neuron].resultadoGlobal[0];
          } else {
            let individualWeight = s.weight * s.from.output;
            this.layers[layer].neurons[neuron].setOutput(individualWeight);
            cont++;

            if (cont === this.layers[0].neurons.length) {
              let a = 'a';
              let p = 0;
              this.layers[layer].neurons[neuron].getResultado(this.f, l, a);
              this.layers[layer].neurons[neuron].cleanValoresParciales(0);
              this.layers[layer].neurons[neuron].cleanPuntosParciales(0);
              p = this.layers[layer].neurons[neuron].resultadoGlobal[0]; //Para visualizacion del resultado.

              console.log('Neurona: ' + f2, p);
              f2++;
            }

            return this.layers[layer].neurons[neuron].resultadoGlobal[0];
          }
        });
      }
    }

    this.CalcularMejorO();
    return this.CalcularMejor();
  }
  /*  calculateDeltasSigmoid(target) {
      for (let layer = this.layers.length - 1; layer >= 0; layer--) {
        const currentLayer = this.layers[layer]
  
        for (let neuron = 0; neuron < currentLayer.neurons.length; neuron++) {
          const currentNeuron = currentLayer.neurons[neuron]
          let output = currentNeuron.output;
  
          let error = 0;
          if (layer === this.layers.length -1 ) {
            // Is output layer
            error = target[neuron] - output;
             //console.log('calculate delta, error, last layer', error)
          }
          else {
            // Other than output layer
            for (let k = 0; k < currentNeuron.outputConnections.length; k++) {
              const currentConnection = currentNeuron.outputConnections[k]
              error += currentConnection.to.delta * currentConnection.weight
             //console.log('calculate delta, error, inner layer', error)
            }
  
  
          }
          currentNeuron.setError(error)
          currentNeuron.setDelta(error * output * (1 - output))
        }
      }
    }
  
    adjustWeights() {
      
      for (let layer = 1; layer <= this.layers.length -1; layer++) {
        const prevLayer = this.layers[layer - 1]
        const currentLayer = this.layers[layer]
  
        for (let neuron = 0; neuron < currentLayer.neurons.length; neuron++) {
           const currentNeuron = currentLayer.neurons[neuron]
           let delta = currentNeuron.delta
           
          for (let i = 0; i < currentNeuron.inputConnections.length; i++) {
            const currentConnection = currentNeuron.inputConnections[i]
            let change = currentConnection.change
           
            change = (this.learningRate * delta * currentConnection.from.output)
                + (this.momentum * change);
            
            currentConnection.setChange(change)
            currentConnection.setWeight(currentConnection.weight + change)
          }
  
          currentNeuron.setBias(currentNeuron.bias + (this.learningRate * delta))
         
        }
      }
    }*/


}

module.exports = Network;