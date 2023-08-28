const express = require('express');
const router = express.Router();
const User = require("../models/user");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const constants  = require('../constants')
const redis = require('redis');

const client = redis.createClient({
    host: 'localhost', // Redis server host
    port: 6379, // Redis server port
    legacyMode: true 
  });

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
                        username: name,
                        email: email,
                        password: hash,
                        userid: Buffer.from(Date.now().toString()).toString('base64'),
                        isVerified: false,
                        role: 'default'
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
    
    User.findOne({ email: email }, (err, user) => {
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
                const sessionPayload = {
                    userId: user.userid
                };
                const expiresIn = '1h';
                const sessionToken = jwt.sign(sessionPayload, constants.JWT_SECRET, { expiresIn });
                console.log(`Succesfully logged in user: ${user.name}, and generated token: ${sessionToken}`)
                return res.status(200).json({ user: user, token: sessionToken });
            } else {
                return res.status(401).json({ error: 'Wrong password' });
            }
        });
    });
});


router.post('/verifytoken', (req, res) => {
    const { token } = req.body;
    jwt.verify(token, constants.JWT_SECRET, (err, decoded) => {
        if (err) {
          return res.status(401).json({ error: err });
        } else {
          console.log('Decoded Payload:', decoded);
          return res.status(200).json({ data: decoded });
        }
      });
});

router.get('/api', (req, res) => {
    res.status(200).json({ status: 'API OK' });
});
module.exports = router;
