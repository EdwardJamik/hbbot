const { Signup,Login, Logout,DeleteUser} = require("../Controllers/AuthController");
const {userVerification} = require("../Middlewares/AuthMiddleware");
const { rootMenu } = require("../Controllers/AdminController");
const router = require("express").Router();


router.post("/rootMenu", rootMenu);
router.post("/signup", Signup);
router.post("/deleteUser", DeleteUser);
router.post('/login', Login);
router.post('/logout', Logout);
router.post('/',userVerification)


module.exports = router;