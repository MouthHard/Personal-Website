<template>
	<button :class="{ isActive: activeTab == 0 }" @click="handelToogel(0)">专辑</button>
	<button :class="{ isActive: activeTab == 1 }" @click="handelToogel(1)">MV</button>
	<input  type="text" placeholder=" 🔍  搜 索 " />
	<footer>
		<div v-show="activeTab == 0">
			<button :class="{ isSubActive: subActiveTab == 0 }" @click="subhandelToogel(0)">收藏专辑</button>
			<button :class="{ isSubActive: subActiveTab == 1 }" @click="subhandelToogel(1)">已购专辑</button>
			<p>
				关注的歌手请前往
				<a href="javascript:;">我的主页 → 关注 → 歌手</a>
				<svg @click="closeMsgWindow" xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 48 48">
					<path
						fill="currentColor"
						fill-rule="evenodd"
						stroke="currentColor"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="4"
						d="m6 11l5-5l13 13L37 6l5 5l-13 13l13 13l-5 5l-13-13l-13 13l-5-5l13-13z"
						clip-rule="evenodd" />
				</svg>
			</p>

			<div v-show="subActiveTab == 0" id="myCollectSubTab">
				<div v-for="singer in albumList" :key="singer.singerId" class="singer-all">
					<svg xmlns="http://www.w3.org/2000/svg" width="3rem" height="3rem" viewBox="0 0 24 24">
						<path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2m-2 14.5v-9l6 4.5z" />
					</svg>
					<img :src="singer.pigSrc" alt="" />
					<h5>{{ singer.album }}</h5>
					<h6>{{ singer.name }}</h6>
				</div>
			</div>
			<div v-show="subActiveTab == 1" id="myCollectSecTab">
				<div v-for="singer in albumList" :key="singer.singerId" class="singer-all">
					<svg xmlns="http://www.w3.org/2000/svg" width="3rem" height="3rem" viewBox="0 0 24 24">
						<path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2m-2 14.5v-9l6 4.5z" />
					</svg>
					<img :src="singer.pigSrc" alt="" />
					<h5>{{ singer.album }}</h5>
					<h6>{{ singer.name }}</h6>
				</div>
			</div>
		</div>
		<div v-show="activeTab == 1" id="myCollectMv">
			<div v-for="singer in mvList" :key="singer.singerId" class="singer-all">
				<svg xmlns="http://www.w3.org/2000/svg" width="3rem" height="3rem" viewBox="0 0 24 24">
					<path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2m-2 14.5v-9l6 4.5z" />
				</svg>
				<img :src="singer.pigSrc" alt="" />
				<h5>{{ singer.album }}</h5>
				<h6>{{ singer.name }}</h6>
				<h4>{{ singer.playNum }}</h4>
				<h4>{{ singer.time }}</h4>
			</div>
		</div>
	</footer>
