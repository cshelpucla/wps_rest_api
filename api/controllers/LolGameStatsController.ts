import { getConnection, getRepository } from "typeorm";
import { Request, Response } from "express";
import { NextFunction } from 'express-serve-static-core';
import { CustomError } from './../helpers/CustomError';

const moment = require("moment");

let   typeORMConnectionCORE = null

const DEST_DATABASE = "slg_v4_db"
const DEST_STATS_TABLE = "game_stats"
const DEST_CALLBACKS_TABLE = "callback_data"

class LolGameStatsParam {
   gameId: number
   requester: string
   url: string
   source: string
   type: string
   body: string
   matchEndDate: Date
}

class LolCallBackParam {
   tournamentCode : string
   gameId: number
   body: string
}

class LolGameStatsController {

    constructor() {       
        typeORMConnectionCORE  = getConnection("v4_db")
    }      

    // OK !!! app.put("/updateLoLGameStatsRecord/" 
    async updateLoLGameStatsPost(request: Request | any, response: Response, next: NextFunction) {    
        var lolStatsQueryBodyIn  = request.swagger.params.body.raw;
        try {    
            let ret= this.updateLoLGameStats(lolStatsQueryBodyIn);            
            response.status(200).send(ret);
        } catch (error) {
            response.status(error.status || 500).send(error)
        }
    }

    // OK !!! app.put("/updateLoLGameCallBack/" 
    async updateLoLCallBackPost(request: Request | any, response: Response, next: NextFunction) {    
        var lolStatsQueryBodyIn  = request.swagger.params.body.raw;
        try {    
            let ret= this.updateLoLCallBack(lolStatsQueryBodyIn);            
            response.status(200).send(ret);
        } catch (error) {
            response.status(error.status || 500).send(error)
        }
    }
        
    async updateLoLCallBack( dataObj: LolCallBackParam ) {    
        console.log("/updateLoLGameStats/" , dataObj );     

        let tournamentCode = dataObj.tournamentCode;
        let gameId = dataObj.gameId;
        let body = dataObj.body;
                
        let queryStr = "INSERT into " + DEST_DATABASE + "." + DEST_CALLBACKS_TABLE + " (tournament_code, data, game_id) values(?,?,?)"
        console.log("CallBack query" , queryStr, [tournamentCode,body,gameId] );     

        try {    
            let ret = await typeORMConnectionCORE.manager.query(queryStr, [tournamentCode,body,gameId]);
            return ret;
        } catch (error) {
            throw new CustomError(error);
        }
    }

    async updateLoLGameStats( dataObj: LolGameStatsParam ) {    

        console.log("/updateLoLGameStats/" , dataObj );     

        const gameId = dataObj.gameId;
        const requester = dataObj.requester;
        const url = dataObj.url;
        const source = dataObj.source;
        const type = dataObj.type;
        const body = dataObj.body;
        const matchEndDate = dataObj.matchEndDate;

        const queryStr = "INSERT into " + DEST_DATABASE + "." + DEST_STATS_TABLE +
                   " (game_id, requester, url, source, type, body, match_end_date) values(?,?,?,?,?,?,?);"

        let conn = typeORMConnectionCORE

        try {    
            let ret = await conn.manager.query(queryStr, [gameId,requester,url,source,type,body,matchEndDate]);
            console.log("execute insert statement ")    
            let results = 0;
            try {    
                let results = await conn.query("CALL " + DEST_DATABASE + ".rollup_game_stats_row(?)", [ gameId ] );
                console.log("executed stored proc ")    
            } catch (error) {
                return error;
            }
            return results;
        } catch (error) {
            throw new CustomError(error);
        }
    }
}     

const lolGameStatsController =  new LolGameStatsController();

module.exports = {
    updateLoLGameStatsPost: (req, res, next) => lolGameStatsController.updateLoLGameStatsPost(req, res, next),      
    updateLoLCallBackPost: (req, res, next) => lolGameStatsController.updateLoLCallBackPost(req, res, next),          
}