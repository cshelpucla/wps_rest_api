import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {experience} from "./experience";
import {team_player} from "./team_player";
import { user_alliance } from "./user_alliance";
import { series } from "./series";
import { lol_summoner } from "./lol_summoner";
import { user } from "./user";
import { game_stats_rollup } from "./game_stats_rollup";

@Entity("player",{schema:"slg_v4_db" } )
// @Index("player_experience",["experience",])
// @Index("player_slg_user",["slgUser",])
export class player extends BaseEntity {

    @PrimaryGeneratedColumn()
    id:number;               

    @Column("varchar",{ 
        nullable:false,
        name:"external_player_name"
        })
    external_player_name:string;
        

    @Column("varchar",{ 
        nullable:false,
        name:"external_player_id"
        })
    external_player_id:string;
        
    @Column("int",{ 
        nullable:false,
        primary:false,
        name:"experience_id"
        })
    experience_id:number;
    
    @Column("int",{ 
        nullable:false,
        primary:false,
        name:"slg_user_id"
        })
    slg_user_id:number;
    
   
    @ManyToOne(type=>user, user=>user.players,{  nullable:false,onDelete: 'NO ACTION',onUpdate: 'NO ACTION' })
    @JoinColumn({ name: 'id' })
    user:user | null;

    @ManyToMany(type=>game_stats_rollup, game_stats_rollup=>game_stats_rollup.player,{  nullable:false, onDelete: 'NO ACTION',onUpdate: 'NO ACTION' })
    @JoinColumn({ name: 'external_player_id',  referencedColumnName: 'pSId' })
    game_stats_rollup:game_stats_rollup | null;

    /*
    @ManyToOne(type=>experience, experience=>experience.players,{  nullable:false,onDelete: 'NO ACTION',onUpdate: 'NO ACTION' })
    @JoinColumn({ name:'experience_id'})
    experience:experience | null;   
    */

    @ManyToOne(type=>lol_summoner, lol_summoner=>lol_summoner.players,{  nullable:false,onDelete: 'NO ACTION',onUpdate: 'NO ACTION' })
    @JoinColumn({ name: 'slg_user_id',  referencedColumnName: 'user_id' })
    lol_summoner:lol_summoner | null;
   

    @Column("datetime",{ 
        nullable:true,
        name:"created_at"
        })
    created_at:Date | null;
        

    @Column("datetime",{ 
        nullable:true,
        name:"updated_at"
        })
    updated_at:Date | null;
        

    @Column("datetime",{ 
        nullable:true,
        name:"deleted_at"
        })
    deleted_at:Date | null;
        
   
    @OneToMany(type=>team_player, team_player=>team_player.player,{ onDelete: 'NO ACTION' ,onUpdate: 'NO ACTION' })
    teamPlayers:team_player[];

    @OneToMany(type=>user_alliance, user_alliance=>user_alliance.player,{ onDelete: 'NO ACTION' ,onUpdate: 'NO ACTION' })
    userAlliances:user_alliance[];
    
    
}
