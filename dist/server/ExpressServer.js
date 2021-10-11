"use strict";

var _express = _interopRequireDefault(require("express"));

var _morgan = _interopRequireDefault(require("morgan"));

var _expressHandlebars = _interopRequireDefault(require("express-handlebars"));

var _path = _interopRequireDefault(require("path"));

var _connectFlash = _interopRequireDefault(require("connect-flash"));

var _expressSession = _interopRequireDefault(require("express-session"));

var _expressMysqlSession = _interopRequireDefault(require("express-mysql-session"));

var _passport = _interopRequireDefault(require("passport"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _keys = require("../keys.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const {
  routesIndex,
  routesIndex2,
  routesNN,
  routesAuth,
  routesUsers
} = _express.default.Router();

class ExpressServer {
  constructor(hostname = process.env.LOCAL_HOST, port = process.env.PORT || 3000) {
    _defineProperty(this, "initRoutes", () => {
      this.routesIndex = require('../routes/index');
      this.routesAuth = require('../routes/authentication');
      this.routesNN = require('../routes/nn');
      this.routesUsers = require('../routes/usuarios');
    });

    _defineProperty(this, "initViewEngine", () => {
      this.server.set('views', _path.default.join(__dirname, './../../src/views'));
      this.server.engine('.hbs', (0, _expressHandlebars.default)({
        defaultLayout: 'main',
        layoutsDir: _path.default.join(this.server.get('views'), 'layouts'),
        partialsDir: _path.default.join(this.server.get('views'), 'partials'),
        extname: '.hbs',
        helpers: require('../lib/handlebars')
      }));
      this.server.set('view engine', '.hbs');

      var hbs = require('handlebars');

      hbs.registerHelper('ifEquals', function (a, b, options) {
        if (a === b) {
          return options.fn(this);
        }

        return options.inverse(this);
      });
    });

    _defineProperty(this, "initServer", () => {
      //Create Server
      this.server = (0, _express.default)();

      require('../lib/passport'); //Ajustes


      this.initRoutes();
      this.initViewEngine(); // Public

      this.server.use(_express.default.static(_path.default.join(__dirname, '/../../src/public'))); // Middlewares

      this.server.use((0, _connectFlash.default)());
      this.server.use((0, _morgan.default)('dev'));
      this.server.use(_express.default.json()); // for parsing application/json

      this.server.use(_bodyParser.default.urlencoded({
        extended: true
      })); // for parsing application/x-www-form-urlencoded

      this.server.use((0, _expressSession.default)({
        secret: 'NeuralNetworksGermanCode',
        resave: false,
        saveUninitialized: false,
        store: new _expressMysqlSession.default(_keys.database)
      }));
      this.server.use(_passport.default.initialize());
      this.server.use(_passport.default.session()); //Global Variables

      this.server.use((req, res, next) => {
        this.server.locals.success = req.flash('success');
        this.server.locals.message = req.flash('message');
        this.server.locals.user = req.user;
        next();
      }); //Routes Implementation

      this.server.use('/', this.routesIndex);
      this.server.use('/auth/', this.routesAuth);
      this.server.use('/nn/', this.routesNN);
      this.server.use('/admin/', this.routesUsers); //Start Listening

      this.server.listen(this.port, () => {
        console.log(`${this.serverName} Started at http://${this.hostname}:${this.port}/`);
      });
    });

    this.serverName = 'Express Server';
    this.hostname = hostname;
    this.port = port; //Auto Start Server

    this.initServer();
  }

}

module.exports = ExpressServer;