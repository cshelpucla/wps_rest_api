import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {user} from "./user";
import {series} from "./series";
import {alliance} from "./alliance";
import {player} from "./player";
import { game } from "./game";


@Entity("user_alliance",{schema:"slg_v4_db" } )
export class user_alliance extends BaseEntity {

    @PrimaryGeneratedColumn()
    id:number;        
        
    @Column("int",{ 
        nullable:false,
        primary:false,
        name:"slg_user_id"
        })
    slg_user_id:number;

    @Column("int",{ 
        nullable:false,
        primary:false,
        name:"series_id"
        })
    series_id:number;
   
    @Column("int",{ 
        nullable:false,
        primary:false,
        name:"alliance_id"
        })
    alliance_id:number;

    @ManyToOne(type=>user, user=>user.userAlliances,{  nullable:false,onDelete: 'NO ACTION',onUpdate: 'NO ACTION' })
    @JoinColumn({ name:'slg_user_id', referencedColumnName: 'id'})
    user:user | null;
    /*    
    @ManyToOne(type=>series, series=>series.userAlliances,{  nullable:false,onDelete: 'NO ACTION',onUpdate: 'NO ACTION' })
    @JoinColumn({ name:'series_id'})
    series:series | null;

    @ManyToOne(type=>alliance, alliance=>alliance.userAlliances,{  nullable:false,onDelete: 'NO ACTION',onUpdate: 'NO ACTION' })
    @JoinColumn({ name:'alliance_id'})
    alliance:alliance | null;
    */

    @ManyToOne(type=>player, player=>player.userAlliances,{  nullable:false,onDelete: 'NO ACTION',onUpdate: 'NO ACTION' })
    @JoinColumn({ name:'slg_user_id', referencedColumnName: 'slg_user_id'})
    player:player | null;

    @ManyToOne(type=>game, game=>game.user_alliance,{  nullable:false,onDelete: 'NO ACTION',onUpdate: 'NO ACTION' })
    @JoinColumn({ name: 'series_id',  referencedColumnName: 'series_id' })
    game:game | null;


    @Column("date",{ 
        nullable:true,
        name:"created_dt"
        })
    created_dt:string | null;
        

    @Column("date",{ 
        nullable:true,
        name:"updated_dt"
        })
    updated_dt:string | null;
        

    @Column("date",{ 
        nullable:true,
        name:"deleted_dt"
        })
    deleted_dt:string | null;
        

    @Column("bigint",{ 
        nullable:true,
        name:"version"
        })
    version:string | null;
        
}
