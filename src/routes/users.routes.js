const router = require("express").Router();

const {
  renderSignUpForm,
  singup,
  renderSigninForm,
  signin,
  logout,
  renderUsers,
  renderEditForm,
  updateUser,
  deleteUser
} = require("../controllers/users.controller");

// Helpers
const { isAuthenticated } = require("../helpers/auth");

// Create Users
router.get("/users/signup", renderSignUpForm);

router.post("/users/signup", singup);

// Sign In User

router.get("/users/signin", renderSigninForm);

router.post("/users/signin", signin);

router.get("/users/logout", logout);

// Get Users
router.get("/users", isAuthenticated, renderUsers);

// Edit Users
router.get("/users/edit/:id", isAuthenticated, renderEditForm);

router.put("/users/edit-user/:id", isAuthenticated, updateUser);

// Delete Notes
router.delete("/users/delete/:id", isAuthenticated, deleteUser);

module.exports = router;
