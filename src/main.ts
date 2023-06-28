import { createApp } from 'vue'
import App from './App.vue'
import { setupI18n } from './locales'
import { setupAssets, setupScrollbarStyle } from './plugins'
import { setupStore } from './store'
import { setupRouter } from './router'

// 检查是否在生产环境中
// console.log("import.meta.env.VITE_APP_LOGGING,",import.meta.env.VITE_APP_LOGGING);
if (import.meta.env.VITE_APP_LOGGING === 'false') {
  console.log = () => {};
}

async function bootstrap() {
  const app = createApp(App)
  setupAssets()

  setupScrollbarStyle()

  setupStore(app)

  setupI18n(app)

  await setupRouter(app)

  app.mount('#app')
}

bootstrap()


// const checkDebugger = () => {
//   const start = new Date();
//   debugger;
//   const end = new Date();
  
//   if (end.getTime() - start.getTime() > 100) {
//     // 你可以在这里处理调试模式下的行为，比如停止程序执行
//     console.log("Debugging mode detected! App is stopping...");
//     // 或者直接使用alert提示用户
//     // alert("Debugging mode detected! Please close your devtools.");
//   }

//   setTimeout(checkDebugger, 1000);
// };

// checkDebugger();
