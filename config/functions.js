const { pool } = require("./database");


exports.fun1=async(query,param)=>{
    const connection = await pool.getConnection(async (conn) => conn);
    const [result] = await connection.query(
        query,
        param
      );
    
    return result;
}








