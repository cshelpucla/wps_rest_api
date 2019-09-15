import { Request, Response } from "express";
import { CustomError } from './../helpers/CustomError';
import { getConnection } from "typeorm";
import { NextFunction } from 'express-serve-static-core';
import { DebuggableLogger } from '../logger/DebuggableLogger';

class ORMLoggerController  {

    constructor() {       
     }

     public async setORMTrace( req: Request | any, res: Response, next: NextFunction) {
        try {
            var level = req.swagger.params.level.value
            var flag =  ( level.toLowerCase() == "off" ? false : true ) 
            
            let c= getConnection("v4_db")
            var l = <DebuggableLogger> c.logger
            l.enabled = flag;        
            await c.close()
            await c.connect()

            c= getConnection("wp_db")
            l = <DebuggableLogger> c.logger
            l.enabled = flag;        
            await c.close()
            await c.connect()

            c= getConnection("lol_service_db")
            l = <DebuggableLogger> c.logger
            l.enabled = flag;        
            await c.close()
            await c.connect()

            console.log('Reconnected')

            console.log("ORM console logging is : " + level)
            res.status(200).send("ORM console logging is : " + level);
        } catch (error) {
            res.status(error.status || 500).json(new CustomError(error));
        }

    }
}

const ormlogController =  new ORMLoggerController();

module.exports = {   
    setORMTrace:    (req, res, next) => ormlogController.setORMTrace(req, res, next),
}
