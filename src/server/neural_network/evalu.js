const Algebra = require('nerdamer/Algebra');
const Calculus = require('nerdamer/Calculus');
const all = require('nerdamer/all');
const core = require('nerdamer/nerdamer.core');

function evalu(fn, parametros) {
  //aqui va la funcion esta de asignar las variables la letra que las representa
  core.setFunction('f', ['x', 'y'], fn);
  let result = parseFloat(core('f('+ parametros +')').toTeX('decimal'));
  console.log(result);
  return result;
}

module.exports = evalu;