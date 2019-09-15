import { Request, Response } from "express";
import { CustomError } from './../helpers/CustomError';
import { getConnection } from "typeorm";
import { user_alliance } from "../entities/user_alliance";
import { allianceStandings } from "../services/AllianceStandings";
import { NextFunction } from 'express-serve-static-core';

let environment = process.env.NODE_ENV || "development";
let typeORMConnectionWP = null
let typeORMConnectionCORE = null
let typeORMConnectionV1DB = null

class AllianceController  {

    constructor() {       
        typeORMConnectionCORE  = getConnection("v4_db")
        typeORMConnectionWP    = getConnection("wp_db")
        typeORMConnectionV1DB  = getConnection("lol_service_db")        
     }

    //app.get("/allianceStandings/experience/:experience_id/", async function (req: Request, res: Response) {
    async getAllianceStandings(request: Request | any, response: Response, next: NextFunction) {
        const { experienceId, seriesId } = request.swagger.params;

        try {
            console.log("/allianceStandings/experience/:experience_id/ ---> e:" + experienceId.value + "s:" + seriesId.value);
            var as = new allianceStandings()        
        
            var obj = await as.execQuery(typeORMConnectionCORE, typeORMConnectionWP, experienceId, seriesId )
            response.status(200).send(obj);
        } catch(error) {
            response.status(error.status || 500).json(new CustomError(error));
        }            
    }
  
    //OK !!! app.get("/findLowestUserCountAlliance/series/:series_id", async function (req: Request, res: Response) 
    async findLowestUserCountAlliance(req: Request | any, response: Response, next: NextFunction) {            

        const { seriesId } = req.swagger.params;

        try {
            console.log("/findLowestUserCountAlliance/series/:series_id : " + seriesId.value );     

            var as = new allianceStandings()            
            var selectedAlliance;
            var lowestGamesPlayed = -1;            

            var selectAlliance;
            const alliancePlayers =  await as.execQueryPlayersPerAlliance(typeORMConnectionCORE, typeORMConnectionWP, seriesId )

            var i;                
            for ( i=0; i< alliancePlayers.length; i++ ) {
                let tp = parseInt(alliancePlayers[i]["totalPlayers"])
                console.log(tp);
                console.log(typeof alliancePlayers[i]);
                console.log(alliancePlayers[i]);

                if ( lowestGamesPlayed > tp || lowestGamesPlayed == -1) {
                    lowestGamesPlayed = tp         
                    selectedAlliance = alliancePlayers[i];
                    console.log(alliancePlayers[i]);
                }        
              }                

              response.status(200).send(selectedAlliance)
        } catch(error) {
            response.status(error.status || 500).json(new CustomError(error));
        }                
    }  

    // app.get("/findUserAlliance/series/:series_id/user/:user_id", async function (req: Request, res: Response) {        
    async findUserAlliance(req: Request | any, res: Response, next: NextFunction) {            
        const { seriesId, userId } = req.swagger.params;
        try { 
            console.log("/findUserAlliance/series/:series_id/user/:user_id -> " + userId.value );

            var wprepo = typeORMConnectionWP.getRepository("alliance")
            var alliances = await wprepo.find();
    
            let qb = typeORMConnectionCORE.createQueryBuilder(user_alliance, "user_alliance")
            qb.where("user_alliance.slg_user_id = :user_id", { user_id: userId.value })            
            qb.andWhere("user_alliance.series_id = :series_id", { series_id: seriesId.value })
            var uas = await qb.getMany();
            
            let result = null;
            uas.forEach(ua => {
                result =  alliances.filter(item => item.id == ua["alliance_id"]) ;          
            });

            if(result && result.length > 0) {
                res.status(200).send(result[0]);
            } else {
                //TODO: we change the status of this to a 404 when we have error recovery set up in a future pass on error handling
                res.status(200).send({});
            }
        } catch (error) {
            res.status(error.status || 500).json(new CustomError(error));
        }        
    }  
}

const allianceController =  new AllianceController();

module.exports = {   

    getAllianceStangings:    (req, res, next) => allianceController.getAllianceStandings(req, res, next),
    findLowestUserCountAlliance: (req, res, next) => allianceController.findLowestUserCountAlliance(req, res, next),               
    findUserAlliance: (req, res, next) => allianceController.findUserAlliance(req, res, next),    
}
