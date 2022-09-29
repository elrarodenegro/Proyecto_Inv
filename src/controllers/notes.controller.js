const notesCtrl = {};

// Models
const Note = require("../models/Note");
const { ADMIN_TYPE } = process.env;

notesCtrl.renderNoteForm = (req, res) => {
  if (req.user.type != ADMIN_TYPE) {
    req.flash("error_msg", "No Permitido");
    return res.redirect("/notes");
  } else {
    res.render("notes/new-note");
  }
};

notesCtrl.createNewNote = async (req, res) => {
  const { title, type, description, quantity } = req.body;
  const errors = [];
  if (title == "NaN") {
    errors.push({ text: "Por favor ingrese un Título." });
  }
  if (type == "NaN") {
    errors.push({ text: "Por favor ingrese un Género." });
  }
  if (!description) {
    errors.push({ text: "Por favor ingrese una Descripción" });
  }
  if (!quantity) {
    errors.push({ text: "Por favor ingrese una Cantidad" });
  }
  if (errors.length > 0) {
    res.render("notes/new-note", {
      errors,
      title,
      type,
      description,
      quantity
    });
  } else {
    const newNote = new Note({ title, type, description, quantity });
    newNote.creator = req.user.type;
    newNote.permissions = req.user.permissions;
    await newNote.save();
    req.flash("success_msg", "Objeto Añadido Exitosamente");
    res.redirect("/notes");
  }
};

notesCtrl.renderNotes = async (req, res) => {
  if (req.user.type != ADMIN_TYPE) {
    const notes = await Note.find({ permissions: req.user.permissions }).sort({createdAt: "asc"}).lean();
    res.render("notes/normal_notes", { notes });
  } else {
    const notes = await Note.find().sort({ createdAt: "asc" }).lean();
    res.render("notes/admin_notes", { notes });
  }
};

notesCtrl.renderEditForm = async (req, res) => {
  const note = await Note.findById(req.params.id).lean();
  if (req.user.type != ADMIN_TYPE) {
    req.flash("error_msg", "No Permitido");
    return res.redirect("/notes");
  }
  res.render("notes/edit-note", { note });
};

notesCtrl.updateNote = async (req, res) => {
  const { title, type, description, quantity } = req.body;
  await Note.findByIdAndUpdate(req.params.id, { title, type, description, quantity });
  req.flash("success_msg", "Objeto Actualizado Satisfactoriamente");
  res.redirect("/notes");
};

notesCtrl.deleteNote = async (req, res) => {
  if (req.user.type != ADMIN_TYPE) {
    req.flash("error_msg", "No Permitido");
    return res.redirect("/notes");
  }
  await Note.findByIdAndDelete(req.params.id);
  req.flash("success_msg", "Objeto Eliminado Satisfactoriamente");
  res.redirect("/notes");
};

module.exports = notesCtrl;
