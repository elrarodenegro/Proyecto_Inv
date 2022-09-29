const usersCtrl = {};

// Models
const User = require("../models/User");
const { ADMIN_TYPE } = process.env;

// Modules
const passport = require("passport");


usersCtrl.renderSignUpForm = (req, res) => {
  res.render("users/signup");
};

usersCtrl.singup = async (req, res) => {
  let errors = [];
  const {
    name,
    email,
    type,
    permissions,
    password,
    confirm_password,
  } = req.body;
  if (!name) {
    errors.push({ text: "Por favor ingrese un Nombre." });
  }
  if (!email) {
    errors.push({ text: "Por favor ingrese un correo." });
  }
  if (type == "NaN") {
    errors.push({ text: "Por favor ingrese un Tipo de cuenta." });
  }
  if (permissions == "NaN") {
    errors.push({ text: "Por favor ingrese los Permisos de Acceso." });
  }
  if (password != confirm_password) {
    errors.push({ text: "Las contraseñas no concuerdan." });
  }
  if (password.length < 4) {
    errors.push({ text: "Las contraseñas deben tener al menos 4 caracteres." });
  }
  if (errors.length > 0) {
    res.render("users/signup", {
      errors,
      name,
      email,
      type,
      permissions,
      password,
      confirm_password,
    });
  } else {
    // Look for email coincidence
    const emailUser = await User.findOne({ email: email });
    if (emailUser) {
      req.flash("error_msg", "Ese Correo ya se encuentra en uso.");
      res.redirect("/users/signup");
    } else {
      // Saving a New User
      const newUser = new User({ name, email, type, permissions, password });
      newUser.password = await newUser.encryptPassword(password);
      await newUser.save();
      req.flash("success_msg", "Se ha registrado satisfactoriamente.");
      res.redirect("/users");
    }
  }
};

usersCtrl.renderSigninForm = (req, res) => {
  res.render("users/signin");
};

usersCtrl.signin = passport.authenticate("local", {
  successRedirect: "/machines/all-movies",
  failureRedirect: "/users/signin",
  failureFlash: true,
});

usersCtrl.logout = (req, res) => {
  req.logout();
  req.flash("success_msg", "Se ha cerrado la sesión satisfactoriamente.");
  res.redirect("/users/signin");
};

/* --- --- Landing --- --- */
usersCtrl.renderUsers = async (req, res) => {
  if (req.user.type != ADMIN_TYPE) {
    res.render("users/landing/normal_users");
  } else {
    const users = await User.find().sort({ createdAt: "asc" }).lean();
    res.render("users/landing/admin_users", { users });
  }
};

usersCtrl.renderEditForm = async (req, res) => {
  const user = await User.findById(req.params.id).lean();
  if (req.user.type != ADMIN_TYPE) {
    req.flash("error_msg", "No Permitido");
    return res.redirect("/users");
  }
  res.render("users/edit-user", { user });
};

usersCtrl.updateUser = async (req, res) => {
  const { name, email, type, permissions} = req.body;
  await User.findByIdAndUpdate(req.params.id, { name, email, type, permissions });
  req.flash("success_msg", "Usuario Actualizado Satisfactoriamente");
  res.redirect("/users");
};

usersCtrl.deleteUser = async (req, res) => {
  if (req.user.type != ADMIN_TYPE) {
    req.flash("error_msg", "No Permitido");
    return res.redirect("/users");
  }
  await User.findByIdAndDelete(req.params.id);
  req.flash("success_msg", "Objeto Eliminado Satisfactoriamente");
  res.redirect("/users");
};

module.exports = usersCtrl;