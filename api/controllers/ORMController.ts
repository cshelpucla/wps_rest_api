import { Request, Response } from "express";
import { CustomError } from './../helpers/CustomError';
import { getConnection, MoreThan, LessThan, LessThanOrEqual, MoreThanOrEqual, Not, In, Like, Between } from "typeorm";
import { NextFunction } from 'express-serve-static-core';
import { parse, stringify } from 'qs';
import * as jwt from 'jsonwebtoken';
import { any } from "joi";
import config from "../config/config";

import { user } from "../entities/user";

let typeORMConnectionCORE = null

let esEntries =
[
    { name: "customer", route: "/customer", db_conn: "" },
    { name: "user", route: "/user", db_conn: "" },
]

class ORMController  {

    constructor() {       
        typeORMConnectionCORE  = getConnection("wps_data")
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
       dbcon = typeORMConnectionCORE     
       return await dbcon.getRepository(es.name)        
    }

    async getAuth(request: Request | any, response: Response, next: NextFunction)  {
        let jwtSecret = config.jwtSecret
        
        const { userId, password } = request.swagger.params;   

        var uid = userId.value;
        var pval = password.value;

        //Sing JWT, valid for - 120 sec
        const token = jwt.sign({ userId: uid }, jwtSecret,{ expiresIn: 600 }  );
  
        //Send the jwt token in the response      
        try {
           let repo = await this.getRepo("user")
           const results = await repo.find({ userid: uid, password: pval }).
           then(res => {
            if (res.length > 0)             
                response.status(200).send(token);
             else
               response.status(401).send();             
           });           
        } catch (error) {
            response.status(error.status || 500).json(new CustomError(error));
        }        
    }

    checkAuth(request: Request ) {
        let jwtSecret = config.jwtSecret
        let jwtPayload ;

        const token = <string>request.headers["auth"];
        try {
            jwtPayload = <any>jwt.verify(token, jwtSecret);
            const { userId } = jwtPayload;
            const newToken = jwt.sign({ userId }, jwtSecret, {  expiresIn: "1h"  });            
            return newToken
        } catch (error) {
            //If token is not valid, respond with 401 (unauthorized) 
            error.status = 401
            throw error;         
        }
    }

    async findEntity(request: Request | any, response: Response, next: NextFunction)  {
        const { entityName, entityId } = request.swagger.params;               
        try {            
            let newToken = this.checkAuth(request)
            let repo = await this.getRepo(entityName.value)

            console.log("findEntity : this is entity Id: " + entityId.value )
            const results = await repo.findOne({ id: entityId.value  });
           
            response.setHeader("token", newToken);            
            response.status(200).send(results);
        } catch (error) {
            response.status(error.status || 500).json(new CustomError(error));
        }        
    }

    async findAllEntities(request: Request | any, response: Response, next: NextFunction)  {
        const { entityName } = request.swagger.params;
        
        try {
            let newToken = this.checkAuth(request)            
            let repo = await this.getRepo(entityName.value)
            // Caching is implemented here
            const results = await repo.find();
            response.setHeader("token", newToken);
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
            if (exp.length > 1 ) 
              sortObj[exp[0]] = exp[1].toUpperCase() 
            else   
              sortObj[exp[0]] = 'ASC'           
        } );
        
        try {
            let newToken = this.checkAuth(request)
            let repo = await this.getRepo(entityName.value)

            if ( selectColumns.length > 0)          { queryParams["select"] = selectColumns }
            if ( Object.keys(filterObj).length > 0) { queryParams["where"]  = filterObj      }
            if ( Object.keys(sortObj).length)       { queryParams["order"]  = sortObj        }

            console.log("query",   queryParams )       
            // Caching is implemented here 
            const results = await repo.find(queryParams);
            response.setHeader("token", newToken);
            response.status(200).send(results);
        } catch (error) {
            response.status(error.status || 500).json(new CustomError(error));
        }        
    }
    
    async createEntity(request: Request | any, response: Response, next: NextFunction)  {

        try {
            console.log("incoming entityName parameteres ==> " , request.swagger.params.entityName.value)
            console.log("incoming body parameteres  ==> " , request.swagger.params.bodyParam.value)
            let newToken = this.checkAuth(request)

            const entityName= request.swagger.params.entityName;        
            const body= request.swagger.params.bodyParam.value;        

            let repo = await this.getRepo(entityName.value)

            const object = await repo.create(body);

            console.log("updating record incoming body merged " + object)

            const results = await repo.save(object);
            response.setHeader("token", newToken);
            response.status(201).send(results);
        } catch (error) {
            response.status(error.status || 500).json(new CustomError(error));
        }
    }

    async updateEntity(request: Request | any, response: Response, next: NextFunction)  {

        try {
            console.log("incoming entityName parameteres ==> " , request.swagger.params.entityName.value)
            console.log("incoming body parameteres  ==> " , request.swagger.params.bodyParam.value)
            let newToken = this.checkAuth(request)
            const entityId= request.swagger.params.entityId;        
            const entityName= request.swagger.params.entityName;        
            const body= request.swagger.params.bodyParam.value;     

            let repo = await this.getRepo(entityName.value)        
            console.log("incoming body ==> " + body )        

            const object = await repo.findOne({ id: entityId.value });

            await repo.merge(object, body);
            console.log("updated  body merged " + object)
            
            const results = await repo.save(object);
            response.setHeader("token", newToken);
            response.status(200).send(results);
        } catch (error) {
            response.status(error.status || 500).json(new CustomError(error));
        }
    }

    async deleteEntity(request: Request | any, response: Response, next: NextFunction) {
 
        const { entityName, entityId } = request.swagger.params;
        try {
            let newToken = this.checkAuth(request)
            let repo = await this.getRepo(entityName.value)

            const results = await repo.delete({ id: entityId.value });
            response.setHeader("token", newToken);
            response.status(204).send(results);
        } catch (error) {
            response.status(error.status || 500).json(new CustomError(error));
        }
    }

}

const ormController =  new ORMController();

module.exports = {

    getAuth        : (req, res, next) => ormController.getAuth(req, res, next),    
    findAllEntities: (req, res, next) => ormController.findAllEntities(req, res, next),
    findEntity:      (req, res, next) => ormController.findEntity(req, res, next),
    updateEntity:    (req, res, next) => ormController.updateEntity(req, res, next),
    createEntity:    (req, res, next) => ormController.createEntity(req, res, next),
    deleteEntity:    (req, res, next) => ormController.deleteEntity(req, res, next),
    findAllEntitiesSearch: (req, res, next) => ormController.findAllEntitiesSearch(req, res, next)

}
