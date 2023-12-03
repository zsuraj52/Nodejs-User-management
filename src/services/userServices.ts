import { getAdmin, getUser, getUserById, getUsersList, saveUser, updateUserData,deleteUserData, getUserByMail, getUsersListWithoutSkip, updateUserDataByMail } from "../repository/userRepo";
import CryptoJS = require('crypto-js');
import { UserModel } from "../model/userModel";
import { UserEntity } from "../entity/userEntity";

export const UserCreate = async (userName: string, email: string, password: string , adminId:number) :Promise<UserEntity> => {
    console.log("UserCreate data :", userName, email, password);
    try {

        let findAdmin = await getAdmin(adminId);
        if (!findAdmin ) {
            console.log({ "Status ": "FAILED", "Response ": "No Admin Found For Given Id ,Please Create Admin First!" });
            throw ("No Admin Found For Given Id ,Please Create Admin First!");
        }

        let findUser = await getUser(email);
        console.log("getUser Response : ",findUser);
        if (findUser) {
            console.log({ "Status": "FAILED", "Response": "User Already Created." });
            throw ("User Already Created.");
        }

        if (userName.length == 0 || email.length == 0 || password.length == 0) {
            console.log("Please Enter Valid Data");
            throw ("Please Enter Valid Data");
        }
    
        console.log("password.length ", password.length);
        if (password.length < 8) {
            console.log({"Status ":"FAILED" , "Response ": "Password Length Must be Greater than 8"});
            throw ("Password Length Must be Greater than 8")
        }
    
        let paswd = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{6,20}$/;
        if (!password.match(paswd)) {
            console.log({"Status ":"FAILED" , "Response ":"Your password must contain at least one uppercase, one numeric digit and a special character"});
            throw ("Your password must contain at least one uppercase, one numeric digit and a special character")
        }

        let userPassword = CryptoJS.AES.encrypt(password, 'USERMANAGEMENT').toString();
        console.log("Encrypted User Password :",userPassword);
        
        let user = await saveUser(userName, email, userPassword ,adminId);
        return user;
    }
    catch (e) {
        console.log({"Status ":"FAILED" , "Response ":e.message});
        throw (e);
    }
    
    
}

export const getAllUsersWithoutSkip = async (id: number): Promise<[]> => {
    try {
        let findAdmin = await getAdmin(id); 
        if (!findAdmin)
            throw('No Admin Found For Given id')
        let users = await getUsersListWithoutSkip(id);
        if (!users)
            throw ("No Users Found For Given Admin ID");
        console.log("List Of Users getAllUsers service: ", users);
        let usersArray = users.filter((data:any) => {
            delete (data.password);
            delete (data.token);
            return data;
        })
        console.log("usersArray after deleting password :",usersArray);
        return usersArray;
        return users;
    }
    catch (e) {
        console.log("Error in getAllUsers Service :", e);
        throw (e);
    }
    
}

export const getAllUsers = async ( skip: number,id:number ): Promise<any> => {
    try {
        let findAdmin = await getAdmin(id);
        console.log("findAdmin : ",findAdmin);
        
        if (!findAdmin)
            throw('No Admin Found For Given id')
        let users = await getUsersList(skip,findAdmin);
        if (!users)
            throw ("No Users Found For Given Admin ID");
        console.log("List Of Users getAllUsers service: ", users);
        let usersArray = users.filter((data:any) => {
            delete (data.password)
            return data;
        })
        console.log("usersArray after deleting password :",usersArray);
        return usersArray;
    }
    catch (e) {
        console.log("Error in getAllUsers Service :", e);
        throw (e);
    }
    
}

export const fetchUserById = async(userid: number): Promise<UserEntity> => {
    console.log("User-id :", userid);
    try {
        return await getUserById(userid).then((data) => {
            if (!data)
                throw ('No User Found For Given Id');
            delete(data.password)
            return data;
        }).catch((e) => {
            console.log("Error in fetchUser .catch : ",e);
            throw (e);
        })
    }
    catch (e) {
        console.log("Error in fetchUser Service :", e);
        throw (e);
    }
}

export const fetchUserByMail = async(mail: string): Promise<UserEntity> => {
    console.log("User-mail :", mail);
    try {
        return await getUserByMail(mail).then((data) => {
            if (!data)
                throw ('No User Found For Given Mail');
            delete(data.password)
            return data;
        }).catch((e) => {
            console.log("Error in fetchUser .catch : ",e);
            throw (e);
        })
    }
    catch (e) {
        console.log("Error in fetchUser Service :", e);
        throw (e);
    }
}


export const updateUserById = async (userid: number , data:UserModel): Promise<UserEntity> => {
    console.log("userid : ",userid);
    try {
        return await getUserById(userid).then( async (datas) => {
            if (!datas)
                throw ('No User Found For Given ID');
            return await updateUserData(userid, data).then((res) => {
                return res;
                }).catch((e) => {
                    console.log("Error in updateUserById Service .catch-1s : ",e);
                    throw (e);
                })
            }).catch((e) => {
                console.log("Error in updateUserById Service .catch-2 : ",e);
                throw (e);
            })
        }
    catch (e) {
        console.log("Error in updateUserById Service :", e);
        throw (e);
    }
}

export const updateUserByMail = async (mail: string , data:UserModel): Promise<UserEntity> => {
    console.log("Email : ",mail);
    try {
        return await getUserByMail(mail).then( async (datas) => {
            if (!datas)
                throw ('No User Found For Given ID');
            return await updateUserDataByMail(mail, data).then((res) => {
                return res;
                }).catch((e) => {
                    console.log("Error in updateUserById Service .catch-1s : ",e);
                    throw (e);
                })
            }).catch((e) => {
                console.log("Error in updateUserById Service .catch-2 : ",e);
                throw (e);
            })
        }
    catch (e) {
        console.log("Error in updateUserById Service :", e);
        throw (e);
    }
}


export const deleteUser = async (id: number) :Promise<string> => {
    try {
        return await getUserById(id).then(async (response) => {
            if (!response)
                throw("No User Found To Delete")
            return await deleteUserData(id).then((res) => {
                return res;
                }).catch((e) => {
                    console.log("Error in deleteUserData .catch : ", e);
                    throw (e)
                })
            }).catch((e) => {
                console.log("Error in deleteUser .catch : ", e);
                throw (e)
            })
    }
    catch (e) {
        console.log("Error in deleteUser Service :", e);
        throw (e);
    }
}