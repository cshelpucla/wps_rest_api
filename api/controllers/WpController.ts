import { getConnection, getRepository } from "typeorm";
import { Request, Response } from "express";
import { CustomError } from './../helpers/CustomError';
import { NextFunction } from 'express-serve-static-core';
import { In } from "typeorm";
import { event } from "../entities/event";
import { experience } from "../entities/experience";
import { series } from "../entities/series";
import { venue } from "../entities/venue";
import { wp_game } from "../entities/wp_game";
import { game } from "../entities/game";

let typeORMConnectionWP = null
let typeORMConnectionCORE = null
let typeORMConnectionV1DB = null


class WpController {

    constructor() {       
        typeORMConnectionCORE  = getConnection("v4_db")
        typeORMConnectionWP    = getConnection("wp_db")
        typeORMConnectionV1DB  = getConnection("lol_service_db")        
    }
        
    async getExperienceStructure (request: Request | any, response: Response, next: NextFunction)  {         
        console.log ("IN getExperienceStructure: " + request.swagger.params.experienceId.value);
        
        let experienceId = request.swagger.params.experienceId.value

        try {                 
                console.log("/findWpExperience/:experience_id/" + experienceId);
                
                let experience = await typeORMConnectionWP.getRepository("experience").find({ where: { id: experienceId }});
                let series     = await typeORMConnectionWP.getRepository("series").find({ where: { experience_id: experienceId }});
                let event      = await typeORMConnectionWP.getRepository("event").find()
                let alliance   = await typeORMConnectionWP.getRepository("alliance").find()
                let wp_game    = await typeORMConnectionWP.getRepository("wp_game").find()
                let venue      = await typeORMConnectionWP.getRepository("venue").find();

                let experience_json = {}
                experience.forEach(ex => {
                    let seriesFiltered = series.filter(item => item["experience_id"] == ex["id"]);    
                    seriesFiltered.forEach(sr => {
                        sr["alliances"] = alliance.filter(item => item["series_id"] == sr["id"]);    
                        let eventFiltered = event.filter(item => item["series_id"] == sr["id"]);    
                        eventFiltered.forEach(ev => {
                            var vArray = venue.filter( ve => ev.venue_id == ve.id );
                            ev["venue"] = vArray[0]
                        });    
                        sr["events"]    = eventFiltered;
                    });
                    ex["series"] = seriesFiltered 

                    if (ex.game_ids != undefined &&  ex.game_ids != null) {
                        console.log(" exp "+ ex.id  +" has ids: " + ex.game_ids ) 
                        ex["games"] = wp_game.filter( g => ex.game_ids.includes(g.id) )
                    } else { 
                        ex["games"] = [] 
                    }
                    
                    delete ex["game_ids"] 
                    experience_json =  ex 
                });
                
            
            response.status(200).send(experience_json);
        } catch (error) {
            response.status(400).send(error)
        }        
    };     


    //OK !!! app.get("/eventsbyseries/series/:id", async function (req: Request, res: Response) {
    async getEventBySeriesId(request: Request | any, response: Response, next: NextFunction) {
        const { seriesId } = request.swagger.params;

        try {
            const repo = typeORMConnectionWP.getRepository("event")
        
            const results = await repo.find({ where: { series_id: seriesId.value }});
            response.status(200).send(results);
        } catch (error) {
            response.status(error.status || 500).json(new CustomError(error));
        }
    }

