const { Signup,Login, Logout,DeleteUser, updatedAdminData} = require("../Controllers/AuthController");
const {userVerification} = require("../Middlewares/AuthMiddleware");
const { rootMenu } = require("../Controllers/AdminController");
const router = require("express").Router();


router.post("/rootMenu", rootMenu);
router.post("/signup", Signup);
router.post("/deleteUser", DeleteUser);
router.post('/login', Login);
router.post('/logout', Logout);
router.post('/',userVerification)

router.post("/updatedAdminData", updatedAdminData);

module.exports = router;