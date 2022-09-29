const express = require("express");
const router = express.Router();

// Controllers
const { renderLabs, renderVm } = require("../controllers/machines.controller");

// Helpers
const { isAuthenticated } = require("../helpers/auth");

// Get Labs
router.get("/machines/all-movies", isAuthenticated, renderLabs);

// Get VMs
router.get("/machines/machine", isAuthenticated, renderVm);


module.exports = router;