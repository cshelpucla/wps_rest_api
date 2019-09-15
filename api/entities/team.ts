import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {team_player} from "./team_player";


@Entity("team",{schema:"slg_v4_db" } )
export class team extends BaseEntity {

    @PrimaryGeneratedColumn()
    id:number;        

    @Column("int",{ 
        nullable:false,
        name:"name"
        })
    name:number;
    
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
        

    @Column("datetime",{ 
        nullable:true,
        name:"updated_at"
        })
    updated_at:Date | null;


   
    @OneToMany(type=>team_player, team_player=>team_player.team,{ onDelete: 'NO ACTION' ,onUpdate: 'NO ACTION' })
    teamPlayers:team_player[];
    
}
