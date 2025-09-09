<template>
  <div>
    <div class="clock-container">
      <div class="time"></div>
      <div class="date"></div>
    </div>
    <div id="curPageName">
      {{ curPageName }}
    </div>
    
    <div id="mainPage">
      <!-- 太阳 -->
      <div id="sun"></div>
      <!-- 时钟 -->
      <div class="clock-container">
        <div class="needle hour"></div>
        <div class="needle minute"></div>
        <div class="needle second"></div>
      </div>
      <!-- 轨迹星图 -->
      <div class="trajectory">
        <template v-for="value in routeArr" :key="value.routeId">
          <p @click="jumpToRouter(value.routeName)" @mouseover="mouseOverPages(value.routeName)"
            @mouseout="curPageName = ''">
            <a href="javascript:void(0);"></a>
          </p>
        </template>
      </div>
    </div>

    <div id="tabContainer">
      <!-- 主要这里的 v-slot={Component}只能是Component而不能是其他变量名如componentA或者componentB，估计是Vue内定的变量名;
				并且要求和<component>标签中的:is绑定的变量名一致 -->
      <router-view v-slot="{ Component }">
        <component :is="Component"></component>
      </router-view>
    </div>
  </div>
</template>
<script setup>
import { onMounted, onBeforeMount, ref } from "vue";
import { useRouter } from "vue-router";

let router = useRouter();
let curPageName = ref("");
let timer;

const routeArr = [
  {
    routeId: "1",
    routeName: "/music",
    pageName: "紫玉筝",
    bg: "https://images-pc.oss-cn-hongkong.aliyuncs.com/app/Saturn.png",
  },
  {
    routeId: "2",
    routeName: "/game",
    pageName: "礼乐庭",
    bg: "https://images-pc.oss-cn-hongkong.aliyuncs.com/app/Venus.png",
  },
  {
    routeId: "3",
    routeName: "/aphorism",
    pageName: "千金竹",
    bg: "https://images-pc.oss-cn-hongkong.aliyuncs.com/app/earth.png",
  },
  {
    routeId: "4",
    routeName: "/share_video",
    pageName: "伯牙琴",
    bg: "https://images-pc.oss-cn-hongkong.aliyuncs.com/app/Mars.png",
  },
  {
    routeId: "5",
    routeName: "/docu",
    pageName: "霞珠算",
    bg: "https://images-pc.oss-cn-hongkong.aliyuncs.com/app/Jupiter.png",
  },
  {
    routeId: "6",
    routeName: "/landscape",
    pageName: "碧落录",
    bg: "https://images-pc.oss-cn-hongkong.aliyuncs.com/app/Mercury.png",
  },
  {
    routeId: "7",
    routeName: "/like",
    pageName: "崇文阁",
    bg: "https://images-pc.oss-cn-hongkong.aliyuncs.com/app/Uranus.png",
  },
];
const jumpToRouter = (route) => {
  showTab();
  router.push(route);
};
const showTab = () => {
  document.getElementById("tabContainer").style.display = "block";
};
const mouseOverPages = (add) => {
  let obj = routeArr.find((value) => {
    return value.routeName === add;
  });
  curPageName.value = obj.pageName;
};

// 生命周期钩子
onMounted(() => {
  let domArr = document.querySelectorAll(".trajectory p a");
  for (let i = 0; i < routeArr.length; i++) {
    domArr[i].style.backgroundImage = `url(${routeArr[i].bg})`;
  }
  // 页面路由跳转后切换场景
  if (router.currentRoute.value.path == "/") {
    router.push("/");
    document.getElementById("tabContainer").style.display = "none";
  } else {
    document.getElementById("tabContainer").style.display = "block";
    document.getElementById("tabContainer").style.zIndex = "5";
  }

  //时钟
  const hourEl = document.querySelector(".hour");
  const minuteEl = document.querySelector(".minute");
  const secondEl = document.querySelector(".second");
  const timeEl = document.querySelector(".time");
  const dateEl = document.querySelector(".date");
  const days = ["星期天", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六",];
  const months = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
  let time, month, day, date, hours, minutes, seconds;
  function setTime() {
    time = new Date();
    month = time.getMonth();
    day = time.getDay();
    date = time.getDate();
    hours = time.getHours() < 10 ? "0" + time.getHours() : time.getHours();
    minutes = time.getMinutes();
    seconds = time.getSeconds();
    hourEl.style.transform = `translate(-50%, -100%) rotate(${scale(hours, 0, 12, 0, 360)}deg)`;
    minuteEl.style.transform = `translate(-50%, -100%) rotate(${scale(minutes, 0, 60, 0, 360)}deg)`;
    secondEl.style.transform = `translate(-50%, -100%) rotate(${scale(seconds, 0, 60, 0, 360)}deg)`;
    timeEl.innerHTML = `${hours} : ${minutes < 10 ? `0${minutes}` : minutes} : ${seconds < 10 ? `0${seconds}` : seconds} `;
    dateEl.innerHTML = `${days[day]} , ${time.getFullYear()}年${months[month]}月${date}日`;
  }

  const scale = (num, in_min, in_max, out_min, out_max) => {
    return ((num - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
  };
  setTime();
  timer = setInterval(setTime, 1000);
});
onBeforeMount(() => {
  clearInterval(timer);
  timer = null;
});
</script>
<style scoped lang="scss" src="@/assets/css/SolarSystem.scss" />
