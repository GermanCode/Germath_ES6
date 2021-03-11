const express = require('express');
const router = express.Router();
import Network from '../server/neural_network/network';
const core = require('../public/js/nerdamer.core');;
//creo que aqui llamamos los archivos de neuralnetwork, y comienza despues del post a ejecutarse

const pool = require('../database');

router.get('/add', (req, res) => {
  res.render('nn/add');
});

router.get('/show', (req, res) => {
  res.render('nn/nn');
});

router.post('/add', async (req, res) => {

  const { f, x, y, description } = req.body;

  const layers = [
    2,
    3,
    1
  ];

  const network = new Network(layers);

  const numberOfIterations = 3;

  try {

  core.setFunction('f', ['x', 'y'], f);
  var resultadox = core('f('+x+','+y+')').toString();

  var trainingData = [{
    input: [x, y],
    output: [resultadox]
  }];

  console.log('es esto?', trainingData);
  console.log('es resuktado?', resultadox);

  for (let i = 0; i < numberOfIterations; i++) {
    console.table('Iteracion ' + i);

    network.train(trainingData[0].input, trainingData[0].output);
    console.log('soy los mejores valores: ', network.mejoresValores, 'soy el mejor resultado: ', network.mejorResultado);

    trainingData[0].input = network.mejoresValores;
    trainingData[0].output = network.mejorResultado;
  }
  res.render('nn/nn', {resultado: network.mejorResultado} );

} catch (error) {
  console.log('error', error);
  res.redirect('/');   
}

});

router.get('/', async (req, res) => {
  const users = await pool.query('SELECT * FROM users');
  res.render('nn/list', { users });
});

router.get('/delete/:id', async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM users WHERE id=?', [id]);
  req.flash('success', 'Usuario Removido Correctamente')
  res.redirect('/nn');
});

router.get('/edit/:id', async (req, res) => {
  const { id } = req.params;
  const users = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
  res.render('nn/edit', { users: users[0] });
});

router.post('/edit/:id', async (req, res) => {
  const { id } = req.params;
  const { username, password, fullname } = req.body;
  const newUser = {
    username,
    password,
    fullname
  };
  await pool.query('UPDATE users SET ? WHERE id = ?', [newUser, id]);
  req.flash('success', 'Usuario Actualizado Correctamente.')
  res.redirect('/nn/');
})

module.exports = router;