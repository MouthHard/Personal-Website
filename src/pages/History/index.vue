<template>
	<div class="history-page">
		<!-- 古风背景 -->
		<div class="ancient-bg"></div>

		<!-- 页面标题和导航 -->
		<div class="page-header">
			<div class="header-left">
				<div class="seal-decoration">历史印记</div>
				<div class="title-container">
					<h1 class="page-title">历史长河</h1>
					<p class="page-subtitle">穿越时空，探索中华五千年文明</p>
				</div>
			</div>

			<div class="nav-menu">
				<button
					v-for="item in navItems"
					:key="item.id"
					class="nav-item"
					:class="{ active: activeNav === item.id }"
					@click="activeNav = item.id"
				>
					<component :is="item.icon" class="nav-icon" />
					<span>{{ item.name }}</span>
				</button>
			</div>
		</div>

		<!-- 内容区域 -->
		<div class="content-area">
			<!-- 朝代更迭 -->
			<div v-if="activeNav === 'dynasties'" class="content-section">
				<DynastiesTimeline />
			</div>

			<!-- 历史事件 -->
			<div v-else-if="activeNav === 'events'" class="content-section">
				<HistoricalEvents />
			</div>

			<!-- 历史人物 -->
			<div v-else-if="activeNav === 'figures'" class="content-section">
				<HistoricalFigures />
			</div>

			<!-- 文化遗产 -->
			<div v-else-if="activeNav === 'heritage'" class="content-section">
				<CulturalHeritage />
			</div>

			<!-- 博物馆推荐 -->
			<div v-else-if="activeNav === 'museums'" class="content-section">
				<MuseumRecommendations />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { ref } from "vue";
	import DynastiesTimeline from "./components/dynasties/index.vue";
	import HistoricalEvents from "./components/events/index.vue";
	import HistoricalFigures from "./components/figures/index.vue";
	import CulturalHeritage from "./components/heritage/index.vue";
	import MuseumRecommendations from "./components/museum/index.vue";
	import ScrollIcon from "./icons/ScrollIcon.vue";
	import BookIcon from "./icons/BookIcon.vue";
	import PersonIcon from "./icons/PersonIcon.vue";
	import RelicIcon from "./icons/RelicIcon.vue";
	import MuseumIcon from "./icons/MuseumIcon.vue";

	const activeNav = ref("dynasties");

	const navItems = [
		{
			id: "dynasties",
			name: "朝代更迭",
			icon: ScrollIcon,
		},
		{
			id: "events",
			name: "历史事件",
			icon: BookIcon,
		},
		{
			id: "figures",
			name: "历史人物",
			icon: PersonIcon,
		},
		{
			id: "heritage",
			name: "文化遗产",
			icon: RelicIcon,
		},
		{
			id: "museums",
			name: "博物馆推荐",
			icon: MuseumIcon,
		},
	];
</script>

