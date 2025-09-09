<template>
	<div id="land-con">
		<!-- 主页面加载页 -->
		<!-- <PageChange></PageChange> -->
		<div class="slider-container">
			<div id="left-slide">
				<span v-for="value in imgLeftArr" :key="value.imgId">
					<div class="flip-card">
						<section>
							<h3>创作背景</h3>
							<h4> </h4>
							<h4>{{ noteRightArr[value.imgId]?.background }}</h4>
							<h3 v-if="noteRightArr[value.imgId]?.product!==''">作者 （ {{ noteRightArr[value.imgId]?.product }}）</h3>
							<h4>{{ noteRightArr[value.imgId]?.author }}</h4>
						</section>
						<img :src="value.imgSrc" />
					</div>
				</span>
			</div>

			<div id="right-slide">
				<p v-for="note in noteRightArr" :key="note.id" @mouseover="rotateLeftSlide()" @mouseout="rotateLeftSlideBack()" @click="openNewWindow(note.link)"> {{ note.poem }} </p>
			</div>

			<div id="action-buttons">
				<button class="down-button">▽</button>
				<button class="return-button" @click="router.push('/')">☾</button>
				<button class="up-button">▲</button>
			</div>
		</div>
	</div>
</template>

<script setup>
	import { onMounted, ref, reactive, nextTick } from "vue";
	import router from "@/router";
	import axios from "axios";
	const imgLeftArr = [];
	const noteRightArr = ref([]);
	for (let i = 0; i <= 39; i++) {
		imgLeftArr.push({
			imgId: i,
			imgSrc: `https://images-pc.oss-cn-hongkong.aliyuncs.com/aphorism/${i}.webp`,
		});
	}

	const openNewWindow = (link) => {
		window.open(link, "_blank");
	};

	//读取阿里云oss里面的json文件
	async function fetchPublicJsonWithAxios(url) {
		try {
			const response = await axios.get(url);
			return response.data;
		} catch (error) {
			console.error("读取json文件失败:", error);
			throw error;
		}
	}
	const publicJsonUrl = "https://images-pc.oss-cn-hongkong.aliyuncs.com/aphorism/poem/aphorismList.json";
	fetchPublicJsonWithAxios(publicJsonUrl)
		.then((data) => {
			noteRightArr.value = data;
		})
		.catch((error) => {
			console.error("axios读取json文件失败:", error);
		});

	const rotateLeftSlide = () => {
		document.querySelectorAll(" .flip-card").forEach((item) => {
			item.style.transform = "rotateY(180deg)";
			item.style.transition = "transform 1s";
		});
	};
	const rotateLeftSlideBack = () => {
		document.querySelectorAll(".flip-card").forEach((item) => {
			item.style.transform = "rotateY(0deg)";
			item.style.transition = "transform 1s";
		});
	};
	onMounted(() => {
		//滑动图片和诗句
		const initSlider = () => {
			const sliderContainer = document.querySelector(".slider-container");
			const slideRight = document.getElementById("right-slide");
			const slideLeft = document.getElementById("left-slide");
			const upButton = document.querySelector(".up-button");
			const downButton = document.querySelector(".down-button");
			const slidesLength = slideLeft.querySelectorAll("img").length;
			let activeSlideIndex = 0;

			upButton.addEventListener("click", () => changeSlide("up"));
			downButton.addEventListener("click", () => changeSlide("down"));
			const changeSlide = (direction) => {
				downButton.classList.add("down-active");
				upButton.classList.add("up-active");
				setTimeout(() => {
					upButton.classList.remove("up-active");
					downButton.classList.remove("down-active");
				}, 1000);
				const sliderHeight = sliderContainer.clientHeight;
				if (direction === "up") {
					activeSlideIndex++;
					if (activeSlideIndex > slidesLength - 1) {
						activeSlideIndex = 0;
					}
				} else if (direction === "down") {
					activeSlideIndex--;
					if (activeSlideIndex < 0) {
						activeSlideIndex = slidesLength - 1;
					}
				}
				slideRight.style.transform = `translateY(-${activeSlideIndex * sliderHeight}px)`;
				slideLeft.style.transform = `translateY(-${activeSlideIndex * sliderHeight}px)`;
			};
		};
		initSlider();
	});
</script>

<style scoped lang="scss"  src="./index.scss"/>
