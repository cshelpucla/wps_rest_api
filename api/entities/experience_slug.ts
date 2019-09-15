import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {experience} from "./experience";

@Entity("experience_slug",{schema:"slg_v4_db" } )
export class experience_slug {

    @PrimaryGeneratedColumn({
        type:"int", 
        name:"id"
        })
    id:number;
        

    @Column("int",{ 
        nullable:true,
        name:"experience_id"
        })
    experience_id:number | null;
        

    @Column("varchar",{ 
        nullable:true,
        name:"experience_slug"
        })
    eperience_slug:string | null;
        

    @Column("datetime",{ 
        nullable:true,
        name:"creatre_dt"
        })
    creatre_dt:Date | null;
        

    @Column("datetime",{ 
        nullable:true,
        name:"update_dt"
        })
    update_dt:Date | null;
        

    @Column("datetime",{ 
        nullable:true,
        name:"delete_dt"
        })
    delete_dt:Date | null;

    //@OneToOne(type=>experience, experience=>experience.experience_slug,{ onDelete: 'NO ACTION' ,onUpdate: 'NO ACTION' })
    //@JoinColumn({ name: 'experience_id',  referencedColumnName: 'id' })
    //experience:experience;
    
        
}
