const express = require('express');
const router = express.Router();

const pool = require('../database')

const { isLoggedIn } = require('../lib/auth');


router.get('/users', isLoggedIn, async (req, res) => {
    const usuarios = await pool.query('SELECT Identificacion, Nombres, Apellidos, created_at, Estado FROM persona INNER JOIN users ON persona.Identificacion = users.username where persona.fk_Rol = 2 and persona.Estado = 1;');
    var titulo = 'Usuarios Activos'
    res.render('admin/list_all', { usuarios, titulo });
});

router.get('/act_user', isLoggedIn, async (req, res) => {
    const usuarios = await pool.query('SELECT Identificacion, Nombres, Apellidos, created_at, Estado FROM persona INNER JOIN users ON persona.Identificacion = users.username and persona.Estado = 2;');
    var titulo = 'Usuarios Inactivos'
    res.render('admin/list_all', { usuarios, titulo });
});

router.get('/admins', isLoggedIn, async (req, res) => {
    const usuarios = await pool.query('SELECT Identificacion, Nombres, Apellidos, created_at FROM persona INNER JOIN users ON persona.Identificacion = users.username where persona.fk_Rol = 1 and persona.Estado = 1;');
    var titulo = 'Administradores'
    res.render('admin/list_all', { usuarios, titulo });
});

router.get('/est_rol', isLoggedIn, async (req, res) => {
    const usuarios = await pool.query('SELECT Identificacion, Nombres, Apellidos, fechaNacimiento, Telefono, Estado, Descripcion FROM persona INNER JOIN rol ON fk_Rol = id_Rol;');
    var titulo = 'Todos los Usuarios'
    res.render('admin/list_per', { usuarios, titulo });
});

router.get('/est_rol_user/:identificacion', isLoggedIn, async (req, res) => {
    const { identificacion } = req.params;
    const usuario = await pool.query('SELECT Identificacion, Nombres, Apellidos,  Estado, Descripcion FROM persona INNER JOIN rol on persona.fk_Rol = id_Rol where persona.identificacion = ?;', [identificacion]);
    res.render('admin/edit_rol', { usuario: usuario[0] });
});

router.post('/est_rol_user/:identificacion', isLoggedIn, async (req, res) => {
    const { identificacion } = req.params;
    const { hiddenRol, Nombres, Apellidos, Estado } = req.body;
    const nuevoUsuario = {
        Identificacion: identificacion,
        Nombres: Nombres,
        Apellidos: Apellidos,
        Estado: 'Activo',
        fk_Rol: hiddenRol
    };
    console.log(nuevoUsuario);

    await pool.query('UPDATE persona SET ? WHERE identificacion = ?;', [nuevoUsuario, identificacion]);
    req.flash('success', ' Usuario Actualizado con Exito!');
    res.redirect('/admin/admins');

});

router.get('/edit_user/:identificacion', isLoggedIn, async (req, res) => {
    const { identificacion } = req.params;
    const usuario = await pool.query('SELECT Identificacion, Nombres, Apellidos, created_at, Estado FROM persona INNER JOIN users ON persona.Identificacion = users.username where persona.identificacion = ?;', [identificacion]);
    res.render('admin/edit_user', { usuario: usuario[0] });
});

router.post('/edit_user/:identificacion', isLoggedIn, async (req, res) => {
    const { identificacion } = req.params;
    const { hiddenEst, Nombres, Apellidos } = req.body;

    const nuevoUsuario = {
        Identificacion: identificacion,
        Nombres: Nombres,
        Apellidos: Apellidos,
        Estado: hiddenEst
    };
    console.log(nuevoUsuario);
    await pool.query('UPDATE persona SET ? WHERE identificacion = ?;', [nuevoUsuario, identificacion]);
    req.flash('success', ' Usuario Actualizado con Exito!');
    res.redirect('/admin/users');
});

router.get('/act/:identificacion', isLoggedIn, async (req, res) => {
    const { identificacion } = req.params;
    await pool.query('UPDATE persona SET persona.Estado = 1 WHERE identificacion = ?;', [identificacion]);
    res.redirect('/admin/users');
});

router.get('/desac/:identificacion', isLoggedIn, async (req, res) => {
    const { identificacion } = req.params;
    await pool.query('UPDATE persona SET persona.Estado = 2 WHERE identificacion = ?;', [identificacion]);
    res.redirect('/admin/users');
});

router.get('/data', isLoggedIn, async (req, res) => {
    const datos = await pool.query('SELECT id, funcion, restricciones, resultado, salida, Identificacion, Nombres, Apellidos  FROM persona INNER JOIN nn ON persona.Identificacion = nn.user_id;');

    var d = await pool.query('SELECT salida FROM nn;');
    var count = 0;
    for (let i = 0; i < d.length; i++) {
        if (d[i].salida == 'Correcto') {
            count = count + 1;
        }
    }

    var titulo = 'Datos Acumulados de la Red Neuronal Artificial - GerMath.JS';
    var efec = ((count/d.length)*100);
    res.render('admin/data', { datos, titulo, efec });
});


module.exports = router;