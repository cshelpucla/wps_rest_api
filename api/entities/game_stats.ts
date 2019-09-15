import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";


@Entity("game_stats",{schema:"slg_v4_db" } )
export class game_stats extends BaseEntity {

    @Column("int",{ 
        nullable:false,
        primary:true,
        name:"id"
        })
    id:number;
        

    @Column("bigint",{ 
        nullable:false,
        name:"game_id"
        })
    game_id:string;
        

    @Column("text",{ 
        nullable:false,
        name:"body"
        })
    body:string;
        

    @Column("datetime",{ 
        nullable:false,
        name:"match_end_date"
        })
    match_end_date:Date;
        

    @Column("datetime",{ 
        nullable:false,
        name:"created_at"
        })
    created_at:Date;
        
}
