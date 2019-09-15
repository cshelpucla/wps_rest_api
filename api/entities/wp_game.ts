import {BaseEntity,Column,ViewEntity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {series} from "./series";
import {user_alliance} from "./user_alliance";

@ViewEntity("slg_game",{schema:"slgwp_prod" } )
export class wp_game extends BaseEntity {

    @Column("int",{ 
        nullable:false,
        primary:true,
        name:"id"
        })
    id:number;
        
    @Column("varchar",{ 
        nullable:false,
        name:"title"
        })
    title:string;   

    @Column("varchar",{ 
        nullable:false,
        name:"publisher"
        })
    publisher:string;   


    /*
    @ManyToOne(type=>series, series=>series.alliances,{  nullable:false,onDelete: 'NO ACTION',onUpdate: 'NO ACTION' })
    @JoinColumn({ name:'series_id'})
    series:series | null;
    */          

    /*

    @Column("bigint",{ 
        nullable:false,
        name:"version"
        })
    version:string;


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
        

    @OneToMany(type=>user_alliance, user_alliance=>user_alliance.alliance,{ onDelete: 'NO ACTION' ,onUpdate: 'NO ACTION' })
    userAlliances:user_alliance[];
    */
}
