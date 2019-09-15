import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {game} from "./game";
import {player} from "./player";

@Entity("game_stats_rollup",{schema:"slg_v4_db" } )
@Index("game_id",["game_id",])
@Index("pSId",["pSId",])
@Index("pSName",["pSName",])
@Index("tournament_code",["tournament_code",])
export class game_stats_rollup extends BaseEntity {

    @Column("bigint",{ 
        nullable:false,
        primary:true,
        name:"game_id"
        })
    game_id:string;
        

    @Column("int",{ 
        nullable:true,
        name:"pId"
        })
    pId:number | null;
        

    @Column("varchar",{ 
        nullable:true,
        length:50,
        name:"pSName"
        })
    pSName:string | null;
        

    @Column("varchar",{ 
        nullable:true,
        name:"pSId"
        })
    pSId:string | null;
        

    @Column("varchar",{ 
        nullable:true,
        length:50,
        name:"teamId"
        })
    teamId:string | null;
        

    @Column("varchar",{ 
        nullable:true,
        length:50,
        name:"winFlag"
        })
    winFlag:string | null;
        

    @Column("int",{ 
        nullable:true,
        name:"kills"
        })
    kills:number | null;
        

    @Column("int",{ 
        nullable:true,
        name:"deaths"
        })
    deaths:number | null;
        

    @Column("int",{ 
        nullable:true,
        name:"assists"
        })
    assists:number | null;
        

    @Column("varchar",{ 
        nullable:false,
        name:"tournament_code"
        })
    tournament_code:string;

    @ManyToOne(type=>game, games=>games.game_stats_rollup,{  nullable:false, onDelete: 'NO ACTION',onUpdate: 'NO ACTION' })
    @JoinColumn({ name:'tournament_code'})
    games:game[] | null;

    @ManyToMany(type=>player, player=>player.game_stats_rollup,{  nullable:false, onDelete: 'NO ACTION',onUpdate: 'NO ACTION' })
    @JoinColumn({ name: 'pSId',  referencedColumnName: 'external_player_id' })
    player:player | null;
        
}
