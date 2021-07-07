"use strict";

var _ExpressServer = _interopRequireDefault(require("./server/ExpressServer"));

var _dotenv = _interopRequireDefault(require("dotenv"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv.default.config(); //Inicio de Express JS Server


const expressServer = new _ExpressServer.default();