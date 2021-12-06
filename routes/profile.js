const express = require("express");
const router = express.Router();
let userData = require("../data/users");

router.get("/", async (req, res) => {
  if (!req.session.user) {
    res.render("login", { title: "Login" });
    return;
  }
  res.render("update_profile", { title: "Update Account" });
});

router.get("/new", (req, res) => {
  res.render("new_profile", { title: "New Account" });
});

router.get("/feedback", async (req, res) => {
  if (!req.session.user) {
    res.redirect("/");
    return;
  }
  res.render("feedback", { title: "Feedback" });
});

router.patch("/", async (req, res) => {
  try {
    let username = req.body.username;
    let password = req.body.password;
    let confirm_password = req.body.confirm_password;
    let oldUser = await userData.read(req.session.user._id);
    let updatingData = { id: req.session.user._id };
    if (username) {
      if (typeof username != "string" || username.replace(/\s/g, "") == "")
        throw "Invalid username";
      updatingData.username = username;
    } else updatingData.username = oldUser.username;
    if (password) {
      if (confirm_password) {
        if (password == confirm_password) {
          updatingData.password = password;
        } else throw "Password and confirm password must match";
      } else throw "Must enter password and confirm password";
    } else updatingData.password = oldUser.password;

    let newStuff = await userData.update(
      updatingData.id,
      updatingData.username,
      updatingData.password
    );
    if (newStuff)
      res.render("profile", {
        title: "Profile",
        success: "Successfully updated!",
      });
    else throw "Error updating";
  } catch (error) {
    res.render("profile", { title: "Profile", error: error });
  }
});

router.post("/", async (req, res) => {
  try {
    let username = req.body.username;
    let password = req.body.password;
    let confirm_password = req.body.confirm_password;
    if (username) {
      if (typeof username != "string" || username.replace(/\s/g, "") == "")
        throw "Invalid username.";
    }
    if (password) {
      if (confirm_password) {
        if (password !== confirm_password) {
          throw "Password and confirm password must match.";
        }
      } else throw "Must enter password and confirm password.";
    }
    const user = await userData.create(username, password);
    if (user) {
      req.session.user = {
        username,
        _id: user._id.toString(),
      };
      let theTrips = user.trips;
      if (theTrips) req.session.user.trips = theTrips;
      res.render("update_profile", {
        title: "Update Account",
        success: `Account created!\nLogged in as: ${username}`,
      });
    } else throw "Error creating account. Please try again.";
  } catch (error) {
    res.render("new_profile", { title: "New Account", error: error });
  }
});

router.post("/feedback", async (req, res) => {
  if (!req.session.user) {
    res.redirect("/");
    return;
  }
  res.render("feedback", { title: "Feedback", success: "Feedback sent!" });
});

router.post("/logout", async (req, res) => {
  if (!req.session.user) {
    res.redirect("/");
    return;
  }
  delete req.session.user;
  res.render("login", { title: "Login", success: "Successfully logged out." });
});

router.post("/login", async (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  try {
    if (
      !username ||
      typeof username != "string" ||
      username.replace(/\s/g, "") == ""
    ) {
      throw "Invalid username.";
    }
    if (
      !password ||
      typeof password != "string" ||
      password.replace(/\s/g, "") == ""
    ) {
      throw "Invalid password.";
    }
    const user = await userData.login(username, password);
    if (user) {
      req.session.user = {
        username,
        _id: user._id.toString(),
      };
      let theTrips = user.trips;
      if (theTrips) req.session.user.trips = theTrips;
    }
  } catch (error) {
    res.render("login", {
      title: "Login",
      error,
    });
    return;
  }
  res.redirect("/trips");
});

module.exports = router;
