
import axios from 'axios'
import express from 'express'
const router = express.Router()

router.post('/mj-submit-imagine', async (req, res) => {
    try {
      const { API_MIDJOURNEY,prompt,base64 } = req.body; 
      // console.log("/mj-submit-imagine",VITE_GLOB_API_MIDJOURNEY+"/mj/submit/imagine",prompt);
      const response = await axios.post(API_MIDJOURNEY+"/mj/submit/imagine", { "prompt":prompt,"base64":base64 });
      // console.log("response:mj-submit-imagine");
      // res.set('Content-Type', response.headers['content-type']);
      res.send(response.data);
      // let data = response.data;
      // res.status(200).json({ success: true, message: 'successfully',data});
    } catch (error) {
      res.send(error)
    }
  });
  
  
  router.get('/mj-task-id-fetch', async (req, res) => {
    const taskId = req.query.taskId;
    const API_MIDJOURNEY = req.query.API_MIDJOURNEY;
    // console.log(VITE_GLOB_API_MIDJOURNEY+"/mj/task/"+taskId+"/fetch",taskId);
    try {
      const response = await axios.get(API_MIDJOURNEY+"/mj/task/"+taskId+"/fetch");
      // console.log("response:===");
      // res.set('Content-Type', response.headers['content-type']);
      // let data = response.data;
      // res.status(200).json({ success: true, message: 'successfully',data});
      res.send(response.data)
    } catch (error) {
      res.send(error)
    }
  });
  
  router.post('/mj-submit-change', async (req, res) => {
    try {
      const { API_MIDJOURNEY,taskId, action, index} = req.body; 
      // console.log("/mj-submit-change",VITE_GLOB_API_MIDJOURNEY+"/mj/submit/change");
      const response = await axios.post(API_MIDJOURNEY+"/mj/submit/change", { "taskId":taskId,"action":action,"index":index });
      // console.log(response);
      // res.set('Content-Type', response.headers['content-type']);
      res.send(response.data);
    //   let data = response.data;
    //   res.status(200).json({ success: true, message: 'successfully',data});
    } catch (error) {
      res.send(error)
    }
  });
  router.post('/mj-submit-describe', async (req, res) => {
    try {
      const {API_MIDJOURNEY,base64} = req.body; 
      // console.log("/mj-submit-describe",VITE_GLOB_API_MIDJOURNEY+"/mj/submit/describe");
      const response = await axios.post(API_MIDJOURNEY+"/mj/submit/describe", { "base64":base64});
      // console.log(response);
      res.send(response.data);
    //   let data = response.data;
    //   res.status(200).json({ success: true, message: 'successfully',data});
    } catch (error) {
      res.send(error)
    }
  });
  
  router.post('/mj-submit-blend', async (req, res) => {
    try {
      const {API_MIDJOURNEY,base64Array} = req.body; 
      console.log("/mj-submit-blend",API_MIDJOURNEY+"/mj/submit/blend","base64Array:",base64Array);
      const response = await axios.post(API_MIDJOURNEY+"/mj/submit/blend", { "base64Array":base64Array});
      // console.log(response);
      res.send(response.data);
    //   let data = response.data;
    //   res.status(200).json({ success: true, message: 'successfully',data});
    } catch (error) {
      res.send(error)
    }
  });
  router.post('/mj-task-queue', async (req, res) => {
    const API_MIDJOURNEY = req.query.API_MIDJOURNEY;
    try {
      // console.log("/mj-submit-queue",API_MIDJOURNEY+"/mj/task/queue");
      const response = await axios.post(API_MIDJOURNEY+"/mj/task/queue");
      // console.log(response);
      res.send(response.data);
    //   let data = response.data;
    //   res.status(200).json({ success: true, message: 'successfully',data});
    } catch (error) {
      res.send(error)
    }
  });
  router.get('/mj-task-list', async (req, res) => {
    const API_MIDJOURNEY = req.query.API_MIDJOURNEY;
    try {
      // console.log("/mj-submit-list",API_MIDJOURNEY+"/mj/task/list");
      const response = await axios.get(API_MIDJOURNEY+"/mj/task/list");
      // console.log(response);
      res.send(response.data);
    //   let data = response.data;
    //   res.status(200).json({ success: true, message: 'successfully',data});
    } catch (error) {
      res.send(error)
    }
  });
  router.post('/mj-task-list-by-condition', async (req, res) => {
    const {API_MIDJOURNEY,ids} = req.body; 
    let arr = ids.split(",");
    try {
      console.log("/mj-submit-list-by-condition",API_MIDJOURNEY+"/mj/task/list",arr);
      const response = await axios.post(API_MIDJOURNEY+"/mj/task/list-by-condition",{"ids":arr});
      // console.log(response);
      res.send(response);
    //   let data = response.data;
    //   res.status(200).json({ success: true, message: 'successfully',data});
    } catch (error) {
      res.send(error)
    }
  });
  
  

  export default router;