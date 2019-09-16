import { ormconfig } from '../config/ormconfig';
import { createConnection, In, getConnection, Connection } from "typeorm";
import { DebuggableLogger } from '../logger/DebuggableLogger';

let environment = process.env.NODE_ENV || "development";
let envConnections = ormconfig[environment];
let coreDbConfig;
let loggingFlag = true;

export class DBController  {

    constructor () {
    }

    public async dbConnect() {     
        // console.log("ORM config: ", ormconfig[environment])
        let ormLogger = new DebuggableLogger("all")
        ormLogger.enabled = true;

        coreDbConfig = envConnections["wps_data"];
        coreDbConfig.logging = true
        coreDbConfig.logger = ormLogger

        createConnection(coreDbConfig).then(connection => { 
            console.log("Created connection to wps database : " + connection.name)        
            console.log("Entering connecting  to : " + JSON.stringify(coreDbConfig))                
        })
        .catch(error => console.log(error))

    }
}



