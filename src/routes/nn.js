const express = require('express');
const router = express.Router();
//creo que aqui llamamos los archivos de neuralnetwork, y comienza despues del post a ejecutarse

const pool = require('../database');

router.get('/add', (req, res) => {
    res.render('nn/add');
});

router.get('/nn', (req, res) => {
    res.render('nn/nn');
});



router.post('/add', async (req, res) => {
    const { f, t, description } = req.body;
    const newUser = {
        id: f,
        username: t,
        password: description,
        fullname: description
    };
    await pool.query('INSERT INTO users set ?', [newUser]);
    req.flash('success', 'Usuario agregado con exito');
    res.redirect('/nn');
});

router.get('/', async (req, res) => {
    const users = await pool.query('SELECT * FROM users');
    res.render('nn/list', { users });
});

router.get('/delete/:id', async (req, res)=>{
    const { id}  = req.params;
    await pool.query('DELETE FROM users WHERE id=?', [id]);
    req.flash('success', 'Usuario Removido Correctamente')
    res.redirect('/nn');
});

router.get('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const users = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    res.render('nn/edit', {users: users[0]});
});

router.post('/edit/:id', async (req, res) => {
    const {id} = req.params;
    const {username, password, fullname} = req.body;
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