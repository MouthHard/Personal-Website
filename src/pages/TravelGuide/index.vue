<template>
	<div class="travel-guide-container">
		<!-- 固定头部区域 -->
		<header class="sticky-header">
			<div class="header-content">
				<!-- 左侧区域：当前省份标签和基本信息 -->
				<div class="header-left">
					<!-- 省份基本信息 -->
					<div class="basic-info">
						<div class="capital-info">
							<span class="info-label">省会: </span>
							<span class="info-value">{{ getCurrentProvinceCapital() }}</span>
						</div>
						<div class="weather-info">
							<span class="weather-icon">{{ getWeatherIcon() }}</span>
							<span class="info-value">{{ getWeatherDescription() }}</span>
						</div>
					</div>

					<!-- 省份标签 -->
					<div class="province-tags">
						<span
							v-for="(tag, index) in getAllTags()"
							:key="index"
							class="tag-item"
							:class="getTagColorClass(index)"
						>
							{{ tag }}
						</span>
					</div>

					<!-- 省份简要描述 -->
					<div class="province-description">
						{{ getProvinceDescription() }}
					</div>
				</div>

				<!-- 中间区域：标题和标签页导航 -->
				<div class="header-center">
					<div class="header-title">
						<h1 class="hero-title">{{ getCurrentProvinceName() }}旅游指引</h1>
					</div>
					<!-- 标签页导航 -->
					<div class="tab-navigation">
						<button
							v-for="tab in tabs"
							:key="tab.id"
							class="tab-button"
							:class="{ active: activeTab === tab.id }"
							@click="activeTab = tab.id"
						>
							<span class="tab-icon">
								<component :is="tab.icon" />
							</span>
							<span class="tab-name">{{ tab.name }}</span>
						</button>
					</div>
				</div>

				<!-- 右侧区域：返回按钮 -->
				<div class="header-right">
					<!-- 返回首页按钮 -->
					<button class="back-home-button" @click="router.push('/')">
						<span class="back-icon">🏠</span>
						<span class="back-text">返回首页</span>
						<span class="button-glow"></span>
					</button>
				</div>
			</div>
		</header>

		<!-- 左侧省份选择菜单 -->
		<aside class="province-sidebar">
			<div class="sidebar-content">
				<!-- 菜单标题 -->
				<div class="sidebar-title">
					<component :is="provinceSelectorIcon" class="title-icon" />
					<h3>省份选择</h3>
				</div>

				<!-- 搜索框 -->
				<div class="search-box">
					<input
						type="text"
						v-model="searchQuery"
						placeholder="搜索省份..."
						class="search-input"
					/>
					<span class="search-icon">🔍</span>
				</div>

				<!-- 地区筛选 -->
				<div class="region-filter">
					<button
						v-for="region in getRegions()"
						:key="region"
						class="region-button"
						:class="{ active: selectedRegion === region }"
						@click="selectedRegion = region"
					>
						{{ region }}
					</button>
				</div>

				<!-- 省份列表 -->
				<div class="province-list">
					<div
						v-for="province in filteredProvinces"
						:key="province.id"
						class="province-item"
						:class="{ selected: province.id === selectedProvinceId }"
						@click="selectProvince(province.id)"
					>
						<span class="province-name">{{ province.name }}</span>
						<span class="province-abbreviation">{{
							province.abbreviation
						}}</span>
						<span class="province-region">{{ province.region }}</span>
					</div>
				</div>
			</div>
		</aside>

		<!-- 主内容区域 - 可滚动 -->
		<main class="main-content">
			<FoodModule
				v-if="activeTab === 'food'"
				:province-id="selectedProvinceId"
			/>
			<SceneryModule
				v-else-if="activeTab === 'scenery'"
				:province-id="selectedProvinceId"
			/>
		</main>
	</div>
</template>

