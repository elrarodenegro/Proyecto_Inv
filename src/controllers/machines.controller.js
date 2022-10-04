const labsCtrl = {};

// Models
const Note = require("../models/Note");

labsCtrl.renderLabs = async (req, res) => {

  const notes = await Note.find({ permissions: req.user.permissions }).sort({ createdAt: "asc" }).lean();
  res.render("machines/all-products", { notes });

};

labsCtrl.renderVm = (req, res) => {
  res.render("machines/machine");
};

module.exports = labsCtrl;
