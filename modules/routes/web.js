const express = require('express');

const router = express.Router();

router.get('/' , (req , res) => {
    res.json('Welcome to Home Page');    
});

router.get('/about' , (req , res) => {
    res.json('Welcome to About Page');
});


module.exports = router;