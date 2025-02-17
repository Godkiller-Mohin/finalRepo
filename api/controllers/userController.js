const express = require('express');
var bcrypt = require('bcryptjs');
const User = require('../models/user_model');
const Token = require('../models/token');

module.exports.firstFunction = async (req,res) => {
    try{
        const user = await User.findById(req.params.id);
        if(!user) return res.status(400).json({message: 'User does not exist'});

        const token = await Token.findOne({userId: user._id, token: req.params.token});

        if(!token) return res.status(400).json({message: 'Invalid or expired token'});

        await User.updateOne({_id: user._id}, {isVerified: true});
        await Token.deleteOne({userId: user._id});

        res.status(200).json({message: 'Email verified successfully'});

    }catch(e){
        console.log("OOps");
        res.status(400).json({message: e.message});

    }
}




module.exports.verifyEmail = async (req, res) => {
    try {
      console.log("we are in verify email function");
      const user = await User.findOne({ _id: req.params.id });
      if (!user) return res.status(400).send('Invalid link');
  
      const token = await Token.findOne({
        userId: user._id,
        token: req.params.token,
      });
      if (!token) return res.status(400).send('Invalid link');
  
      user.verified = true;
      await user.save();
      await Token.findByIdAndDelete(token._id); 
      console.log("Checking the link")
      console.log(req.query)
      console.log("h")
      res.redirect(`https://localhost:5173/signin/?verified=true`);
    } catch (error) {
      res.status(400).send(error.message);
      console.log(error);
    }
  };

