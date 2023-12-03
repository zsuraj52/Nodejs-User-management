// ?? Remove unused imports
import { Request, Response } from "express";
import { ProjectEntity } from "../entity/projectEntity";
import { getUserProjects , getAllProjectsForUser , getProject, getAllProjectsLists , updateProjectById ,deleteProjectById} from "../services/projectServices";

export const createProject = async (req: Request, res: Response) => {
    const { project_Name, project_Language, project_Deadline, admin_id } = req.body;
    console.log("Project Data : ", project_Name, project_Language, project_Deadline, admin_id);
    
    let user_id = parseInt(req.params.userid);
    console.log("User ID :" ,user_id);
    
    try {       
        return await getUserProjects(project_Name, project_Language, project_Deadline, user_id, admin_id).then((data) => {
            console.log("Response :",data);
            res.status(201).send({"Status :" : "SUCCESS" , "Message :" : `Project For User ID ${user_id} Created Successfully. ` , "Response :" : data})
        }).catch((e) => {
            console.log("Error : Catch = ", e);
            res.status(400).send({"Status :" : "FAILED" , "Message :" : `Failed To Create Project For User ${user_id}` , "Response :" : e})
        })  
    } catch (e) {
        console.log("Error in catch :", e);
        res.status(400).send({"Status :" : "FAILED" , "Message :" : e})
    }
}


export const getAllProjectsByUserId = async (req: Request, res: Response) => {
    console.log("User Id :",req.params.userid);
    try {
        let userid = parseInt (req.params.userid); 
        if (!userid)
            res.status(400).send({ "Status :": "FAILED", "Message :": "Please Provide User ID" });
        await getAllProjectsForUser(userid).then((projects) => {
            if (!projects)
                throw("NO Projects Found. ")
            console.log("List Of Projects For Given User :",projects);
            res.status(200).send({ "Status :": "SUCCESS", "Message :": "List Of Projects For Gievn User is Rendered. ", "Response :": projects})
        }).catch((e) => {
            console.log("Error in getAllProjects : .catch ",e);
            res.status(400).send({"Status :" : "FAILED" , "Message :" : "Failed To Get List Of Projedcts for Given User. " , "Response :" : e})
        })
        
    } catch (e) {
        console.log("Error in getAllProjects catch : ",e);
        res.status(400).send({"Status :" : "FAILED" , "Message :" : "Something Went Wrong while Getting List Of Projedcts for Given User. " , "Response :" : e})
    }
}


export const getProjectById = async (req: Request, res: Response) => {
    console.log("Project ID :",req.params.projectid);
    try {
        let projectid = parseInt(req.params.projectid);
        if (!projectid)
            res.status(400).send({ "Status :": "FAILED", "Message :": "Please Provide Project ID" });
        await getProject(projectid).then((project: ProjectEntity) => {
            if (!project)
                throw("No Project Found. ")
            console.log("Project For Given Id :",project);
            res.status(200).send({ "Status :": "SUCCESS", "Message :": "Project For Gievn Project-ID is Rendered. ", "Response :": project });
            }).catch((e) => {
                console.log("Error in getProjectById : .catch ",e);
                res.status(400).send({ "Status :": "FAILED", "Message :": "Failed To Get Project for Given Project-ID. ", "Response :": e });
            })
    } catch (e) {
        console.log("Error in getAllProjects catch : ",e);
        res.status(400).send({"Status :" : "FAILED" , "Message :" : "Something Went Wrong While Getting Project for Given Project-ID. " , "Response :" : e})
    }
}


export const getAllProjects = async (req:Request,res:Response) => {
    try {
        await getAllProjectsLists().then((projects ) => {
            if (!projects)
                res.status(400).send({ "Status :": "FAILED", "Message :": "No Projects Found. " });
            res.status(200).send({ "Status :": "SUCCESS", "Message :": "Project For Gievn Project-ID is Rendered. ", "Response :": projects });
        }).catch((e : string) => {
            console.log("Error in getProjectsList .catch : ",e);
            res.status(400).send({"Status :" : "FAILED" , "Message :" : "Failed To Get Projects. " , "Response :" : e})
        })
    } catch (e) {
        console.log("Error in getAllProjects catch : ",e);
        res.status(400).send({"Status :" : "FAILED" , "Message :" : "Something Went Wrong While Getting Projects. " , "Response :" : e})
    }
}


export const updateProject = async (req:Request , res:Response) => {
    console.log("Project ID : ",req.params.projectid);
    console.log("Data To Update :",req.body);
    
    try {
        let data : ProjectEntity= req.body;
        let projectid = parseInt(req.params.projectid);
        if (!projectid)
            res.status(400).send({ "Status :": "FAILED", "Message :": "Please Provide Project ID" });
        await updateProjectById(projectid , data).then((project:ProjectEntity) => {
            res.status(200).send({ "Status :": "SUCCESS", "Message :": "Project For Gievn Project-ID  Updated Successfully. ", "Response :": project });
        }).catch((e:string) => {
            console.log("Error in updateProject .catch : ",e);
            res.status(400).send({"Status :" : "FAILED" , "Message :" : "Failed To Update Project. " , "Response :" : e})
        })    
    } catch (e) {
        console.log("Error in updateProject catch : ",e);
        res.status(400).send({"Status :" : "FAILED" , "Message :" : "Something Went Wrong While Updating Project. " , "Response :" : e})
    }
}


export const deleteProject = async (req:Request , res:Response) => {
    console.log("Project ID : ",req.params.projectid);
    try {
        let projectid = parseInt(req.params.projectid);
        if (!projectid)
            res.status(400).send({ "Status :": "FAILED", "Message :": "Please Provide Project ID" });
        await deleteProjectById(projectid).then((response: string) => {
            res.status(200).send({ "Status :": "SUCCESS", "Message :": "Project For Gievn Project-ID  Deleted Successfully. ", "Response :": response });
        }).catch((e : string) => {
            console.log("Error in deleteProjectById .catch : ",e);
            res.status(400).send({"Status :" : "FAILED" , "Message :" : "Failed To Delete Project. " , "Response :" : e})
        })
    } catch (e) {
        console.log("Error in updateProject catch : ",e);
        res.status(400).send({"Status :" : "FAILED" , "Message :" : "Something Went Wrong While Deleting Project. " , "Response :" : e})
    }
}