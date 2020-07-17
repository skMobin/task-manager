const validator = require('validator')
const mongoose  = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('../models/task') 

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    trim: true,
    required: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email is Invalid.");
      }
    },
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 7,
    validate(value) {
      if (value.toLowerCase().includes("password")) {
        throw new Error("Password cannot be 'password'");
      }
    },
  },
  age: {
    type: Number,
    default: 0,
    validate(value) {
      if (value < 0) {
        throw new Error("Invalid Age!");
      }
    }
  },
  tokens:[{
    token:{
      type:String,
      required:true
    }
  }],
  avatar:{
    type: Buffer
  }
},{
  timestamps:true
})

userSchema.virtual('tasks',{
  ref:'Task',
  localField:'_id',
  foreignField:'owner'
})

userSchema.methods.toJSON = function(){
  const user = this
  const userObject = user.toObject()

  delete userObject.tokens
  delete userObject.password
  delete userObject.avatar

  return userObject
}
//token generation
userSchema.methods.generateAuthToken = async function(){
    const token = await jwt.sign({_id:this._id.toString()},process.env.JWT_SECRET);
    this.tokens = this.tokens.concat({token})
    await this.save()
    return token
}
//verify user
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Invalid Credentials");
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid Credentials");
  }
  return user;
};
//delete task when user got deleted
userSchema.pre('remove',async function(next){
  const user = this
  await  Task.deleteMany({owner:user._id})
  next()
})

//password hash 
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});



const User = mongoose.model('User',userSchema)

module.exports = User