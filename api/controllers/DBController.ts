import { ormconfig } from '../config/ormconfig';
import * as path from "path";
import { createConnection, In, getConnection, Connection } from "typeorm";
import { NextFunction } from 'express-serve-static-core';
import { Request, Response } from "express";
import { DebuggableLogger } from '../logger/DebuggableLogger';

let environment = process.env.NODE_ENV || "development";
let selectConnection = "v4_db"
let envConnections = ormconfig[environment];
let coreDbConfig;
let wpDbConfig;
let v1DbConfig;
let loggingFlag = true;

export class DBController  {

    constructor () {

    }

    public async dbConnect() {     


        // console.log("ORM config: ", ormconfig[environment])

        let ormLogger = new DebuggableLogger("all")
        ormLogger.enabled = true;

        coreDbConfig = envConnections["v4_db"];
        coreDbConfig.logging = true
        coreDbConfig.logger = ormLogger

        wpDbConfig = envConnections["wp_db"];
        wpDbConfig.logging = true
        wpDbConfig.logger = ormLogger

        v1DbConfig = envConnections["lol_service_db"];
        v1DbConfig.logging = true
        v1DbConfig.logger = ormLogger

        createConnection(coreDbConfig).then(connection => { 
            console.log("Created connection to CORE V4 db : " + connection.name)        
            console.log("Entering connecting  to : " + JSON.stringify(coreDbConfig))                
        })
        .catch(error => console.log(error))

        createConnection(wpDbConfig).then(connection => { 
            console.log("Created connection to word press db : " + connection.name)             
            console.log("Entering connecting  to : " + JSON.stringify(wpDbConfig))                
        })
        .catch(error => console.log(error))

        createConnection(v1DbConfig).then(connection => { 
            console.log("Created connection to lol_service db : " + connection.name)                
        })
        .catch(error => console.log(error))         

    }

}



