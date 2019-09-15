import {BaseEntity,Column,ViewEntity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";

@ViewEntity("slg_geo_venue",{schema:"slgwp_prod" } )
export class venue extends BaseEntity {

    @Column("int",{ 
        nullable:false,
        primary:true,
        name:"id"
        })
    id:number;
    
    @Column("int",{ 
        nullable:false,
        name:"term_id"
        })
    term_id:number;

    @Column("varchar",{ 
        nullable:false,
        name:"name"
        })
    name:string;   

    @Column("varchar",{ 
        nullable:false,
        name:"type"
        })
    type:string;   

    @Column("varchar",{ 
        nullable:false,
        name:"status"
        })
    status:string;   

    @Column("varchar",{ 
        nullable:false,
        name:"phone"
        })
    phone:string;   

    @Column("varchar",{ 
        nullable:false,
        name:"address"
        })
    address:string;   

    @Column("varchar",{ 
        nullable:false,
        name:"address2"
        })
    address2:string;   

    @Column("varchar",{ 
        nullable:false,
        name:"city"
        })
    city:string;   

    @Column("varchar",{ 
        nullable:false,
        name:"state"
        })
    state:string;   

    @Column("varchar",{ 
        nullable:false,
        name:"zipcode"
        })
    zipcode:string;   

    @Column("varchar",{ 
        nullable:false,
        name:"slg_approved"
        })
    slg_approved:string;   

    @Column("varchar",{ 
        nullable:false,
        name:"timezone"
        })
    timezone:string;   

    @Column("varchar",{ 
        nullable:false,
        name:"currency"
        })
    currency:string;   

    @Column("varchar",{ 
        nullable:false,
        name:"age_restrictions"
        })
    age_restriction:string;   

    @Column("number",{ 
        nullable:false,
        name:"lat"
        })
    lat:number;   

    @Column("number",{ 
        nullable:false,
        name:"lng"
        })
    lng:number;   

    
    /*
    @OneToOne(type=>event, event=>event.venue,{  nullable:false,onDelete: 'NO ACTION',onUpdate: 'NO ACTION' })
    @JoinColumn({ name:'venue_id'})
    event:event | null;         

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
