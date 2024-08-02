const express = require("express");
const router = express.Router();
const upload = require("../config/multer")

const UserController = require("../controllers/UserController");
const isAuth = require('../middleware/jwtAuth')

router.post("/users", upload.single('image'),UserController.createUser);
router.get("/users/:store_id",isAuth,UserController.users);
router.get("/user/:id",isAuth,UserController.getUser);
router.delete("/users/:id/:store_id",isAuth,UserController.deleteUser);
router.post("/users/:id",upload.single('image'),UserController.updateUser);

module.exports = router;
