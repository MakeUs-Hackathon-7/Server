const {fun1}=require('../../../config/functions');


exports.insertNotice=(userId,content)=>{
    const query= `
      INSERT INTO Notice(userId,content) VALUES(?,?);
    `;
    const param=[userId,content];
    return fun1(query,param);
}


exports.getNotice=(page)=>{
const query= `
    SELECT id,userId,content,
    CASE 
        WHEN TIMESTAMPDIFF(SECOND,createdAt,now())<60
            THEN CONCAT(TIMESTAMPDIFF(SECOND,createdAt,now()),'초 전')
        WHEN TIMESTAMPDIFF(MINUTE,createdAt,now())<60
            THEN CONCAT(TIMESTAMPDIFF(MINUTE,createdAt,now()),'분 전')
        WHEN TIMESTAMPDIFF(HOUR,createdAt,now())<24
            THEN CONCAT(TIMESTAMPDIFF(HOUR,createdAt,now()),'시간 전')
        ELSE CONCAT(TIMESTAMPDIFF(DAY,createdAt,now()),'일 전')
    END AS time,
    (SELECT COUNT(*) FROM Comment WHERE noticeId=Notice.id) AS commentCount
    FROM Notice 
    LIMIT ?,?
`;
const param=[page*5,5];
return fun1(query,param);
}


exports.deleteNotice=(noticeId)=>{
    const query= `
        DELETE FROM Notice WHERE id=?
    `;
    const param=[noticeId];
    return fun1(query,param);
}

exports.deleteNoticeComment=(noticeId)=>{
    const query= `
    DELETE FROM Comment WHERE noticeId=?
    `;
    const param=[noticeId];
    return fun1(query,param);
}


exports.insertComment=(noticeId,comment,userId)=>{
    const query= `
      INSERT INTO Comment(noticeId,comment,userId) VALUES(?,?,?);
    `;
    const param=[noticeId,comment,userId];
    return fun1(query,param);
}

exports.getComment=(noticeId,page)=>{
    const query= `
    SELECT id,userId,comment,
    CASE 
        WHEN TIMESTAMPDIFF(SECOND,createdAt,now())<60
            THEN CONCAT(TIMESTAMPDIFF(SECOND,createdAt,now()),'초 전')
        WHEN TIMESTAMPDIFF(MINUTE,createdAt,now())<60
            THEN CONCAT(TIMESTAMPDIFF(MINUTE,createdAt,now()),'분 전')
        WHEN TIMESTAMPDIFF(HOUR,createdAt,now())<24
            THEN CONCAT(TIMESTAMPDIFF(HOUR,createdAt,now()),'시간 전')
        ELSE CONCAT(TIMESTAMPDIFF(DAY,createdAt,now()),'일 전')
    END AS time
    FROM Comment
    WHERE noticeId=?
    LIMIT ?,?
  `;
  const param=[noticeId,page*5,5];
  return fun1(query,param);
}

exports.deleteComment=(noticeId,commentId)=>{
    const query= `
    DELETE FROM Comment WHERE noticeId=? AND id=?
  `;
  const param=[noticeId,commentId];
  return fun1(query,param);
}