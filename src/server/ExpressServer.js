import express      from 'express';
import morgan       from'morgan';
import exphbs       from 'express-handlebars';
import path         from 'path';
import flash        from 'connect-flash';
import session      from 'express-session';
const MySQLStore = require('express-mysql-session');
import passport     from 'passport';
import bodyParser   from 'body-parser';

const { routesIndex, routesIndex2, routesNN, routesAuth, routesUsers} = express.Router();

import { database } from '../keys.js';

class ExpressServer {
  
    constructor(hostname =process.env.LOCAL_HOST, port = process.env.PORT || 3000) { 
      this.serverName = 'Express Server';
      this.hostname = hostname;
      this.port = port;
  
      //Auto Start Server
      this.initServer();
    }

    initRoutes=()=>{
      this.routesIndex = require('../routes/index');
      this.routesAuth = require('../routes/authentication');
      this.routesNN =  require('../routes/nn');
    }

    initViewEngine=()=>{
      
      this.server.set('views', path.join(__dirname, './../../src/views'));

      this.server.engine('.hbs', exphbs({
        defaultLayout: 'main',
        layoutsDir: path.join(this.server.get('views'), 'layouts'),
        partialsDir: path.join(this.server.get('views'), 'partials'),
        extname: '.hbs',
        helpers: require('../lib/handlebars')
    }));
    this.server.set('view engine', '.hbs');
    }
  
    initServer=()=> {

      //Create Server
      this.server = express();
      require('../lib/passport');

      //Ajustes
      this.initRoutes();
      this.initViewEngine();

      // Public
      this.server.use(express.static(path.join(__dirname, '/../../src/public')));
 
      // Middlewares
      this.server.use(flash());
      this.server.use(morgan('dev'));
      this.server.use(express.json()); // for parsing application/json
      this.server.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
      this.server.use(session({
        secret: 'NeuralNetworksGermanCode',
        resave: false,
        saveUninitialized: false,
        store: new MySQLStore( database )
      }));
      this.server.use(passport.initialize());
      this.server.use(passport.session());

      //Global Variables
    this.server.use((req, res, next) => {
    this.server.locals.success = req.flash('success');
    this.server.locals.message = req.flash('message');
    this.server.locals.user = req.user;
    next();
  
  });
        //Routes Implementation
        this.server.use('/', this.routesIndex);
        this.server.use('/auth/', this.routesAuth);
        this.server.use('/nn/', this.routesNN);
        
      
        //Start Listening
      this.server.listen(this.port, () => {
        console.log(`${this.serverName} Started at http://${this.hostname}:${this.port}/`);
      });
    }
  }
  module.exports = ExpressServer