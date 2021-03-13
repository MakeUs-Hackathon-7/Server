const { UserBindingPage } = require('twilio/lib/rest/ipMessaging/v2/service/user/userBinding');
const {pool} = require('../../../config/database');
const {logger} = require('../../../config/winston');


const authDao = require('../dao/authDao');
const noticeDao=require('../dao/noticeDao');

exports.createNotice = async(req, res)=> {
    
    
    const userId=req.verifiedToken.id;
    const content=req.body.content;

    try{
        const user=await authDao.selectUserById(userId);
        if(user.length<1){
            return res.json({
                isSuccess:false,
                message:'없는 유저입니다',
                code:420
            })
        }

        await noticeDao.insertNotice(userId,content);

        return res.json({
            message:'게시글 작성 성공',
            code:200,
            isSuccess:true
        });


    } catch (err) {
        logger.error(`게시글 작성 실패\n: ${err.message}`);
        return res.json({
            message:err.message,
            code:500,
            isSuccess:false
        });
    }
};


exports.getNotice = async(req, res)=> {
    
    var page=req.query.page;
    if(!page){
        return res.json({
            message:'페이지를 입력해주세요',
            code:423,
            isSuccess:true
        });
    }
    page=Number(page);

    try{


        const notice=await noticeDao.getNotice(page);
        var noticeData=[];
        for(var _ of notice){
            var ob={};
            const userId=_.userId;
            const user=await authDao.selectUserById(userId);
            ob.userImg=user[0].profileImg;
            ob.content=_.content;
            ob.time=_.time,
            ob.id=_.id
            ob.commentCount=_.commentCount;

            noticeData.push(ob);
        }

        return res.json({
            message:'게시글 조회 성공',
            code:200,
            isSuccess:true,
            result:{
                noticeData:noticeData
            }
        });


    } catch (err) {
        logger.error(`게시글 조회 실패\n: ${err.message}`);
        return res.json({
            message:err.message,
            code:500,
            isSuccess:false
        });
    }
};





exports.deleteNotice = async(req, res)=> {
    
    var noticeId=req.params.noticeId;

    if(!noticeId){
        return res.json({
            message:'게시물 아이디를 입력해주세요',
            code:426,
            isSuccess:true
        });
    }
    noticeId=Number(req.params.noticeId);

    try{

        await noticeDao.deleteNotice(noticeId);

        await noticeDao.deleteNoticeComment(noticeId);
        
        return res.json({
            message:'게시글 삭제 성공',
            code:200,
            isSuccess:true
        });


    } catch (err) {
        logger.error(`게시글 삭제 실패\n: ${err.message}`);
        return res.json({
            message:err.message,
            code:500,
            isSuccess:false
        });
    }
};


exports.createComment = async(req, res)=> {
    
    
    const userId=req.verifiedToken.id;
    var noticeId=req.params.noticeId;
    const comment=req.body.comment;
    

    if(!comment){
        return res.json({
            message:'댓글을 입력해주세요',
            code:424,
            isSuccess:false
        });
    }

    if(!noticeId){
        return res.json({
            message:'게시물 아이디를 입력해주세요',
            code:426,
            isSuccess:false
        });
    }
    noticeId=Number(req.params.noticeId);

    try{

        const user=await authDao.selectUserById(userId);
        if(user.length<1){
            return res.json({
                isSuccess:false,
                message:'없는 유저입니다',
                code:420
            })
        }

        await noticeDao.insertComment(noticeId,comment,userId);
        
        return res.json({
            message:'게시판 댓글 생성 성공',
            code:200,
            isSuccess:true
        });


    } catch (err) {
        logger.error(`게시판 댓글 생성 실패\n: ${err.message}`);
        return res.json({
            message:err.message,
            code:500,
            isSuccess:false
        });
    }
};


exports.getComment = async(req, res)=> {
    
    
    var noticeId=req.params.noticeId;


    if(!noticeId){
        return res.json({
            message:'게시물 아이디를 입력해주세요',
            code:426,
            isSuccess:false
        });
    }
    noticeId=Number(req.params.noticeId);


    var page=req.query.page;
    if(!page){
        return res.json({
            message:'페이지를 입력해주세요',
            code:423,
            isSuccess:true
        });
    }
    page=Number(page);

    try{


        const comment=await noticeDao.getComment(noticeId,page);

        var commentData=[];
        for(var _ of comment){
            var ob={};
            const userId=_.userId;
            const user=await authDao.selectUserById(userId);
            ob.userImg=user[0].profileImg;
            ob.comment=_.comment;
            ob.time=_.time,
            ob.id=_.id
            
            commentData.push(ob);
        }


        return res.json({
            message:'게시판 댓글 조회 성공',
            code:200,
            isSuccess:true,
            commentData:commentData
        });


    } catch (err) {
        logger.error(`게시판 댓글 생성 실패\n: ${err.message}`);
        return res.json({
            message:err.message,
            code:500,
            isSuccess:false
        });
    }
};



exports.deleteComment = async(req, res)=> {
    
    
    var noticeId=req.params.noticeId;

    if(!noticeId){
        return res.json({
            message:'게시물 아이디를 입력해주세요',
            code:426,
            isSuccess:false
        });
    }
    noticeId=Number(req.params.noticeId);


    var commentId=req.params.commentId;
    if(!commentId){
        return res.json({
            message:'댓글 아이디를 입력해주세요',
            code:425,
            isSuccess:true
        });
    }
    commentId=Number(commentId);

    try{


        await noticeDao.deleteComment(noticeId,commentId);


        return res.json({
            message:'게시판 댓글 삭제 성공',
            code:200,
            isSuccess:true,
            commentData:commentData
        });


    } catch (err) {
        logger.error(`게시판 댓글 삭제 실패\n: ${err.message}`);
        return res.json({
            message:err.message,
            code:500,
            isSuccess:false
        });
    }
};