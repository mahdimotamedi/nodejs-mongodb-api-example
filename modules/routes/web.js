const express = require('express');

const router = express.Router();

// the routes of main website url
router.get('/' , (req , res) => {
    res.json('Welcome to Home Page');    
});

router.get('/about' , (req , res) => {
    res.json('Welcome to About Page');
});


module.exports = router;