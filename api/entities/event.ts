import {BaseEntity,Column,ViewEntity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";

@ViewEntity("slg_event",{schema:"slgwp_prod" } )
export class event extends BaseEntity {

    @Column("int",{ 
        nullable:false,
        primary:true,
        name:"id"
        })
    id:number;

    @Column("int",{ 
        nullable:false,
        primary:false,
        name:"series_id"
        })
    series_id:number;

    @Column("int",{ 
        nullable:false,
        primary:false,
        name:"venue_id"
        })
    venue_id:number;       

    @Column("longtext",{ 
        nullable:false,
        name:"name"
        })
    name:string;       
   
    /*
    @ManyToOne(type=>series, series=>series.events,{  nullable:false,onDelete: 'NO ACTION',onUpdate: 'NO ACTION' })
    @JoinColumn({ name:'series_id'})
    series:series | null;
    */

    @Column("datetime",{ 
        nullable:false,
        name:"promo_start_date"
        })
    promo_start_date:Date;
        
    @Column("datetime",{ 
        nullable:false,
        name:"promo_end_date"
        })
    promo_end_date:Date;

    @Column("datetime",{ 
        nullable:false,
        name:"sales_start_date"
        })
    sales_start_date:Date;

    @Column("datetime",{ 
        nullable:false,
        name:"sales_end_date"
        })
    sales_end_date:Date;

    @Column("datetime",{ 
        nullable:false,
        name:"start_time"
        })
    start_time:Date;       

    @Column("datetime",{ 
        nullable:false,
        name:"end_time"
        })
    end_time:Date;

    @Column("datetime",{ 
        nullable:true,
        name:"created_dt"
        })
    created_dt:Date | null;
        

    @Column("datetime",{ 
        nullable:true,
        name:"updated_dt"
        })
    updated_dt:Date | null;
        

    @Column("datetime",{ 
        nullable:true,
        name:"deleted_dt"
        })
    deleted_dt:Date | null;
        

    @Column("longtext",{ 
        nullable:true,
        name:"description"
        })
    description:string | null;
        
    @Column("longtext",{ 
        nullable:true,
        name:"short_description"
        })
    short_description:string | null;


    /*
    @OneToMany(type=>game, game=>game.event,{ onDelete: 'NO ACTION' ,onUpdate: 'NO ACTION' })
    games:game[];
    
   @OneToOne(type=>venue, venue=>venue.event,{  nullable:false,onDelete: 'NO ACTION',onUpdate: 'NO ACTION' })
   @JoinColumn({ name:'event_id'})
   venue:venue | null;

   @OneToOne(type=>series, series=>series.event,{  nullable:false,onDelete: 'NO ACTION',onUpdate: 'NO ACTION' })
   @JoinColumn({ name:'series_id'})
   series:series | null;
    */

}
