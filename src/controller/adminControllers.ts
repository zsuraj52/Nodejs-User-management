import { Request, Response } from "express";
import { adminData } from "../model/adminModel";
import { getAdmin } from "../repository/adminRepo";
import { registerAdmin , loginAdmin, validateEmail, findAllAdmins , updateAdminById , deleteAdminById , deleteAdmins, findAllAdminsWihtoutSkip, adminDetailsById, adminDetailsByMail, updateAdminByMail } from "../services/adminServies";
 

export const adminRegister = async (req: Request, res: Response) => {
    const {adminName , email , password} = req.body;
    try{
        if (!email || !password || !adminName)
            res.status(400).send({"Status": "FAILED" , "Message ":"Please Provide Proper adminName ,Email and Password."});

        let findAdmin = await getAdmin(email);
        console.log("getAdmin Response : ",findAdmin);
        if (findAdmin)
            res.status(400).send({"Status ": "FAILED", "Message " :"Admin Already Exist , Please Login."})

        let validateAdminEmail = await validateEmail(email);
        console.log("ValidateEmail Response : ",validateAdminEmail);
        if (!validateAdminEmail) {
            console.log({ "Status": "FAILED", "Response": "E-mail is Not valid, Please Enter Valid Email Id" });
            res.status(400).send({ "Status": "FAILED", "Message ": "E-mail is Not valid, Please Enter Valid Email Id" });
        }    

        await registerAdmin(adminName , email , password).then((data) =>{
            console.log(data);
            if (data)
                res.status(201).json({"Status":"SUCCESS","Message ":" Admin Registered Successfully! ","Response ": data});
            }).catch((err) =>{
                console.log("Error in adminRegister Controller .catch : ", err);
                res.status(400).send({"Status":"FAILED" , "Message ":err});
            })
    }
    catch (e)
        {
        console.log('Something Went Wrong in adminRegister Controller : ', e);
        res.status(400).send('Something Went Wrong , Please Try Again!')
        }
}


export const adminLogin = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    console.log("Email : ", email);
    console.log("Password : ", password);

    try {
        if (!email || !password ) {
            console.log("Please Enter Login Credentials");
            res.status(400).send({ "Status ": "FAILED", "Message ": "Please Enter Login Credentials" })
        }
        await loginAdmin(email, password).then((data) => {
            res.status(200).send({ "Status": "SUCCESS", "Message ": " Admin Logged In Successfully! ","Response ": data });
            })
            .catch((e) => {
                console.log("Error in adminLogin Controller .catch : ", e);
                res.status(400).send({ "Status": "FAILED", "Message ": e });
            })
    }
    catch (e) {
        console.log("Error in adminLogin Controller : ", e);
        res.status(400).send({ "Status": "FAILED", "Message ": e });
    }
}


export const getAdminById = async (req: Request , res: Response) => {
    console.log(req.query);
    console.log("adminid :", req.query.adminId);
    console.log("admin-email :",req.query.email);
    
    try {
        const mail = String (req.query.email); 
        const id = Number (req.query.adminId);
        if (id) {
            console.log("adminid : try :", id);
            await adminDetailsById(id).then((data) => {
                console.log("Admin Data :", data);
                res.status(200).send({ "Status": "SUCCESS","Message ":" Admin For Given Admin-ID Is Rendered Successfully. ","Response ": data });
                })
                .catch((e) => {
                    console.log("Error in getAdminById Controller .catch : ", e);
                    res.status(400).send({ "Status": "FAILED", "Message ": e });
                })
        }
        else if (mail) {
            await adminDetailsByMail(mail).then((data) => {
                console.log("Admin Data :", data);
                res.status(200).send({ "Status": "SUCCESS","Message ":" Admin For Given Email-ID Is Rendered Successfully. ","Response ": data });
                })
                .catch((e) => {
                    console.log("Error in getAdminById Controller .catch : ", e);
                    res.status(400).send({ "Status": "FAILED", "Message ": e });
                })   
        } else {
            res.status(400).send({ "Status :": "FAILED", "Message :": "Please Provide Data To Get Admin " });
        }
    }
    catch (e) {
        console.log("Error in getAdminById Controller :", e);
        res.status(400).send({ "Status": "FAILED", "Message ": e });
    }
}


