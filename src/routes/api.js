const express = require("express");
const router = express.Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const constants = require("../constants");
const sendNotification = require("../notification");
const logger = require("../logger");

router.post("/getUsers", (req, res) => {
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
                if(user.role == "administrator") {
                    User.find({}, function(err, result) {
                        if(err) {
                            logger(`Database error: ${err}`, 'ERROR');
                            return res.status(500).json({error: 'Database error'});
                        } else {
                            return res.status(200).json({data: result});
                        }
                    });
                } else {
                    return res.status(401).json({ error: 'Insufficient permissions'});
                }
            }
          });
        }
      });
});
router.get("/", (req, res) => {
    sendNotification("API Status checked-OK");
    logger(`API status checked with good result`, 'INFO');
    res.status(200).json({ status: "API OK" });
});
module.exports = router;