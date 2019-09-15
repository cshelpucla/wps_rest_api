import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";


@Entity("game_team",{schema:"slg_v4_db" } )
@Index("join_game_to_team_game",["game_id",])
@Index("join_game_to_team_team",["team_id",])
export class game_team extends BaseEntity {

    @PrimaryGeneratedColumn()
    id:number;               

    @Column("bigint",{ 
        nullable:false,
        name:"game_id"
        })
    game_id:string;
        

    @Column("bigint",{ 
        nullable:false,
        name:"team_id"
        })
    team_id:string;
        

    @Column("int",{ 
        nullable:true,
        name:"side_descriptor"
        })
    side_descriptor:number | null;
        

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
        nullable:true,
        name:"version"
        })
    version:string | null;
        
}
