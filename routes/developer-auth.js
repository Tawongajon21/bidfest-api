

const  express= require('express');
const { DeveloperLogin,DeveloperSignup } = require('../controllers/developerAuth');

const isAuth = require('../middlewares/auth');
const developerRoutes= express.Router();

developerRoutes.post("/developer-signup",DeveloperSignup)
developerRoutes.post("/developer-signin",DeveloperLogin);

/*
adminRoutes.put("/update-profile",isAuth,EditAdminProfile);
adminRoutes.get("/get-profile",isAuth,GetAdminProfile);
*/


module.exports=developerRoutes