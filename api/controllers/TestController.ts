import { getConnection } from "typeorm";
import {Test} from "../entities/test";


export class TestController  {
  private repository;
  private connection;

  constructor(){
    this.connection = getConnection("v4_db");
    this.repository = this.connection.getRepository(Test);
  }

  async test(req, res, next){
    console.log(req.swagger.params.testBody.value);
    res.sendStatus(200);
    // const records = await this.repository.find();
    // res.status(200).json(records);
  }

  async migrateUp(req, res, next){
    const results = await this.connection.runMigrations();
    res.status(200).send(results);
  }

  async migrateDown(req, res, next){
    const results = await this.connection.undoLastMigration();
    res.status(200).send(results);
  }
}

const testController =  new TestController();

module.exports = {
  test: (req, res, next) => testController.test(req, res, next),
  migrateUp: (req, res, next) => testController.migrateUp(req, res, next),
  migrateDown: (req, res, next) => testController.migrateDown(req, res, next)
}