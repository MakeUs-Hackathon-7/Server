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


const symptomDao = require('../dao/symptomDao');


//증상 등록 페이지 유저 정보 보여주기
exports.getUser = async(req, res)=> {

    const userId = req.verifiedToken.id;
    //const userId = 1;
  
    try {
        const user = await symptomDao.getUserInfoById(userId);
        if(user.length<1){
            return res.json({
                isSuccess:false,
                message:'없는 유저입니다.',
                code:420
            })
        }
        
        else {
            return res.json({
                isSuccess: true,
                code: 200,
                message: "유저정보 조회 성공",
                result : user
            });
        }

    } catch (err) {
        logger.error(`유저정보 조회 실패\n: ${err.message}`);
        return res.json({
            message:err.message,
            code:201,
            isSuccess:false
        });
    }
};

//증상 등록
exports.postSymptom = async (req, res)=> {

    //userId, fever, chills, vomit, headache, musclePain, etc
    const userId = req.verifiedToken.id;
    const {
        fever, chills, vomit, headache, musclePain, etc
    } = req.body;

    try {
        await symptomDao.insertSyptoms(userId, fever, chills, vomit, headache, musclePain, etc);
        return res.json({
            isSuccess: true,
            code: 200,
            message: "증상등록 성공"
        });
        

    } catch (err) {
        logger.error(`증상등록 실패\n: ${err.message}`);
        return res.json({
            message:err.message,
            code:500,
            isSuccess:false
        });
    }

};

//증상 공유 페이지 나이대, 백신종류, 지역 필터
exports.filter = async(req, res)=> {

    const userId = req.verifiedToken.id;

    if(!pic){
        return res.json({
            isSuccess:false,
            message:'접종인증 사진을 입력해주세요',
            code:419
        })
    }
    console.log(pic);

    try{
        const user = await authDao.selectUserById(userId);
        if(user.length<1){
            return res.json({
                isSuccess:false,
                message:'없는 유저입니다',
                code:420
            })
        }

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

        var authorizaton=result.data.includes('질병관리청');

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

        return new Promise((resolve, reject) => {
            streamifier.createReadStream(pic.buffer)
                .on('error', (err) => {
                    return reject(err);
                })
                .pipe(blobStream)
                .on('finish', (resp) => {
                    return res.json({
                        isSuccess: true,
                        code: 200,
                        message: "접종인증 성공"
                    });
                });
        })

    } catch (err) {
        logger.error(`접종 인증 실패\n: ${err.message}`);
        return res.json({
            message:err.message,
            code:500,
            isSuccess:false
        });
    }

};