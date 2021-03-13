module.exports = function(app){
    const notice = require('../controllers/noticeController');
    const {verify} = require('../../../config/middlewares');

    app.post('/notice',verify,notice.createNotice);
    app.get('/notice',verify,notice.getNotice);
    app.delete('/notice/:noticeId',verify,notice.deleteNotice);
    
    app.post('/notice/:noticeId/comment',verify,notice.createComment);
    app.get('/notice/:noticeId/comment',verify,notice.getComment);
    app.delete('/notice/:noticeId/comment/:commentId',verify,notice.deleteNotice);

};