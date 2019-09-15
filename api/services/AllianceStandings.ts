import { CustomError } from './../helpers/CustomError';
import { isDate } from "util";

export class allianceStandings {

    
    async execQueryPlayersPerAlliance(connection, wpconn, seriesId): Promise<Object[]> {

        let mWhere = ""
        let series_id = seriesId

        var wprepo = wpconn.getRepository("alliance")
        var alliances = await wprepo.find();

        if (series_id != undefined && series_id.value > 0) {
            mWhere = " ua.series_id = " + series_id.value + " and "
        }

        try {
            let qry = "select \
                      ua.alliance_id id,  \
                      count(l.id) totalPlayers \
                from  slg_v4_db.player l, \
                      slg_v4_db.user_alliance ua \
                where " + mWhere + " \
                      ua.slg_user_id = l.slg_user_id \
                group by  \
                      ua.alliance_id";

            console.log("execQueryPlayersPerAlliance  SQL: " + qry);

            let alliancePlayers = await connection.manager.query(qry)
            console.log(alliancePlayers);
            return alliancePlayers;

        } catch (error) {
            throw new CustomError(error);
        };
    }


    async execQuery(connection, wpconn, experienceId, seriesId ): Promise<Object[]> {

        console.log("IN alliance standings: " + experienceId );        

        var wprepo = wpconn.getRepository("alliance")
        var alliances = await wprepo.find();

        wprepo = wpconn.getRepository("series")
        var series = await wprepo.find({ where: { experience_id: experienceId.value } });

        var seriesInClause = null;
        series.forEach(element => {
            if (seriesInClause == null) {
                seriesInClause = " " + element.id
            } else {
                seriesInClause = seriesInClause + "," + element.id
            }
        });

        let mWhere = ""
        let experienceQuery = true;

        if (seriesId != undefined && seriesId.value > 0) {
            console.log("IN alliance standings: " + experienceId.value + ":" + seriesId.value);        
            mWhere = " and g.series_id = " + seriesId.value
            experienceQuery = false;
        }
        
        console.log("Experience only: " + experienceQuery )
        console.log("seriesInClause: " + seriesInClause )
        console.log("mWhere: " + mWhere )

        try {
            let qry = "select \
                      ua.alliance_id id,  \
                      count(s.game_id) totalGamesPlayed \
                from  slg_v4_db.game_stats_rollup s,  \
                      slg_v4_db.player l, \
                      slg_v4_db.user_alliance ua,  \
                      slg_v4_db.game g \
                where   g.series_id in (" + seriesInClause + ")\
                      " + mWhere + " \
                      and l.external_player_id = s.pSId COLLATE utf8mb4_0900_ai_ci \
                      and g.external_game_id = s.tournament_code COLLATE utf8mb4_0900_ai_ci \
                      and ua.slg_user_id = l.slg_user_id \
                      and ua.series_id = g.series_id \
                group by  \
                      ua.alliance_id";

            console.log(qry)

            let alliancePoints = await connection.manager.query(qry)

            console.log(alliancePoints)

            alliancePoints.forEach(e => {
                let a = alliances.filter(item => item.id == e.id);
                e["name"] = a[0].name;
            });

            if (experienceQuery) {
                let allAlliancePoints = new Array();
                alliancePoints.forEach(e => {
                    let ar = allAlliancePoints.filter(item => item.name == e.name);
                    if (ar.length == 0) {
                        allAlliancePoints.push({ "id": 0, "name": e.name, "totalGamesPlayed": parseInt(e.totalGamesPlayed) });
                    } else {
                        var tgp = parseInt(ar[0].totalGamesPlayed) + parseInt(e.totalGamesPlayed)
                        //removing accumulator and re-inserting it to avoid multiple rows
                        allAlliancePoints.splice(allAlliancePoints.findIndex(item => item.name == e.name), 1)
                        allAlliancePoints.push({ "id": 0, "name": e.name, "totalGamesPlayed": tgp })
                    }
                }
                );
                alliancePoints = allAlliancePoints;
            }

            return alliancePoints;

        } catch (error) {
            throw new CustomError(error);
        };
    }
}        