import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";


@Entity("callback_data",{schema:"slg_v4_db" } )
export class callback_data {

    @Column("bigint",{ 
        nullable:false,
        primary:true,
        name:"id"
        })
    id:string;
        

    @Column("varchar",{ 
        nullable:false,
        name:"tournament_code"
        })
    tournament_code:string;
        

    @Column("text",{ 
        nullable:false,
        name:"data"
        })
    data:string;
        

    @Column("bigint",{ 
        nullable:false,
        name:"game_id"
        })
    game_id:string;
        

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
        name:"version"
        })
    version:string;
        
}
