import { getConnection } from "typeorm";
import { CustomError } from './../helpers/CustomError'
import {AngryBirdsGameCallback} from "../entities/AngryBirdsGameCallback";
import {AngryBirdsGamePlayer} from "../entities/AngryBirdsGamePlayer";
import {Request, Response, NextFunction} from "express";
import {AngryBirdsStatRow} from "../entities/AngryBirdsStatRow";

export class AngryBirdsController  {
  private gameRepository;
  private playerRespository;

  constructor(){
    this.gameRepository = getConnection("v4_db").getRepository(AngryBirdsGameCallback);
    this.playerRespository = getConnection("v4_db").getRepository(AngryBirdsGamePlayer);
  }

  async saveGameData(request: Request | any, response: Response, next: NextFunction){

    try {
      const gameData = request.swagger.params.gameData.value;
      const formatedGameData: AngryBirdsGameCallback = {
        eventId: gameData.eventId,
        gameId: gameData.gameId,
        body: JSON.stringify(gameData)
      };
      // This is create or update on primary key (gameId)
      const savedGameData = await this.gameRepository.save(formatedGameData);

      // Loop through all players and save their records
      const players = gameData.players;
      for(let i=0; i<players.length; i++){
        // We save a lot of stuff here that is also on the game level to make rollup easier later
        const angryBirdsGamePlayer:AngryBirdsGamePlayer = {
          gameId: gameData.gameId,
          uuid: players[i].uuid,
          eventId: gameData.eventId,
          playerName: players[i].playerName,
          eaglesDefeated: players[i].eaglesDefeated,
          hatchlingsRescued: players[i].hatchlingsRescued,
          revives: players[i].revives,
          wave: gameData.wave
        };
        // This is create or update on composite primary key (gameId, uuid)
        const savedPlayer = await this.playerRespository.save(angryBirdsGamePlayer);
      }

      response.status(201).json(savedGameData);
    } catch (error) {
      response.status(error.status || 500).json(new CustomError(error));
    } 
  }

  async getLeaderboard(request: Request | any, response: Response, next: NextFunction){

    try {
      const eventId = request.swagger.params.eventId.value || -1;
      const showRankedPlayersOnly = request.swagger.params.ranked.value || 0;
      let uuids;
      const aggregatePlayersArray: AngryBirdsStatRow[] = [];
      console.log(eventId);
      if(eventId > 0){
        uuids = await this.playerRespository.createQueryBuilder("player")
        .select([
          "player.uuid"
        ])
        .where("player.eventId = :eventId", {eventId: eventId})
        .groupBy("player.uuid")
        .execute();
        for(let i=0; i<uuids.length; i++){
          const singlePlayerFullRecords: AngryBirdsGamePlayer[] = await this.playerRespository.find({uuid: uuids[i].player_uuid, eventId: eventId});
          let totalEaglesDefeated = 0;
          let gamesPlayed = singlePlayerFullRecords.length;
          let highestLevel = 0;
          let totalTeammatesRevived = 0;
          let totalHatchlingsRescued = 0;
    
          //iterate over all records and aggregate stats
          for(let j=0; j<singlePlayerFullRecords.length; j++){
            totalEaglesDefeated += singlePlayerFullRecords[j].eaglesDefeated;
            highestLevel = highestLevel < singlePlayerFullRecords[j].wave ? singlePlayerFullRecords[j].wave : highestLevel;
            totalTeammatesRevived += singlePlayerFullRecords[j].revives;
            totalHatchlingsRescued += singlePlayerFullRecords[j].hatchlingsRescued;
          }
    
          //build stat row
          const aggregatePlayer: AngryBirdsStatRow = {
            playerName: singlePlayerFullRecords[0].playerName,
            uuid: singlePlayerFullRecords[0].uuid,
            totalEaglesDefeated: totalEaglesDefeated,
            gamesPlayed: gamesPlayed,
            highestLevel: highestLevel,
            totalTeammatesRevived: totalTeammatesRevived,
            totalHatchlingsRescued: totalHatchlingsRescued,
            hatchlingsPerGame: (totalHatchlingsRescued / gamesPlayed).toFixed(2), //round to 2 decimal places
            rank: 0
          }
    
          aggregatePlayersArray.push(aggregatePlayer);
        }
      }else{
        uuids = await this.playerRespository.createQueryBuilder("player")
        .select([
          "player.uuid"
        ])
        .groupBy("player.uuid")
        .execute();
        for(let i=0; i<uuids.length; i++){
          const singlePlayerFullRecords: AngryBirdsGamePlayer[] = await this.playerRespository.find({uuid: uuids[i].player_uuid});
          let totalEaglesDefeated = 0;
          let gamesPlayed = singlePlayerFullRecords.length;
          let highestLevel = 0;
          let totalTeammatesRevived = 0;
          let totalHatchlingsRescued = 0;
    
          //iterate over all records and aggregate stats
          for(let j=0; j<singlePlayerFullRecords.length; j++){
            totalEaglesDefeated += singlePlayerFullRecords[j].eaglesDefeated;
            highestLevel = highestLevel < singlePlayerFullRecords[j].wave ? singlePlayerFullRecords[j].wave : highestLevel;
            totalTeammatesRevived += singlePlayerFullRecords[j].revives;
            totalHatchlingsRescued += singlePlayerFullRecords[j].hatchlingsRescued;
          }
    
          //build stat row
          const aggregatePlayer: AngryBirdsStatRow = {
            playerName: singlePlayerFullRecords[0].playerName,
            uuid: singlePlayerFullRecords[0].uuid,
            totalEaglesDefeated: totalEaglesDefeated,
            gamesPlayed: gamesPlayed,
            highestLevel: highestLevel,
            totalTeammatesRevived: totalTeammatesRevived,
            totalHatchlingsRescued: totalHatchlingsRescued,
            hatchlingsPerGame: (totalHatchlingsRescued / gamesPlayed).toFixed(2), //round to 2 decimal places
            rank: null
          }
    
          aggregatePlayersArray.push(aggregatePlayer);
        }
      }
      
      //sort the players
      aggregatePlayersArray.sort(function(a, b){
        if (a.hatchlingsPerGame < b.hatchlingsPerGame) return 1;
        if (a.hatchlingsPerGame > b.hatchlingsPerGame) return -1;
        if(a.gamesPlayed < b.gamesPlayed) return 1;
        if(a.gamesPlayed > b.gamesPlayed) return -1;
        if(a.totalTeammatesRevived < b.totalTeammatesRevived) return 1;
        if(a.totalTeammatesRevived > b.totalTeammatesRevived) return -1;
        return 0;
      })

      const rankedPlayers: AngryBirdsStatRow[] = [];

      //rank the players
      let rankCounter = 1;
      for(let i=0; i<aggregatePlayersArray.length; i++){
        if(aggregatePlayersArray[i].gamesPlayed >= 6){
          aggregatePlayersArray[i].rank = (rankCounter);
          rankCounter++;
          rankedPlayers.push(aggregatePlayersArray[i]);
        }
      }
      
      if(showRankedPlayersOnly){
        response.status(200).send(rankedPlayers);
      } else {
        response.status(200).send(aggregatePlayersArray);
      }
    } catch (error) {
      response.status(error.status || 500).json(new CustomError(error));
    }
  }
}

const angryBirdsController =  new AngryBirdsController();

module.exports = {
  saveGameData: (req, res, next) => angryBirdsController.saveGameData(req, res, next),
  getLeaderboard: (req, res, next) => angryBirdsController.getLeaderboard(req, res, next)
}