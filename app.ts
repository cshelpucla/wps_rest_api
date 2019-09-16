import "reflect-metadata";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as healthCheck from '@nymdev/health-check';
import * as path from "path";
import * as YAML from "js-yaml";
import * as fs from "fs";
import * as SwaggerExpress from 'swagger-express-mw';

import { DBController } from "./api/controllers/DBController";

// TODO: setup api docs view endpoint
const swaggerDocument = YAML.safeLoad(fs.readFileSync('./api/swagger/swagger.yaml', 'utf8'));

const packageJson = require(path.join(__dirname, '.', 'package.json'));

import { CustomError } from "./api/helpers/CustomError";


const swaggerConfig = {
    appRoot: __dirname, // required config
}

// // create express app
const app = express();
app.use(healthCheck({
    stats: {
      version: function () { return packageJson.version; }
    },
    env: [
      'NODE_ENV',
      'PORT'
    ]
  }));
app.use(bodyParser.json());

SwaggerExpress.create(swaggerConfig, function(err, swaggerExpress) {
  if (err) { throw err; }

  // install middleware
  swaggerExpress.register(app);

  // Handle 404's
  app.use(function(req, res, next) {
    return res.status(404).json({code: 404, message: `${req.method} for ${req.url} not found.`});
  });

  app.use(function (err, req, res, next) {
  //   logger.error(err);
    res.status(err.status || 500).json({code: err.status, message: err.message});
  });
  
  //const port = process.env.PORT || 3060;
  const port = process.env.PORT || 80;  
  app.listen(port, function() {   
      console.log('Listening to port: ', port);
  });

  // create db connections
  const dbController = new DBController();
  dbController.dbConnect();

  
});