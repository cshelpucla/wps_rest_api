import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {team_player} from "./team_player";


@Entity("custom_query_def",{schema:"slg_v4_db" } )
export class custom_query_def extends BaseEntity {

    @PrimaryGeneratedColumn()
    id:number;        

    @Column("longtext",{ 
        nullable:false,
        name:"query_type"
        })
    query_type:string;

    @Column("longtext",{ 
        nullable:false,
        name:"query_name"
        })
    query_name:string;

    @Column("int",{ 
        nullable:false,
        name:"experience_id"
        })
    experience_id:number;

    @Column("longtext",{ 
        nullable:false,
        name:"experience_slug"
        })
    experience_slug:string;

    @Column("longtext",{ 
        nullable:false,
        name:"query_text"
        })
    query_text:string;

    @Column("longtext",{ 
        nullable:false,
        name:"query_html"
        })
    query_html:string;

    @Column("longtext",{ 
        nullable:true,
        name:"query_param1_name"
        })
    query_param1_name:string;

    @Column("longtext",{ 
        nullable:true,
        name:"query_param1_type"
        })
    query_param1_type:string;


    @Column("longtext",{ 
        nullable:true,
        name:"query_param2_name"
        })
    query_param2_name:string;

    @Column("longtext",{ 
        nullable:true,
        name:"query_param2_type"
        })
    query_param2_type:string;

    @Column("longtext",{ 
        nullable:true,
        name:"query_param3_name"
        })
    query_param3_name:string;

    @Column("longtext",{ 
        nullable:true,
        name:"query_param3_type"
        })
    query_param3_type:string;

    @Column("longtext",{ 
        nullable:true,
        name:"query_param4_name"
        })
    query_param4_name:string;

    @Column("longtext",{ 
        nullable:true,
        name:"query_param4_type"
        })
    query_param4_type:string;

    @Column("datetime",{ 
        nullable:true,
        name:"updated_at"
        })
    updated_at:Date | null;        

    @Column("datetime",{ 
        nullable:true,
        name:"created_at"
        })
    created_at:Date | null;
        
    @Column("longtext",{ 
        nullable:true,
        name:"version"
        })
    version:string;

    @Column("longtext",{ 
        nullable:true,
        name:"current"
        })
    current:string;
   
}
