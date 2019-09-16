import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";

@Entity("user",{schema:"wps_data" } )
export class user extends BaseEntity {

    @PrimaryGeneratedColumn()
    id:number;               

    @Column("varchar",{ 
        nullable:false,
        name:"first_name"
        })
    firstName:string;

    @Column("varchar",{ 
        nullable:false,
        name:"last_name"
        })
    lastName:string;

    @Column("varchar",{ 
        nullable:false,
        name:"userid"
        })
    userid:string;

    @Column("varchar",{ 
        nullable:false,
        name:"password"
        })
    password:string;
    
    @Column("varchar",{ 
        nullable:false,
        name:"roles"
        })
    roles:string;
    

    @Column("datetime",{ 
        nullable:true,
        name:"date_created"
        })
    dateCreated:Date | null;
    
}