</template>
<script setup>
	import { onMounted, ref } from "vue";

	let activeTab = ref(0); //默认选中第一个tab
	let subActiveTab = ref(0); //默认选中第一个tab
	const handelToogel = (index) => {
		activeTab.value = index;
	};
	const subhandelToogel = (index) => {
		subActiveTab.value = index;
	};
	const closeMsgWindow = () => {
		document.querySelector("footer p").style.display = "none";
	};
	const albumList = [
		{
			singerId: 0,
			album: "Dying Light 2 Stay Human (Original Game Soundtrack)",
			name: "Olivier Deriviere",
			pigSrc: "https://i1.wp.com/maroonersrock.com/wp-content/uploads/2019/08/DL2-artwork2-logo-small.jpg?fit=1920%2C1285&ssl=1",
		},
		{
			singerId: 1,
			album: "Dying Light 2 Stay Human (Original Game Soundtrack)",
			name: "Olivier Deriviere",
			pigSrc: "https://i1.wp.com/maroonersrock.com/wp-content/uploads/2019/08/DL2-artwork2-logo-small.jpg?fit=1920%2C1285&ssl=1",
		},
		{
			singerId: 2,
			album: "Dying Light 2 Stay Human (Original Game Soundtrack)",
			name: "Olivier Deriviere",
			pigSrc: "https://i1.wp.com/maroonersrock.com/wp-content/uploads/2019/08/DL2-artwork2-logo-small.jpg?fit=1920%2C1285&ssl=1",
		},
		{
			singerId: 3,
			album: "Dying Light 2 Stay Human (Original Game Soundtrack)",
			name: "Olivier Deriviere",
			pigSrc: "https://i1.wp.com/maroonersrock.com/wp-content/uploads/2019/08/DL2-artwork2-logo-small.jpg?fit=1920%2C1285&ssl=1",
		},
		{
			singerId: 4,
			album: "Dying Light 2 Stay Human (Original Game Soundtrack)",
			name: "Olivier Deriviere",
			pigSrc: "https://i1.wp.com/maroonersrock.com/wp-content/uploads/2019/08/DL2-artwork2-logo-small.jpg?fit=1920%2C1285&ssl=1",
		},
		{
			singerId: 5,
			album: "Dying Light 2 Stay Human (Original Game Soundtrack)",
			name: "Olivier Deriviere",
			pigSrc: "https://i1.wp.com/maroonersrock.com/wp-content/uploads/2019/08/DL2-artwork2-logo-small.jpg?fit=1920%2C1285&ssl=1",
		},
	];
	const mvList = [
		{
			singerId: 0,
			album: "Dying Light 2 Stay Human (Original Game Soundtrack)",
			name: "Olivier Deriviere",
			time: "02:01",
			playNum: " ▶ 233.2万",
			pigSrc: "https://i1.wp.com/maroonersrock.com/wp-content/uploads/2019/08/DL2-artwork2-logo-small.jpg?fit=1920%2C1285&ssl=1",
		},
		{
			singerId: 1,
			album: "Dying Light 2 Stay Human (Original Game Soundtrack)",
			name: "Olivier Deriviere",
			time: "02:01",
			playNum: " ▶ 233.2万",
			pigSrc: "https://i1.wp.com/maroonersrock.com/wp-content/uploads/2019/08/DL2-artwork2-logo-small.jpg?fit=1920%2C1285&ssl=1",
		},
		{
			singerId: 2,
			album: "Dying Light 2 Stay Human (Original Game Soundtrack)",
			name: "Olivier Deriviere",
			time: "02:01",
			playNum: " ▶ 233.2万",
			pigSrc: "https://i1.wp.com/maroonersrock.com/wp-content/uploads/2019/08/DL2-artwork2-logo-small.jpg?fit=1920%2C1285&ssl=1",
		},
		{
			singerId: 3,
			album: "Dying Light 2 Stay Human (Original Game Soundtrack)",
			name: "Olivier Deriviere",
			time: "02:01",
			playNum: " ▶ 233.2万",
			pigSrc: "https://i1.wp.com/maroonersrock.com/wp-content/uploads/2019/08/DL2-artwork2-logo-small.jpg?fit=1920%2C1285&ssl=1",
		},
		{
			singerId: 4,
			album: "Dying Light 2 Stay Human (Original Game Soundtrack)",
			name: "Olivier Deriviere",
			time: "02:01",
			playNum: " ▶ 233.2万",
			pigSrc: "https://i1.wp.com/maroonersrock.com/wp-content/uploads/2019/08/DL2-artwork2-logo-small.jpg?fit=1920%2C1285&ssl=1",
		},
		{
			singerId: 5,
			album: "Dying Light 2 Stay Human (Original Game Soundtrack)",
			name: "Olivier Deriviere",
			time: "02:01",
			playNum: " ▶ 233.2万",
			pigSrc: "https://i1.wp.com/maroonersrock.com/wp-content/uploads/2019/08/DL2-artwork2-logo-small.jpg?fit=1920%2C1285&ssl=1",
		},
	];
</script>
<style lang="scss" scoped src="./index.scss"/>
