const Algebra = require('nerdamer/Algebra');
const Calculus = require('nerdamer/Calculus');
const all = require('nerdamer/all');
const core = require('nerdamer/nerdamer.core');
const Network = require('./network.js');

//prueba 12/02/2021 funcinality modular and dinamic learning
console.log('Digite el numero de Variables');

const numVars = 2;

console.log('Usted a digitado el numero '+ numVars +'.')
// Define the layer structure
const layers = [
  numVars, // This is the input layer
  3, // Hidden layer
  1 // Output
]

const network = new Network(layers);

//Aqui ya se creo la red neuronal con todos y cada uno de los pesos necesarios en cada una de las conexiones

// Start training
const numberOfIterations = 3;

// Training data for a simple test
var trainingData = [{
  input : [1, 1],
  output: [14]
}]

for(let i = 0; i < numberOfIterations; i ++) {
  console.table('Iteracion '+ i);

  network.train(trainingData[0].input, trainingData[0].output);
  console.log('soy el martirio', network.h, 'soy el mejor', network.m);

  trainingData[0].input = network.h;
  trainingData[0].output = network.m;
}

// After training we can see if it works
// we call activate to set a input in the first layer
//network.activate(trainingData[0].input)
//const resultA = network.run()

//console.log('Expected 14 got', resultA[0])
/*
// prueba nerdamer
const funcion = f;
const func = core(funcion);
//declare vars
var ver = 0;
var derivX = core.diff(func, 'x');
var derivY = core.diff(func, 'y');
while(ver <= 1){

  console.log(ver);

  core.setVar('x', ver);
  core.setVar('y', 2);
  ver = ver + 1;
  var variables = core.getVars('text');
  console.log(variables);
}

var result = core(func);
console.log('funcion', func.text());
console.log('deX', derivX.text());
console.log('deY', derivY.text());
console.log('resut', result.text());*/