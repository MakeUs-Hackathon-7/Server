const {fun1}=require('../../../config/functions');

exports.selectUserByEmail=(email)=>{
  const query= `
    SELECT * FROM User WHERE email=?;
  `;
  const param=[email];
  return fun1(query,param);
}

exports.selectUserById=(id)=>{
  const query=`
    SELECT * FROM User WHERE id=?;
  `;
  const param=[id];
  return fun1(query,param);
}


exports.insertUserInfo=(email,hashedPassword,nickname,publicUrl)=>{
  const query= `
    INSERT INTO User(email,password,nickname,publicUrl) VALUES(?,?,?,?);
  `;
  const param=[email,hashedPassword,nickname,publicUrl];
  return fun1(query,param);
}

exports.insertAuth=(userId,vaccine,times,date1,date2,publicUrl)=>{
  const query=`
    INSERT INTO Auth(userId,vaccine,times,firstDate,secondDate,fileImg) VALUES(?,?,?,?,?,?);
  `;
  const param=[userId,vaccine,times,date1,date2,publicUrl];
  return fun1(query,param);
}