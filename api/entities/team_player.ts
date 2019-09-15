import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {team} from "./team";
import {player} from "./player";

@Entity("team_player",{schema:"slg_v4_db" } )
@Index("join_player_to_team_player",["player",])
@Index("join_player_to_team_team",["team",])
export class team_player {

    @PrimaryGeneratedColumn()
    id:number;        
        
    @Column("int",{ 
        nullable:false,
        primary:true,
        name:"team_id"
        })
    team_id:number;

    @Column("int",{ 
        nullable:false,
        primary:true,
        name:"player_id"
        })
    player_id:number;

   
    @ManyToOne(type=>team, team=>team.teamPlayers,{  nullable:false,onDelete: 'NO ACTION',onUpdate: 'NO ACTION' })
    @JoinColumn({ name:'team_id'})
    team:team | null;
   
    @ManyToOne(type=>player, player=>player.teamPlayers,{  nullable:false,onDelete: 'NO ACTION',onUpdate: 'NO ACTION' })
    @JoinColumn({ name:'player_id'})
    player:player | null;
}
