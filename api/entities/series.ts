import {BaseEntity,Column,ViewEntity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";

@ViewEntity("slg_series",{schema:"slgwp_prod" } )
export class series extends BaseEntity {

    @Column("int",{ 
        nullable:false,
        primary:true,
        name:"id"
        })
    id:number;
        
    @Column("int",{ 
        nullable:false,
        primary:false,
        name:"experience_id"
        })
    experience_id:number;
  
    /*
    @OneToMany(type=>event, event=>event.series,{  nullable:false,onDelete: 'NO ACTION',onUpdate: 'NO ACTION' })
    @JoinColumn({ name:'experience_id'})
    event:event | null;

    
    @ManyToOne(type=>alliance, alliance=>alliance.seriess,{  nullable:false,onDelete: 'NO ACTION',onUpdate: 'NO ACTION' })
    @JoinColumn({ name:'experience_id'})
    experience:experience | null;
       
    
    @ManyToOne(type=>experience, experience=>experience.seriess,{  nullable:false,onDelete: 'NO ACTION',onUpdate: 'NO ACTION' })
    @JoinColumn({ name:'experience_id'})
    experience:experience | null;
    */

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
    start_time:Date;
        

    @Column("datetime",{ 
        nullable:false,
        name:"end_datetime"
        })
    end_time:Date;       

    @Column("datetime",{ 
        nullable:false,
        name:"alliance_selection_end_date"
        })
    alliance_selection_end_date:Date;       
 
    @Column("longtext",{ 
        nullable:false,
        name:"alliance_selection_end_date_time_zone"
        })
    alliance_selection_end_date_time_zone:string;

    @Column("longtext",{ 
        nullable:false,
        name:"time_zone"
        })
    time_zone:string;
    
}
