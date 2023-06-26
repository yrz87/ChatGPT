import express from 'express'
import { getConnection } from '../utils/dbconfig'
const router = express.Router()

// 增加出现错误，回滚操作
// 你会看到两个重要的事务处理步骤：
// connection.commit() - 这是在执行所有数据库操作后，如果没有错误发生，我们就提交事务。这将保存所有的更改。
// connection.rollback() - 这是当出现错误时执行的。它会撤销在事务中进行的所有更改。这就是所谓的"回滚"。
// 在 try 语句块中，所有的数据库操作都是事务的一部分。如果这些操作中的任何一个失败，我们都会进入 catch 语句块并回滚事务。只有当所有操作都成功时，我们才提交事务。
// 在 finally 语句块中，我们调用 connection.release() 来确保在结束后，无论事务是否成功，连接都会被正确地返回到连接池。
// 注意：不同的数据库和数据库驱动可能有不同的方式来处理事务。这是使用 MySQL 和 Node.js 的一种常见方式。如果你使用的是其他数据库或驱动，应查阅相关文档以找到正确的方法。
const updateNumByTokenFunction = async (objReuqest, retryCount = 0) => {
    const maxRetry = 3; // maximum number of retries
    const { question,token,type,userIdentify,version } = objReuqest;
    console.log("根据token,修改剩余次数",token);
    let obj = {};
    let lessNum = 1;
    const connection = await getConnection();
    // Start transaction
    await connection.beginTransaction();
    try {
      const [rows, fields] = await connection.execute(
        'SELECT id,surplus,use_num,express_date,type,vip_chatgpt4_num FROM chatgpt_user WHERE token = ? and type=?',
        [token,userIdentify]
      );
  
      
      if(rows.length > 0) {
        const row = rows[0];
        if(userIdentify === 1) {
          const expressDate = new Date(row.express_date);
          const today = new Date();
          if(expressDate.getTime() < today.getTime()) {
            obj = { success: false, message: '您的密钥已过期!' };
          } else {
            if(version === 'gpt-4') {
              await connection.execute(
                'UPDATE chatgpt_user SET vip_chatgpt4_num = vip_chatgpt4_num - 1 WHERE token = ? AND vip_chatgpt4_num > 0',
                [token]
              );
            }
            obj = { success: true, message: 'Logged in successfully',data:row };
          }
        } else {//积分
          if(version === 'gpt-4') {
            const [rows2] = await connection.execute(
              'SELECT value FROM sys_config WHERE name = "LESS_NUM_BY_CHATGPT4" '
            );
            lessNum = Number(rows2[0].value);
          }
          const newUseNum = row.use_num + lessNum;
          const newSurplus = row.surplus - lessNum;
          const [result] = await connection.execute(
            'UPDATE chatgpt_user SET surplus = ?, use_num = ? WHERE token = ? AND surplus > 0',
            [newSurplus, newUseNum, token]
          );
          if(result.affectedRows > 0) {
            obj = { success: true, message: 'Logged in successfully', data:{"useNum":newUseNum,"surplus":newSurplus}};
          } else {
            obj = { success: false, message: '请输入正确的密钥!' };
          }
        }
      } else {
        obj = { success: false, message: '请输入正确的密钥!' };
      }
  
      if(type == 0) {
        await connection.execute(
          'INSERT INTO chatgpt_question_log(message, token,type,num,version) VALUES (?,?,?,?,?)',
          [question,token,type,lessNum,version]
        );
      } else if(type == 1) {
        await connection.execute(
          'UPDATE chatgpt_question_log SET type = ? WHERE token = ? ORDER BY id DESC LIMIT 1',
          [type,token]
        );
      }
  
      // If there's no error, commit the transaction
      await connection.commit();
      connection.release();
      return obj;
    } catch (err) {
      await connection.rollback(); // rollback the transaction
  
      // retry logic
      if (retryCount < maxRetry) {
        console.log(`Retry attempt ${retryCount + 1}...`);
        return await updateNumByTokenFunction(objReuqest, retryCount + 1); // retry the function with incremented retryCount
      } else {
        console.log('Max retries exceeded.');
        // throw err; // throw the error if max retries exceeded
        obj = { success: false, message: 'Max retries exceeded.' };
        return obj;
      }
    } finally {
      connection.release();
    }
  }
  
  const processData = async (row: any, token: string, connection: any) => {
    if(row.type == 0) {
      return { userIdentify:row.type, surplus: row.surplus, use_num: row.use_num };
    }
  
    const expressDate = new Date(row.express_date);
    const today = new Date();
    const oneMonthLater = new Date();
    oneMonthLater.setMonth(today.getMonth() + 1);
  
    if(row.start_date == null) { 
      await connection.execute(
        "UPDATE chatgpt_user SET start_date = CONVERT_TZ(NOW(), 'UTC', 'Asia/Shanghai'), express_date = DATE_ADD(start_date, INTERVAL long_date MONTH) WHERE token = ? AND type = ?",
        [token, row.type]
      );
      const [updatedRows] = await connection.execute(
        'SELECT start_date,express_date FROM chatgpt_user WHERE token = ?',
        [token]
      );
      return { userIdentify:row.type, startDate: updatedRows[0].start_date, expressDate: updatedRows[0].express_date, vipChatgpt4Num: row.vip_chatgpt4_num };
    }
    else if(row.long_date == 0 || expressDate.getTime() >= today.getTime()) {
      return { userIdentify:row.type, startDate: row.start_date, expressDate: row.long_date == 0 ? 0 : row.express_date, vipChatgpt4Num: row.vip_chatgpt4_num };
    }
    else {
      throw new Error('您的密钥已过期!');
    }
  }
  router.post('/updateNumByToken', async (req, res) => {
    const { token,userIdentify,chatModel,question,type} = req.body;
    const obj = {userIdentify:userIdentify,token:token,version:chatModel,question:question,type:type}
    await updateNumByTokenFunction(obj)
  });
  router.post('/verificationCode', async (req, res) => {
    const { token } = req.body;
    const connection = await getConnection()
  
    try {
      const [rows] = await connection.execute(
        'SELECT surplus,use_num,type,start_date,long_date,express_date,vip_chatgpt4_num FROM chatgpt_user WHERE token = ?',
        [token]
      );
  
      if (rows.length > 0) {
        const data = await processData(rows[0], token, connection);
        res.status(200).json({ success: true, message: 'Logged in successfully', data });
      } else {
        res.status(200).json({ success: false, message: '请输入正确的密钥!' });
      }
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    } finally {
      connection.release();
    }
  });

  export default router;