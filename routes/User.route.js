const express = require('express');
const route = express.Router();

// signUp
route.post('/signUp', (req, res) => {
    res.send('signUp');
} );

// signIn
route.post('/signIn', (req, res) => {
    res.send('signIn');
} );

// signOut
route.post('/signOut', (req, res) => {
    res.send('signOut');
} );

module.exports = route;