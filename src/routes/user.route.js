import {
  getAllUsers,
  registerAsBuyer,
  registerAsSeller,
  login,
  getuserById,
  uploadUserProfile,
  editUser,
  getUserProfile,
  deleteUserById,
  otpVerification,
  deleteAllUsers
} from "../controllers/user.controller.js";
import { Router } from "express";
const router = Router();

router.route("/register/seller").post(registerAsSeller);
router.route("/register/buyer").post(registerAsBuyer);
router.route("/login").post(login);
router.route("/get-all").get(getAllUsers);
router.route("/upload/profilePic/:id").post(uploadUserProfile);
router.route("/get/profilePic/:id").get(getUserProfile);
router.route("/edit/:id").post(editUser);
router.route("/delete/:id").delete(deleteUserById);
router.route("/get-user/:id").get(getuserById);
router.route("/opt-verification").post(otpVerification);
router.route("/delete-all").delete(deleteAllUsers);

export default router;
