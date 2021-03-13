module.exports = function(app){
    const sym = require('../controllers/symptomController');
    const {verify,upload} = require('../../../config/middlewares');

    app.get('/users', verify, sym.getUser);
    app.post('/symptoms', verify, sym.postSymptom);

    app.get('/symptoms-filter', sym.filter); //둘러보기 시에도 적용돼야 하기 때문에 verify 없음
    
};