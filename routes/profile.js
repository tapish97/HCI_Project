const express = require('express');
const router = express.Router();
let userData = require('../data/users');

router.get('/', async (req, res) => {
    if(!req.session.user) {
        res.redirect('/');
        return;
    }
    res.render('profile', { title: "Profile" });
});

router.get('/feedback', async (req, res) => {
    if(!req.session.user) {
        res.redirect('/');
        return;
    }
    res.render('feedback', { title: "Feedback" });
});

router.post('/', async (req, res) => {
    try {
        let username = req.body.username;
        let password = req.body.password;
        let confirm_password = req.body.confirm_password;
        let oldUser = await userData.read(req.session.user._id);
        let updatingData = { id: req.session.user._id };
        if(username) {
            if(typeof username != "string" || username.replace(/\s/g, '') == "") throw "Username must be string";
            updatingData.username = username;
        }
        else updatingData.username = oldUser.username;
        if(password) {
            if(confirm_password) {
                if(password == confirm_password) {
                    updatingData.password = password;
                }
                else throw "password and confirm password must match";
            }
            else throw "must enter password and confirm password";
        }
        else updatingData.password = oldUser.password;

        let newStuff = await userData.update(updatingData.id, updatingData.username, updatingData.password);
        if(newStuff) res.render('profile', { title: "Profile", success: "Successfully updated!"});
        else throw "Error updating";
    } 
    catch (error) {
        res.render('profile', { title: "Profile", error: error });
    }
});

router.post('/feedback', async (req, res) => {
    if(!req.session.user) {
        res.redirect('/');
        return;
    }
    res.render('feedback', { title: "Feedback", success: "Feedback sent!" });
});

module.exports = router;