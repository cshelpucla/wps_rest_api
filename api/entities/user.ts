
import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {player} from "./player";
import {user_alliance} from "./user_alliance";


@Entity("users",{schema:"nthgames" } )
@Index("email",["email",],{unique:true})
@Index("promo_code",["promo_code",],{unique:true})
@Index("users_4a4e06c2",["date_i_agree_policy_tos",])
@Index("users_a098d9ec",["date_of_birth",])
@Index("users_city_224d57dbacf29ab9_uniq",["city",])
@Index("users_country_732399694a6b081f_uniq",["country",])
@Index("users_date_age_recorded_2e0eb86eb8c0d068_uniq",["date_age_recorded",])
@Index("users_first_name_3be69363c455c39c_uniq",["first_name",])
@Index("users_last_name_2d9d7a8182c1461f_uniq",["last_name",])
@Index("users_minecraft_name_6447c7178c590473_uniq",["minecraft_name",])
@Index("users_phone_number_20698b913f613eca_uniq",["phone_number",])
@Index("users_slg_profile_name_57f97c9722b6a90e_uniq",["slg_profile_name",],{unique:true})
@Index("users_state_6c141298f8cb33cc_uniq",["state",])
@Index("users_zip_code_4745e781fac3ce5d_uniq",["zip_code",])
export class user {

    @PrimaryGeneratedColumn({
        type:"int", 
        name:"id"
        })
    id:number;
        

    @Column("varchar",{ 
        nullable:false,
        length:128,
        name:"password"
        })
    password:string;
        

    @Column("datetime",{ 
        nullable:false,
        name:"last_login"
        })
    last_login:Date;
        

    @Column("varchar",{ 
        nullable:false,
        unique: true,
        name:"email"
        })
    email:string;
        

    @Column("varchar",{ 
        nullable:false,
        length:100,
        name:"phone_number"
        })
    phone_number:string;
        

    @Column("tinyint",{ 
        nullable:false,
        width:1,
        name:"is_active"
        })
    is_active:boolean;
        

    @Column("tinyint",{ 
        nullable:false,
        width:1,
        name:"is_staff"
        })
    is_staff:boolean;
        

    @Column("varchar",{ 
        nullable:false,
        length:64,
        name:"email_token"
        })
    email_token:string;
        

    @Column("tinyint",{ 
        nullable:false,
        width:1,
        name:"is_verified"
        })
    is_verified:boolean;
        

    @Column("varchar",{ 
        nullable:false,
        name:"first_name"
        })
    first_name:string;
        

    @Column("varchar",{ 
        nullable:false,
        name:"last_name"
        })
    last_name:string;
        

    @Column("tinyint",{ 
        nullable:false,
        width:1,
        name:"is_superuser"
        })
    is_superuser:boolean;
        

    @Column("varchar",{ 
        nullable:true,
        length:100,
        name:"image"
        })
    image:string | null;
        

    @Column("int",{ 
        nullable:true,
        name:"age"
        })
    age:number | null;
        

    @Column("varchar",{ 
        nullable:false,
        length:100,
        name:"city"
        })
    city:string;
        

    @Column("varchar",{ 
        nullable:false,
        length:16,
        name:"jersey_size"
        })
    jersey_size:string;
        

    @Column("varchar",{ 
        nullable:false,
        length:50,
        name:"state"
        })
    state:string;
        

    @Column("longtext",{ 
        nullable:true,
        name:"address"
        })
    address:string | null;
        

    @Column("varchar",{ 
        nullable:false,
        length:20,
        name:"zip_code"
        })
    zip_code:string;
        

    @Column("datetime",{ 
        nullable:true,
        name:"date_age_recorded"
        })
    date_age_recorded:Date | null;
        

    @Column("varchar",{ 
        nullable:false,
        length:120,
        name:"minecraft_name"
        })
    minecraft_name:string;
        

    @Column("varchar",{ 
        nullable:true,
        unique: true,
        length:120,
        name:"slg_profile_name"
        })
    slg_profile_name:string | null;
        

    @Column("varchar",{ 
        nullable:true,
        length:128,
        name:"affiliate_id"
        })
    affiliate_id:string | null;
        

    @Column("varchar",{ 
        nullable:false,
        length:2,
        name:"country"
        })
    country:string;
        

    @Column("varchar",{ 
        nullable:false,
        length:100,
        name:"laptop_status"
        })
    laptop_status:string;
        

    @Column("varchar",{ 
        nullable:true,
        unique: true,
        name:"promo_code"
        })
    promo_code:string | null;
        

    @Column("decimal",{ 
        nullable:false,
        precision:9,
        scale:2,
        name:"promo_credit_balance"
        })
    promo_credit_balance:string;
        

    @Column("datetime",{ 
        nullable:true,
        name:"date_i_agree_policy_tos"
        })
    date_i_agree_policy_tos:Date | null;
        

    @Column("date",{ 
        nullable:true,
        name:"date_of_birth"
        })
    date_of_birth:string | null;
        

    @Column("double",{ 
        nullable:false,
        name:"latitude"
        })
    latitude:number;
        

    @Column("double",{ 
        nullable:false,
        name:"longitude"
        })
    longitude:number;
        

    @Column("tinyint",{ 
        nullable:false,
        width:1,
        name:"is_super_action_squad"
        })
    is_super_action_squad:boolean;
        

    @Column("varchar",{ 
        nullable:false,
        length:64,
        name:"phone_token"
        })
    phone_token:string;
        

    @Column("tinyint",{ 
        nullable:false,
        width:1,
        name:"phone_verified"
        })
    phone_verified:boolean;
        

    @Column("tinyint",{ 
        nullable:false,
        width:1,
        name:"is_fill_player"
        })
    is_fill_player:boolean;
        

    @Column("varchar",{ 
        nullable:false,
        length:50,
        name:"contact_preference"
        })
    contact_preference:string;
        

    @Column("tinyint",{ 
        nullable:false,
        width:1,
        name:"newsletter_subscribe"
        })
    newsletter_subscribe:boolean;
        

    @Column("bigint",{ 
        nullable:false,
        default: () => "'0'",
        name:"version"
        })
    version:string;
        

    @Column("varchar",{ 
        nullable:true,
        name:"avatar"
        })
    avatar:string | null;
        

    @Column("datetime",{ 
        nullable:true,
        name:"date_created"
        })
    date_created:Date | null;
        

    @Column("datetime",{ 
        nullable:true,
        name:"date_modified"
        })
    date_modified:Date | null;
        

    @Column("datetime",{ 
        nullable:true,
        name:"date_deleted"
        })
    date_deleted:Date | null;
        

    @Column("varchar",{ 
        nullable:true,
        name:"address2"
        })
    address2:string | null;
        

    @Column("tinyint",{ 
        nullable:true,
        width:1,
        default: () => "'1'",
        name:"is_public"
        })
    is_public:boolean | null;
   

    @OneToMany(type=>player, player=>player.user,{ onDelete: 'NO ACTION' ,onUpdate: 'NO ACTION' })
    players:player[];

    @OneToMany(type=>user_alliance, user_alliance=>user_alliance.user,{ onDelete: 'NO ACTION' ,onUpdate: 'NO ACTION' })
    userAlliances:user_alliance[];
}