<style scoped lang="scss">
	.history-page {
		min-height: 100vh;
		max-height: 100vh;
		position: relative;
		overflow-x: hidden;
		overflow-y: auto;
 
		color: #333;
		animation: pageAppear 0.8s ease-out forwards;
	}

	/* 页面出现动画 */
	@keyframes pageAppear {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	/* 古风背景 */
	.ancient-bg {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: linear-gradient(
				rgba(255, 248, 235, 0.92),
				rgba(255, 248, 235, 0.85)
			),
			url("https://images.unsplash.com/photo-1508804185872-d7badad00f7d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80");
		background-size: cover;
		background-position: center;
		background-attachment: fixed;
		z-index: -1;
		animation: bgScroll 20s ease-in-out infinite alternate;
	}

	/* 背景滚动动画 */
	@keyframes bgScroll {
		0% {
			background-position: 0% 0%;
		}
		100% {
			background-position: 100% 100%;
		}
	}

	/* 页面标题 */
	.page-header {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 100;
		display: grid;
		grid-template-columns: 1fr auto 1fr;
		align-items: center;
		padding: 10px 30px;
		background: rgba(255, 248, 235, 0.95);
		backdrop-filter: blur(10px);
		border-bottom: 1px solid rgba(200, 160, 99, 0.3);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	.header-left {
		display: flex;
		align-items: center;
		gap: 15px;
		flex-shrink: 0;
	}

	.title-container {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
	}

	.page-title {
		font-size: 28px;
		font-weight: bold;
		color: #8a1a1a;
		margin-bottom: 5px;
		text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
		position: relative;
		display: inline-block;
	 
		letter-spacing: 2px;
		animation: titleAppear 1.5s ease-out forwards;
		opacity: 0;
		transform: translateY(-20px);
	}

	/* 标题出现动画 */
	@keyframes titleAppear {
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.page-title::before,
	.page-title::after {
		content: "『";
		font-size: 30px;
		color: #c8a063;
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		animation: decorAppear 2s ease-out forwards;
		opacity: 0;
	}

	.page-title::before {
		left: -40px;
		animation-delay: 0.3s;
	}

	.page-title::after {
		content: "』";
		right: -40px;
		animation-delay: 0.6s;
	}

	/* 装饰出现动画 */
	@keyframes decorAppear {
		to {
			opacity: 1;
		}
	}

	.page-subtitle {
		font-size: 14px;
		color: #666;
		margin-top: 5px;
 
		animation: subtitleAppear 2s ease-out forwards;
		opacity: 0;
		transform: translateY(20px);
		animation-delay: 0.9s;
	}

	/* 副标题出现动画 */
	@keyframes subtitleAppear {
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	/* 印章装饰 */
	.seal-decoration {
		position: absolute;
		top: 10px;
		right: 20px;
		width: 50px;
		height: 50px;
		background: rgba(138, 26, 26, 0.1);
		border: 2px solid #c8a063;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 10px;
		color: #8a1a1a;
		font-weight: bold;
		animation: sealRotate 3s ease-in-out infinite alternate;
	}

	/* 印章旋转动画 */
	@keyframes sealRotate {
		0% {
			transform: rotate(0deg) scale(1);
		}
		100% {
			transform: rotate(5deg) scale(1.05);
		}
	}

	/* 导航菜单 */
	.nav-menu {
		display: flex;
		justify-content: center;
		gap: 15px;
		flex-wrap: wrap;
		animation: navAppear 2.5s ease-out forwards;
		opacity: 0;
		transform: translateY(20px);
	}

	.header-right {
		display: flex;
		justify-content: flex-end;
	}

	/* 导航菜单出现动画 */
	@keyframes navAppear {
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.nav-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 5px;
		padding: 8px 12px;
		background: rgba(255, 255, 255, 0.85);
		border: 2px solid #c8a063;
		border-radius: 8px;
		cursor: pointer;
		transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
		backdrop-filter: blur(8px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
		position: relative;
		overflow: hidden;
	}

	/* 导航菜单项背景渐变效果 */
	.nav-item::before {
		content: "";
		position: absolute;
		top: 0;
		left: -100%;
		width: 100%;
		height: 100%;
		background: linear-gradient(
			90deg,
			transparent,
			rgba(200, 160, 99, 0.1),
			transparent
		);
		transition: left 0.5s ease;
	}

	.nav-item:hover::before {
		left: 100%;
	}

	.nav-item:hover {
		transform: translateY(-5px) scale(1.02);
		box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
		border-color: #8a1a1a;
		background: rgba(255, 255, 255, 0.95);
	}

	.nav-item.active {
		background: linear-gradient(135deg, #8a1a1a, #a02828);
		color: #fff;
		border-color: #8a1a1a;
		box-shadow: 0 8px 20px rgba(138, 26, 26, 0.3);
		transform: translateY(-3px);
	}

	.nav-icon {
		width: 20px;
		height: 20px;
		fill: currentColor;
		transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.nav-item:hover .nav-icon {
		transform: scale(1.15) rotate(5deg);
	}

	.nav-item.active .nav-icon {
		transform: scale(1.2) rotate(0deg);
	}

	.nav-item span {
		font-size: 14px;
		font-weight: 500;
 
		transition: all 0.3s ease;
		letter-spacing: 0.5px;
	}

	.nav-item:hover span {
		letter-spacing: 1px;
		transform: translateY(-2px);
	}

	.nav-item.active span {
		letter-spacing: 1px;
		font-weight: bold;
	}

	/* 内容区域 */
	.content-area {
		max-width: 1200px;
		margin: 0 auto;
		padding: 80px 20px 20px;
		animation: contentAreaAppear 1s ease-out forwards;
		animation-delay: 0.5s;
		opacity: 0;
	}

	/* 内容区域出现动画 */
	@keyframes contentAreaAppear {
		to {
			opacity: 1;
		}
	}

	.content-section {
		background: rgba(255, 255, 255, 0.92);
		border-radius: 16px;
		padding: 25px;
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
		backdrop-filter: blur(12px);
		border: 1px solid rgba(200, 160, 99, 0.3);
		animation: contentAppear 1s ease-out forwards;
		opacity: 0;
		transform: translateY(20px);
		transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
	}

	/* 内容区域出现动画 */
	@keyframes contentAppear {
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.content-section:hover {
		box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
		transform: translateY(-3px);
		border-color: rgba(200, 160, 99, 0.5);
		background: rgba(255, 255, 255, 0.95);
	}

	/* 页面滚动条样式 */
	::-webkit-scrollbar {
		width: 8px;
		height: 8px;
	}

	::-webkit-scrollbar-track {
		background: rgba(255, 248, 235, 0.8);
		border-radius: 4px;
	}

	::-webkit-scrollbar-thumb {
		background: rgba(200, 160, 99, 0.6);
		border-radius: 4px;
		transition: all 0.3s ease;
	}

	::-webkit-scrollbar-thumb:hover {
		background: rgba(138, 26, 26, 0.6);
	}

	/* 底部装饰 */
	.page-footer {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 80px;
		background: rgba(138, 26, 26, 0.95);
		color: #fff;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		z-index: 10;
	}

	.footer-pattern {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 10px;
		background: url("https://images.unsplash.com/photo-1508804185872-d7badad00f7d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80");
		background-size: repeat-x;
		background-position: center;
	}

	.footer-text {
		margin-top: 20px;
		font-size: 14px;
		opacity: 0.8;
	}

	/* 响应式设计 */
	@media (max-width: 768px) {
		.page-header {
			flex-direction: column;
			padding: 10px 15px;
			gap: 10px;
		}

		.header-left {
			width: 100%;
			justify-content: center;
		}

		.title-container {
			align-items: center;
		}

		.page-title {
			font-size: 20px;
		}

		.page-title::before,
		.page-title::after {
			display: none;
		}

		.page-subtitle {
			font-size: 12px;
		}

		.seal-decoration {
			width: 40px;
			height: 40px;
			font-size: 8px;
		}

		.nav-menu {
			gap: 8px;
			justify-content: center;
		}

		.nav-item {
			padding: 6px 10px;
			gap: 3px;
		}

		.nav-icon {
			width: 16px;
			height: 16px;
		}

		.nav-item span {
			font-size: 12px;
		}

		.content-area {
			padding: 120px 15px 15px;
		}

		.content-section {
			padding: 20px;
		}
	}
</style>
