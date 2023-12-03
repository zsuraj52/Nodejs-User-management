import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn, ManyToOne } from "typeorm";
import { AdminEntity } from "./adminEntity";
import { ProjectEntity } from "./projectEntity";

@Entity({ name : 'User' })
export class UserEntity {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column({name:'userName' , nullable : false})
    public userName: string ;

    @Column({name:'email' , nullable : false})
    public email: string ;

    @Column({name:'password' , nullable : false})
    public password: string ;

    @ManyToOne(() => AdminEntity, (admin) => admin.user,{onDelete:'CASCADE'})
    // @JoinColumn({ name: 'admin_id', referencedColumnName: 'id' })
    public admin: AdminEntity;

    @OneToMany(() => ProjectEntity , project => project.user)
    public project: ProjectEntity[];

}