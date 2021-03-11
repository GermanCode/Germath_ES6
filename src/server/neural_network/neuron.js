const uid = require ('./uid.js');
const core = require('nerdamer/nerdamer.core');
const evalu = require('./evalu.js');

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
    this.valoresParciales = [];
    this.resultadoGlobal = 0;
    this.letra = '';
    this.fn = '';
    //console.log(this.id);
    
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
    return Math.floor(Math.random() * (+max - +min)) +min; 
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

  cleanOutput(){
    this.output = [];
  }

  cleanValoresParciales(val){
    if(val === 0){
      this.output = [];
      this.output = this.valoresParciales;
      this.valoresParciales = [];
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

  getResultado(f, l, n) {
    core.setFunction('f', l, f);
    if( n == 'a'){
      //para hidden layers
      let result = parseFloat(core('f('+ this.valoresParciales +')').toTeX('decimal'));
      this.resultadoGlobal = result;
    }else{
      // para output layers
      let result = parseFloat(core('f('+ this.valoresParciales[0] +')').toTeX('decimal'));
      this.resultadoGlobal = result;
    }
    return this.resultadoGlobal;
  }


  setError(val) {
    this.error = val
  }
}

module.exports = Neuron;