<script setup>
	// eslint-disable-next-line no-unused-vars
	import { ref, onMounted, provide, computed, onUnmounted } from "vue";
	import { useRouter } from "vue-router";
	import { provinces as provincesData } from "./data/provinces.ts";
	import FoodModule from "./components/food/index.vue";
	import SceneryModule from "./components/scenery/index.vue";
	import { FoodIcon, SceneryIcon, ProvinceIcon } from "./icons";

	// 将provinces设置为响应式数组
	const provinces = ref(provincesData);

	const router = useRouter();
	const selectedProvinceId = ref(provinces.value[0].id); // 默认选择第一个省份
	const activeTab = ref("food"); // 默认显示美食标签页

	// 标签页定义
	const tabs = [
		{ id: "food", name: "美食", icon: FoodIcon },
		{ id: "scenery", name: "风光", icon: SceneryIcon },
	];

	// 省份选择器图标
	const provinceSelectorIcon = ProvinceIcon;

	// 提供省份选择状态给子组件
	provide("selectedProvinceId", selectedProvinceId);

	// 获取当前省份名称
	const getCurrentProvinceName = () => {
		const province = provinces.value.find(
			(p) => p.id === selectedProvinceId.value,
		);
		return province?.name || "";
	};

	// 获取当前省份标签（包括地区）
	const getAllTags = () => {
		const province = provinces.value.find(
			(p) => p.id === selectedProvinceId.value,
		);
		if (!province) return [];
		return [province.region, ...(province.tags || [])];
	};

	// 获取当前省份描述
	const getProvinceDescription = () => {
		const province = provinces.value.find(
			(p) => p.id === selectedProvinceId.value,
		);
		return province?.description || "";
	};

	// 获取当前省份省会
	const getCurrentProvinceCapital = () => {
		const province = provinces.value.find(
			(p) => p.id === selectedProvinceId.value,
		);
		return province?.capital || "";
	};

	// 获取天气图标（模拟数据）
	const getWeatherIcon = () => {
		// 根据省份随机生成天气图标
		const icons = ["☀️", "🌤️", "⛅", "🌧️", "❄️", "🌬️"];
		const province = provinces.value.find(
			(p) => p.id === selectedProvinceId.value,
		);
		if (!province) return "☀️";
		// 使用省份ID的哈希值生成相对稳定的随机数
		const hash = province.id
			.split("")
			.reduce((acc, char) => acc + char.charCodeAt(0), 0);
		return icons[hash % icons.length];
	};

	// 获取天气描述（模拟数据）
	const getWeatherDescription = () => {
		// 根据省份随机生成天气描述
		const descriptions = ["晴朗", "多云", "阴天", "小雨", "下雪", "大风"];
		const province = provinces.value.find(
			(p) => p.id === selectedProvinceId.value,
		);
		if (!province) return "晴朗";
		// 使用省份ID的哈希值生成相对稳定的随机数
		const hash = province.id
			.split("")
			.reduce((acc, char) => acc + char.charCodeAt(0), 0);
		return descriptions[hash % descriptions.length];
	};

	// 获取标签颜色类
	const getTagColorClass = (index) => {
		const colors = ["tag-color-1", "tag-color-2", "tag-color-3"];
		return colors[index % colors.length];
	};

	// 省份选择器相关状态
	const selectedRegion = ref("全部");
	const searchQuery = ref("");

	// 获取所有地区
	const getRegions = () => {
		const regions = new Set(provinces.value.map((p) => p.region));
		return ["全部", ...Array.from(regions)];
	};

	// 过滤后的省份列表
	const filteredProvinces = computed(() => {
		return provinces.value.filter((province) => {
			const matchRegion =
				selectedRegion.value === "全部" ||
				province.region === selectedRegion.value;
			const matchSearch =
				searchQuery.value === "" ||
				province.name.includes(searchQuery.value) ||
				province.id.includes(searchQuery.value);
			return matchRegion && matchSearch;
		});
	});
  
	const selectProvince = (provinceId) => {
		selectedProvinceId.value = provinceId;
	};
</script>

<style scoped src="./index.scss" lang="scss"></style>
