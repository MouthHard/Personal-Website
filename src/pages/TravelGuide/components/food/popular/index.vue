<template>
	<section class="module-popular" v-if="popularFoods.length > 0">
		<!-- 黑客帝国风格背景线条 -->
		<svg
			class="matrix-background"
			viewBox="0 0 100 100"
			preserveAspectRatio="none"
		>
			<!-- 随机线条 -->
			<line
				v-for="i in 25"
				:key="i"
				class="matrix-line"
				:x1="getRandomPosition()"
				:y1="getRandomPosition()"
				:x2="getLongLineEnd(getRandomPosition(), 'x')"
				:y2="getLongLineEnd(getRandomPosition(), 'y')"
				:stroke="getMatrixColor()"
				:stroke-width="getRandomWidth()"
				:style="{
					animationDelay: `${i * 0.2}s`,
					animationDuration: `${getRandomDuration()}s`,
				}"
			/>
		</svg>

		<div class="section-header">
			<h3 class="section-title">🔥 热门推荐</h3>
			<button class="section-more">查看更多</button>
		</div>
		<div class="popular-grid">
			<div v-for="food in popularFoods" :key="food.id" class="popular-card">
				<!-- 图片区域 -->
				<div class="popular-card-image-container">
					<!-- 左侧三角形热门推荐标签 -->
					<div
						class="popular-card-badge"
						:style="{ '--badge-color': food.badgeColor || '#ff6b6b' }"
					>
						<span class="badge-text">{{ food.badgeText || "热门推荐" }}</span>
					</div>

					<div class="popular-card-image-wrapper">
						<img :src="food.image" class="popular-card-image" loading="lazy" />
					</div>
				</div>

				<!-- 卡片内容区域 -->
				<div class="popular-card-content">
					<div class="popular-card-header">
						<h4 class="popular-card-title">{{ food.name }}</h4>
						<div class="popular-card-title-rating">
							<el-rate
								:model-value="parseFloat(food.rating)"
								:disabled="true"
								:max="5"
								:precision="1"
								show-score
								class="custom-element-rate popular-card-title-rate"
							/>
						</div>
					</div>

					<div class="popular-card-tags">
						<span
							v-for="(tag, index) in food.tags"
							:key="index"
							class="popular-card-tag"
							:style="getRandomColor(tag)"
						>
							{{ tag }}
						</span>
					</div>

					<p class="popular-card-description">{{ food.description }}</p>

					<div class="popular-card-footer">
						<div class="popular-card-price">
							<span class="price-symbol">¥</span>
							<span class="price-value">{{ food.price }}</span>
						</div>
						<div class="popular-card-actions">
							<button class="action-btn">了解详情</button>
							<button
								class="favorite-btn"
								:class="{ active: isFavorite(food.id) }"
								@click.stop="toggleFavorite(food.id)"
							>
								<svg
									class="heart-icon"
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="currentColor"
								>
									<path
										d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
									/>
								</svg>
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>

