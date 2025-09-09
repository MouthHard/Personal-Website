<template>
	<div id="menu">
		<nav>
			<template v-for="vr in routerArr" :key="vr.id">
				<router-link :to="vr.address">{{ vr.title }}</router-link>
			</template>
		</nav>
		<div id="menuContent">
			<router-view></router-view>
		</div>
	</div>
</template>
<script setup>
	import { getCurrentInstance, onMounted } from "vue";

	//路由数组
	const routerArr = [
		{ id: "001", title: "转换器", address: "/docu/convertor" },
		{ id: "002", title: "计算器", address: "/docu/calculator" },
		{ id: "003", title: "日历", address: "/docu/calendar" },
		{ id: "004", title: "返回", address: "/" },
	];
	const { proxy } = getCurrentInstance();
</script>

<style lang="scss" scoped  src="./index.scss"/>
