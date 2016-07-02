"use strict";
require('dotenv').config();

const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const express = require('express');
const request = require('superagent');
const multipart = require('connect-multiparty');
const helmet = require('helmet');

const fs = require('fs');
const _ = require('lodash');
const async = require('async');
const parseGpx = require('parse-gpx');
const randomWord = require('random-word');

const mailer = require('./mailer');
const PRINTFUL_AUTH = `Basic ${new Buffer(process.env.PRINTFUL_API_KEY).toString('base64')}`;

let app = express();
let multipartMiddleware = multipart();

app.use(helmet());
app.use(logger("dev"));
app.use(cookieParser());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(session({ secret: 'irunsofarandhere', resave: false, saveUninitialized: false }));

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

const getVariantId = (body) => {
    return 2;
}

let countriesCache = [];

app.get('/countries', (req, res) => {
    if(countriesCache.length === 0) {
        request('https://api.theprintful.com/countries')
        .set('Authorization', PRINTFUL_AUTH)
        .end((err, apiRes) => {
            countriesCache = apiRes.body.result;
            res.json({
                countries: countriesCache
            });
        });
    } else {
        res.json({ 
            countries: countriesCache
        });
    }
});

app.post('/shipping', (req, res) => {

    let info = {
        "recipient": {
            "address1": req.body.address,
            "city": req.body.city,
            "country_code": req.body.country,
            "state_code": req.body.state,
            "zip": req.body.zip
        },
        "items": [{
            "quantity": 1,
            "variant_id": getVariantId(req.body)
        }]
    };

    request.post('https://api.theprintful.com/shipping/rates')
    .set('Authorization', PRINTFUL_AUTH)
    .send(info)
    .end((err, apiRes) => {
        res.json(apiRes.body);
    });
});

app.post('/runs', multipartMiddleware, (req, res) => {

    let runs = req.files.runs;

    if(!_.isArray(runs)) {
        runs = [runs];

    }
    let files = runs.map(f => f.path);

    async.reduce(files, [], (acc, f, cb) => {
            parseGpx(f).then(track => {
                cb(null, acc.concat(track));
            }, function(err) {
                console.log(err);
            });
    }, (err, result) => {
        result = result.map(r => {
            return {
                lat: r.latitude,
                lng: r.longitude
            };
        });

        res.json({
            'data': result
        });
    });
});

app.get('/convert', (req, res) => {
    request(req.query.url).pipe(res);
});


const getRandomFilename = _ => {
    if(process.env.NODE_ENV === 'production') {
        return `${randomWord()}-${randomWord()}.png`;
    } else {
        return 'test.png';
    }
}

app.post('/save', (req, res) => {

    let imgData = req.body.data;
    let filename = getRandomFilename();

    fs.writeFile(`${__dirname}/public/imgs/${filename}`, imgData, {encoding: 'base64'}, (err) => {
        if(err) {
            res.status(500).json({
                error: 'Something gone wrong'
            });
        }
        res.json({
            url:`/imgs/${filename}`
        });
    })
});

app.post('/order', (req, res) => {

    let orderInfo = req.body;
    res.json(orderInfo);

    // mailer.orderConfirmation(orderInfo.email, orderInfo).then(emailRes => {
    //     res.json(Object.assign(req.body, emailRes));
    // });
});


app.get('/email', (req, res) => {
    mailer.orderConfirmation('mills.dma@gmail.com', { first_name: 'Daniel', last_name: 'Mills'}).then(data => {
        res.json(data);
    });
});

app.get('/auth/strava', (req, res) => {
    let code = req.query.code;
    console.log('sending auth code: ' + code);

    request
    .post('https://www.strava.com/oauth/token')
    .send({
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        code: code
    })
    .end((err, stravaRes) => {
        let stravaInfo = JSON.parse(stravaRes.text);
        res.json(stravaInfo);
    });
});

console.log('Listening');
app.listen(8000);
