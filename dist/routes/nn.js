"use strict";

var _network = _interopRequireDefault(require("../server/neural_network/network"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const express = require('express');

const router = express.Router();

const core = require('nerdamer/nerdamer.core');

var datos = []; //creo que aqui llamamos los archivos de neuralnetwork, y comienza despues del post a ejecutarse

const pool = require('../database');

router.get('/add', (req, res) => {
  res.render('neural_network/add');
});
router.get('/show', (req, res) => {
  res.render('neural_network/nn');
});
router.post('/add', async (req, res) => {
  var cont = 0;
  var err = 0.000001;
  var px, py, px1t, py1t; // Estas variables seran usadas solo para la visualizacion del resultado en tablas
  // ordenadas debido a las trasformaciones que sufre la variable a su paso
  //Recibimos la funcion ingresada y la almacenamos en una vairable llamada "funcion"

  const {
    f,
    x,
    y,
    arrayrestrictionsinput
  } = req.body;
  var arrayRestrict = arrayrestrictionsinput.split(',');
  const layers = [2, 3, 1];
  const network = new _network.default(layers);
  datos = [];
  network.cleanRestrictions();
  network.setRestrictions(arrayRestrict);

  try {
    var c = 0;
    core.setFunction('f', network.l, f);
    var resultadox = core('f(' + x + ',' + y + ')').toString();
    network.setF(f);
    var deriv = []; //Guardamos las derivadas respectivas de la funcion.

    for (let index = 0; index < network.l.length; index++) {
      deriv.push(core.diff(f, network.l[index]).toString());
    }

    var trainingData = [{
      input: [x, y],
      output: [resultadox]
    }];

    while (Math.abs(network.pDelta) >= err && network.iterations <= 60) {
      console.table('Iteracion ' + network.iterations);
      network.train(trainingData[0].input, trainingData[0].output);
      console.log('soy los mejores valores: ', network.mejoresValores, 'soy el mejor resultado: ', network.mejorResultado);
      trainingData[0].input = network.mejoresValores;
      trainingData[0].output = network.mejorResultado;
      datos.push({
        iteraciones: c,
        X: network.mejoresValores[0],
        Y: network.mejoresValores[1],
        resultado: network.mejorResultado,
        error: Math.abs(network.pDelta)
      });
      c = c + 1;
    }

    if (arrayRestrict.includes('')) {
      var v = 'none';
      var wR = '90%';
    } else {
      var v = 'inline-block';
      var wR = '78%';
    }

    res.render('neural_network/nn', {
      resultado: network.mejorResultado,
      funcion: f,
      derivadas: deriv,
      datos: datos,
      visibleR: v,
      wR: wR,
      restrict: arrayRestrict,
      X: network.mejoresValores[0],
      Y: network.mejoresValores[1]
    });
  } catch (error) {
    console.log('error', error);
    res.redirect('/');
  }
});
router.get('/', async (req, res) => {
  const users = await pool.query('SELECT * FROM users');
  res.render('neural_network/list', {
    users
  });
});
router.get('/delete/:id', async (req, res) => {
  const {
    id
  } = req.params;
  await pool.query('DELETE FROM users WHERE id=?', [id]);
  req.flash('success', 'Usuario Removido Correctamente');
  res.redirect('/nn');
});
router.get('/edit/:id', async (req, res) => {
  const {
    id
  } = req.params;
  const users = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
  res.render('neural_network/edit', {
    users: users[0]
  });
});
router.post('/edit/:id', async (req, res) => {
  const {
    id
  } = req.params;
  const {
    username,
    password,
    fullname
  } = req.body;
  const newUser = {
    username,
    password,
    fullname
  };
  await pool.query('UPDATE users SET ? WHERE id = ?', [newUser, id]);
  req.flash('success', 'Usuario Actualizado Correctamente.');
  res.redirect('/nn');
});
module.exports = router;