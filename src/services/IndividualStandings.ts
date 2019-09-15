export class individualStandings {    
    
    async getIndividualStandings(connection, wpconn, params): Promise<Object> {
        
        console.log("IN getIndividualStandings: " + params);
        
        let experience_id = params.experience_id
        try {
            var playersStandings = await this.getIndPlayerStandings(connection, wpconn, params)                        
            
            return playersStandings;
        } catch (error) {
            return error;
        };
    }     
        
    async getAlliancesByExperience(connection, params): Promise<Object> {
        console.log("IN getAlliancesByExperience: " + JSON.stringify(params));

        let experience_id = params.experience_id
        try {
            //build alliances to return back        
            let qryAllliance = "select distinct \
                    a.name allianceName, \
                    a.id \
                from    slg_series sr,  \
                    slg_alliance a \
                where   sr.experience_id = " + experience_id + " \
                    and a.series_id = sr.id"

            let resultAlliance = await connection.manager.query(qryAllliance);
            let alliances = {};
            for (var i = 0; i < resultAlliance.length; i++) {
                alliances[resultAlliance[i].allianceName] = resultAlliance[i].alliance_id
            }
            
            return alliances;

        } catch (error) {
            return error;
        };
    }    

    async getMonthlySeriesOptions(connection, params): Promise<Object> {
        const repo = connection.getRepository("player")
        console.log("IN getMonthlySeriesOptions: " + + JSON.stringify(params));

        let mSelect = ""
        let wSelect = ""
        let mWhere = ""
        let wWhere = ""
        let wWhere2 = ""
        let mGrp = ""
        let wGrp = ""

        let experience_id = params.experience_id
        let series_id = params.series_id
        let event_id = params.event_id

        if (series_id != undefined && series_id > 0) {
            mSelect = " sr.id series_id , "
            mWhere = " and sr.id = " + series_id
            mGrp = " sr.id, "
        }

        if (event_id != undefined && event_id > 0) {
            wSelect = " e.id event_id , "
            wWhere = " and e.id = " + event_id
            wGrp = " e.id, "
        }

        try {
            //build monthly options to return back
            let qryMSeriesOpt = "select  sr.id s_id, sr.name s_name, e.id e_id, e.name e_name \
                from slg_series sr,  \
                    slg_event e \
                where sr.experience_id = " + experience_id + " \
                    and sr.id = e.series_id \
                order by sr.id ;"

            let resultmSeriesOpt = await connection.manager.query(qryMSeriesOpt);
            let weeklySeriesOptions = {}
            let optionsData = new Array()
            let last_s_id = 0, last_s_name = ""
            let wso = new Array();

            for (var i = 0; i < resultmSeriesOpt.length; i++) {
                // console.log(resultmSeriesOpt[i])
                let o = resultmSeriesOpt[i]
                if (o.s_id == last_s_id || last_s_id == 0) {
                    wso.push({ "value": o.e_id, "label": o.e_name })
                }
                else {
                    optionsData.push({
                        "weeklySeriesOptions": { "optionsData": wso, "selected": false }
                    });
                    wso = new Array();
                }
                last_s_id = o.s_id; last_s_name = o.s_name;
            }
            optionsData.push({
                "weeklySeriesOptions": { "optionsData": wso, "selected": false }
            });
            let monthlySeriesOptions = {
                "optionsData": optionsData,
                "selected": {"value": 20101,
                             "label": "LOL Monthly April 2019" 
                            }
            }
            
            return monthlySeriesOptions;
        } catch (error) {
            return error;
        };

    }

    async getIndPlayerStandings(connection, wpconn, params): Promise<Object[]> {
        
        console.log("IN getIndPlayerStandings: " + JSON.stringify(params));
        var wprepo = wpconn.getRepository("alliance")
        var alliances = await wprepo.find();

        wprepo = wpconn.getRepository("series")
        var series = await wprepo.find({ where: { experience_id: params.experience_id }});
        
        var seriesInClause = null;
        series.forEach(element => {
            if ( seriesInClause == null ) {
                seriesInClause = " " + element.id
            } else {
                seriesInClause = seriesInClause + "," + element.id 
            }
        });


        let mSelect = ""
        let wSelect = ""
        let mWhere = ""
        let wWhere = ""
        let wWhere2 = ""
        let mGrp = ""
        let wGrp = ""

        let experience_id = params.experience_id
        let series_id = params.series_id
        let event_id = params.event_id
        let ipAddress = "\'172.31.6.81\'"

        if (series_id != undefined && series_id > 0) {
            mSelect = " g.series_id series_id , "
            mWhere = " and g.series_id = " + series_id
            mGrp = " g.series_id, "
        } else {
            // for bftb logic using 1t and only series 
            series_id = series[0].id
            mSelect = " g.series_id series_id , "
            mWhere = " and g.series_id = " + series_id
            mGrp = " g.series_id, "
        }

        if (event_id != undefined && event_id > 0) {
            wSelect = " g.event_id event_id , "
            wWhere = " and g.event_id = " + event_id
            wGrp = " g.event_id, "
        }

        // json_object( \"total\" , count(s.game_id), \"CHAMPION\" , sum(if(s.winFlag = 'Win',1,0))) gameCounts, \

        try {
            let qry = "select \
                " + mSelect + " \
                " + wSelect + " \
                ua.alliance_id clubId,  \
                l.slg_user_id slgUserId,  \
                s.pSName summonerName,  \
                count(s.game_id) gameCounts, \
                sum(if(s.winFlag = 'Win',1,0)) wins,   \
                sum(if(s.winFlag <> 'Win',1,0)) loss,  \
                (sum(if(s.winFlag = 'Win',1,0)) / count(s.game_id)) winRatio, \
                (sum(if(s.winFlag = 'Win',1,0)) / count(s.game_id)) * 100 winPercentage, \
                (sum(s.kills) / sum(s.deaths)) * 100 kdaPercent,  \
                avg(s.gameDuration)  avarageDuration,  \
                (sum(s.kills) +0) kills,  \
                sum(s.deaths) deaths, \
                sum(s.assists) assists,\
                RANK() OVER (ORDER BY sum(if(s.winFlag = 'Win',1,0)) DESC) AS 'rank' \
            from    \
                slg_v4_db.game_stats_rollup s,  \
                slg_v4_db.player l, \
                slg_v4_db.user_alliance ua,  \
                slg_v4_db.game g \
            where   g.series_id in (" + seriesInClause + ") \
                " + mWhere + " \
                " + wWhere + " \
                and l.external_player_id = s.pSId COLLATE utf8mb4_0900_ai_ci \
                and g.external_game_id = s.tournament_code COLLATE utf8mb4_0900_ai_ci \
                and ua.slg_user_id = l.slg_user_id \
                and ua.series_id = g.series_id \
            group by  \
                " + mGrp + " \
                " + wGrp + " \
                ua.alliance_id, \
                l.slg_user_id, \
                s.pSName \
            ORDER BY sum(if(s.winFlag = 'Win',1,0)) desc"

            console.log(qry)

            var playersStandings = await connection.manager.query(qry);
            
            console.log("------------------------------------------------ before adding alliance:" + playersStandings[0])
            console.log(playersStandings[0])

            playersStandings.forEach(e => {
                var a =  alliances.filter(item => item.id == e.clubId) ;    
                console.log(a)
                var colsToCheck = Object.keys(e)
                console.log(colsToCheck)

                var colsToIgnore = ["summonerName"];
                // colsToCheck.filter(e => colsToIgnore.includes(e));

                var i;
                for (i=0; i<colsToCheck.length; i++) {                    
                    if (! colsToIgnore.includes(colsToCheck[i]) ) {
                        var col = e[colsToCheck[i]]                    
                        if ( Number.isNaN(col) == false ) e[colsToCheck[i]] = parseFloat(col);
                    }
                }
                
                e["allianceName"] = a[0].name;
                e["gameCounts"] = { "CHAMPION": e.wins, "total":e.gameCounts }
                e["victoryPointsDisplay"] = 0
                e["isEligible"] = true
                e["eliminated"] = false
                e["eliminatedReason"] = "eliminated Reason"
                e["eventIds"] = [3585,3876,3345]
                e["ipAddresses"] = ["174.22.33.444", "174.22.33.444",]                

            });
            console.log("------------------------------------------------ after before adding alliance:" + playersStandings[0])

            return playersStandings;
        } catch (error) {
            console.log(error)
            return error;
        };     

    }
}        