import express from 'express'
import type { RequestProps } from './types'

import type { ChatMessage } from './chatgpt'
import { chatConfig, chatReplyProcess, currentModel } from './chatgpt'
import { auth } from './middleware/auth'
import { limiter } from './middleware/limiter'
import { isNotEmptyString } from './utils/is'
import {createProxyMiddleware} from 'http-proxy-middleware';
import axios from 'axios'
import midjourney from './midjourney/index'; // 确保你的路径正确
import db from './db/index'; // 确保你的路径正确

import { generationsImage } from './daller2'
import {bodyParser} from 'body-parser';
import path from 'path'
import md5 from 'md5';

const app = express()
const router = express.Router()

app.use(express.static('public'))
app.use(express.json())

app.all('*', (_, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'authorization, Content-Type')
  res.header('Access-Control-Allow-Methods', '*')
  next()
})

router.post('/translate', async (req, res) => {
  const { query,} = req.body;
  const from = 'auto';
  const to = 'zh';
  const appid = '20230623001721675';
  const key = '3_1RHLnlaZNczaJFbKbm';
  const salt = (new Date).getTime();
  const str1 = appid + query + salt +key;
  const sign = md5(str1);
  const APIHttps="https://fanyi-api.baidu.com/api/trans/vip/translate";
  try {
    const result = await axios.get(`${APIHttps}?q=${query}&from=${from}&to=${to}&appid=${appid}&salt=${salt}&sign=${sign}`);
    console.log(result.data);
    res.send(result.data.data.trans_result[0].dst);
  } catch (err) {
    res.send(err);
  }
});
router.get('/download', (req, res) => {
  const url = 'https://image.175ai.cn/inspiration/2023/6/25/2cace941-01f7-4919-b9df-11103e3c5e8c.png/inspiration'; // 这里替换为你的图片 HTTP URL

  // 用 axios 发送一个 HTTP get 请求来获取图片数据
  const response =  axios.get(url, {
    responseType: 'arraybuffer', // 表示要返回 ArrayBuffer 数据
});

// 检查 response.data 是否存在
if (response.data) {
    // 将返回的 ArrayBuffer 数据作为一个 Buffer 实例发送回客户端
    res.send(Buffer.from(response.data, 'binary'));
} else {
    // 如果 response.data 不存在，返回一个错误信息
    res.status(400).send('Failed to download image');
}
});

router.post('/generate-image', async (req, res) => {
  const { prompt,userIdentify,token } = req.body;
  // const obj = {userIdentify:userIdentify,token:token,version:"Daller2",question:prompt,type:0}
  // await updateNumByTokenFunction(obj)
 try {
   let response = await generationsImage({
     prompt: prompt
   })
   res.status(200).json({ success: true, message: 'successfully',data:response.data });
 } catch (error) {
  // const obj = {userIdentify:userIdentify,token:token,version:"Daller2",question:prompt,type:1}
  // await updateNumByTokenFunction(obj)
  res.status(500).send('Error: ' + error.message);
 }finally {
   res.end()
 }
});
router.post('/chat-process', [auth, limiter], async (req, res) => {
  res.setHeader('Content-type', 'application/octet-stream')
  const { prompt, options = {}, systemMessage, temperature, top_p, chatModel,userIdentify,token } = req.body as RequestProps
  //updateToken 修改的次数
  // const obj = {userIdentify:userIdentify,token:token,version:chatModel,question:prompt,type:0}
  // await updateNumByTokenFunction(obj)
  try {
    let firstChunk = true
    await chatReplyProcess({
      message: prompt,
      lastContext: options,
      process: (chat: ChatMessage) => {
        res.write(firstChunk ? JSON.stringify(chat) : `\n${JSON.stringify(chat)}`)
        firstChunk = false
      },
      systemMessage,
      temperature,
      top_p,
      chatModel
    })
  }
  catch (error) {
    //错误updateToken 返回修改的次数
    // const obj = {userIdentify:userIdentify,token:token,version:chatModel,question:prompt,type:1}
    // await updateNumByTokenFunction(obj)
    res.write(JSON.stringify(error))
  }
  finally {
    res.end()
  }
})
router.post('/config', auth, async (req, res) => {
  try {
    const response = await chatConfig()
    res.send(response)
  }
  catch (error) {
    res.send(error)
  }
})

router.post('/session', async (req, res) => {
  try {
    const AUTH_SECRET_KEY = process.env.AUTH_SECRET_KEY
    const hasAuth = isNotEmptyString(AUTH_SECRET_KEY)
    res.send({ status: 'Success', message: '', data: { auth: hasAuth, model: currentModel() } })
  }
  catch (error) {
    res.send({ status: 'Fail', message: error.message, data: null })
  }
})

router.post('/verify', async (req, res) => {
  try {
    const { token } = req.body as { token: string }
    if (!token)
      throw new Error('Secret key is empty')

    if (process.env.AUTH_SECRET_KEY !== token)
      throw new Error('密钥无效 | Secret key is invalid')

    res.send({ status: 'Success', message: 'Verify successfully', data: null })
  }
  catch (error) {
    res.send({ status: 'Fail', message: error.message, data: null })
  }
})
app.use('/images/cnd-discordapp', createProxyMiddleware({ 
  target: 'https://cdn.discordapp.com/attachments', // 这是实际的图片服务器地址
  changeOrigin: true, 
  pathRewrite: {
    '^/images/cnd-discordapp' : '/' // 这将会将你的服务器上的 /images 路径重写为目标服务器上的 / 路径
  },
  onProxyReq: function(proxyReq, req, res) {
    console.log('Original Request URL: ', req.originalUrl);
    console.log('Proxy Request URL: ', proxyReq.path);
  },
  onProxyRes: function(proxyRes, req, res) {
    console.log('Proxy Response Status: ', proxyRes.statusCode);
  },
  onError: function(err, req, res) {
    console.error('Error in proxy: ', err);
  }
}));

app.use(midjourney)
app.use(db)

app.use('', router)

app.use('/api', router)
app.set('trust proxy', 1)
// app.use(bodyParser.json()); // for parsing application/json
// app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
// app.use(bodyParser.json({ limit: '100mb' }));
// app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));

app.listen(3002, () => globalThis.console.log('Server is running on port 3002'))
