
import axios from 'axios'
import express from 'express'
const router = express.Router()

router.post('/mj-submit-imagine', async (req, res) => {
    try {
      const { API_MIDJOURNEY,prompt,base64 } = req.body; 
      console.log("/mj-submit-imagine",API_MIDJOURNEY+"/mj/submit/imagine",prompt);
      const response = await axios.post(API_MIDJOURNEY+"/mj/submit/imagine", { "prompt":prompt,"base64":base64 });
      res.send(response.data);
    } catch (error) {
      res.send(error)
    }
  });
  
  
  router.get('/mj-task-id-fetch', async (req, res) => {
    const taskId = req.query.taskId;
    const API_MIDJOURNEY = req.query.API_MIDJOURNEY;
    console.log(API_MIDJOURNEY+"/mj/task/"+taskId+"/fetch",taskId);
    try {
      const response = await axios.get(API_MIDJOURNEY+"/mj/task/"+taskId+"/fetch");
      res.send(response.data)
    } catch (error) {
      res.send(error)
    }
  });
  
  router.post('/mj-submit-change', async (req, res) => {
    try {
      const { API_MIDJOURNEY,taskId, action, index} = req.body; 
      console.log("/mj-submit-change",API_MIDJOURNEY+"/mj/submit/change");
      const response = await axios.post(API_MIDJOURNEY+"/mj/submit/change", { "taskId":taskId,"action":action,"index":index });
      res.send(response.data);
    } catch (error) {
      res.send(error)
    }
  });
  router.post('/mj-submit-describe', async (req, res) => {
    try {
      const {API_MIDJOURNEY,base64} = req.body; 
      console.log("/mj-submit-describe",API_MIDJOURNEY+"/mj/submit/describe");
      const response = await axios.post(API_MIDJOURNEY+"/mj/submit/describe", { "base64":base64});
      res.send(response.data);
    } catch (error) {
      res.send(error)
    }
  });
  
  router.post('/mj-submit-blend', async (req, res) => {
    try {
      const {API_MIDJOURNEY,base64Array} = req.body; 
    //   console.log("/mj-submit-blend",API_MIDJOURNEY+"/mj/submit/blend","base64Array:",base64Array);
      const response = await axios.post(API_MIDJOURNEY+"/mj/submit/blend", { "base64Array":base64Array});
      res.send(response.data);
    } catch (error) {
      res.send(error)
    }
  });
  router.post('/mj-task-queue', async (req, res) => {
    const API_MIDJOURNEY = req.query.API_MIDJOURNEY;
    try {
      console.log("/mj-submit-queue",API_MIDJOURNEY+"/mj/task/queue");
      const response = await axios.post(API_MIDJOURNEY+"/mj/task/queue");
      res.send(response.data);
    } catch (error) {
      res.send(error)
    }
  });
  router.get('/mj-task-list', async (req, res) => {
    const API_MIDJOURNEY = req.query.API_MIDJOURNEY;
    try {
      console.log("/mj-submit-list",API_MIDJOURNEY+"/mj/task/list");
      const response = await axios.get(API_MIDJOURNEY+"/mj/task/list");
      res.send(response.data);
    } catch (error) {
      res.send(error)
    }
  });
//   router.post('/mj-task-list-by-condition', async (req, res) => {
//     const {API_MIDJOURNEY,ids} = req.body; 
//     let arr = ids.split(",");
//     try {
//       console.log("/mj-submit-list-by-condition",API_MIDJOURNEY+"/mj/task/list",arr);
//       const response = await axios.post(API_MIDJOURNEY+"/mj/task/list-by-condition",{"ids":arr});
//       res.send(response);
//     } catch (error) {
//       res.send(error)
//     }
//   });
  
  

  export default router;