import { CustomError } from './../helpers/CustomError';
import { In, Any } from "typeorm";
import { game } from "../../api/entities/game";
import { event } from "../../api/entities/event";
import { player } from "../../api/entities/player";
import { game_stats_rollup } from "../../api/entities/game_stats_rollup";
import { user_alliance } from "../../api/entities/user_alliance";

export class individualStandings {    
    
    async getSeriesOptions(connection, experienceId, seriesId, eventId): Promise<Object> {
        const repo = connection.getRepository("player")
        console.log("IN getSeriesOptions: ====> " + experienceId);

        let experience_id = experienceId.value

        try {
            //build monthly options to return back
            var queryBuild = await connection.getRepository("series").createQueryBuilder("series")
              .select([ "series.id AS s_id",  "series.name AS s_name",  "event.id AS e_id", "event.name AS e_name" ])
              .leftJoin( event, 'event', 'series.id = event.series_id')
              .where(" series.experience_id = :experienceIdParm ", { experienceIdParm: experience_id })
              .orderBy("series.id")

            let resultSeriesOpt = await queryBuild.execute();
            let optionsData = new Array()
            let last_s_id = 0, last_s_name = ""
            let wso = new Array();

            for (var i = 0; i < resultSeriesOpt.length; i++) {
                // console.log(resultmSeriesOpt[i])
                let o = resultSeriesOpt[i]
                if (o.s_id == last_s_id || last_s_id == 0) {
                    wso.push({ "value": o.e_id, "label": o.e_name })
                }
                else {
                    optionsData.push({
                        "value": last_s_id,
                        "label": last_s_name,
                        "weeklySeriesOptions": { "optionsData": wso, "selected": false }
                    }
                    );
                    wso = new Array();
                }
                last_s_id = o.s_id; last_s_name = o.s_name;
            }
            optionsData.push({
                "value": last_s_id,
                "label": last_s_name,
                "weeklySeriesOptions": { "optionsData": wso, "selected": false }
            });
            let seriesOptions = {
                "optionsData": optionsData,
                "selected": {"value": 20101,
                             "label": "LOL Monthly April 2019" 
                            }
            }
            
            return seriesOptions;
        } catch (error) {
            throw new CustomError(error);
        };

    }

