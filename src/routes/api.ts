import express, { Request, Response } from "express";
import { Router } from 'express';
import {User, IUser} from "../models/user";
import jwt from "jsonwebtoken";
import * as constants from "../constants";
import sendNotification from "../notification";

const apirouter: Router = express.Router();

apirouter.post("/getUsers", (req: Request, res: Response) => {
    const { token } = req.body;
    jwt.verify(token, constants.JWT_SECRET, (err: any, decoded: any) => {
        if (err) {
            return res.status(401).json({ error: err });
        } else {
            var UserID = decoded.userId;
            User.findOne({ userid: UserID }, (err: any, user: IUser) => {
                if (err) {
                    return res.status(500).json({ error: err });
                } else {
                    if (user.role === "administrator") {
                        User.find({}, function (err: any, result: IUser) {
                            if (err) {
                                console.log(`Database error: ${err}`, 'ERROR');
                                return res.status(500).json({ error: 'Database error' });
                            } else {
                                return res.status(200).json({ data: result });
                            }
                        });
                    } else {
                        return res.status(401).json({ error: 'Insufficient permissions' });
                    }
                }
            });
        }
    });
});

apirouter.get("/", (req: Request, res: Response) => {
    sendNotification("API Status checked-OK");
    console.log(`API status checked with good result`, 'INFO');
    res.status(200).json({ status: "API OK" });
});

export default apirouter;
