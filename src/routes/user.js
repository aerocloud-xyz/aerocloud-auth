const express = require('express');
const router = express.Router();
const User = require("../models/user");
const bcrypt = require('bcrypt');

router.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    console.log(req.body);
    User.findOne({ email: email }).exec((err, user) => {
        if (err) {
            return res.status(500).json({ error: "Internal server error." });
        }

        if (user) {
            return res.status(409).json({ error: "User already exists." });
        } else {
                bcrypt.genSalt(10, (err, salt) => {
                if (err) {
                    return res.status(500).json({ error: `Internal server error: ${err}` });
                }

                bcrypt.hash(password, salt, (err, hash) => {
                    if (err) {
                        return res.status(500).json({ error: `Internal server error: ${err}` });
                    }

                    const newUser = new User({
                        name: name,
                        email: email,
                        password: hash,
                        userid: Buffer.from(Date.now().toString()).toString('base64')
                    });
                    newUser.save()
                        .then((value) => {
                            return res.status(200).json(newUser.toJSON());
                        })
                        .catch((error) => {
                            return res.status(500).json({ error: `Internal server error: ${error}` });
                        });
                });
            });
        }
    });
});

router.post('/login', (req, res) => {
    const { email, password } = req.body;
    User.findOne({ email: email }).exec((err, user) => {
        if (err) {
            return res.status(500).json({ error: "Internal server error." });
        }
        if (!user) {
            return res.status(409).json({ error: 'User does not exist.' });
        }
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                return res.status(500).json({ error: 'Internal server error' });
            }
            if (isMatch) {
                return res.status(200).json({ user: user });
            } else {
                return res.status(401).json({ error: 'Wrong password' });
            }
        });
    });
});

module.exports = router;
