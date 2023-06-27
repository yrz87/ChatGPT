<template>
  <div
    id="scrollRef"
    ref="scrollRef"
    class="h-full overflow-hidden overflow-y-auto"
  >
    <div
      id="image-wrapper"
      class="w-full max-w-screen-xl m-auto dark:bg-[#101014]"
    >
      <div class="p-4 space-y-4">
        <h2 class="text-xl font-bold">AI画册</h2>
        <!-- <NInput /> -->
        <div class="content">
          <NImageGroup show-toolbar-tooltip>
          <div v-for="(item, index) in items" :key="index" class="item">
            <NImage :src="item.src" :alt="'Image ' + index"/>
            <!-- <div style="position: relative;top: -90px;color:#fff">
              <NEllipsis :line-clamp="2" :tooltip="false">{{item.name}}</NEllipsis>
              <div class="items-center justify-center" >
                <NButton strong secondary type="primary" round @click="downloadImage">下载</NButton>
                <NButton strong secondary type="primary" round @click="copyText(item.name)">复制</NButton>
              </div>
              
            </div> -->
          </div>
          </NImageGroup>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { 
  // NInput,
  NImage,NImageGroup,
  // NButton,
  // NEllipsis 
  } from "naive-ui";
import gralleryJson from "@/assets/grallery.json";
const items = [...gralleryJson];
// function downloadImage() {
//   const url = 'http://localhost:3002/download'; // 替换成你的服务器地址
//   window.location.href = url; // 通过改变 window.location.href 触发下载请求
// }

// async function copyText(text: string) {
//   try {
//     await navigator.clipboard.writeText(text);
//     console.log('复制成功');
//   } catch (err) {
//     console.log('复制失败', err);
//   }
// }
</script>

<style scoped>
.content {
  column-count: 5;
  column-gap: 1em;
  width: 100%;
}
.item {
  break-inside: avoid;
  margin-bottom: 1em;
}
.item img {
  width: 100%;
  height: auto;
}
</style>
