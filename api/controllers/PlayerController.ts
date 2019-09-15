import { Request, Response } from "express";
import { CustomError } from './../helpers/CustomError';
import { getConnection } from "typeorm";
import { player } from "../entities/player";
import { user_alliance } from "../entities/user_alliance";
import { lol_summoner } from "../entities/lol_summoner";
import { user } from "../entities/user";

import { individualStandings } from "../services/IndividualStandings";
import { NextFunction } from 'express-serve-static-core';

let typeORMConnectionWP = null
let typeORMConnectionCORE = null
let typeORMConnectionV1DB = null

class PlayerController  {

    constructor() {       
        typeORMConnectionCORE  = getConnection("v4_db")
        typeORMConnectionWP    = getConnection("wp_db")
        typeORMConnectionV1DB  = getConnection("lol_service_db")        
     }
    
    // app.get("/playerbyuserandseries/user/:slg_user_id/series/:series_id", async function (req: Request, res: Response) {
    async getPlayerByUserAndSeries(request: Request | any, response: Response, next: NextFunction) {

        const { slgUserId, seriesId } = request.swagger.params;
        try { 
            const repoCORE = typeORMConnectionCORE.getRepository("player")

            const results = await repoCORE
                .createQueryBuilder("player")            
                .leftJoin("player.userAlliances", "user_alliance" )            
                .where("player.slg_user_id = :slg_user_id", { slg_user_id: slgUserId.value })
                .andWhere("user_alliance.series_id = :series_id", { series_id: seriesId.value })
                .getMany();                 

                results.forEach(e => {  e["inAllianceFlag"] = true; });   
            
            //console.log("AAllliance player ---> " +  JSON.stringify(results)    )

            if ( results.length == 0 )    {
                const repoWP = typeORMConnectionWP.getRepository("series")
                const series = await repoWP.find({ where: { series_id: seriesId.value }});    

                const results2 = await repoCORE
                    .createQueryBuilder("player")                                
                    .where("player.experience_id = :experience_id ",  { experience_id: series[0].experience_id } )            
                    .where("player.slg_user_id = :slg_user_id", { slg_user_id: slgUserId.value })
                    .getMany();

                console.log("no allliance player ---> " + JSON.stringify(results2)    )
                results2.forEach(e => {  e["inAllianceFlag"] = false; });   

                response.status(200).send(results2);         
            } else {
                response.status(200).send(results);
            }    
        } catch (error) {
            console.log(error)    
            response.status(error.status || 500).json(new CustomError(error));
        }
    }
    
    //app.get("/findAllPlayers/experience/:experience_id/", async function (req: Request, res: Response) 
    async findAllPlayers(req: Request | any, response: Response, next: NextFunction) {            
        const experienceId = req.swagger.params.experienceId.value;
            
        try { 
            console.log("/findAllPlayers/experience/:experience_id/ ==> " + experienceId);
            const repo = typeORMConnectionCORE.getRepository("player")
            const results = await repo.find({ 
                where: { experience_id: experienceId }});
            response.status(200).send(results);
        } catch (error) {
            response.status(error.status || 500).json(new CustomError(error));
        }        
      } 

    //app.get("/findAllPlayersWithMeta/experience/:experience_id/", async function (req: Request, res: Response) {        
    async findAllPlayersWithMeta(req: Request | any, res: Response, next: NextFunction) {            
        const { experienceId } = req.swagger.params;
        try { 
            console.log("/findAllPlayersWithMeta/experience/:experience_id/  : " + experienceId.value);

            const results = await typeORMConnectionCORE.getRepository("player").createQueryBuilder("player")
            .leftJoinAndMapOne('player.user', user, 'user', 'user.id=player.slg_user_id')
            .leftJoinAndMapOne('player.lol_summoner', lol_summoner, 'lol_summoner', 'lol_summoner.user_id=player.slg_user_id')
            .where("player.experience_id = :experience_id", { experience_id: experienceId.value })
            .getMany()

            res.status(200).send(results);
        } catch (error) {
            res.status(error.status || 500).json(new CustomError(error));
        }        
    }

