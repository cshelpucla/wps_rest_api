import {BaseEntity,ViewEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {player} from "./player";
import {series} from "./series";
import {experience_slug} from "./experience_slug";

@ViewEntity("slg_experience",{schema:"slgwp_prod" } )
export class experience extends BaseEntity {

    @Column("int",{ 
        nullable:false,
        primary:true,
        name:"id"
        })
    id:number;

    @Column("longtext",{ 
        nullable:false,
        name:"name"
        })
    name:string;
        

    @Column("longtext",{ 
        nullable:false,
        name:"description"
        })
    description:string;
        

    @Column("datetime",{ 
        nullable:false,
        name:"start_datetime"
        })
    start_date:Date;
        

    @Column("datetime",{ 
        nullable:false,
        name:"end_datetime"
        })
    end_date:Date;      

    @Column("longtext",{ 
        nullable:false,
        name:"timezone"
        })
    timezone:string;      

    @Column("longtext",{ 
        nullable:false,
        name:"experience_slug"
        })
    experience_slug:string;      

    @Column("longtext",{ 
        nullable:false,
        name:"email_slug"
        })
    email_slug:string;      

    @Column("longtext",{ 
        nullable:false,
        name:"game_ids"
        })
    game_ids:string;      

    @Column("longtext",{ 
        nullable:false,
        name:"venue"
        })
    experience_venue:string;      
  
    /*
    @OneToMany(type=>player, player=>player.experience,{ onDelete: 'NO ACTION' ,onUpdate: 'NO ACTION' })
    players:player[];
       
    @OneToMany(type=>series, series=>series.experience,{ onDelete: 'NO ACTION' ,onUpdate: 'NO ACTION' })
    seriess:series[];

    @OneToOne(type=>experience_slug, experience_slug=>experience_slug.experience,{  nullable:false,onDelete: 'NO ACTION',onUpdate: 'NO ACTION' })
    @JoinColumn({ name: 'id',  referencedColumnName: 'experience_id' })
    experience_slug:experience_slug | null;
    */
}