    async getIndPlayerStanding(connection, wpconn, experienceId, seriesId, eventId ): Promise<Object[]> {
        
        console.log("IN getIndPlayerStandings: experience:" + experienceId.value);
        var alliances = await wpconn.getRepository("alliance").find();
        var series = null;

        var seriesInClause = null;
        var seriesIdArray = new Array()
        if (seriesId != undefined && seriesId.value > 0) {
            series = await wpconn.getRepository("series").find({ where: { experience_id: experienceId.value,
                                                                          id: seriesId.value}});
        } else {
            series = await wpconn.getRepository("series").find({ where: { experience_id: experienceId.value }});
        }    
        console.log("Show series --->", series )        

        series.forEach(element => {
            seriesInClause = (seriesInClause == null ? " " + element.id : seriesInClause + "," + element.id )
            seriesIdArray.push(element.id)
        }) 

        let seriesSelectQ   = "", seriesGrpQ  = ""
        let eventSelectQ    = "", eventGrpQ   = "", eventWhereQ     = ""

        let experience_id = experienceId
        let series_id = seriesId
        let event_id = eventId      

        if (series_id != undefined && series_id.value > 0) {
            console.log("IN getIndPlayerStandings: series:" + seriesId.value);
            series_id = series_id.value
        } else {
            // for bftb logic using 1t and only series 
            series_id = series[0].id
        }
        seriesSelectQ  = " game.series_id AS series_id"
        seriesGrpQ = " game.series_id "

        if (event_id != undefined && event_id.value > 0) {
            console.log("IN getIndPlayerStandings: event:" + eventId.value);
            eventSelectQ = " game.event_id AS event_id "
            eventWhereQ = " game.event_id = :eventId " + event_id.value
            eventGrpQ = " game.event_id "
        }

        try {                
                var queryColumnList = [ 
                    "user_alliance.alliance_id AS clubId",  
                    "player.slg_user_id AS slgUserId",  
                    "game_stats_rollup.pSName AS summonerName", 
                    "COUNT(game_stats_rollup.game_id) AS gameCounts",
                    "sum(if(game_stats_rollup.winFlag = 'Win',1,0)) AS wins",   
                    "sum(if(game_stats_rollup.winFlag <> 'Win',1,0)) AS loss",  
                    "(sum(if(game_stats_rollup.winFlag = 'Win',1,0)) / count(game_stats_rollup.game_id)) AS winRatio", 
                    "(sum(if(game_stats_rollup.winFlag = 'Win',1,0)) / count(game_stats_rollup.game_id)) * 100 AS winPercentage", 
                    "(sum(game_stats_rollup.kills) + sum(game_stats_rollup.assists) / sum(game_stats_rollup.deaths)) * 100 AS kdaPercent",  
                    "avg(game_stats_rollup.gameDuration)  AS avarageDuration",  
                    "sum(game_stats_rollup.kills) AS kills",  
                    "sum(game_stats_rollup.deaths) AS deaths", 
                    "sum(game_stats_rollup.assists) AS assists"
                  ]

                var groupByColumnList = [ "user_alliance.alliance_id",  "player.slg_user_id",  "game_stats_rollup.pSName" ] 
            
                // add required columns to select and group by if needed 
                if ( eventSelectQ.length > 0 ) { queryColumnList.unshift(eventSelectQ); groupByColumnList.unshift(eventGrpQ) }
                if ( seriesSelectQ.length > 0 ) { queryColumnList.unshift(seriesSelectQ); groupByColumnList.unshift(seriesGrpQ) }

                var queryBuild = await connection.getRepository("game").createQueryBuilder("game")
                .select(queryColumnList)
                .leftJoin( game_stats_rollup, 'game_stats_rollup', 'game.external_game_id = game_stats_rollup.tournament_code COLLATE utf8mb4_0900_ai_ci')
                .leftJoin( user_alliance, 'user_alliance', 'game.series_id = user_alliance.series_id ')
                .leftJoin( player, 'player', 'player.external_player_id = game_stats_rollup.pSId COLLATE utf8mb4_0900_ai_ci ')
                //Old inclause processing syntax - may run faster performance wise
                //.where(" game.series_id IN (" + seriesInClause + ") ")
                .where(" game.series_id IN (:...seriesIdsParam) ", { seriesIdsParam: seriesIdArray })
                .andWhere(" player.slg_user_id = user_alliance.slg_user_id" )
                
                if ( eventWhereQ.length > 0 ) {
                    queryBuild.andWhere("game.event_id = :eventIdParam", { eventIdParam: event_id.value } )
                }

                queryBuild.groupBy( groupByColumnList.join() )
                const playersStandingsSQL = await queryBuild.getSql()
                
                console.log(playersStandingsSQL)
                const playersStandings = await queryBuild.execute()

                playersStandings.forEach(e => {
                    var a =  alliances.filter(item => item.id == e.clubId) ;    
                   
                    e["allianceName"] = a[0].name;
                    e["gameCounts"] = { "CHAMPION": e.wins, "total":e.gameCounts }
                    e["victoryPointsDisplay"] = 0
                    e["isEligible"] = true
                    e["eliminated"] = false
                    e["eliminatedReason"] = "eliminated Reason"
                    e["eventIds"] = [3585,3876,3345]
                    e["ipAddresses"] = ["174.22.33.444", "174.22.33.444",]                

                });
            return playersStandings;
        } catch (error) {
            throw new CustomError(error);
        };     
    }

    async getIndPlayerStandingCustomQry( connection, wpconn, experienceId, seriesId, eventId ) : Promise<Object[]> {
        
        const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
        
        var queryBuild = await connection.getRepository("custom_query_def")
        .createQueryBuilder("custom_query_def")
        .where(" custom_query_def.experience_id = :id",           { id: experienceId.value })
        .andWhere(" custom_query_def.query_name = :qryName",      { qryName: "IndividualStandings" })
        .andWhere(" custom_query_def.current = :currFlag",        { currFlag: "Y" })
        .getMany()
        
        var queryStr = queryBuild[0]["query_text"]

        console.log("Experience id passed in: " + experienceId.value);
        console.log(queryStr);
        
        function createAsync(){
            return new AsyncFunction('connection', 'wpconn', 'experienceId', 'seriesId', 'eventId', queryStr );
        }
               
        let asyncFn = createAsync();                  
        return asyncFn(connection, wpconn, experienceId, seriesId, eventId);
    }   


}        