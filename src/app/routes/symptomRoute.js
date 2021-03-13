module.exports = function(app){
    const sym = require('../controllers/symptomController');
    const {verify,upload} = require('../../../config/middlewares');

    app.get('/users', verify, sym.getUser);
    app.post('/symptoms', verify, sym.postSymptom);

    app.get('/symptoms-filter', verify, sym.filter);
    
};