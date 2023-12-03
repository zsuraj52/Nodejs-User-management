import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"
import { ProjectEntity } from "./projectEntity";
import { UserEntity } from "./userEntity";

@Entity({name : 'Admin'})
export class AdminEntity {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column({name:'adminName' , nullable : false})
    public adminName: string ;

    @Column({name:'email' , nullable : false})
    public email: string ;

    @Column({name:'password' , nullable : false})
    public password: string ;
    
    @Column ({name :'token' , nullable :true})
    public token:string;

    @OneToMany(() => UserEntity , (user) => user.admin)
    public user: UserEntity[];

    // @OneToMany(() => ProjectEntity , (project) => project.admin)
    // public project: ProjectEntity[];

}