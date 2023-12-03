import CryptoJS = require('crypto-js');
import { getAdmin, getAdminById, getAllAdmins, saveAdmin ,saveToken, updateAdminData , deleteAdmin ,getAllAdminsUsingSkip, deleteAllAdminsFromDB, getAdminByMail, updateAdminDataUsingMail} from '../repository/adminRepo';
import * as jwt from 'jsonwebtoken';
import { adminData } from '../model/adminModel';
import { AdminEntity } from '../entity/adminEntity';


export const registerAdmin = async (adminName:string, email:string, password:string) :Promise<adminData> => {
    console.log("Data in registerAdmin : ", adminName, email, password);
    try{
        if (adminName.length == 0 || email.length == 0 || password.length == 0) {
            console.log("Please Enter Valid Data");
            throw ("Please Enter Valid Data");
        }
        console.log("password.length ", password.length);
        if (password.length < 8) {
            console.log("Password Length Must be Greater than 8");
            throw ("Password Length Must be Greater than 8")
        }
        let paswd = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{6,20}$/;
        if (!password.match(paswd)) {
            console.log("Your password must contain at least one uppercase, one numeric digit and a special character");
            throw ("Your password must contain at least one uppercase, one numeric digit and a special character")
        }
        let findAdmin = await getAdmin(email);
        if(findAdmin)
            throw ('Admin For Given Credentials Already exist !');

        let adminPassword = CryptoJS.AES.encrypt(password , 'USERMANAGEMENT').toString();
        console.log("Encrypted Pass : ",adminPassword);
        
        let admin = await saveAdmin(adminName,email,adminPassword);
        return admin;
    }
    catch(e){
        console.log("Error in Register Admin Function Service :",e);
        throw (e);
    }
}

export const validateEmail =async (email:string) : Promise <Boolean> => {
        let emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
        try {
            if (!email)
                return false;
            if (email.length > 254)
                return false;
            let valid = emailRegex.test(email);
            if (!valid)
                return false;
            let parts = email.split("@");
            if (parts[0].length > 64)
                return false;
            let domainParts = parts[1].split(".");
            if (domainParts.some(function (part) { return part.length > 63; }))
                return false;
            return true;
        }
        catch (e) {
            console.log("Error in validateEmail Function : ",e);
            console.log(e.message);
            return (e.message);
        }
    
}

export const loginAdmin =async (email:string , pass:string) : Promise <object> =>{
    try {
        let findAdmin = await getAdmin(email);
        if (!findAdmin) {
            console.log("Admin Doesn't Exist , Please Register Yourself.");
            throw ("Admin Doesn't Exist , Please Register Yourself.");
        }
        console.log("Response of findAdmin :", findAdmin);
        console.log("Admin Original password : ",findAdmin.password);
        
        let userPassword = CryptoJS.AES.decrypt(findAdmin.password, 'USERMANAGEMENT');
        let decryptedUserPass = userPassword.toString(CryptoJS.enc.Utf8);
        console.log("Decrypted Password : ", decryptedUserPass);

        let comparedPass = (pass === decryptedUserPass);
        console.log("compare Password Output :", comparedPass);

        if (!(findAdmin && comparedPass)) {
            console.log("you have Entered Invalid Email or Password.");
            throw ("you have Entered Invalid Email or Password , Please Try Again.")
        }

        let jwtToken = jwt.sign({ email: email }, 'secret' , {expiresIn : "1d"});
        console.log("Token Generated For Current Admin : ", jwtToken);
        
        let userData = await saveToken(email, jwtToken);
        console.log("Admin after saving token : ", userData);
        return { "Response": `Welcome ${userData.adminName}`, "Response Token ": jwtToken };
    }
    catch (e) {
        console.log("Error in loginAdmin Service :",e);
        throw  (e);
    }
}