    //app.post("/findAllUserAlliances/alliances/", async function (req: Request, res: Response) {   
    async findAllUserAlliances(req: Request | any, response: Response, next: NextFunction) {         
    
            //TODO use swagger parameters to retrieve body - does not work now - only supports more than one array element in body - not work with single element
            //Preferred syntax below
            //const body = req.swagger.params.bodyParam.value
    
            try { 
                console.log("/findAllUserAlliances/alliances/");
                console.log("/findAllUserAlliances/alliances/ --- body === > "  + req.body);
                
                const body = req.swagger.params.body.value;
    
                var aids = body.data;
                
                const results = await typeORMConnectionCORE
                .createQueryBuilder(user_alliance, "user_alliance")
                .where("user_alliance.alliance_id IN (:alliance_ids )", { alliance_ids: aids })
                .getMany();
    
                response.status(200).json(results);                        
            } catch (error) {
                response.status(error.status || 500).json(new CustomError(error));
            }
        }
        

    //app.post("/findUsersWithAllianceMeta/users/", async function (req: Request, res: Response) {        
    async findUsersWithAllianceMeta(req: Request | any, res: Response, next: NextFunction) {  
        
        //TODO use swagger parameters to retrieve body - does not work now - only supports more than one array element in body - not work with single element
        //Preferred syntax below
        //const body = req.swagger.params.bodyParam.value
        
        try {
            const body = req.swagger.params.body.value;

            var wprepo = typeORMConnectionWP.getRepository("alliance")
            var alliances = await wprepo.find();

            var uids = body.data;
            
            console.log("RESULTS", uids);

            const results = await typeORMConnectionCORE
            .createQueryBuilder(user_alliance, "user_alliance")
            .leftJoinAndMapOne('user_alliance.user', user, 'user', 'user.id = user_alliance.slg_user_id')
            .where("user_alliance.slg_user_id IN (:user_ids )", { user_ids: uids })            
            .getMany();

            results.forEach(e => {
                var alliance =  alliances.filter(item => item.id == e.alliance_id) ;                         
                if ( alliance.length > 0 ) {
                    e["alliance"] = alliance[0];
                }
            });

            res.status(200).send(results);
        } catch (error) {
            res.status(error.status || 500).json(new CustomError(error));
        }        
    }

    //app.get("/individualstandings/experience/:experience_id/series/:series_id/event/:event_id", async function (req: Request, res: Response) {
    //app.get("/individualstandings/experience/:experience_id/series/:series_id/", async function (req: Request, res: Response) {
    //app.get("/individualstandings/experience/:experience_id/", async function (req: Request, res: Response) {

    //app.get("/findIndPlayerStanding/experience/:experience_id/", async function (req: Request, res: Response) {
    //app.get("/findIndPlayerStanding/experience/:experience_id/series/:series_id", async function (req: Request, res: Response) {
    //app.get("/findIndPlayerStanding/experience/:experience_id/series/:series_id/event/:event_id", async function (req: Request, res: Response) {
    async findIndPlayerStanding(req: Request | any, res: Response, next: NextFunction) {           
        var is = new individualStandings()
        const { experienceId, seriesId, eventId } = req.swagger.params;

        try {
            var obj = await is.getIndPlayerStanding
                            (typeORMConnectionCORE, typeORMConnectionWP, experienceId, seriesId, eventId)
            res.status(200).send(obj);
        } catch(error) {
            res.status(error.status || 500).json(new CustomError(error));
        }            
    }
    
    /// new version
    async getIndPlayerStanding(req: Request | any, res: Response, next: NextFunction) {           
        var is = new individualStandings()
        const { experienceId, seriesId, eventId } = req.swagger.params;

        try {
            var obj = await is.getIndPlayerStanding
                            (typeORMConnectionCORE, typeORMConnectionWP, experienceId, seriesId, eventId)
            res.status(200).send(obj);
        } catch(error) {
            res.status(error.status || 500).json(new CustomError(error));
        }            
    }

