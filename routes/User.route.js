const express = require('express');
const route = express.Router();

// mongoDb User Model
const User = require('../models/User.model');

// Password Handler
const bcrypt = require('bcryptjs');

// signUp
route.post('/signUp', (req, res) => {
    let { name, email, password, dateOfBirth } = req.body;
    name = name.trim();
    email = email.trim();
    password = password.trim();
    dateOfBirth = dateOfBirth.trim();

    if(name == "" || email == "" || password == "" || dateOfBirth == "") {
        res.json({
            status:"failed",
            message: "empty input fields"
        })
    }else if(!/^[a-zA-Z]*$/.test(name)) {
        res.json({
            status:"failed",
            message: "invalid name"
        })
    }else if(!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email)) {
        res.json({
            status:"failed",
        })
    }else if(!/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(dateOfBirth)) {
        res.json({
            status:"failed",
            message: "invalid date of birth"
        })
    }else if(!/^[a-zA-Z0-9]*$/.test(password)) {
        res.json({
            status:"failed",
            message: "invalid password"
        })
    }else if(password.length < 8){
        res.json({
            status:"failed",
            message: "password must be at least 8 characters"
        })
    }else{
        // if user already registered
        User.find({email: email})
            .then(result=>{
                if(result.length){
                    res.json({
                        status:"failed",
                        message:"user with the provided email is already registered."
                    })
                }else{
                    // Password Handling
                    const saltRounds = 10;
                    bcrypt.hash(password, saltRounds)
                    .then(hashedPassword => {
                        // create new user
                        const newUser = new User({
                            name: name,
                            email: email,
                            password: hashedPassword,
                            dateOfBirth: dateOfBirth
                        });
                        newUser.save()
                            .then(result=>{
                                res.json({
                                    status:"success",
                                    message:"user created successfully",
                                    data:result
                                })
                            }).catch(err=>{
                                res.json({
                                    status:"failed",
                                    message:"an error occure while registering user account"
                                })
                            })
                    })
                    .catch(err=>{
                        res.json({
                            status:"failed",
                            message:"an error occure while hashing password"
                        })
                    })

                }
            })
            .catch(err=>{
                res.json({
                    status:"failed",
                    message: "error while checking the existing user"
                })
            })
            
            
        }
    res.send('signUp success');
} );

// signIn
route.post('/signIn', (req, res) => {
    let { email, password } = req.body;
    email = email.trim();
    password = password.trim();
    if(email == "" || password == "") {
        res.json({
            status:"failed",
            message: "Empty credintials supplied"
        })
    }else if(!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email)) {
        res.json({
            status:"failed",
            message: "Invalid email"
        })
    }else if(!/^[a-zA-Z0-9]*$/.test(password)) {
        res.json({
            status:"failed",
            message: "Invalid password"
        })
    }else{
        // check if user exists
        User.find({email: email})
            .then(result=>{
                if(result.length){
                    const hashedPassword = result[0].password;
                    bcrypt.compare(password, hashedPassword)
                        .then(result=>{
                            if(result){
                                res.json({
                                    status:"success",
                                    message:"user logged in successfully",
                                    data:result
                                })
                            }else{
                                res.json({
                                    status:"failed",
                                    message:"invalid credientials entered."
                                })
                            }
                        }).catch(err=>{
                            res.json({
                                status:"failed",
                                message:"an error occure while comparing password"
                            })
                        })
                }else{
                    res.json({
                        status:"failed",
                        message:"user not found"
                    })
                }
            }).catch(err=>{
                res.json({
                    status:"failed",
                    message:"an error occure while checking the existing user"
                })
            })

    }
    res.send('signIn successfull');
} );

// signOut
route.post('/signOut', (req, res) => {
    res.send('signOut');
} );

module.exports = route;