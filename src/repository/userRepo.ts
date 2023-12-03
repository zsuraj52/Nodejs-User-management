import { UserEntity } from "../entity/userEntity";
import { AppDataSource } from "../data-source";
import { AdminEntity } from "../entity/adminEntity";
import { UserModel } from "../model/userModel";
import { getAdminById } from "./adminRepo";

const userRepo = AppDataSource.getRepository(UserEntity);
const adminRepo = AppDataSource.getRepository(AdminEntity);

export const getUser = async (email: string) => {
  return await userRepo.findOneBy({ email: email });
};

export const getAdmin = async (adminId: number): Promise<AdminEntity> => {
  console.log("Admin ID :", adminId);
  return await adminRepo.findOneBy({ id: adminId });
};

export const saveUser = async (userName: string,email: string,userPassword: string,adminId: number): Promise<any> => {
  console.log("Data in saveUser : ", userName, email, userPassword);
  let admins = await getAdminById(adminId).then((res) => {
    delete res.password;
    delete res.token;
    return res;
  });
  console.log("Admin :", admins);
  let userData = {
    userName: userName,
    email: email,
    password: userPassword,
    admin: admins,
  };
  await AppDataSource.createQueryBuilder().insert().into(UserEntity).values(userData).execute();
  delete userData.password;
  return userData;
};

export const getUsersListWithoutSkip = async (id: number): Promise<any> => {
  try {
    // return await userRepo.find();
    let data = await AppDataSource.createQueryBuilder('AdminEntity', 'admin').leftJoinAndSelect('admin.user', 'user').where("user.adminId = :id",{id : id}).getMany();
    console.log("User : ", data);

    return data.filter(async (res: any) => {
      delete (res.password);
      delete (res.token);
      return await res.user.filter((user:UserEntity) => {
        delete (user.password);
        return user;
      })
    })
    // return data;
  } catch (e) {
    console.log("Error in getUsersList :", e);
    throw e;
  }
};

export const getUsersList = async (skip: number,findAdmin:AdminEntity): Promise<any> => {
  try {
    const take = 5;
    console.log("im here",skip,findAdmin);
    
     return await userRepo.find({
      where: {
        admin:findAdmin
      },
      skip:skip,
      take: (skip + take)
    })
    // let data = await AppDataSource.createQueryBuilder("AdminEntity", "admin").leftJoinAndSelect("admin.user", "user").where("user.adminId = :id",{id : id}).skip(skip).take(skip + take).getMany();
    // console.log("Data : ", data);
    // return data;
  } catch (e) {
    console.log("Error in getUsersList :", e);
    throw e;
  }
};

export const getUserById = async (userid: number): Promise<UserEntity> => {
  return await userRepo.findOneBy({ id: userid });
};

export const getUserByMail = async (mail: string): Promise<UserEntity> => {
  return await userRepo.findOneBy({ email: mail });
};

export const updateUserData = async (userid: number,data: UserModel): Promise<UserEntity> => {
  try {
    return await getUserById(userid).then(async (datas) => {
        if (!datas) throw "No User Found";
        console.log("User :", datas);
        console.log("Data To Update : ", data);
        let res : UserEntity = await Object.assign(datas, data);
        console.log("User After Updated : ", res);
      await AppDataSource.createQueryBuilder().update<UserEntity>(UserEntity, res).where("id = :id", { id: userid }).updateEntity(true).execute();
      delete (res.password);
      return res;
      })
      .catch((e: any) => {
        console.log("Error in updateUserData .catch-2 : ", e);
        throw e;
      });
  } catch (e) {
    console.log("Error in updateUserById :", e);
    throw e;
  }
};

export const updateUserDataByMail = async (mail: string,data: UserModel): Promise<UserEntity> => {
  try {
    return await getUserByMail(mail)
      .then(async (datas) => {
        if (!datas) throw "No User Found";
        console.log("User :", datas);
        console.log("Data To Update : ", data);
        let res = await <any> Object.assign(datas, data);
        console.log("User After Updated : ", res);
        await AppDataSource.createQueryBuilder().update<UserEntity>(UserEntity, res).where("email = :email", { email: mail }).updateEntity(true).execute();
        delete (res.password);
        return res;
      })
      .catch((e: any) => {
        console.log("Error in updateUserData .catch 2 : ", e);
        throw e;
      });
  } catch (e) {
    console.log("Error in updateUserById :", e);
    throw e;
  }
};

export const deleteUserData = async (id: number) => {
  try {
    await AppDataSource.createQueryBuilder().delete().from(AdminEntity).where("id = :id", { id: id }).execute();
    return "User Deleted Successfully! ";
  } catch (e) {
    console.log("Error in deleteUserData :", e);
    throw e;
  }
  
};
