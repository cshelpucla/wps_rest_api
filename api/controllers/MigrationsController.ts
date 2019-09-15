import { getConnection } from "typeorm";
import {Request, Response, NextFunction} from "express";

export class MigrationsController  {
  private connection;
  private token = "ozvSekH92ww1tBO6DT6F";

  constructor(){
    this.connection = getConnection("v4_db");
  }

  async migrateUp(request: Request | any, response: Response, next: NextFunction){
    const token = request.swagger.params.token.value;
    if(token == this.token){
      const results = await this.connection.runMigrations();
      response.status(200).send(results);
    } else {
      response.status(401).json({type: "Unauthorized", code: 401, message: "Access token does not match"});
    }
  }

  async migrateDown(request: Request | any, response: Response, next: NextFunction){
    const token = request.swagger.params.token.value;
    if(token == this.token){
      const results = await this.connection.undoLastMigration();
      response.status(200).send(results);
    } else {
      response.status(401).json({type: "Unauthorized", code: 401, message: "Access token does not match"});
    }
  }
}

const migrationsController =  new MigrationsController();

module.exports = {
  migrateUp: (req, res, next) => migrationsController.migrateUp(req, res, next),
  migrateDown: (req, res, next) => migrationsController.migrateDown(req, res, next)
}