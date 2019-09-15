import { Request, Response } from "express";
import { CustomError } from './../helpers/CustomError';
import { getConnection, MoreThan, LessThan, LessThanOrEqual, MoreThanOrEqual, Not, In, Like, Between } from "typeorm";
import { NextFunction } from 'express-serve-static-core';
import { parse, stringify } from 'qs';

let typeORMConnectionWP = null
let typeORMConnectionCORE = null
let typeORMConnectionV1DB = null

let transientEntries = [
    { name: "wp_alliance", route: "/alliances", db_conn: "wp_db" },
    { name: "experience", route: "/experiences", db_conn: "wp_db" },
    { name: "wp_event", route: "/events", db_conn: "wp_db" },
    { name: "wp_series", route: "/series", db_conn: "wp_db" },
    { name: "wp_game", route: "/wpgames", db_conn: "wp_db" },
    { name: "venue", route: "/venues", db_conn: "wp_db" },
]

let esEntries =
[
    { name: "player", route: "/players", db_conn: "" },
    { name: "user_alliance", route: "/useralliances", db_conn: "" },
    { name: "alliance", route: "/alliances", db_conn: "wp_db" },
    { name: "experience", route: "/experiences", db_conn: "wp_db" },
    { name: "event", route: "/events", db_conn: "wp_db" },
    { name: "series", route: "/series", db_conn: "wp_db" },
    { name: "game", route: "/games", db_conn: "" },
    { name: "game_stats", route: "/gamestats", db_conn: "" },
    { name: "game_team", route: "/gameteams", db_conn: "" },
    { name: "experience_slug", route: "/experienceslugs", db_conn: "" },
    { name: "team", route: "/teams", db_conn: "" },
    { name: "team_player", route: "/teamplayers", db_conn: "" },
    { name: "game_team", route: "/gameteams", db_conn: "" },
    { name: "wp_game", route: "/wpgames", db_conn: "wp_db" },
    { name: "venue", route: "/venues", db_conn: "wp_db" },
    { name: "user", route: "/users", db_conn: "" },
    { name: "custom_query_def", route: "/customquerydefs", db_conn: "" },
    // refers to experience MYSQL view that contains JOIN to WP taxanomy structure that provides 
    // a DIRECT experience to venues relationships to support geo-location 
    // searches by geo location (lat lng) AND by venue_id
    { name: "experience_geo", route: "/experiencegeos", db_conn: "wp_db" },
]

class ORMController  {

    constructor() {       
        typeORMConnectionCORE  = getConnection("v4_db")
        typeORMConnectionWP    = getConnection("wp_db")
        typeORMConnectionV1DB  = getConnection("lol_service_db")        
     }

    async getRepo( entityName: string ) {
        let dbcon = null;
        let es = null;
        return await this.getRepoNoConnect(entityName)        
    }

    async getRepoNoConnect( entityName: string ) {
       let dbcon = null;
       let es = null;
       let route = '/' + entityName;
       es = esEntries.find(obj => {return obj.route === route.toLowerCase()});
       console.log("findEntity  : this is entity Name: " + es.name)
       dbcon = ( es.db_conn != "" ? typeORMConnectionWP : typeORMConnectionCORE )     
       return await dbcon.getRepository(es.name)        
    }

    async findEntity(request: Request | any, response: Response, next: NextFunction)  {
        
        const { entityName, entityId } = request.swagger.params;               
        try {
            let repo = await this.getRepo(entityName.value)
            console.log("findEntity : this is entity Id: " + entityId.value )
            const results = await repo.findOne({ id: entityId.value });
            response.status(200).send(results);
        } catch (error) {
            response.status(error.status || 500).json(new CustomError(error));
        }        
    }

    async findAllEntities(request: Request | any, response: Response, next: NextFunction)  {
        const { entityName } = request.swagger.params;
        
        try {
            let repo = await this.getRepo(entityName.value)
            const results = await repo.find();
            response.status(200).send(results);
        } catch (error) {
            response.status(error.status || 500).json(new CustomError(error));
        }        
    }

