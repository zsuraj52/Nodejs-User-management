import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne } from "typeorm";
import { AdminEntity } from "./adminEntity";
import { UserEntity } from "./userEntity";

@Entity({ name : 'Projects' })
export class ProjectEntity {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column({name:'project_Name' , nullable : false})
    public project_Name: string ;

    @Column({name:'project_Deadline' , nullable : false})
    public project_Deadline: string ;

    @Column({name:'project_Language' , nullable : false})
    public project_Language: string ;

    @ManyToOne(() => AdminEntity, {onDelete:'CASCADE'})
    // @JoinColumn({ name: 'admin_id', referencedColumnName: 'id' })
    public admin: AdminEntity;

    @ManyToOne(() => UserEntity, (user) => user.project , {onDelete:'CASCADE'})
    // @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
    public user: UserEntity;

}