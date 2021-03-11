"use strict";

const Network = require('./network.js');

console.log('Digite el numero de Variables');
const numVars = 2;
console.log('Usted a digitado el numero ' + numVars + '.');
const layers = [numVars, // This is the input layer
3, // Hidden layer
1 // Output
];
const network = new Network(layers); //Aqui ya se creo la red neuronal con todos y cada uno de los pesos necesarios en cada una de las conexiones

const numberOfIterations = 3; // Training data for a simple test

var trainingData = [{
  input: [1, 1],
  output: [14]
}];

for (let i = 0; i < numberOfIterations; i++) {
  console.table('Iteracion ' + i);
  network.train(trainingData[0].input, trainingData[0].output);
  console.log('soy los mejores valores: ', network.mejoresValores, 'soy el mejor resultado: ', network.mejorResultado);
  trainingData[0].input = network.mejoresValores;
  trainingData[0].output = network.mejorResultado;
}