export const getAllAdmins = async (req: Request , res: Response) => {
    console.log("QueryParams : ",req.query.skip);
    
    try {
        let skip = Number(req.query.skip);
        console.log("skip : ",skip);
        if (skip) {
            await findAllAdmins(skip).then((data) => {
                console.log("List of Admins : ", data);
                res.status(200).send({ "Status": "SUCCESS","Message ":" All Admin's List Is Rendered. ", "Response ": data });
                })
                .catch((e) => {
                    console.log("Error in findAllAdmins Controller .catch : ", e);
                res.status(400).send({ "Status": "FAILED", "Message ": e });
                })
        } 
        else {
            await findAllAdminsWihtoutSkip().then((data) => {
                console.log("List of Admins : ", data);
                res.status(200).send({ "Status": "SUCCESS","Message ":" All Admin's List Is Rendered. ", "Response ": data });
                })
                .catch((e) => {
                    console.log("Error in findAllAdmins Controller .catch : ", e);
                res.status(400).send({ "Status": "FAILED", "Message ": e });
                })   
            }  
        }
    catch (e) {
        console.log("Error in getAllAdmins Controller :", e);
        res.status(400).send({ "Status": "FAILED", "Message ": e });
    }
}


export const updateAdmin = async (req: Request, res: Response) => {
    
    console.log("adminid :", req.query.adminId);
    console.log("admin-email :",req.query.email);
    if (req.query.adminId == undefined && req.query.email == undefined)
        res.status(400).send({ "Status :": "FAILED", "Message :": "Please Provide Data To Get Admin " });
    
    try {
        const mail = String (req.query.email); 
        const id = Number(req.query.adminId);
        const datas: adminData = req.body;
        if (id) {
            console.log("adminid : try :", id);
            await updateAdminById(id, datas).then((data) => {
                res.status(200).send({ "Status": "SUCCESS", "Message ":" Admin For Given Admin-ID Is Updated Successfully. ", "Response ": data });
                })
                .catch((e) => {
                    console.log("Error in updateAdmin Controller .catch : ", e);
                    res.status(400).send({ "Status": "FAILED", "Message ": e });
                })
        }
        else if (mail) {
            await updateAdminByMail(mail, datas).then((data) => {
                res.status(200).send({ "Status": "SUCCESS", "Message ":" Admin For Given Admin-Email Is Updated Successfully. ", "Response ": data });
                })
                .catch((e) => {
                    console.log("Error in updateAdmin Controller .catch : ", e);
                    res.status(400).send({ "Status": "FAILED", "Message ": e });
                })  
        } else {
            res.status(404).send({ "Status :": "FAILED", "Message :": "Please Provide Data To Update Admin " });
        }
    }
    catch (e) {
        console.log("Error in updateAdmin Controller :", e);
        res.status(400).send({ "Status": "FAILED", "Message ": e });
    }
    
}


export const deleteAdmin = async (req: Request, res: Response) => {
    console.log("Id of Admin To Delete : ",req.params.adminid);
    try {
        const id = parseInt(req.params.adminid);
        if (!id)
            res.status(400).send({ "Status: " : "FAILED", "Message : " : "Please Provide Admin Id" });
        await deleteAdminById(id).then((data) => {
            console.log("Admin Deleted Successfully!");
                res.status(200).send({ "Status :": "SUCCESSS", "Message :":" Admin For Given Admin-ID Is Deleted Successfully. ","Response ": data });
            }).catch((e) => {
                console.log("Error in deleteAdmin Controller .catch : ", e);
                    res.status(400).send({ "Status: " : "FAILED", "Message : " : e });
                })
    }
    catch (e) {
        res.status(400).send({ "Status: " : "FAILED", "Message : " : e });
    }
}


export const deleteAllAdmin = async (req: Request, res: Response) => {
    try {
        await deleteAdmins().then((data) => {
            console.log("All Admins Deleted Successfully! ");
            res.status(200).send({ "Status: ": "SUCCESS", "Message ":"All Admin's In The Database Are Deleted. ","Response :": data });
        }).catch((e) => {
            console.log("Error in deleteAllAdmin Controller .catch : ", e);
            res.status(400).send({ "Status: " : "FAILED", "Response: " : e })           
        })
    }
    catch (e) {
        console.log("Errorin deleteAllAdmins Controller : ", e);
        res.status(400).send({ "Status: " : "FAILED", "Response: " : e })
    }
}