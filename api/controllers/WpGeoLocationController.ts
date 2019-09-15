import { getConnection, getRepository } from "typeorm";
import { Request, Response } from "express";
import { NextFunction } from 'express-serve-static-core';
import { In } from "typeorm";
import { event } from "../entities/event";
import { experience } from "../entities/experience";
import { series } from "../entities/series";
import { venue } from "../entities/venue";
import { wp_game } from "../entities/wp_game";

const moment = require("moment");

let typeORMConnectionWP = null
let typeORMConnectionCORE = null
let typeORMConnectionV1DB = null

class GeoLocQueryParam {
    userId      : number
    userLat     : number
    userLng     : number
    radius      : number
    gameId      : number
    startDate   : Date
    endDate     : Date
    online      : boolean
    past        : boolean
    ticketed    : boolean
    venueId     : number
}

class WpGeoLocationController {

    constructor() {       
        typeORMConnectionCORE  = getConnection("v4_db")
        typeORMConnectionWP    = getConnection("wp_db")
        typeORMConnectionV1DB  = getConnection("lol_service_db")        
    }      

    // OK !!! app.get("/findByGeoLocation/venue/{venueId}/" 
    async findByGeoLocation(request: Request | any, response: Response, next: NextFunction) {    
        const { venueId } = request.swagger.params;    
        var geoQueryParamIn  = new GeoLocQueryParam();    
        
        geoQueryParamIn.venueId     = venueId.value
        console.log("/findByGeoLocation(GET)/" + geoQueryParamIn );     

        try {    
            var ret = await this.findByGeoLocationCall("venue", geoQueryParamIn)
            response.status(200).send(ret);
        } catch (error) {
            response.status(400).send(error)
        }
    }

    // OK !!! app.post("/findByGeoLocation/entityName/:entityName/lng/:lng/lat/:lat/radius/:radius/" 
    async findByGeoLocationPost(request: Request | any, response: Response, next: NextFunction) {    
        
        var { entityName }  = request.swagger.params;    
        const geoQueryParamIn = request.swagger.params.body.raw;      

        console.log("/findByGeoLocationPost/  para ---> ", geoQueryParamIn );     

        try {    
            var ret = await this.findByGeoLocationCall(entityName.value, geoQueryParamIn)
            response.status(200).send(ret);
        } catch (error) {
            response.status(400).send(error)
        }
    }

