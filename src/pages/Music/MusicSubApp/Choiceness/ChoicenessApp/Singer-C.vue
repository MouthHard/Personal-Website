<template>
	<div id="singer-Con">
		<div id="singer_area">
			<button v-for="(it, index) in singer_area_arr" :key="index" :class="{ isSubActive: index == active_singer_area }" @click="handelToogel(index, 'singer_area')">
				{{ it }}
			</button>
		</div>
		<div id="singer_man">
			<button v-for="(it, index) in singer_man_arr" :key="index" :class="{ isSubActive: index == active_singer_man }" @click="handelToogel(index, 'singer_man')">
				{{ it }}
			</button>
		</div>

		<div id="singer_character_arr">
			<button v-for="(it, index) in singer_character_arr" :key="index" :class="{ isSubActive: index == active_singer_character }" @click="handelToogel(index, 'singer_character')">
				{{ it }}
			</button>
		</div>
		<footer>
			<div v-for="singer in allSinger" :key="singer.singerId" class="singer-all">
				<svg xmlns="http://www.w3.org/2000/svg" width="3rem" height="3rem" viewBox="0 0 24 24">
					<path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2m-2 14.5v-9l6 4.5z" />
				</svg>
				<img :src="singer.pigSrc" alt="" />
				<h5>{{ singer.name }}</h5>
				<h6>单曲 ：{{ singer.num }}</h6>
			</div>
		</footer>
	</div>
</template>
<script setup>
import { ref } from "vue";

const singer_area_arr = ["全部", "华语", "欧美", "日本", "韩国", "其他"];
const singer_man_arr = ["全部", "男歌手", "女歌手", "乐队组合"];
const singer_character_arr = ["热门", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "#"];

const allSinger = [
];
for(let i =0;i<15;i++){
	allSinger.push({
		singerId: i, name: "陈奕迅", num: "1000", pigSrc: "http://p1.music.126.net/ODuFZql3x08Q4AaW7y20Aw==/109951169014571694.jpg?param=130y130"
	})
}
let active_singer_area = ref(0);
let active_singer_man = ref(0);
let active_singer_character = ref(0);
const handelToogel = (index, id) => {
	if (id == "singer_area") {
		active_singer_area.value = index;
	} else if (id == "singer_man") {
		active_singer_man.value = index;
	} else {
		active_singer_character.value = index;
	}
};
</script>

<style lang="less" scoped>
* {
	margin: 0;
	padding: 0;
}
#singer-Con {
	width: 97%;
	height: 100%;
}
#singer_area,
#singer_man,
#singer_character_arr {
	position: sticky;
	left: 0;
	display: flex;
	margin: 10px 0 0 10px;
	flex-wrap: wrap;
	button {
		color: white;
		margin: 0 0 10px 10px;
		padding: 10px 15px;
		background: transparent;
		&:hover {
			cursor: pointer;
			color: #00ff73;
			box-shadow: inset 0 -20px 15px -15px #00aaff6d;
			background: rgba(0, 0, 0, 0.5);
			font-weight: bolder;
			border: none;
		}
	}
	.isSubActive {
		font-size: 1rem;
		border-radius: 15px;
		font-weight: bolder;
		transition: 0.5s;
		box-shadow: 0 0 15px 3px #00aaff;
		background: #ffffff;
		color: black;
		border: none;
	}
}
footer {
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: space-around;
	flex-wrap: wrap;
	.singer-all {
		width: 15%;
		height: 36%;
		margin-top: 10px;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
		background: #000;
		position: relative;
		transition: 1s;
		border-radius: 15px;
		img {
			width: 70%;
			height: 55%;
			background-size: cover;
			margin: 20px 0 10px 0;
			transition: 1s;
		}
		h5,
		h6 {
			margin: 5px;
		}

		h6 {
			font-weight: normal;
		}
		svg {
			position: absolute;
			z-index: 1;
			left: 38%;
			top: 23%;
			opacity: 0;
			transition: 0.5s;
			font-weight: bolder;
		}
		&:hover {
			border-radius: 0;
			cursor: pointer;
			background: rgba(0, 0, 0, 0);
		}
		&:hover img {
			border-radius: 50%;
			cursor: pointer;
			opacity: 0.5;
		}
		&:hover svg {
			opacity: 1;
		}
	}
}
</style>
