<template>
	<div class="choice-container">
		<!-- 标签切换 -->
		<div class="choice_tags_box">
			<router-link :to="value.routeName" v-for="value in choicenessRouteArr" class="tags" :class="{ isActive: value.routeId == active }" @click.capture="handelToogel(value.routeId)">
				{{ value.pageName }}
			</router-link>
		</div>
		<!-- 内容部分 -->
		<div class="choice-conbox">
			<router-view v-slot="{ Component }">
				<component :is="Component"></component>
			</router-view>
		</div>
	</div>
</template>
<script setup>
	import { onMounted, ref, watch } from "vue";
	import { onBeforeRouteUpdate } from "vue-router";

	const choicenessRouteArr = [
		{
			routeId: "0",
			routeName: "/music/choiceness/Recommend-C",
			pageName: "推荐",
		},
		{
			routeId: "1",
			routeName: "/music/choiceness/MusicPlaza-C",
			pageName: "云音乐广场",
		},
		{
			routeId: "2",
			routeName: "/music/choiceness/RankingList-C",
			pageName: "排行榜",
		},
		{
			routeId: "3",
			routeName: "/music/choiceness/Singer-C",
			pageName: "歌手",
		},
		{
			routeId: "4",
			routeName: "/music/choiceness/VIP-C",
			pageName: "VIP",
		},
	];

	let active = ref(0); //默认选中第一个tab

	const handelToogel = (index) => {
		active.value = index;
	};
	//组件内路由守卫  监听路由变化，实时更新当前路由地址
	onBeforeRouteUpdate((to, from) => {
		if (from.fullPath != to.fullPath) {
			for (let item of choicenessRouteArr) {
				if (item.routeName == to.fullPath) {
					active.value = item.routeId;
				}
			}
		}
	});
	const changeDate = () => {
		showDate.value = showDate.value == true ? false : true;
	};
	const switchChange = () => {
		switchBtn.value = switchBtn.value == "增加日期" ? "减少日期" : "增加日期";
	};
	let partIndex = 0;
	const changPart = (d, arr, childID) => {
		let temp = Array.from(document.querySelectorAll(`.MP_Line`)[childID].childNodes[1].childNodes);
		const commendDom = [];
		for (let i = 0; i < temp.length; i++) {
			if (temp[i].nodeName != "#text") commendDom.push(temp[i]);
		}

		if (d == 0) {
			partIndex = Math.abs(partIndex - arr.length / 6) % (arr.length / 3);
		} else {
			partIndex = (partIndex + arr.length / 6) % (arr.length / 3);
		}
		commendDom.forEach((e) => {
			e.style.transform = `translateX(${-partIndex * 100}%)`;
			e.style.transition = `0.5s`;
		});
	};

	const songRank = [
		{
			id: 0,
			rankUpdate: "刚刚更新",
			rankName: "飙升榜",
			songArr: ["XXX   -", "XXX  新", "XXX  ↑"],
			bg: "https://ts1.cn.mm.bing.net/th/id/R-C.b3c68ef9de1109b0d020e22bc2aacf40?rik=H9R9l7dvJP9Kbw&riu=http%3a%2f%2fpic.bizhi360.com%2fbbpic%2f89%2f8989.jpg&ehk=VyIdtYriq3lSqrO3x0MHd5IyxYaw8jZUCKZbHNtvewU%3d&risl=&pid=ImgRaw&r=0",
		},
		{
			id: 1,
			rankUpdate: "刚刚更新",
			rankName: "新歌榜",
			songArr: ["XXX   -", "XXX  新", "XXX  ↑"],
			bg: "https://ts1.cn.mm.bing.net/th/id/R-C.127aa5f88b1feb388333a3a8fe8ca868?rik=ZppO8Pf8gDbvoA&riu=http%3a%2f%2fwww.2008php.com%2f2011_Website_appreciate%2f2011-11-21%2f20111121023804.jpg&ehk=gqjwGS894SDNUGPshHNAqSSUF9rN2C%2f6Cfrv1NMIbpM%3d&risl=&pid=ImgRaw&r=0",
		},
		{
			id: 2,
			rankUpdate: "更新30首",
			rankName: "热歌榜",
			songArr: ["XXX   -", "XXX  新", "XXX  ↑"],
			bg: "https://ts1.cn.mm.bing.net/th/id/R-C.51282c5684c5dbd2033b30e18848e122?rik=uW3NLnz6Y1Dxrw&riu=http%3a%2f%2fpic.bizhi360.com%2fbpic%2f78%2f9878_7.jpg&ehk=UNapveT2usAbPXSLCbZUVu3QjrOXPMea63KPeDhlY%2fY%3d&risl=&pid=ImgRaw&r=0",
		},
		{
			id: 3,
			rankUpdate: "每周四更新",
			rankName: "原创榜",
			songArr: ["XXX   -", "XXX  ↓", "XXX  ↓"],
			bg: "https://ts1.cn.mm.bing.net/th/id/R-C.7373f117602fdf56b0038b49e8b3b13a?rik=e1a3GVx8bJE%2beA&riu=http%3a%2f%2fpic.bizhi360.com%2fbbpic%2f98%2f2198.jpg&ehk=79RLvIv9AOZN0V9VPW8fJYHaCopJVnlK3O0MJsk3DQA%3d&risl=&pid=ImgRaw&r=0",
		},
		{
			id: 4,
			rankUpdate: "长期更新",
			rankName: "经典榜",
			songArr: ["XXX   -", "XXX  新", "XXX  ↑"],
			bg: "https://i3.3conline.com/images/piclib/200909/13/batch/1/40641/125285144813577rnagpkh1.jpg",
		},
		{
			id: 5,
			rankUpdate: "每月更新",
			rankName: "共享榜",
			songArr: ["XXX   -", `XXX    新`, "XXX  ↑"],
			bg: "https://ts1.cn.mm.bing.net/th/id/R-C.6754cb13772fe38388abf26bd710fc30?rik=Qn43gY4EXomx5g&riu=http%3a%2f%2fpic.bizhi360.com%2fbbpic%2f97%2f3697.jpg&ehk=xNU32bprVD%2fIK%2foW2Bic6IfW8g1aQ%2fddWOrjoOned3I%3d&risl=&pid=ImgRaw&r=0",
		},
	];

	onMounted(() => {});
</script>

<style scoped lang="scss" src="./index.scss" />
