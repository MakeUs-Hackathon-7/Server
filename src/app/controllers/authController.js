const {pool} = require('../../../config/database');
const {logger} = require('../../../config/winston');

const jwt = require('jsonwebtoken');
const regexEmail = require('regex-email');
const crypto = require('crypto');
const axios=require('axios');
const FormData=require('form-data');
const {Storage:GCS}=require('@google-cloud/storage') ;
const storage=new GCS();
const {format}=require('util');
const path=require('path');
const streamifier = require('streamifier');


require('dotenv').config();


const authDao = require('../dao/authDao');



exports.signUp = async(req, res)=> {
    
    const email=req.body.email;
    const password=req.body.password;
    const nickname=req.body.nickname;

    const pic=req.file;

    console.log(email);
    console.log(pic);


    if (!email){
        return res.json({
            isSuccess: false, 
            code: 410, 
            message: "이메일을 입력해주세요."
        });
    }

    if (!regexEmail.test(email)){
        return res.json({
            isSuccess: false,
            code:411,
            message: "이메일을 형식을 지켜주세요"
        });
    }

    if (!password){
        return res.json({
            isSuccess: false, 
            code: 412, 
            message: "비밀번호를 입력 해주세요"
        });
    }

    if (typeof(password)!='string'){
        return res.json({
            isSuccess: false,
            code: 413,
            message: "비밀번호는 문자열입니다"
        });
    }


    if(!nickname){
        return res.json({
            code:414,
            isSuccess:false,
            message:'닉네임 입력해주세요'
        })
    }

    if(typeof(nickname)!='string'){
        return res.json({
            code:415,
            isSuccess:false,
            message:'닉네임은 문자열입니다'
        })
    }

    if(!pic){
        return res.json({
            code:422,
            isSuccess:false,
            message:'프로필 사진을 입력해주세요'
        })
    }

  
    try {

        const bucket = storage.bucket(process.env.GCLOUD_STORAGE_BUCKET);
        const blob = bucket.file(Math.floor(Math.random() * 1000).toString()+Date.now()+path.extname(pic.originalname));
        console.log(blob.name);
        const blobStream = blob.createWriteStream();

        const publicUrl = format(`https://storage.googleapis.com/${bucket.name}/${blob.name}`);
   
           

        const userByEmail=await authDao.selectUserByEmail(email);

        if(userByEmail.length>1){
            return res.json({
                isSuccess:true,
                message:'중복된 이메일입니다',
                code:416
            })
        }

        const hashedPassword = await crypto.createHash('sha512').update(password).digest('hex');

        await authDao.insertUserInfo(email,hashedPassword,nickname,publicUrl);


        return new Promise((resolve, reject) => {
            streamifier.createReadStream(req.file.buffer)
                .on('error', (err) => {
                    return reject(err);
                })
                .pipe(blobStream)
                .on('finish', (resp) => {
                    return res.json({
                        isSuccess: true,
                        code: 200,
                        message: "회원가입 성공"
                    });
                });
        })


    } catch (err) {
        logger.error(`회원가입 실패\n: ${err.message}`);
        return res.json({
            message:err.message,
            code:500,
            isSuccess:false
        });
    }
};


exports.signIn = async (req, res)=> {
   
    var email=req.body.email;
    var password=req.body.password;
    
    console.log(email);

    if (!email){
        return res.json({
            isSuccess: false, 
            code: 410, 
            message: "이메일을 입력해주세요."
        });
    }

    if (!regexEmail.test(email)){
        return res.json({
            isSuccess: false,
            code:411,
            message: "이메일을 형식을 지켜주세요"
        });
    }

    if (!password){
        return res.json({
            isSuccess: false, 
            code: 412, 
            message: "비밀번호를 입력 해주세요"
        });
    }

    if (typeof(password)!='string'){
        return res.json({
            isSuccess: false,
            code: 413,
            message: "비밀번호는 문자열입니다"
        });
    }

    const hashedPassword = await crypto.createHash('sha512').update(password).digest('hex');

    try{

        const userByEmail=await authDao.selectUserByEmail(email);

        if(userByEmail.length<1){
            return res.json({
                isSuccess:true,
                message:'존재하지않는 이메일입니다',
                code:417
            })
        }

        if(hashedPassword!=userByEmail[0].password){
            return res.json({
                isSuccess:true,
                message:'틀린 비밀번호입니다',
                code:418
            })
        }




        var token = await jwt.sign({
                id: userByEmail[0].id,
            }, 
            process.env.JWT, 
            {
                expiresIn: '365d',
                subject: 'userInfo',
            } 
        );

        return res.json({
            isSuccess: true,
            code: 200,
            message: "로그인 성공",
            result:{
                token:token
            }
        });

    }catch (err) {
        logger.error(`로그인 실패\n: ${JSON.stringify(err)}`);
        return false;
    }
};





exports.createAuth = async(req, res)=> {
   
    const userId=req.verifiedToken.id;
    const pic=req.file;


    if(!pic){
        return res.json({
            isSuccess:false,
            message:'접종인증 사진을 입력해주세요',
            code:419
        })
    }

    console.log(pic);


    try{
/*
        const user=await authDao.selectUserById(userId);
        if(user.length<1){
            return res.json({
                isSuccess:false,
                message:'없는 유저입니다',
                code:420
            })
        }

*/
        
        const bucket = storage.bucket(process.env.GCLOUD_STORAGE_BUCKET);
        const blob = bucket.file(Math.floor(Math.random() * 1000).toString()+Date.now()+path.extname(pic.originalname));
        const blobStream = blob.createWriteStream();

    
        const publicUrl = format(`https://storage.googleapis.com/${bucket.name}/${blob.name}`);

        var form = new FormData();
    
        form.append("base_image",pic.buffer,{filename:pic.originalname});
        form.append("language",'ko');

        const result=await axios.post('https://master-easy-ocr-wook-2.endpoint.ainize.ai/word_extraction',form,{
            headers:{
                ...form.getHeaders()
            }
        });

        console.log(result.data);
/*        var authorizaton=result.data.includes('질병관리청');

        var vaccine;
        if(result.data.includes('아스트라제네카')) vaccine='아스트라제네카';
        else if(result.data.includes('화이자')) vaccine='화이자';

        if(!authorizaton||!vaccine){
            return res.json({
                isSuccess:false,
                message:'접종 인증 인식 실패',
                code:421
            })
        }

        var times='1차';
        var date1=new Date(2021,3,0);
        var date2=new Date(2021,4,0);

        await authDao.insertAuth(userId,vaccine,times,date1,date2,publicUrl);
*/
        return new Promise((resolve, reject) => {
            streamifier.createReadStream(pic.buffer)
                .on('error', (err) => {
                    return reject(err);
                })
                .pipe(blobStream)
                .on('finish',  (resp) => {
                    return res.json({
                        isSuccess: true,
                        code: 200,
                        message: "접종인증 성공"
                    });
                });
        })


    }catch (err) {
        logger.error(`접종 인증 실패\n: ${err.message}`);
        return res.json({
            message:err.message,
            code:500,
            isSuccess:false
        });
    }

};