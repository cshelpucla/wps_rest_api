import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";

@Entity("customer",{schema:"wps_data" } )
export class customer extends BaseEntity {

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

    @Column("int",{ 
        nullable:false,
        name:"age"
        })
    age:number;

    @Column("varchar",{ 
        nullable:false,
        name:"profession"
        })
    profession:string;
    
    @Column("datetime",{ 
        nullable:true,
        name:"date_created"
        })
    dateCreated:Date | null;
    
}