<script setup>
	import { ref } from "vue";

	// 接收props
	const props = defineProps({
		popularFoods: {
			type: Array,
			default: () => [],
		},
	});

	// 收藏状态管理
	const favoriteFoods = ref(new Set());

	// 切换收藏状态
	const toggleFavorite = (foodId) => {
		if (isFavorite(foodId)) {
			favoriteFoods.value.delete(foodId);
		} else {
			favoriteFoods.value.add(foodId);
		}
	};

	// 检查是否已收藏
	const isFavorite = (foodId) => {
		return favoriteFoods.value.has(foodId);
	};

	// 为标签生成随机颜色函数
	const getRandomColor = (tag) => {
	 
		let hash = 0;
		for (let i = 0; i < tag.length; i++) {
			hash = tag.charCodeAt(i) + ((hash << 5) - hash);
		}

		// 预定义颜色列表  
		const colorSchemes = [
			{
				background: "rgba(255, 107, 107, 0.2)",
				border: "1px solid rgba(255, 107, 107, 0.8)",
				color: "rgba(255, 107, 107, 1)",
			},
			{
				background: "rgba(102, 126, 234, 0.2)",
				border: "1px solid rgba(102, 126, 234, 0.8)",
				color: "rgba(102, 126, 234, 1)",
			},
			{
				background: "rgba(147, 112, 219, 0.2)",
				border: "1px solid rgba(147, 112, 219, 0.8)",
				color: "rgba(147, 112, 219, 1)",
			},
			{
				background: "rgba(65, 215, 215, 0.2)",
				border: "1px solid rgba(65, 215, 215, 0.8)",
				color: "rgba(65, 215, 215, 1)",
			},
			{
				background: "rgba(255, 215, 0, 0.2)",
				border: "1px solid rgba(255, 215, 0, 0.8)",
				color: "rgba(255, 215, 0, 1)",
			},
			{
				background: "rgba(152, 251, 152, 0.2)",
				border: "1px solid rgba(152, 251, 152, 0.8)",
				color: "rgba(152, 251, 152, 1)",
			},
			{
				background: "rgba(255, 165, 0, 0.2)",
				border: "1px solid rgba(255, 165, 0, 0.8)",
				color: "rgba(255, 165, 0, 1)",
			},
			{
				background: "rgba(255, 192, 203, 0.2)",
				border: "1px solid rgba(255, 192, 203, 0.8)",
				color: "rgba(255, 192, 203, 1)",
			},
		];

		// 使用哈希值选择颜色方案
		const index = Math.abs(hash) % colorSchemes.length;
		return colorSchemes[index];
	};

	// 生成黑客帝国风格颜色（确保每条线条颜色不同，透明度各异）
	const usedColors = new Set();
	const colorPalette = [
		// 绿色调
		[0, 255, 140],
		[34, 139, 34],
		[0, 255, 0],
		[144, 238, 144],
		[0, 200, 0],
		[50, 205, 50],
		// 蓝色调
		[0, 255, 255],
		[0, 191, 255],
		[0, 139, 139],
		// 紫色调
		[147, 112, 219],
		[123, 104, 238],
		// 青色调
		[64, 224, 208],
		[0, 255, 255],
		// 额外颜色
		[255, 215, 0],
		[255, 107, 107],
		[102, 126, 234],
		[255, 165, 0],
		[255, 192, 203],
		[152, 251, 152],
		[218, 112, 214],
		[255, 20, 147],
		[0, 191, 255],
		[240, 128, 128],
		[173, 216, 230],
		[238, 130, 238],
	];

	const getMatrixColor = () => {
		// 生成随机透明度 (0.4-0.9)
		const opacity = Math.random() * 0.5 + 0.4;

		// 随机选择颜色并确保不重复
		let colorIndex;
		let rgb;

		// 如果所有颜色都用过了，重置已使用颜色集合
		if (usedColors.size >= colorPalette.length) {
			usedColors.clear();
		}

		// 选择一个未使用的颜色
		do {
			colorIndex = Math.floor(Math.random() * colorPalette.length);
			rgb = colorPalette[colorIndex];
		} while (usedColors.has(colorIndex));

		// 标记该颜色为已使用
		usedColors.add(colorIndex);

		// 生成带有随机透明度的颜色
		return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${opacity})`;
	};

	// 生成随机线条宽度
	const getRandomWidth = () => {
		return Math.random() * 0.5 + 0.2;
	};

	// 生成随机位置 (0-100)
	const getRandomPosition = () => {
		return Math.random() * 100;
	};

	// 生成随机动画持续时间 (1-5秒)
	const getRandomDuration = () => {
		return Math.random() * 4 + 1;
	};

	// 生成长线端点，确保线条能穿透整个容器
	const getLongLineEnd = (startPos, axis) => {
		// 随机决定线条方向
		const direction = Math.random() > 0.5 ? 1 : -1;

		// 生成足够长的线条端点，确保能穿透容器
		if (axis === "x") {
			return direction > 0 ? 150 : -50;
		} else {
			return direction > 0 ? 150 : -50;
		}
	};
</script>

<style scoped lang="scss" src="./index.scss" />
