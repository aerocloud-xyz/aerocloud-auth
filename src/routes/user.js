const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const constants = require("../constants");
const sendNotification = require("../notification");

router.post("/register", (req, res) => {
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
          return res
            .status(500)
            .json({ error: `Internal server error: ${err}` });
        }

        bcrypt.hash(password, salt, (err, hash) => {
          if (err) {
            return res
              .status(500)
              .json({ error: `Internal server error: ${err}` });
          }

          const newUser = new User({
            name: name,
            username: name,
            email: email,
            password: hash,
            userid: Buffer.from(Date.now().toString()).toString("base64"),
            isVerified: false,
            role: "default",
            integrations: "{}",
          });
          newUser
            .save()
            .then((value) => {
              sendNotification(
                `Succesfully registered in user: ${newUser.name}!`
              );
              return res.status(200).json(newUser.toJSON());
            })
            .catch((error) => {
              return res
                .status(500)
                .json({ error: `Internal server error: ${error}` });
            });
        });
      });
    }
  });
});
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email: email }, (err, user) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    if (!user) {
      return res.status(409).json({ error: "User does not exist." });
    }
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        return res.status(500).json({ error: err });
      }
      if (isMatch) {
        const sessionPayload = {
          userId: user.userid,
        };
        const expiresIn = "1h";
        const sessionToken = jwt.sign(sessionPayload, constants.JWT_SECRET, {
          expiresIn,
        });
        console.log(
          `Succesfully logged in user: ${user.name}, and generated token: ${sessionToken}`
        );
        sendNotification(`Succesfully logged in user: ${user.name}!`);
        return res.status(200).json({ user: user, token: sessionToken });
      } else {
        return res.status(401).json({ error: "Wrong password" });
      }
    });
  });
});
router.post("/verifytoken", (req, res) => {
  const { token } = req.body;
  jwt.verify(token, constants.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: err });
    } else {
      var UserID = decoded.userId;
      User.findOne({ userid: UserID }, (err, user) => {
        if (err) {
          return res.status(500).json({ error: err });
        } else {
          console.log("Decoded Payload:", decoded);
          return res.status(200).send(user.role);
        }
      });
    }
  });
});
router.delete("/deleteUser", (req, res) => {
  const { token } = req.body;
  jwt.verify(token, constants.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: err });
    } else {
      User.findOne({ userid: decoded.userId }).exec((err, user) => {
        if (err) {
          return res
            .status(401)
            .json({ error: "User deleted or does not exist." });
        } else {
          User.deleteOne({ userid: decoded.userId }, (err) => {
            if (err) {
              return res.status(500).json({ error: err });
            } else {
              console.log(
                `User with the ID: ${decoded.userId} has been deleted successfully.`
              );
              return res.status(200).json({ status: "User deleted" });
            }
          });
        }
      });
    }
  });
});
router.post("/updateUsername", (req, res) => {
  const { token, newusername } = req.body;
  jwt.verify(token, constants.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: err });
    } else {
      User.findOne({ userid: decoded.userId }).exec((err, user) => {
        if (err) {
          return res
            .status(401)
            .json({ error: "User deleted or does not exist" });
        } else {
          User.updateOne(
            { userid: decoded.userId },
            { username: newusername }
          ).exec((err) => {
            if (err) {
              return res.status(500).json({ error: "Internal server error" });
            } else {
              sendNotification(
                `User ${user.name} changed their username to ${newusername}`
              );
              return res.status(200).json({ status: "Username changed" });
            }
          });
        }
      });
    }
  });
});
module.exports = router;
