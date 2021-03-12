const jwt = require('jsonwebtoken');
require('dotenv').config();

const multer=require('multer');



const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 5 *1024 * 1024, 
    },
});

exports.upload=upload;




const verify = (req, res, next) => {
    
    const token = req.headers['access-token'] || req.query.token;
    
    if(!token) {
        return res.status(403).json({
            isSuccess:false,
            code: 403,
            message: '로그인이 되어 있지 않습니다.'
        });
    }

    const p = new Promise(
        (resolve, reject) => {
            jwt.verify(token, process.env.JWT, (err, verifiedToken) => {
                if(err) reject(err);
                resolve(verifiedToken)
            })
        }
    );

    const onError = (error) => {
        res.status(403).json({
            isSuccess:false,
            code: 403,
            message:"검증 실패"
        });
    };

    p.then((verifiedToken)=>{
        req.verifiedToken = verifiedToken;
        next();
    }).catch(onError)
};

exports.verify = verify;





