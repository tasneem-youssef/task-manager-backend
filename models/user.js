import mongoose from 'mongoose';
import bycrypt from 'bcryptjs';
const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password:{
        type: String,
        required: true,     
        trim: true,
        minlength: 7
    },
    name:{
        type: String,
        required: true,
        trim: true
    }});

//Hash the plain text password before saving
userSchema.pre('save', async function(next){
if(!this.isModified('password')) return next();
const salt = await bycrypt.genSalt(10);
this.password = await bycrypt.hash(this.password, salt);
next();
});

//compare password for login
userSchema.methods.matchPassword = async function(enteredPassword){
    return await bycrypt.compare(enteredPassword, this.password);
}
export default mongoose.model('User', userSchema);
