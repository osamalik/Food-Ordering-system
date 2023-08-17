const express = require("express");
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");

// Welcome Page
router.get("/", forwardAuthenticated, (req, res) =>
  res.render("welcome", { layout: "layouts/layout" })
);

// Dashboard
router.get("/dashboard", ensureAuthenticated, (req, res) =>
  res.render("dashboard", {
    user: req.user,
    layout: "layouts/layout"
  })
);

// Gallery
router.get("/gallery", ensureAuthenticated, (req, res) =>
  res.render("gallery", {
    user: req.user,
    layout: "layouts/layout"
  })
);

router.get("/about", ensureAuthenticated, (req, res) =>
  res.render("about", {
    user: req.user,
    layout: "layouts/layout"
  })
);

// Menu
router.get("/menu", ensureAuthenticated, (req, res) =>
  res.render("menu", {
    user: req.user,
    layout: "layouts/layout"
  })
);

// Dropdown1
router.get("/dropdown1", ensureAuthenticated, (req, res) =>
  res.render("dropdown1", {
    user: req.user,
    layout: "layouts/layout"
  })
);

// Dropdown2
router.get("/dropdown2", ensureAuthenticated, (req, res) =>
  res.render("dropdown2", {
    user: req.user,
    layout: "layouts/layout"
  })
);

// Specials
router.get("/specials", ensureAuthenticated, (req, res) =>
  res.render("specials", {
    user: req.user,
    layout: "layouts/layout"
  })
);

// contact
router.get("/contact", ensureAuthenticated, (req, res) =>
res.render("contact", {
  user: req.user,
  layout: "layouts/layout"
})
);

// Events
router.get("/events", ensureAuthenticated, (req, res) =>
  res.render("events", {
    user: req.user,
    layout: "layouts/layout"
  })
);

// order
router.get("/order", ensureAuthenticated, (req, res) =>
  res.render("order", {
    user: req.user,
    layout: "layouts/layout"
  })
);

// Chefs
router.get("/chefs", ensureAuthenticated, (req, res) =>
  res.render("chefs", {
    user: req.user,
    layout: "layouts/layout"
  })
);

// Reviews
router.get("/reviews", ensureAuthenticated, (req, res) =>
  res.render("reviews", {
    user: req.user,
    layout: "layouts/layout"
  })
);

module.exports = router;
