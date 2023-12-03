import { ProjectEntity } from "../entity/projectEntity";
import { UserEntity } from "../entity/userEntity";
import { createUserProject, getUsersProjects , getProjectsList , getProjectUsingId , getAllProjectsList , saveProject, deleteProjectFromDb} from "../repository/projectRepo"
import { getUserById } from "../repository/userRepo"

export const getUserProjects = async (project_Name:string, project_Language:string, project_Deadline:string ,user_id:number , admin_id:number) => {
    try {
        return await getUserById(user_id).then(async (user) => {
            if (!user)
                throw ("User Not Found. ")
            console.log("User Found! ");
            
            return await getUsersProjects(project_Name, project_Language, user_id).then(async (userProject) => {
                console.log("userProject :",userProject);
                    if (userProject.length != 0)
                        throw ("Project Already Assigned To User");
                return await createUserProject(project_Name, project_Language, project_Deadline, user_id, admin_id).then(async (project) => {
                    return project;
                    }).catch((e) => {
                        console.log("Error While Creating Project For Given User. ");
                        throw (e)
                    })
                }).catch((e) => {
                    console.log("Error While Getting User Projects. ");
                            throw (e)
                    })        
            }).catch((e) => {
                    console.log("Error While Getting User. ");
                    throw(e)
                })
    } catch (e) {
        console.log("Something Went Wrong While Creating Project. " ,e);
        throw (e);
    }
}

export const getAllProjectsForUser = async (userid: number) => {
    return await getUserById(userid).then(async (user: UserEntity) => {
        console.log("User getAllProjectsForUser : ", user);
        if (!user)
            throw("No User Found. ")
        let id = user.id;
        return await getProjectsList(id).then((data : ProjectEntity) => {
            return data;
        })
    })
}

export const getProject = async (projectid : number) => {
    try {
        return await getProjectUsingId(projectid).then((project:ProjectEntity) => {
            if (!project)
                throw ("No Project Found. ")
            console.log("Project : ",project);
            return project; 
        }).catch((e) => {
            console.log("Error in getProject catch : ",e);
            throw (e);
        })
    } catch (e) {
        
    }
}

export const getAllProjectsLists = async () => {
    return await getAllProjectsList().then((res) => {
        if (!res)
            throw ("No Projects Found. ");
        console.log("Projects List :",res);
        return res;
    })
}

export const updateProjectById = async (projectid:number , data : ProjectEntity) => {
    return await getProjectUsingId(projectid).then( async (project:ProjectEntity) => {
        if (!project)
            throw ("No Project Found To Update. ");
        return await saveProject(projectid, data).then((res:ProjectEntity) => {
            return res;
        })
    })
}

export const deleteProjectById = async (projectid: number) => {
    return await getProjectUsingId(projectid).then( async (project: ProjectEntity) => {
        if (!project)
            throw ("No Project Found To Deletet. ");
        return await deleteProjectFromDb(projectid).then((res :string) => {
            return res;
        })
    })
}
