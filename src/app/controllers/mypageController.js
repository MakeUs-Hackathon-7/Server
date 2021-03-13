const { UserBindingPage } = require('twilio/lib/rest/ipMessaging/v2/service/user/userBinding');
const {pool} = require('../../../config/database');
const {logger} = require('../../../config/winston');


const mypageDao=require('../dao/mypageDao');
const authDao=require('../dao/authDao');

exports.getInfo = async(req, res)=> {
    
    
    const userId=req.verifiedToken.id;
    
    try{
        const user=await authDao.selectUserById(userId);
        if(user.length<1){
            return res.json({
                isSuccess:false,
                message:'없는 유저입니다',
                code:420
            })
        }

        const [authInfo]=await mypageDao.selectUserInfo(userId);
  

        return res.json({
            message:'마이페이지 정보 조회 성공',
            code:200,
            isSuccess:true,
            result:{
                authInfo:authInfo
            }
        });


    } catch (err) {
        logger.error(`마이페이지 정보 조회 실패\n: ${err.message}`);
        return res.json({
            message:err.message,
            code:500,
            isSuccess:false
        });
    }
};




exports.getNotice = async(req, res)=> {
    
    
    const userId=req.verifiedToken.id;
    
    try{
        const user=await authDao.selectUserById(userId);
        if(user.length<1){
            return res.json({
                isSuccess:false,
                message:'없는 유저입니다',
                code:420
            })
        }

        const noticeInfo=await mypageDao.selectUserNotice(userId);
        
        

        return res.json({
            message:'마이페이지 정보 조회 성공',
            code:200,
            isSuccess:true,
            result:{
                noticeInfo:noticeInfo
            }
        });


    } catch (err) {
        logger.error(`마이페이지 정보 조회 실패\n: ${err.message}`);
        return res.json({
            message:err.message,
            code:500,
            isSuccess:false
        });
    }
};
