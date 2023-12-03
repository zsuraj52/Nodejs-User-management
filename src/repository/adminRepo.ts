import { AppDataSource } from "../data-source";
import { AdminEntity } from "../entity/adminEntity";
import { adminData } from "../model/adminModel";

const adminRepo = AppDataSource.getRepository(AdminEntity); 
export const saveAdmin = async (adminName:string, email:string, adminPassword:string ):Promise<adminData> => {

    console.log("Data in SaveAdmin : ", adminName, email, adminPassword);
    let adminData = {
        adminName: adminName,
        email: email,
        password: adminPassword
    }
    await AppDataSource.createQueryBuilder().insert().into(AdminEntity).values(adminData).execute();
    delete (adminData.password)
    return adminData;
}

export const getAdmin =async (email:string)  => {
    console.log("Inside getAdmin function :" , email);
    return await adminRepo.findOneBy({ email: email });
}

export const saveToken =async (email:string, jwtToken:string) => {
    try{
        let adminData = await adminRepo.findOneBy({email:email});
        if(!adminData)
            throw ('Admin Not Found For Given Email , Please Register Yourself.');
        adminData.token = jwtToken;
        await adminRepo.save(adminData);
        return adminData;    
    }
    catch(e){
        console.log('Error in saveToken :', e);
        throw (e);
    }
}

export const getAdminById = async (adminid: number)  => {
    console.log("Inside getAdmin function :" , adminid);
    return await adminRepo.findOneBy({ id: adminid }).then((data: AdminEntity) => {        
        if (!data)
            throw ("No Admin Found");
        delete (data.password);
        delete(data.token)
        return data;
    });   
}

export const getAdminByMail = async (mail: string)  => {
    console.log("Inside getAdmin function :" , mail);
    return await adminRepo.findOneBy({ email: mail }).then((data: AdminEntity) => {
        if (data)
            {delete (data.password);
            delete(data.token)
            return data;
        }
        throw("No Admin Found")
    });   
}

export const getAllAdminsUsingSkip = async (skip: number): Promise<any> => {
    const take = 10;
    return await adminRepo.find({
        skip:skip,
        take: (skip + take),
    })
}

export const getAllAdmins = async (): Promise<any> => {
    return await adminRepo.find()
}


export const updateAdminData = async (adminid: number, datas: adminData) => {
    try {
        let oldAdminData = await getAdminById(adminid);
    if (!oldAdminData)
        throw ('No Admin Found!');
    console.log("Admin Before Updating :",oldAdminData);

    let updatedAdmin :AdminEntity = Object.assign(oldAdminData, datas);
    console.log("Admin Data After Updating in updateAdminData :",updatedAdmin);
        await AppDataSource.createQueryBuilder().update<AdminEntity>(AdminEntity, datas).where("id = :id", { id: adminid }).updateEntity(true).execute();
        delete (updatedAdmin.password);
        delete (updatedAdmin.token)
        return updatedAdmin;
    } catch (e) {
        
    }
}

export const updateAdminDataUsingMail = async (mail: string, datas: adminData)  => {
    try {
        let oldAdminData = await getAdminByMail(mail);
    if (!oldAdminData)
        throw ('No Admin Found!');
    console.log("Admin Before Updating :",oldAdminData);

    let updatedAdmin : AdminEntity = Object.assign(oldAdminData, datas);
    console.log("Admin Data After Updating in updateAdminData :",updatedAdmin);
    await AppDataSource.createQueryBuilder().update<AdminEntity>(AdminEntity,datas).where("email = :email",{ email: mail }).updateEntity(true).execute();
    delete(updatedAdmin.password);
    delete (updatedAdmin.token);
    console.log("updatedAdmin : ",updatedAdmin);
    return updatedAdmin;
    } catch (e) {
        console.log("Error in updateAdminDataUsingMail catch : ",e.message);
        throw (e);
    }
}

export const deleteAdmin = async (admin: AdminEntity ) => {
    console.log("Data : ",admin);
    
    try {
        await AppDataSource.createQueryBuilder().delete().from(AdminEntity).where("id = :id", { id: admin.id }).execute()
        return "Admin Deleted Successfully! ";
    } catch (e) {
        console.log("Error in deleteAdmin Repo .catch : ",e);
        throw (e);
            }
}

export const deleteAllAdminsFromDB = async () => {
    try {
        await AppDataSource.createQueryBuilder().delete().from(AdminEntity).execute();
        return "All Admins Deleted Successfully! " ;
    }  
    catch (e) {
        console.log("Error in deleteAdmins Repo catch : ",e);
        throw (e);
    }
} 