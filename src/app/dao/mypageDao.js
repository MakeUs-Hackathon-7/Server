const {fun1}=require('../../../config/functions');


exports.selectUserInfo=(userId)=>{
    const query= `
        SELECT vaccine,institution,location,times,fileImg,
        CONCAT(YEAR(firstDate),'년 ',MONTH(firstDate),'월 ') AS firstDate,
        CONCAT(YEAR(secondDate),'년 ',MONTH(secondDate),'월 ') AS secondDate,
        CONCAT(YEAR(birthday),'년 ',MONTH(birthday),'월 ',DAY(birthday)) AS birthday
        FROM User INNER JOIN Auth ON User.id=Auth.userId
        LIMIT 0,1;
    `;
    const param=[userId];
    return fun1(query,param);
}


exports.selectUserNotice=(userId)=>{
    const query= `
        SELECT id,content,
        CASE 
            WHEN TIMESTAMPDIFF(SECOND,createdAt,now())<60
                THEN CONCAT(TIMESTAMPDIFF(SECOND,createdAt,now()),'초 전')
            WHEN TIMESTAMPDIFF(MINUTE,createdAt,now())<60
                THEN CONCAT(TIMESTAMPDIFF(MINUTE,createdAt,now()),'분 전')
            WHEN TIMESTAMPDIFF(HOUR,createdAt,now())<24
                THEN CONCAT(TIMESTAMPDIFF(HOUR,createdAt,now()),'시간 전')
            ELSE CONCAT(TIMESTAMPDIFF(DAY,createdAt,now()),'일 전')
        END AS time,
        (SELECT COUNT(*) FROM Comment WHERE noticeId=Notice.id) AS commentCount,
        (SELECT profileImg FROM User WHERE id=Notice.userId) AS profileImg
        FROM Notice 
        LIMIT 0,5;
    `;
    const param=[userId];
    return fun1(query,param);
}


exports.selectSymptom=(userId)=>{
    const query= `
        
    `;
    const param=[userId];
    return fun1(query,param);
}

