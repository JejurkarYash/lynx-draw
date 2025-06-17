import { Request, Response, NextFunction } from "express"
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from "@repo/backend-common/config";
export const Auth = (req: Request, res: Response, next: NextFunction) => {

    try {

        const token = req.headers['authorization'] || " ";
        const decode = jwt.verify(token, JWT_SECRET as string)

        if (!decode) {
            res.status(401).json({
                message: "UnAuthorized !"
            })

            return
        }

        // setting the user info to the request header 
        req.userInfo = decode as userInfo
        //  provideing control to the next endpoint 
        next();



    } catch (e) {

        res.status(500).json({
            message: "something went wrong ",
            error: e
        })

    }

}