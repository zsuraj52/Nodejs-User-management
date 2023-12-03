import { AppDataSource } from "../data-source";
import { AdminEntity } from "../entity/adminEntity";
import { ProjectEntity } from "../entity/projectEntity"
import { UserEntity } from "../entity/userEntity";
import { getUserById } from "./userRepo";

const projectRepo = AppDataSource.getRepository(ProjectEntity); 
const userRepo = AppDataSource.getRepository(UserEntity);
const adminRepo = AppDataSource.getRepository(AdminEntity);

export const createUserProject = async (project_Name:string, project_Language:string, project_Deadline:string ,user_id:number , admin_id:number) => {
    try {

        let userData = await userRepo.findOneBy({ id: user_id }).then((res) => {
            delete (res.password);
            return res;
        })
        console.log("user : ", userData);
        console.log("AdminID :",admin_id);
        
        let admin = await adminRepo.findOneBy({ id: admin_id }).then((data) => {
            if (!data)
                throw("No Admin Found. ")
            delete (data.token);
            delete (data.password);
            return data;
        })
        console.log("Admin : ",admin);
        let projectData = {
            project_Name : project_Name,
            project_Language :project_Language, 
            project_Deadline : project_Deadline,
            user: userData,
            admin : admin
        }
        await AppDataSource.createQueryBuilder().insert().into(ProjectEntity).values(projectData).execute();
        return projectData;
    } catch (e) {
        console.log("Error in createUserProject catch : ",e.message);
        throw (e);
    }
}

export const getProjectForGivenUser = async (project_Name: string, project_Language: string , user_id:number)=> {
    try {

        let data = AppDataSource.createQueryBuilder(UserEntity, 'user').leftJoinAndSelect("user.project", "project").where("user.id = :id", { id: user_id }).andWhere("project.project_Name = :project_Name", { project_Name: project_Name }).andWhere("project.project_Language = :project_Language", { project_Language: project_Language }).getMany();
        console.log("Data : ",data);
        return data;
        // return await projectRepo.find({
        //     where: {
        //         user: {
        //             id: user_id
        //         },
        //         project_Name: project_Name,
        //         project_Language: project_Language
        //     }
        // }).then((project) => {
        //     console.log("Query Response :",project);
        //     return project;
        // }).catch((e) => {
        //             console.log("Error : ",e);
        //             console.log("Error in getProjectForGivenUser Query .catch : ",e.message);
        //             throw (e);
        //         })
    } catch (e) {
        console.log("Error in getProjectForGivenUser catch : ",e.message);
        throw (e);   
    }
} 

export const getUsersProjects = async (project_Name: string, project_Language: string , user_id:number) => {
    try {
        return await getUserById(user_id).then( async (user) => {
            if (!user)
                throw ("User Not Found. ");
            return await getProjectForGivenUser(project_Name, project_Language, user_id).then((res) => {
                return res;
                }).catch((e) => {
                    console.log("Error in getProjectForGivenUser .catch : " ,e.message);
                    throw (e);
                })
            }).catch((e) => {
                console.log("Error in getUserById .catch : ",e.message);
                throw (e);
            })
    } catch (e) {
        console.log("Error in getUsersProjects catch : ",e.message);
        throw (e);
    }
}

export const getProjectsList = async (userid: number):Promise<any> => {
    try {
        // return await projectRepo.find({
        //     where: {
        //         user: {
        //             id:userid
        //         }
        //     }
        // }).then((data:any) => {
        //     if (!data)
        //         throw ("No Projects Assigned For Given User. ");
        //     return data;
        // })
        let data = AppDataSource.createQueryBuilder("UserEntity", "user").leftJoinAndSelect("user.project", "project").where("user.id = :id", { id: userid }).getMany();
        console.log("Data : ", data);
        return (await data).filter((arrayData: any) => {
            delete (arrayData.password)
            return data;
        })
    } catch (e) {
        console.log("Error in getProjectsList catch : ",e.message);
        throw (e);
    }
}

export const getProjectUsingId = async (projectid: number) => {
    try {
        return await projectRepo.findOneBy({ id: projectid }).then((project) => {
            if (!project)
                throw("No Project Found. ")
            return project;
        })
    } catch (e) {
        console.log("Error in getProjectUsingId catch : ",e.message);
        throw (e);
    }
}

export const getAllProjectsList = async (): Promise <any>=> {
    // return await projectRepo.find();

    //InnerJoinAndSelect Concept
    const query = AppDataSource.createQueryBuilder('UserEntity', 'user').innerJoinAndSelect('user.project', 'p'); 
    let data = await query.getMany();
    return data.filter(async (res: UserEntity) => {
        delete (res.password)
        return res;
    })
}

export const saveProject = async (projectid:number, data:ProjectEntity) => {
    try {
        return await getProjectUsingId(projectid).then( async (project: ProjectEntity) => {
            if (!project)
                throw ("No Project Found. ")
            let newProject : ProjectEntity = Object.assign(project, data);
            await AppDataSource.createQueryBuilder().update<ProjectEntity>(ProjectEntity, newProject).where("id = :id", { id: projectid }).updateEntity(true).execute();
            return newProject;
        } )
    } catch (e) {
        console.log("Error in saveProject catch : ",e.message);
        throw (e);
    }
}

export const deleteProjectFromDb = async (projectid: number) => {
    try {
        return await getProjectUsingId(projectid).then( async (project:ProjectEntity) => {
            if (!project)
                throw ("No Proejct Found To Delete. ")
            await AppDataSource.createQueryBuilder().delete().from(ProjectEntity).where("id= :id", { id: projectid }).execute();
            return "Project Deleted Successfully! ";
        })
    }
    catch (e) {
        console.log("Error in deleteProjectFromDb catch : ",e.message);
        throw (e);
    }
}