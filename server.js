const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose'); 
const expressValidator = require('express-validator');
const RateLimit = require('express-rate-limit');

global.config = require('./modules/config');
// Connect to DB
mongoose.connect('mongodb://127.0.0.1:27017/example_mvc_mongo' , { useMongoClient : true });
mongoose.Promise = global.Promise;

// active rate limit for all requests
app.enable('trust');
let limiter = new RateLimit({
    windowMs: 10*60*1000,
    max: 100,
    delayMs: 0,
});
app.use(limiter);


// some middleware of express to make app handy
app.use(bodyParser.urlencoded({ extended : false }));
app.use(bodyParser.json({ type : 'application/json' }));
app.use(expressValidator());
app.use('/public' , express.static('public'));

// register routes to express
const apiRouter = require('./modules/routes/api');
const webRouter = require('./modules/routes/web');

app.use('/api' , apiRouter);
app.use('/' , webRouter);

// listen app on a port
app.listen(config.port , () => {
    console.log(`Server running at Port ${config.port}`)
});