<script setup lang='ts'>
import { useUserStore } from "@/store";
import chatDoc from "@/assets/chatDoc.json";
const userStore = useUserStore();
function tryOn(parentId:number,childId:number){
  let name = newsList[parentId].children[childId].name;
  // console.log(name,parentId,childId);
  userStore.updateUserInfo({
    tryText: name,
  });
}
const newsList = [...chatDoc]
</script>

<template>
  <div class="p-6">
    <div class="text-center text-2xl font-semibold mb-10">
      <span
        class="cursor-pointer transition duration-300 ease-in-out text-blue-600"
        >ChatGPT 指令大全</span
      >
      <span class="mx-6 text-gray-300">|</span>
      <!-- <span class="cursor-pointer transition duration-300 ease-in-out text-gray-400">注意事项</span> -->
      <span class="cursor-pointer transition duration-300 ease-in-out text-gray-400">Daller2 指南</span>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" style="font-family: cursive">
      <div
        class="bg-gradient-to-br p-6 rounded-lg shadow-lg" v-for="(item, index) of newsList" :key="index" >
        <h3 class="text-xl font-semibold mb-4">{{ item.name }}</h3>
        <h3 class="text-xs mb-4">{{ item.content }}</h3>
        <ul class="list-disc list-inside">
          <li class="text-base mb-3 flex items-center" v-for="(child, index2) of item.children" :key="index2">
            <div class="flex-grow mr-2">
              <span>{{ child.name }}</span>
            </div>
            <button @click="tryOn(index,index2)" class="bg-white text-blue-500 dark:text-indigo-400 hover:bg-blue-200 dark:hover:bg-indigo-300 px-3 py-1 rounded whitespace-nowrap transition duration-300 ease-in-out">
              尝试
            </button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>