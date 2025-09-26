

const  express= require('express');
const { UserLogin,UserSignup,AdminLogin,AdminSignup ,getUsers,getAdmins,getAdmin,updateAdmin,deleteAdmin,getCompanyUsers} = require('../controllers/auth');

const isAuth = require('../middlewares/auth');
const authRoutes= express.Router();

authRoutes.post("/signup",UserSignup)
authRoutes.post("/signin",UserLogin);
authRoutes.post("/admin-signin",AdminLogin);
authRoutes.post("/admin-signup",isAuth,AdminSignup);

authRoutes.get("/get-users",getUsers);
authRoutes.get("/get-company-users",isAuth,getCompanyUsers);
authRoutes.get("/get-admins",isAuth,getAdmins);
authRoutes.get("/get-admin/:id",isAuth,getAdmin);
authRoutes.patch("/update-admin/:id",isAuth,updateAdmin);
authRoutes.delete("/delete-admin/:id",isAuth,deleteAdmin);
/*
adminRoutes.put("/update-profile",isAuth,EditAdminProfile);
adminRoutes.get("/get-profile",isAuth,GetAdminProfile);
*/


module.exports=authRoutes