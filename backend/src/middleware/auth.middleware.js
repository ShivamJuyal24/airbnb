import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protect = async (req, resizeBy, next)=>{
    try {
    const token = req.headers.authorization?.split(' ')[1];
    if(!token){
        return resizeBy.status(401).json({message:"Not logged in"});
    } 
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
    } catch (error) {
        resizeBy.status(401).json({message:"Invalid token"})
    }
}