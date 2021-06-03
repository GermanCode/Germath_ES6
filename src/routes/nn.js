const express = require('express');
const router = express.Router();
import Network from '../server/neural_network/network';
const core = require('nerdamer/nerdamer.core');
const datos = [];
//creo que aqui llamamos los archivos de neuralnetwork, y comienza despues del post a ejecutarse

const pool = require('../database');

router.get('/add', (req, res) => {
  res.render('neural_network/add');
});

router.get('/show', (req, res) => {
  res.render('neural_network/nn');
});

router.post('/add', async (req, res) => {

    var cont = 0;
    var err = 0.0001;
    var px, py, px1t, py1t; // Estas variables seran usadas solo para la visualizacion del resultado en tablas
                            // ordenadas debido a las trasformaciones que sufre la variable a su paso
                            //Recibimos la funcion ingresada y la almacenamos en una vairable llamada "funcion"

    
  const { f, x, y, description, ri, ari } = req.body;

  console.log(req.body);

  console.log('ari', ari);

  var h = ari.split(',');
  console.log(h)


  const layers = [ 2, 3, 1 ];

  const network = new Network(layers);

  try {
    var c = 0;

  core.setFunction('f', network.l, f);
  var resultadox = core('f('+x+','+y+')').toString();
  network.setF(f);
  var deriv = [];

  for (let index = 0; index < network.l.length; index++) {
    deriv.push(core.diff(f, network.l[index]).toString());
  }

/*let a = []
a.push(x,y);
  var resultadox2 = core('f('+a+')').toString();
  console.log('pequeña prueba ', resultadox2)
*/
  var trainingData = [{
    input: [x, y],
    output: [resultadox]
  }];

while(Math.abs(network.pDelta) >= err && network.iterations <= 60){
  //for (let i = 0; i < numberOfIterations; i++) {
    console.table('Iteracion ' + network.iterations);

    network.train(trainingData[0].input, trainingData[0].output);
    console.log('soy los mejores valores: ', network.mejoresValores, 'soy el mejor resultado: ', network.mejorResultado);

    trainingData[0].input = network.mejoresValores;
    trainingData[0].output = network.mejorResultado;

    console.log('este es el nuevo inicio bich', trainingData[0]);

    
    datos.push({iteraciones: c, X: network.mejoresValores[0], Y: network.mejoresValores[1], resultado: network.mejorResultado, error: Math.abs(network.pDelta) })
    c =  c+1;
  }
//}
  res.render('neural_network/nn', {resultado: network.mejorResultado, funcion: f, derivadas: deriv, datos: datos});

} catch (error) {
  console.log('error', error);
  res.redirect('/');   
}

});

router.get('/', async (req, res) => {
  const users = await pool.query('SELECT * FROM users');
  res.render('neural_network/list', { users });
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
  res.render('neural_network/edit', { users: users[0] });
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
  res.redirect('/nn');
})

module.exports = router;