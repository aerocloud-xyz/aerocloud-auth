import express, { Request, Response } from "express";
import { Router } from "express";
import { User, IUser } from "../models/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as constants from "../constants";
import sendNotification from "../notification";
import saveSession from "../sessionSave";

const userrouter: Router = express.Router();

userrouter.post("/register", (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  console.log(req.body);
  User.findOne({ email: email }).exec((err, user) => {
    if (err) {
      console.log(`Database error: ${err}`, "ERROR");
      return res.status(500).json({ error: "Internal server error." });
    }

    if (user) {
      return res.status(409).json({ error: "User already exists." });
    } else {
      bcrypt.genSalt(10, (err: any, salt: string) => {
        if (err) {
          console.log(`Bcrypt error: ${err}`, "ERROR");
          return res
            .status(500)
            .json({ error: `Internal server error: ${err}` });
        }

        bcrypt.hash(password, salt, (err: any, hash: string) => {
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
              sendNotification(`Succesfully registered user: ${newUser.name}!`);
              return res.status(200).json(newUser.toJSON());
            })
            .catch((error) => {
              console.log(`Database error: ${err}`, "ERROR");
              return res
                .status(500)
                .json({ error: `Internal server error: ${error}` });
            });
        });
      });
    }
  });
});

userrouter.post("/login", (req: Request, res: Response) => {
  const { email, password } = req.body;

  User.findOne({ email: email }, (err: any, user: IUser) => {
    if (err) {
      console.log(`Database error: ${err}`, "ERROR");
      return res.status(500).json({ error: err });
    }
    if (!user) {
      return res.status(409).json({ error: "User does not exist." });
    }
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        console.log(`Bcrypt error: ${err}`, "ERROR");
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
        // TODO: Save the session
        saveSession(sessionToken, "1.1.1.1", user.userid, user.role);
        sendNotification(`Succesfully logged in user: ${user.name}!`);
        return res.status(200).json({ token: sessionToken });
      } else {
        return res.status(401).json({ error: "Wrong password" });
      }
    });
  });
});

userrouter.post("/verifytoken", (req: Request, res: Response) => {
  const { token } = req.body;
  jwt.verify(token, constants.JWT_SECRET, (err: any, decoded: any) => {
    if (err) {
      return res.status(401).json({ error: err });
    } else {
      var UserID: string = decoded.userId;
      User.findOne({ userid: UserID }, (err: any, user: IUser) => {
        if (err) {
          console.log(`Database error: ${err}`, "ERROR");
          return res.status(500).json({ error: err });
        } else {
          console.log("Decoded Payload:", decoded);
          return res.status(200).json({user: user});
        }
      });
    }
  });
});

userrouter.delete("/deleteUser", (req: Request, res: Response) => {
  const { token } = req.body;
  jwt.verify(token, constants.JWT_SECRET, (err: any, decoded: any) => {
    if (err) {
      return res.status(401).json({ error: err });
    } else {
      User.findOne({ userid: decoded.userId }).exec((err: any) => {
        if (err) {
          console.log(`Database error: ${err}`, "ERROR");
          return res
            .status(401)
            .json({ error: "User deleted or does not exist." });
        } else {
          User.deleteOne({ userid: decoded.userId }, (err) => {
            if (err) {
              console.log(`Database error: ${err}`, "ERROR");
              return res.status(500).json({ error: err });
            } else {
              console.log(
                `User with the ID: ${decoded.userId} deleted successfully.`,
                "INFO"
              );
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

userrouter.post("/updateUsername", (req: Request, res: Response) => {
  const { token, newusername } = req.body;
  jwt.verify(token, constants.JWT_SECRET, (err: any, decoded: any) => {
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
              console.log(`Database error: ${err}`, "ERROR");
              return res.status(500).json({ error: "Internal server error" });
            } else {
              if (!user) {
                return res.status(500).json({ error: "user is null" });
              } else {
                sendNotification(
                  `User ${user.name} changed their username to ${newusername}`
                );
                return res.status(200).json({ status: "Username changed" });
              }
            }
          });
        }
      });
    }
  });
});

export default userrouter;
