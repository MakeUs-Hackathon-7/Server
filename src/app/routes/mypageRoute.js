module.exports = function(app){
    const mypage = require('../controllers/mypageController');
    const {verify} = require('../../../config/middlewares');

    app.get('/mypage',verify,mypage.getInfo);
    //app.post('mypage/user',verify,mypage.updateUser);
    app.get('/mypage/notice',verify,mypage.getNotice);
    //app.get('mypage/symptom',verify,mypage.getSymptom);

};