export const adminDetailsById = async (adminid:number) :Promise<AdminEntity> => {
    console.log("AdminID in adminDetails: ", adminid);
    return await getAdminById(adminid).then((data) => {
            if (!data)
                throw ('No Admin Found!');
            return data;
        }).catch((e) => {
            console.log("Error in adminDetails Service .catch : ",e);
            throw (e);
        })
}

export const adminDetailsByMail = async (mail:string) :Promise<AdminEntity> => {
    console.log("AdminID in adminDetails: ", mail);
    return await getAdminByMail(mail).then((data) => {
            if (!data)
                throw ('No Admin Found!');
            return data;
        }).catch((e) => {
            console.log("Error in adminDetails Service .catch : ",e);
            throw (e);
        })
}

export const findAllAdmins = async (skip:number): Promise<AdminEntity> => {
    try {
        return await getAllAdminsUsingSkip(skip).then((totalAdmins) =>{
            return totalAdmins.filter((data:AdminEntity) => {
                delete (data.password);
                delete (data.token);
                return data;
            })
        }).catch((e) => {
            throw (e);
        })
    }
    catch (e) {
        console.log("Error in findAllAdmins Service :",e);
        throw(e)
    }
}

export const findAllAdminsWihtoutSkip = async (): Promise<AdminEntity> => {
    try {
        return await getAllAdmins().then((totalAdmins) =>{
            return totalAdmins.filter((data:AdminEntity) => {
                delete (data.password);
                delete (data.token);
                return data;
            })
        }).catch((e) => {
            throw (e);
        })
    }
    catch (e) {
        console.log("Error in findAllAdmins Service :",e);
        throw(e)
    }
}

export const updateAdminById = async (adminid:number , datas:adminData) :Promise<AdminEntity> => {
    console.log("Admin id in updateAdminById Service :",adminid);
    try {
        let admin = await getAdminById(adminid);
        if (!admin)
            throw ('No Admin Found!')
        return await updateAdminData(adminid, datas).then((data) => {
                console.log("Admin After Upadting updateAdminById Service : ", data);
                delete(data.password);
                delete(data.token);
                return data;
            }).catch((e) => {
                console.log("Error in updateAdminById Service : ", e.message);
                throw (e);
            })
    }
    catch (e) {
        console.log("Error in UpdateAdminId Service : ",e);
        throw (e);
    }
}

export const updateAdminByMail = async (mail:string , datas:adminData) :Promise <AdminEntity>  => {
    console.log("Admin id in updateAdminById Service :",mail);
    try {
        let admin = await getAdminByMail(mail);
        if (!admin)
            throw ('No Admin Found!')
        return await updateAdminDataUsingMail(mail, datas).then((data) => {
                console.log("Admin After Upadting updateAdminById Service : ", data);
                // delete(data.password);
                // delete(data.token);
                return data;
            }).catch((e) => {
                console.log("Error in updateAdminById Service : ", e.message);
                throw (e);
            })
    }
    catch (e) {
        console.log("Error in UpdateAdminId Service : ",e);
        throw (e);
    }
}

export const deleteAdminById = async (id: number) :Promise<string> => {
    try {
        let data = await getAdminById(id);
        console.log("Admin Data To Be Deleted : ", data);
        if (!data)
            throw("No Admin Found To Delete.")
        return await deleteAdmin(data).then((res) => {
            console.log("deleteAdminById Service Response : ",res);
            return res;
            }).catch((e) => {
                console.log("Error in deleteAdmin Service - deleteAdminById : ",e);
                throw (e);
            })
    }
    catch (e) {
        console.log("Error in deleteAdminById Service : ",e);
        throw (e);
    }
}

export const deleteAdmins = async () :Promise<string> => {
    return await deleteAllAdminsFromDB().then((res) => {
        console.log("Response in deleteAdmins Service : ",res);
        return res;
    }).catch((e:string) => {
        console.log("Error in deleteAdmins Service .catch : ",e);
        throw (e);
    } )
}