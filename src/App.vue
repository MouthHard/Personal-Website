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
					<p
						@click="jumpToRouter(value.routeName)"
						@mouseover="mouseOverPages(value.routeName)"
						@mouseout="curPageName = ''"
					>
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
<script setup lang="ts">
	import { onMounted, onBeforeMount, ref, watch } from "vue";
	import { useRouter } from "vue-router";

	interface RouteItem {
		routeId: string;
		routeName: string;
		pageName: string;
		bg: string;
	}

	const router = useRouter();
	const curPageName = ref<string>("");
	let timer: number | undefined;

	const routeArr: RouteItem[] = [
		{
			routeId: "1",
			routeName: "/music",
			pageName: "音乐",
			bg: "https://images-pc.oss-cn-hongkong.aliyuncs.com/app/Saturn.png",
		},
		{
			routeId: "2",
			routeName: "/game",
			pageName: "游戏",
			bg: "https://images-pc.oss-cn-hongkong.aliyuncs.com/app/Venus.png",
		},
		{
			routeId: "3",
			routeName: "/aphorism",
			pageName: "诗词",
			bg: "https://images-pc.oss-cn-hongkong.aliyuncs.com/app/earth.png",
		},
		{
			routeId: "4",
			routeName: "/history",
			pageName: "历史",
			bg: "https://images-pc.oss-cn-hongkong.aliyuncs.com/app/Mars.png",
		},
		{
			routeId: "5",
			routeName: "/travel-guide",
			pageName: "旅游",
			bg: "https://images-pc.oss-cn-hongkong.aliyuncs.com/app/Jupiter.png",
		},
		{
			routeId: "6",
			routeName: "/landscape",
			pageName: "风景",
			bg: "https://images-pc.oss-cn-hongkong.aliyuncs.com/app/Mercury.png",
		},
		{
			routeId: "7",
			routeName: "/like",
			pageName: "文书",
			bg: "https://images-pc.oss-cn-hongkong.aliyuncs.com/app/Uranus.png",
		},
	];

	const jumpToRouter = (route: string): void => {
		showTab();
		router.push(route);
	};

	const showTab = (): void => {
		const tabContainer = document.getElementById("tabContainer");
		if (tabContainer) {
			tabContainer.style.display = "block";
		}
	};

	const mouseOverPages = (add: string): void => {
		const obj = routeArr.find((value) => value.routeName === add);
		if (obj) {
			curPageName.value = obj.pageName;
		}
	};

	const scale = (num: number, in_min: number, in_max: number, out_min: number, out_max: number): number => {
		return ((num - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
	};

	// 监听路由变化
	watch(
		() => router.currentRoute.value.path,
		(newPath: string) => {
			const tabContainer = document.getElementById("tabContainer");
			if (tabContainer) {
				if (newPath === "/") {
					tabContainer.style.display = "none";
				} else {
					tabContainer.style.display = "block";
					tabContainer.style.zIndex = "5";
				}
			}
		}
	);

	// 生命周期钩子
	onMounted(() => {
		const domArr = document.querySelectorAll<HTMLAnchorElement>(".trajectory p a");
		for (let i = 0; i < routeArr.length; i++) {
			if (domArr[i]) {
				domArr[i].style.backgroundImage = `url(${routeArr[i].bg})`;
			}
		}
		
		// 页面路由跳转后切换场景
		const tabContainer = document.getElementById("tabContainer");
		if (tabContainer) {
			if (router.currentRoute.value.path === "/") {
				router.push("/");
				tabContainer.style.display = "none";
			} else {
				tabContainer.style.display = "block";
				tabContainer.style.zIndex = "5";
			}
		}

		//时钟
		const hourEl = document.querySelector<HTMLDivElement>(".hour");
		const minuteEl = document.querySelector<HTMLDivElement>(".minute");
		const secondEl = document.querySelector<HTMLDivElement>(".second");
		const timeEl = document.querySelector<HTMLDivElement>(".time");
		const dateEl = document.querySelector<HTMLDivElement>(".date");
		const days: string[] = [
			"星期天",
			"星期一",
			"星期二",
			"星期三",
			"星期四",
			"星期五",
			"星期六",
		];
		const months: string[] = [
			"1",
			"2",
			"3",
			"4",
			"5",
			"6",
			"7",
			"8",
			"9",
			"10",
			"11",
			"12",
		];

		function setTime(): void {
			const time = new Date();
			const month = time.getMonth();
			const day = time.getDay();
			const date = time.getDate();
			const hours = time.getHours() < 10 ? `0${time.getHours()}` : time.getHours();
			const minutes = time.getMinutes();
			const seconds = time.getSeconds();
			
			if (hourEl) {
				hourEl.style.transform = `translate(-50%, -100%) rotate(${scale(
					typeof hours === 'string' ? parseInt(hours) : hours,
					0,
					12,
					0,
					360
				)}deg)`;
			}
			
			if (minuteEl) {
				minuteEl.style.transform = `translate(-50%, -100%) rotate(${scale(
					minutes,
					0,
					60,
					0,
					360
				)}deg)`;
			}
			
			if (secondEl) {
				secondEl.style.transform = `translate(-50%, -100%) rotate(${scale(
					seconds,
					0,
					60,
					0,
					360
				)}deg)`;
			}
			
			if (timeEl) {
				timeEl.innerHTML = `${hours} : ${
					minutes < 10 ? `0${minutes}` : minutes
				} : ${seconds < 10 ? `0${seconds}` : seconds} `;
			}
			
			if (dateEl) {
				dateEl.innerHTML = `${days[day]} , ${time.getFullYear()}年${
					months[month]
				}月${date}日`;
			}
		}

		setTime();
		timer = window.setInterval(setTime, 1000);
	});

	onBeforeMount(() => {
		if (timer !== undefined) {
			clearInterval(timer);
			timer = undefined;
		}
	});
</script>
<style scoped lang="scss" src="@/assets/css/SolarSystem.scss" />
