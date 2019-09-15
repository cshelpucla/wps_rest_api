import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {series} from "./series";
import {event} from "./event";
import {player} from "./player";
import {game_stats_rollup} from "./game_stats_rollup";
import { user_alliance } from "./user_alliance";


@Entity("game",{schema:"slg_v4_db" } )
// @Index("game_event",["event",])
// @Index("game_series",["series",])
export class game extends BaseEntity {

    @PrimaryGeneratedColumn()
    id:number;        
        
    @Column("int",{ 
        nullable:false,
        primary:false,
        name:"series_id"
        })
    series_id:number;

    @Column("int",{ 
        nullable:false,
        primary:false,
        name:"event_id"
        })
    event_id:number;
    
    @Column("varchar",{ 
        nullable:true,
        name:"external_game_id"
        })
    external_game_id:string | null;       

   
    /*
    @ManyToOne(type=>series, series=>series.games,{  nullable:false,onDelete: 'NO ACTION',onUpdate: 'NO ACTION' })
    @JoinColumn({ name:'series_id'})
    series:series | null;

   
    @ManyToOne(type=>event, event=>event.games,{  nullable:false,onDelete: 'NO ACTION',onUpdate: 'NO ACTION' })
    @JoinColumn({ name:'event_id'})
    event:event | null;

    */

    @OneToMany(type=>game_stats_rollup, game_stats_rollup=>game_stats_rollup.games,{  nullable:false,onDelete: 'NO ACTION',onUpdate: 'NO ACTION' })
    @JoinColumn({ name:'tournament_code'})
    game_stats_rollup:game_stats_rollup | null;

    @OneToMany(type=>user_alliance, user_alliance=>user_alliance.game,{  nullable:false,onDelete: 'NO ACTION',onUpdate: 'NO ACTION' })
    @JoinColumn({ name: 'series_id',  referencedColumnName: 'series_id' })
    user_alliance:game | null;



    @Column("int",{ 
        nullable:true,
        name:"game_type_id"
        })
    game_type_id:number | null;
        

    @Column("varchar",{ 
        nullable:true,
        name:"game_mode"
        })
    game_mode:string | null;
        

    @Column("varchar",{ 
        nullable:true,
        name:"stage"
        })
    stage:string | null;
        

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
        

    @Column("datetime",{ 
        nullable:true,
        name:"created_at"
        })
    created_at:Date | null;
        

    @Column("varchar",{ 
        nullable:true,
        name:"game_state"
        })
    game_state:string | null;
        

    @Column("varchar",{ 
        nullable:true,
        name:"internal_game_id"
        })
    internal_game_id:string | null;
        

    @Column("bigint",{ 
        nullable:true,
        name:"version"
        })
    version:string | null;
        
}
