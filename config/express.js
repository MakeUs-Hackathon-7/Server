const express = require('express');
const compression = require('compression');
const methodOverride = require('method-override');
var cors = require('cors');

module.exports = function () {
    const app = express();

    app.use(compression());

    app.use(express.json());

    app.use(express.urlencoded({extended: true}));

    app.use(express.static('uploads'));

    app.use(methodOverride());

    app.use(cors());
   
    require('../src/app/routes/authRoute')(app);
    require('../src/app/routes/noticeRoute')(app);
    require('../src/app/routes/mypageRoute')(app);
    require('../src/app/routes/symptomRoute')(app);

    return app;
};