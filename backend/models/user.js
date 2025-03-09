const mongoose= require('mongoose');

const userschema = mongoose.schema({

    name:{
      type:string,
      required:true
  
    },
    email: {
      type: String,
      required: true,
      trim:true
  },
  
    password:{type:string , required:true , minlength: 10},
    role: {
      type: String,
      enum: ["student", "teacher"],    
      default: "student" 
  
   }
  })
  