    async findAllEntitiesSearch(request: Request | any, response: Response, next: NextFunction)  {

        console.log("processing find all search ", request.swagger.params.entityName.value)
        const { entityName, select, filter, sort } = request.swagger.params;
        if (filter.value == undefined && sort.value == undefined && select.value == undefined ) {  
            return await this.findAllEntities(request, response, next)
        }

        var selectColumns   = new Array();
        var sortColumns     = new Array();
        var filterColumns   = new Array();
        
        if (filter.value != undefined && filter   != null ) 
            { filterColumns = filter.value.split(','); console.log("filter c",  filterColumns); }
        if (sort.value != undefined && sort   != null ) 
            { console.log("sort",    sort.value);   sortColumns   = sort.value.split(',');  console.log("sort c",  sortColumns); }
        if (select.value != undefined && select   != null ) 
            { console.log("select",    select.value);   selectColumns   = select.value.split(',');  console.log("select c",  selectColumns); }
        
        var queryParams = {}
        var filterObj = {};
        var sortObj = {};
        var likeSep = '"'      
        var inSep = '['      

        filterColumns.forEach(fc => {                         
            var expr = fc.split(/\b(!=|<=|>=|>|<|=|=\[|!=\[|=\"|!=\")\b/g)             
            console.log("processing find all search 1", expr)
            
            switch(expr[1]) {
                case '!=\"':
                case '=\"':
                    expr[2] = expr[1][expr[1].length-1] + expr[2] 
                    console.log("Like:  split 1", expr[1])
                    console.log("Like:  split 2", expr[2])

                    var like =expr[2].split(/(")/g)  
                    var like2 =expr[2].split(/(")/)  

                    if (like.length > 1) {
                        console.log("Like:  split 1", like)
                    }

                    if ( like[1] == like[3] && like[1] == likeSep ) {
                        var str = "%"+ like[2] + "%"
                        var likeVar = Like(str)                      
                        filterObj[expr[0]] = ( expr[1] == '!=\"' ? Not(likeVar) : likeVar )
                    }        
                  break;
                case '!=\[':
                case '=\[':
                    expr[2] = "[" + expr[2] 
                    var betweenExp =expr[2].split(/(\[|\]|\-)/g)   
                    var inExp =expr[2].split(/(\[|\]|\:)/g)   
                    
                    var betweenExpValues =""
                    
                    if (betweenExp.length > 1) { betweenExp[1].split(/|-|/g)  
                        console.log("Between:  split 2", betweenExp, "values", betweenExpValues)
                    }
    
                    if (inExp.length > 1) {
                        console.log("In: split 1", inExp)
                    }
    
                    if ( betweenExp[1] == '[' &&  betweenExp[5] == ']' && betweenExp[3] =='-' ) {
                        var bVar = Between( betweenExp[2], betweenExp[4] )                  
                        filterObj[expr[0]] = ( expr[1] == '!=' ? Not(bVar) : bVar )
                    } else if ( inExp[1] == '[' &&  inExp[inExp.length-2] == ']' && inExp[3] ==':' ) {
                        var inExp2 =expr[2].split(/\[|\]|\:/)
                        console.log("In list", inExp2)                    
                        var inVar = In( inExp2 )
                        filterObj[expr[0]] = ( expr[1] == '!=' ? Not(inVar) : inVar )
                    }     
                  break;
                case '!=':
                case '=':
                  filterObj[expr[0]] = ( expr[1] == '!=' ? Not(expr[2]) : expr[2] )                  
                  break;
                case '>':
                  filterObj[expr[0]] = MoreThan( expr[2] )
                  break;
                case '<':
                  filterObj[expr[0]] = LessThan( expr[2] )
                  break;
                case '>=':
                  filterObj[expr[0]] = MoreThanOrEqual( expr[2] )
                  break;
                case '<=':
                  filterObj[expr[0]] = LessThanOrEqual( expr[2] )
                  break;
                default:
                  filterObj[expr[0]] = expr[2]
             }                                                         
        } );

        sortColumns.forEach(sc => { 
            let exp = sc.split(/:/)
            console.log("processing find all sort ", exp)
            sortObj[exp[0]] = exp[1].toUpperCase() 
        } );
        
        try {
            let repo = await this.getRepo(entityName.value)

            if ( selectColumns.length > 0)          { queryParams["select"] = selectColumns }
            if ( Object.keys(filterObj).length > 0) { queryParams["where"]  = filterObj      }
            if ( Object.keys(sortObj).length)       { queryParams["order"]  = sortObj        }

            console.log("query",   queryParams )       
            
            const results = await repo.find(queryParams);
            response.status(200).send(results);
        } catch (error) {
            response.status(error.status || 500).json(new CustomError(error));
        }        
    }

    async addTransientFileds (entityType: string, records : Object[] ) {
        let qry = "SELECT p.ID, pm1.meta_key, pm1.meta_value \
        FROM wp_posts p,  wp_postmeta pm1 \
	    where p.ID = pm1.post_id \
        and  post_type in ('experience','wp_series','wp_alliance','wp_series','wp_event','venue') \
	    and  substring(pm1.meta_value,1,5) <> 'field'  \
        and  post_type = :entityTypeParm \
        and  p.ID = :entityId";       

        try {}
        records.forEach(e => {
            const data = await typeORMConnectionWP.manager.query(qry, {entityIdParam: e["id"], entityTypeParam:entityType })
        });
         }catch(error){
             
         }  
        return records;
    }

    async createEntity(request: Request | any, response: Response, next: NextFunction)  {

        try {
            console.log("incoming entityName parameteres ==> " , request.swagger.params.entityName.value)
            console.log("incoming body parameteres  ==> " , request.swagger.params.bodyParam.value)

            const entityName= request.swagger.params.entityName;        
            const body= request.swagger.params.bodyParam.value;        

            let repo = await this.getRepo(entityName.value)

            const object = await repo.create(body);

            console.log("updating record incoming body merged " + object)

            const results = await repo.save(object);
            response.status(200).send(results);
        } catch (error) {
            response.status(error.status || 500).json(new CustomError(error));
        }
    }

    async updateEntity(request: Request | any, response: Response, next: NextFunction)  {

        try {
            console.log("incoming entityName parameteres ==> " , request.swagger.params.entityName.value)
            console.log("incoming body parameteres  ==> " , request.swagger.params.bodyParam.value)

            const entityId= request.swagger.params.entityId;        
            const entityName= request.swagger.params.entityName;        
            const body= request.swagger.params.bodyParam.value;     

            let repo = await this.getRepo(entityName.value)        
            console.log("incoming body ==> " + body )        

            const object = await repo.findOne({ id: entityId.value });

            await repo.merge(object, body);
            console.log("updated  body merged " + object)
            
            const results = await repo.save(object);
            response.status(200).send(results);
        } catch (error) {
            response.status(error.status || 500).json(new CustomError(error));
        }
    }

    async deleteEntity(request: Request | any, response: Response, next: NextFunction) {

        const { entityName, entityId } = request.swagger.params;
        try {
            let repo = await this.getRepo(entityName.value)

            const results = await repo.delete({ id: entityId.value });
            response.status(200).send(results);
        } catch (error) {
            response.status(error.status || 500).json(new CustomError(error));
        }
    }

}

const ormController =  new ORMController();

module.exports = {
    
    findAllEntities: (req, res, next) => ormController.findAllEntities(req, res, next),
    findEntity:      (req, res, next) => ormController.findEntity(req, res, next),
    updateEntity:    (req, res, next) => ormController.updateEntity(req, res, next),
    createEntity:    (req, res, next) => ormController.createEntity(req, res, next),
    deleteEntity:    (req, res, next) => ormController.deleteEntity(req, res, next),
    findAllEntitiesSearch: (req, res, next) => ormController.findAllEntitiesSearch(req, res, next)

}