    //OK !!! app.get("/findAllAlliancesByExperience/experience/:experience_id/", async function (req: Request, res: Response)
    async findAllAlliancesByExperience(req: Request | any, response: Response, next: NextFunction) {    
        const { experienceId, seriesId } = req.swagger.params;
        try { 
            console.log("/findAllAlliancesByExperience/experience/:experience_id/" + experienceId.value );     

            var series_id = seriesId;
            var wprepo = typeORMConnectionWP.getRepository("alliance")
            var alliances = await wprepo.find();
            
            var seriesList = new Array()
            wprepo = typeORMConnectionWP.getRepository("series")
            if ( seriesId === undefined ) {
                var seriesCall = await wprepo.find({ where: { experience_id: experienceId.value }});
                seriesCall.forEach(s => { seriesList.push(parseInt(s.id)); });
            } else {
                console.log("/findAllAlliancesByExperience/experience/:experience_id/series/:series_id" + seriesId.value );     
                series_id = parseInt(seriesId.value);
                seriesList.push( series_id );
            }

            console.log(seriesList)
            var series = await wprepo.find({ where: { experience_id: experienceId.value, id: In(seriesList) }}); 

            var allAlliances = new Array()
            series.forEach(s => {
                let filtered = alliances.filter(a => a.series_id == s.id);                    
                // console.log(filtered)
                allAlliances.push.apply(allAlliances, filtered)
            });

            response.status(200).send(allAlliances);
        } catch (error) {
            response.status(error.status || 500).json(new CustomError(error));
        }        
    }

    //OK !!! app.get("/findAllSeries/experience/:experience_id/", async function (req: Request, res: Response) 
    async findAllSeriesByExperience(req: Request | any, response: Response, next: NextFunction) {        
        const { experienceId } = req.swagger.params;
        try { 
            console.log("/findAllSeries/experience/:experience_id/ ->" + experienceId.value);
            const repo =  typeORMConnectionWP.getRepository("series")
            const results = await repo.find({ where: { experience_id: experienceId.value }});
                response.status(200).send(results);
            } catch (error) {
                response.status(error.status || 500).json(new CustomError(error));
            }
    }

    //OK !!! app.get("/findAllAlliances/series/:series_id/", async function (req: Request, res: Response) 
    async findAllAlliancesBySeries(req: Request | any, response: Response, next: NextFunction) {    
            
        const { seriesId } = req.swagger.params;
        try { 
            console.log("/findAllAlliances/series/:series_id/" + seriesId.value );     
            
            var wprepo = typeORMConnectionWP.getRepository("alliance")
            var alliances = await wprepo.find({ where: { series_id: seriesId.value }});            

            response.status(200).send(alliances);
        } catch (error) {
            response.status(error.status || 500).json(new CustomError(error));
        }        
    }

    // OK !!! app.get("/seriesalliances/series/:series_id", async function (req: Request, res: Response) {
    async getSeriesAlliance(request: Request | any, response: Response, next: NextFunction) {    
        const { seriesId } = request.swagger.params; 
        try { 
            const repo = typeORMConnectionWP.getRepository("alliance")
            const results = await repo.find({ where: { series_id: seriesId.value }});
            response.status(200).send(results);            
        } catch (error) {
            response.status(error.status || 500).json(new CustomError(error));
        }
    }

    // OK !!! app.get("/findExperience/slug/:slug_id/", async function (req: Request, res: Response) 
    async findExperienceBySlug(request: Request | any, response: Response, next: NextFunction) {    
        const { slugId } = request.swagger.params;
        try {
            const repo = typeORMConnectionWP.getRepository("experience")
            const results = await repo.findOne({ where: { experience_slug: slugId.value }});
            response.status(200).send(results);
        } catch (error) {
            response.status(error.status || 500).json(new CustomError(error));
        }
    }
        
}     

const wpController =  new WpController();

module.exports = {
    getExperienceStructure: (req, res, next) => wpController.getExperienceStructure(req, res, next),
    getEventBySeriesId: (req, res, next) => wpController.getEventBySeriesId(req, res, next),
    findAllAlliancesByExperience: (req, res, next) => wpController.findAllAlliancesByExperience(req, res, next), 
    findAllSeriesByExperience: (req, res, next) => wpController.findAllSeriesByExperience(req, res, next), 
    findAllAlliancesBySeries: (req, res, next) => wpController.findAllAlliancesBySeries(req, res, next),
    getSeriesAlliance: (req, res, next) => wpController.getSeriesAlliance(req, res, next),
    findExperienceBySlug: (req, res, next) => wpController.findExperienceBySlug(req, res, next), 
}