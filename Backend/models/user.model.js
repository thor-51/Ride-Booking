import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    fullname:{
        firstname:{
            type:String,
            required:true,
            minLength:[3 , "Firstname should be atleast 3 characters long"],
        },
        lastname:{
            type:String,
            minLength:[3, "Lastname should be atleast 3 characters long"],
        }
    },
    email:{
        type:String,
        required:true,
        unique:true,
        minLength:[5, "Email should be atleast 5 characters long"],
    },
    password:{
        type:String,
        required:true,
        select:false,
    },
    socketId:{
        type:String,
    }
})


userSchema.methods.generateAuthToken = function (){
    const token = jwt.sign({_id:this._id} , process.env.JWT_SECRET , {expiresIn:"24h"});
    return token;
}

userSchema.methods.comparePassword = async function (enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
}

userSchema.statics.hashPassword = async function (password){
    return await bcrypt.hash(password, 10);
}

const userModel = mongoose.model("user", userSchema);

export default userModel;