    async findByGeoLocationCall (entityName: string, gQParam : GeoLocQueryParam ) : Promise<Object[]> {                
        const dtFmt        =  '%Y-%m-%dT%H:%i:%s'
        const dtFmtNoTZ    =  '%Y-%m-%d %H:%i:%s'

        const wpRepo = typeORMConnectionWP.getRepository("experience_geo")
        const coreRepoPlayer = typeORMConnectionCORE.getRepository("player")
        
        // column list to be returned from query 
        var queryColumnList = 
        [ 
            "venue.id       AS venue_id", 
            "event.id       AS event_id", 
            "series.id      AS series_id", 
            "experience_geo.id  AS experience_id", 
            "slg_experience_venue.venue_term_id AS venue_term_id",                        
            "venue.name     AS name", 
            "venue.lng      AS venue_lng", 
            "venue.lat      AS venue_lat"
        ]
        
        // add geo lattitude and longitude info to list of fields to be returned
        if ( gQParam.userLng != null &&  gQParam.userLng != undefined ) {
            queryColumnList.push( ":userLngParam  AS user_lng" ) 
            queryColumnList.push( ":userLatParam  AS user_lat" )
            queryColumnList.push( "ST_distance_sphere(  point(venue.lng, venue.lat ),  point(:userLngParam, :userLatParam) ) as distance" )
        }   

        // build main query structure
        var queryBuild = await wpRepo.createQueryBuilder("experience_geo")
         .select(queryColumnList)
         .leftJoinAndSelect( 'series',                    'series',     'series.experience_id = experience_geo.id OR series.id IS NULL')
         .leftJoinAndSelect( 'event',                     'event',      'event.series_id = series.id OR event.id IS NULL')
         .leftJoinAndSelect( 'slg_experience_venue',      
                             'slg_experience_venue',      'slg_experience_venue.venue_term_id = experience_geo.term_id and slg_experience_venue.experience_id = experience_geo.id') 
         .leftJoinAndSelect( 'venue',                     'venue',      'event.venue_id = venue.id OR slg_experience_venue.venue_id = venue.id') 
        
        // add geo lattitude and longitude to search
        if ( gQParam.userLng != null &&  gQParam.userLng != undefined ) {
            queryBuild.where( " ST_distance_sphere(  point(venue.lng, venue.lat ),  point(:userLngParam, :userLatParam) ) <= :radiusParam " )
            queryBuild.setParameter("userLngParam",    gQParam.userLng)       
            queryBuild.setParameter("userLatParam",    gQParam.userLat)             
            queryBuild.setParameter("radiusParam",     gQParam.radius)                     
        } else {
            queryBuild.where( "1=1" )
        }

        // add does user have a ticket logic to search
        if ( gQParam.ticketed != null && gQParam.ticketed != undefined && gQParam.ticketed == true) {
            if ( gQParam.userId != null &&  gQParam.userId != undefined  ) 
            {                 
               let experienceIdArray = await coreRepoPlayer.find({
                    select: ["experience_id"],                
                    where: { slg_user_id: gQParam.userId }
                })
                let expList = new Array()
                experienceIdArray.forEach(exp => {
                    expList.push(exp.experience_id)
                });
                console.log("experiences that user", gQParam.userId, "bought ticket in", expList)
                queryBuild.andWhere(" experience_geo.id IN (:...experienceIdsParam) ", { experienceIdsParam: expList })                
            }
        } 
                
        // add look for experiences in a date range
        if ( gQParam.startDate != null &&  gQParam.startDate != undefined ) {
             queryBuild.andWhere(
              " ( event.id is NOT NULL and STR_TO_DATE(event.start_datetime, '"+dtFmtNoTZ+"') >= str_to_date(:startDateParam, '"+dtFmt+"') \
                 and STR_TO_DATE(event.start_datetime, '"+dtFmtNoTZ+"') <= str_to_date(:endDateParam, '"+dtFmt+"') )  \
                 or ( event.id is NULL and STR_TO_DATE(experience_geo.start_date, '"+dtFmt+"') >= str_to_date(:startDateParam, '"+dtFmt+"') \
                 and STR_TO_DATE(experience_geo.start_date, '"+dtFmt+"') <= str_to_date(:endDateParam, '"+dtFmt+"') ) "
             )

             queryBuild.setParameter("startDateParam",  gQParam.startDate)                    
             queryBuild.setParameter("endDateParam",    gQParam.endDate)                    
        }

        // add look for experiences based on specific games in search
        if ( gQParam.gameId != null &&  gQParam.gameId != undefined ) {
            queryBuild.andWhere( " experience_geo.game_ids is not NULL and INSTR(experience_geo.game_ids, :gameIdParam) > 0 ")
            queryBuild.setParameter("gameIdParam",     gQParam.gameId)                     
        } 

        // include or exclude online experiences in search
        if ( gQParam.online != null &&  gQParam.online != undefined && (! gQParam.online) ) {
            queryBuild.andWhere( " experience_geo.experience_venue  <> 'online' ")                          
        } 

        // include or exclude online experiences in search
        if ( gQParam.past != null && gQParam.past != undefined && gQParam.past == true) {
            console.log("Now date: " , new Date())
        } else {             
            console.log("Now date: " , new Date())
            queryBuild.andWhere("  STR_TO_DATE(experience_geo.end_date, '"+dtFmt+"') >= str_to_date(:nowDateParam, '"+dtFmt+"')")
            queryBuild.setParameter("nowDateParam", moment().format('YYYY-MM-DD') )
        }
        
        // add look for experiences at a specific venue
        if ( gQParam.venueId != null && gQParam.venueId != undefined ) {            
            console.log("Venue id search : " , gQParam.venueId)
            queryBuild.andWhere(" venue.id = :venueIdParam ")                        
            queryBuild.setParameter("venueIdParam",     gQParam.venueId)     
        }

        try {         
            
            const gSQL = await queryBuild.getSql()
            
            console.log ( "----------------------------------------------------------------------------------------------------------------------------" )
            console.log ( gSQL )
            console.log ( "----------------------------------------------------------------------------------------------------------------------------" )

            // execute a final query
            const geo_venues = await queryBuild.execute()   
            console.log ( "total of experience/venues combinations found : " +  geo_venues.length )

            const getCol = (arr, n) => arr.map(x => x[n]);          

            // get unique id lists of venues,series,events and experiences
            var uExperiencesL  = Array.from(new Set(getCol(geo_venues, "experience_id")))               
            var uSeriesL       = Array.from(new Set(getCol(geo_venues, "series_id")))                
            var uEventsL       = Array.from(new Set(getCol(geo_venues, "event_id")))                
            var uVenuesL       = Array.from(new Set(getCol(geo_venues, "venue_id")))    

            console.log ( "experience list : " , uExperiencesL )
            
            //No experiences found return empty array of objects
            if ( uExperiencesL.length == 0 ) return [];

            const uExperiences = await typeORMConnectionWP.getRepository(experience).find({id: In( [ uExperiencesL ]) });

            console.log ( "pulled in this many experiences : " +  uExperiences.length)

            const uSeries      = await typeORMConnectionWP.getRepository(series).find({id: In( [ uSeriesL ]) });
            const uEvents      = await typeORMConnectionWP.getRepository(event).find({id: In( [ uEventsL ]) });
            const uVenues      = await typeORMConnectionWP.getRepository(venue).find({id: In( [ uVenuesL ]) });
            const uWpGames     = await typeORMConnectionWP.getRepository(wp_game).find();
            const allVenues    = await typeORMConnectionWP.getRepository(venue).find();

            // Build hierachial structure of experience/series/event/venue OR experience/venue
            // to be returned from the call

            uExperiences.forEach (ex => {                            
                var sArray = uSeries.filter( sr => sr.experience_id == ex.id )                   

                sArray.forEach (sr => { 
                        var eArray = uEvents.filter( ev => ev.series_id == sr.id );                        
                        eArray.forEach (ev => {   
                            var uArray = uVenues.filter( ve => ev.venue_id == ve.id );
                            if (uArray.length > 0 ) {
                                ev["venue"] = uArray[0]                            
                                
                                var distArr = geo_venues.filter( gv => gv.venue_id == uArray[0].id )
                                if (distArr.length > 0 &&  "distance" in distArr[0] ) {
                                    ev["venue"]["distance_from_user"] = distArr[0].distance;
                                }                        
                            }    
                        }) 
                        //Remove events without venues
                        eArray.forEach (ev => { if (ev["venue"] === undefined) eArray.splice(ev,1) });
                        sr["events"] = eArray
                })
                
                //Remove series without events
                sArray.forEach (sr => { if (sr["events"] === undefined) sArray.splice(sr,1) });
                ex["series"] = sArray

                //Build game object to return
                delete ex["game_ids"]                 
                if (ex.game_ids != undefined &&  ex.game_ids != null) {
                    console.log(" exp "+ ex.id  +" has ids: " + ex.game_ids ) 
                    ex["games"] = uWpGames.filter( g => ex.game_ids.includes(g.id) )
                } else { 
                    ex["games"] = [] 
                }                                                

                let vArr = new Array()
                var expArr = geo_venues.filter( gv => gv.experience_id == ex.id )
                expArr.forEach (exx => { 
                    if ( vArr.filter(v => (v.term_id === exx.venue_term_id)).length == 0 ) {
                        vArr.push.apply( vArr, allVenues.filter( v => exx.venue_term_id == v.term_id ) )
                    }
                })  
                ex["venues"] = vArr
                
                if (vArr.length > 1) {
                    console.log ( "found multiple venues: ",  vArr , " for this exp :", ex.id )
                }

            });

            console.log ( "count experiences after filtering " +  uExperiences.length)

            return uExperiences;
        } catch (error) {
            return error
        }
    } 
}     

const wpGeoLocationController =  new WpGeoLocationController();

module.exports = {
    findByGeoLocationPost: (req, res, next) => wpGeoLocationController.findByGeoLocationPost(req, res, next),      
    findByGeoLocation: (req, res, next) => wpGeoLocationController.findByGeoLocation(req, res, next),      
}