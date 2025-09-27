import jwt from "jsonwebtoken";
import { Request, Response, NextFunction} from "express";
import { AdminJwtPayload } from "../types/express";

const authMiddleware = (req: Request,res: Response, next:NextFunction)=>{
    const token = req.cookies.token;

    if(!token){
        return res.status(401).json({
            message:"Unauthorized access: token doesn't provide"
        })
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as AdminJwtPayload;
        req.admin = decoded;
        next();
    }catch(err){
        return next(
            res.status(403).json({message: 'Invalid token...!!!', error:err})
        )
    }
}

export default authMiddleware;