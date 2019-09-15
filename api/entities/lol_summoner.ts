import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {player} from "./player";

@Entity("lol_summoner",{schema:"lol_service_db" } )
@Index("user_id",["user_id",],{unique:true})
export class lol_summoner {

    @PrimaryGeneratedColumn({
        type:"bigint", 
        name:"id"
        })
    id:string;
        

    @Column("int",{ 
        nullable:false,
        unique: true,
        name:"user_id"
        })
    user_id:number;
        

    @Column("varchar",{ 
        nullable:false,
        name:"name"
        })
    name:string;
        

    @Column("varchar",{ 
        nullable:false,
        name:"summoner_id"
        })
    summoner_id:string;
        

    @Column("varchar",{ 
        nullable:true,
        name:"puuid"
        })
    puuid:string | null;
        

    @Column("int",{ 
        nullable:true,
        name:"level"
        })
    level:number | null;
        

    @Column("varchar",{ 
        nullable:true,
        name:"rank"
        })
    rank:string | null;
        

    @Column("int",{ 
        nullable:true,
        name:"role_id"
        })
    role_id:number | null;
        

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
        

    @Column("bigint",{ 
        nullable:false,
        default: () => "'0'",
        name:"version"
        })
    version:string;
        

    @Column("tinyint",{ 
        nullable:false,
        width:1,
        default: () => "'0'",
        name:"is_valid"
        })
    is_valid:boolean;

    @OneToMany(type=>player, player=>player.lol_summoner,{ onDelete: 'NO ACTION' ,onUpdate: 'NO ACTION' })
    players:player[];
    
        
}