    async getIndPlayerStandingCustomQry(req: Request | any, res: Response, next: NextFunction) {           
        var is = new individualStandings()
        const { experienceId, seriesId, eventId } = req.swagger.params;

        try {
            var obj = await is.getIndPlayerStandingCustomQry
                          (typeORMConnectionCORE, typeORMConnectionWP, experienceId, seriesId, eventId)
            console.log("from call:" , obj)                
            res.status(200).send(obj);
        } catch(error) {
            res.status(error.status || 500).json(new CustomError(error));
        }            
    }


    // app.get("/findMonthlySeriesOptions/experience/:experience_id/", async function (req: Request, res: Response) {
    // app.get("/findMonthlySeriesOptions/experience/:experience_id/series/:series_id/", async function (req: Request, res: Response) {
    // app.get("/findMonthlySeriesOptions/experience/:experience_id/series/:series_id/event/:event_id", async function (req: Request, res: Response) {
    async findSeriesOptions(req: Request | any, res: Response, next: NextFunction) {  
        var is = new individualStandings()
        const { experienceId, seriesId, eventId } = req.swagger.params;
        
        try {
            var obj = await is.getSeriesOptions(typeORMConnectionWP, experienceId, seriesId, eventId)
            res.status(200).send(obj);
        } catch(error) {
            res.status(error.status || 500).json(new CustomError(error));
        }            
    }

    //### Not in use for now #########################################################################
    //app.get("/playerbyuserseries/:userid/:seriesid", async function (req: Request, res: Response) {
    async findPlayerByUserSeries(req: Request | any, res: Response, next: NextFunction) {  
        const { seriesId, userId } = req.swagger.params;

        try {
            const repo = typeORMConnectionCORE.getRepository("player")        
            
            const results = await typeORMConnectionCORE
            .getRepository(player)
            .createQueryBuilder("lol_participant")            
            .select(["lol_participant.summoner_name", "alliance.name", "alliance_points.games_played", "alliance_points.wins","alliance_points.created_at"])        
            .leftJoinAndSelect("lol_participant.user_alliance", "user_alliance" )            
            .leftJoinAndSelect("user_alliance.alliance", "alliance" )            
            .leftJoinAndSelect("alliance.alliance_points", "alliance_points" )    
            //.where("users.last_name = :name", { name: "Smith" })
            //.where("lol_participant.summoner_name = :name", { name: "jeudacy" })
            //.where("(FLOOR((DayOfMonth(ap.updated_at)-1)/7)+1) = :month", { month: 4 })            
            .where("month(tmp.alliance_points.updated_at) = :month", { month: 4 })
            .printSql()
            .getMany();      
        
            res.json(results);
        } catch (error) {
            res.status(error.status || 500).json(new CustomError(error));
        }
    }

}


const playerController =  new PlayerController();

module.exports = {
    
    getPlayerByUserAndSeries: (req, res, next) => playerController.getPlayerByUserAndSeries(req, res, next),
    findAllUserAlliances: (req, res, next) => playerController.findAllUserAlliances(req, res, next),
    findAllPlayers: (req, res, next) => playerController.findAllPlayers(req, res, next),

    findAllPlayersWithMeta: (req, res, next) => playerController.findAllPlayersWithMeta(req, res, next),
    findUsersWithAllianceMeta: (req, res, next) => playerController.findUsersWithAllianceMeta(req, res, next),
    findPlayerByUserSeries: (req, res, next) => playerController.findPlayerByUserSeries(req, res, next),

    findIndPlayerStanding: (req, res, next) => playerController.findIndPlayerStanding(req, res, next),
    findSeriesOptions: (req, res, next) => playerController.findSeriesOptions(req, res, next),

    getIndPlayerStanding: (req, res, next) => playerController.getIndPlayerStanding(req, res, next),
    getIndPlayerStandingCustomQry: (req, res, next) => playerController.getIndPlayerStandingCustomQry(req, res, next),
}
