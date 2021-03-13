const {fun1}=require('../../../config/functions');

exports.getUserInfoById=(id)=>{
  const query = `
    SELECT userId, nickname, vaccine, location,
           CASE
             WHEN TIMESTAMPDIFF(YEAR, birthday, NOW()) < 20 THEN '10대'
             WHEN TIMESTAMPDIFF(YEAR, birthday, NOW()) >= 20 AND TIMESTAMPDIFF(YEAR, birthday, NOW()) < 30 THEN '20대'
             WHEN TIMESTAMPDIFF(YEAR, birthday, NOW()) >= 30 AND TIMESTAMPDIFF(YEAR, birthday, NOW()) < 40 THEN '30대'
             WHEN TIMESTAMPDIFF(YEAR, birthday, NOW()) >= 40 AND TIMESTAMPDIFF(YEAR, birthday, NOW()) < 50 THEN '40대'
             WHEN TIMESTAMPDIFF(YEAR, birthday, NOW()) >= 50 AND TIMESTAMPDIFF(YEAR, birthday, NOW()) < 60 THEN '50대'
             WHEN TIMESTAMPDIFF(YEAR, birthday, NOW()) >= 60 AND TIMESTAMPDIFF(YEAR, birthday, NOW()) < 70 THEN '60대'
             WHEN TIMESTAMPDIFF(YEAR, birthday, NOW()) >= 70 AND TIMESTAMPDIFF(YEAR, birthday, NOW()) < 80 THEN '70대'
             WHEN TIMESTAMPDIFF(YEAR, birthday, NOW()) >= 80 THEN '80대 이상'
             END AS age,  DATE_FORMAT(firstDate, '%Y/%m/%d') as Date, profileImg
    FROM   User U
    LEFT JOIN Auth A ON U.id = A.userId
    WHERE U.id = ?;
  `;
  const param = [id];
  return fun1(query,param);
}


exports.insertSyptoms=(userId, fever, chills, vomit, headache, musclePain, etc)=>{
  const query= `
    INSERT INTO Symptom(userId, fever, chills, vomit, headache, musclePain, etc)
    VALUES(?,?,?,?,?,?,?);
  `;
  const param=[userId, fever, chills, vomit, headache, musclePain, etc];
  return fun1(query,param);
}

exports.findSyptoms=(userId, fever, chills, vomit, headache, musclePain, etc)=>{
  const query=`
    
  `;
  const param=[userId, fever, chills, vomit, headache, musclePain, etc];
  return fun1(query,param);
}