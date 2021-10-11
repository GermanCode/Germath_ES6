const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const pool = require('../database');
const helpers = require('../lib/helpers');

passport.use('local.signin', new LocalStrategy({
    usernameField: 'Identificacion',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, Identificacion, password, done) => {
    const rows = await pool.query('SELECT * FROM persona INNER JOIN users on persona.Identificacion = users.username WHERE Identificacion = ? AND Estado = 1;', [Identificacion]);
    if (rows.length > 0) {
        const persona = rows[0];
        const validPassword = await helpers.mathPassword(password, persona.password);
        console.log(validPassword);
        if(validPassword){
            done(null, persona, req.flash('success', 'Bienvenido Usuario:' + persona.Identificacion));
        } else {
            done(null, false, req.flash('message', 'Contraseña Incorrecta'));
        }
    }else {
            return done(null, false, req.flash('message', 'Usuario NO Encontrado'));
    }
}));

passport.use('local.signup', new LocalStrategy({
    usernameField: 'Identificacion',
    passwordField: 'apellidos',
    passReqToCallback: true
}, async (req, Identificacion, apellidos, done) => {
    const { nombres, fechaNacimiento, telefono, rol } = req.body;
    const newUser = {
        Identificacion,
        nombres,
        apellidos,
        fechaNacimiento,
        telefono,
        fk_Rol : rol
    };
    newUser.apellidos = await helpers.encryptPassword(apellidos);
    const result = await pool.query('INSERT INTO persona SET ?', [newUser]);
    const actualizarApellido = await pool.query('UPDATE persona set Apellidos = ?', [apellidos]);
    return done(null, newUser);
}));

passport.serializeUser( async (user, done) => {
    done(null, user.Identificacion);
});

passport.deserializeUser( async (Identificacion, done) => {
    const rows = await pool.query('SELECT * FROM persona where persona.Identificacion = ?', [Identificacion]);
    done(null, rows[0]);
 });

 