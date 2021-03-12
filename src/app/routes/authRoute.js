module.exports = function(app){
    const auth = require('../controllers/authController');
    const {verify,upload} = require('../../../config/middlewares');

    app.post('/user',upload.single('img'),auth.signUp);
    app.post('/login',auth.signIn);

    app.post('/auth',verify,upload.single('img'),auth.createAuth);
    
};