import * as express from 'express';
import { adminRegister , adminLogin ,getAdminById ,getAllAdmins , updateAdmin , deleteAdmin , deleteAllAdmin } from './controller/adminControllers';
import { createUser, getAllUsersByAdminId, getUserByQueryData, updateUser, deleteUserById } from './controller/userControllers';
import { createProject , getAllProjects , getProjectById,getAllProjectsByUserId , updateProject , deleteProject} from './controller/projectControllers';
import { validateToken } from './middleware/auth';

const router = express.Router();

//routes for admin(Register ,Login, getAdminById, getAllAdmins, updateAdminById, deleteAdminById, deleteAllAdmins)
router.post('/admin/register' ,adminRegister );
router.post('/admin/login', adminLogin);
router.get('/admin', validateToken, getAdminById);
router.get('/admins', validateToken, getAllAdmins);
router.put('/update_admin/admin', validateToken, updateAdmin);
router.delete('/delete/admin/:adminid', validateToken, deleteAdmin);
router.delete('/delete/admins', validateToken, deleteAllAdmin);


//routes for user (registerUser, getUserByQueryData, getUsersByAdminId, upateUserById, deleteUserById)
router.post('/user/register',validateToken ,createUser);
router.get('/users/:adminId',validateToken, getAllUsersByAdminId);
router.get('/update_user/',validateToken, getUserByQueryData);
router.put('/update_user/', validateToken, updateUser);
router.delete('/user/delete/:userid', validateToken, deleteUserById);


//routes for projects(createProect, getProjectsByUserId, getProjectByProjectId, updateProjectById, deleteProjectById)
router.post('/user/:userid/project', validateToken, createProject);
router.get('/projects/user/:userid', validateToken, getAllProjectsByUserId);
router.get('/project/:projectid', validateToken, getProjectById);
router.get('/projects', validateToken, getAllProjects);
router.put('/update/project/:projectid', validateToken, updateProject);
router.delete('/delete/project/:projectid', validateToken, deleteProject);

export default router;