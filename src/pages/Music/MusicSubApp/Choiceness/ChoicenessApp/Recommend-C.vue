<template>
	<div id="Recommend-C">
		<div id="choiceFirstTab_Line">
			<header>
				<h2 @click="changCommendSong(0, choiceSecArr, 'choiceFirstTab_Line')">◀</h2>
				<h2 @click="changCommendSong(1, choiceSecArr, 'choiceFirstTab_Line')">▶</h2>
				<h3>官方歌单 ▼</h3>
				<svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 512 512">
					<path fill="currentColor" d="M256 48C141.31 48 48 141.31 48 256s93.31 208 208 208s208-93.31 208-208S370.69 48 256 48m120 182.15a8.62 8.62 0 0 1-8.62 8.62h-59.54a8.61 8.61 0 0 1-6.09-14.71l22.17-22.17l-5.6-6.51a87.38 87.38 0 1 0-62.94 148a87.55 87.55 0 0 0 82.42-58.25A16 16 0 1 1 368 295.8a119.4 119.4 0 1 1-112.62-159.18a118.34 118.34 0 0 1 86.36 36.95l.56.62l4.31 5l14.68-14.68a8.44 8.44 0 0 1 6-2.54a8.61 8.61 0 0 1 8.68 8.63Z" />
				</svg>
			</header>
			<footer>
				<span v-for="item in choiceSecArr" :key="item.id">
					<h5>{{ item.playNum }}</h5>
					<div>
						<svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 512 512">
							<path
								fill="currentColor"
								d="M234.518 388.333v45.972l-110.635-63.88V242.653l39.794 22.966c-14.135 54.515 12.719 107.317 70.841 122.715M373.264 194.01V66.24L262.61 2.355v127.77zm-123.878-63.885V2.355L138.735 66.24v127.77zm151.96 112.527v127.77L512 434.307v-127.77zm-124.097 145.71v45.937l110.872-63.884V242.649l-39.813 23c15.7 55.241-11.772 105.898-71.059 122.712m-166.598-17.94v-127.77L0 306.537v127.77zm216.189-141.96l39.806-22.994l-110.652-63.886l-110.649 63.883l39.809 22.97c38.444-40.568 100.251-41.979 141.686.026M6.612 445.76l110.65 63.885l110.654-63.885l-110.653-63.886zm277.471 0l110.652 63.885l110.652-63.885l-110.652-63.886zm43.437-151.62c0-54.851-59.788-89.32-107.36-61.894s-47.573 96.363 0 123.789s107.36-7.043 107.36-61.894" />
						</svg>
						<h4>{{ item.playName }}</h4>
						<ol>
							<li v-for="it in item.songArr">{{ it }}</li>
						</ol>
					</div>
				</span>
			</footer>
		</div>

		<div class="choiceFirstTab_MulPart" v-for="item in partArr" :key="item.partId">
			<div class="MP_Line">
				<header>
					<h3>{{ item.title }}</h3>
					<button @click="changPart(0, item.fifthArr, item.partId)">◁</button>
					<button @click="changPart(1, item.fifthArr, item.partId)">▷</button>
					<svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 512 512">
						<path fill="currentColor" d="M256 48C141.31 48 48 141.31 48 256s93.31 208 208 208s208-93.31 208-208S370.69 48 256 48m120 182.15a8.62 8.62 0 0 1-8.62 8.62h-59.54a8.61 8.61 0 0 1-6.09-14.71l22.17-22.17l-5.6-6.51a87.38 87.38 0 1 0-62.94 148a87.55 87.55 0 0 0 82.42-58.25A16 16 0 1 1 368 295.8a119.4 119.4 0 1 1-112.62-159.18a118.34 118.34 0 0 1 86.36 36.95l.56.62l4.31 5l14.68-14.68a8.44 8.44 0 0 1 6-2.54a8.61 8.61 0 0 1 8.68 8.63Z" />
					</svg>
				</header>
				<footer>
					<span v-for="it in item.fifthArr" :key="it.id">
						<img :src="it.imgSrc" alt="" />
						<h4>{{ it.h4Text }}</h4>
						<h5>{{ it.h5Text }}</h5>
						<h6>{{ it.h6Text }}</h6>
						<h6>{{ it.h6OtherText }}</h6>
						<div>
							<svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 32 32">
								<path fill="currentColor" d="M15 4v16.563L9.719 15.28L8.28 16.72l7 7l.719.687l.719-.687l7-7l-1.438-1.438l-5.28 5.28V4zM7 26v2h18v-2z" />
							</svg>
							<svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 256 256">
								<path fill="currentColor" d="M178 40c-20.65 0-38.73 8.88-50 23.89C116.73 48.88 98.65 40 78 40a62.07 62.07 0 0 0-62 62c0 70 103.79 126.66 108.21 129a8 8 0 0 0 7.58 0C136.21 228.66 240 172 240 102a62.07 62.07 0 0 0-62-62m-50 174.8c-18.26-10.64-96-59.11-96-112.8a46.06 46.06 0 0 1 46-46c19.45 0 35.78 10.36 42.6 27a8 8 0 0 0 14.8 0c6.82-16.67 23.15-27 42.6-27a46.06 46.06 0 0 1 46 46c0 53.61-77.76 102.15-96 112.8" />
							</svg>
							<svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
								<path fill="currentColor" d="M5 10c-1.1 0-2 .9-2 2s.9 2 2 2s2-.9 2-2s-.9-2-2-2m14 0c-1.1 0-2 .9-2 2s.9 2 2 2s2-.9 2-2s-.9-2-2-2m-7 0c-1.1 0-2 .9-2 2s.9 2 2 2s2-.9 2-2s-.9-2-2-2" />
							</svg>
						</div>
					</span>
				</footer>
			</div>
		</div>
	</div>
</template>
<script setup>
import { onMounted } from "vue";

const choiceSecArr = [
	{
		playNum: "▶ 1.1亿",
		playName: "深度睡眠 |重度失眠者专用歌单",
		songArr: ["漫漫长夜", "xxx", "xxx"],
		bgColor: "#21353c",
	},
	{
		playNum: "▶ 1.23亿",
		playName: "纯音 | 静淌时隙悄然掠过 | 助眠",
		songArr: ["Mystery of Love", "xxx", "xxx"],
		bgColor: "#fff4e6",
	},
	{
		playNum: "▶ 851.6万",
		playName: "那些你熟悉却又不知道名字的轻音乐",
		songArr: ["xxx", "xxx", "xxx"],
		bgColor: "#f2c86d",
	},
	{
		playNum: "▶ 70万",
		playName: "背景音乐珍藏，总有一天你会用上的",
		songArr: ["xxx", "xxx", "xxx"],
		bgColor: "#ffe7c6",
	},
	{
		playNum: "▶ 5401",
		playName: "「纯音乐」温暖治愈丨沉浸于慵懒的下午时光",
		songArr: ["xxx", "xxx", "xxx"],
		bgColor: "#420002",
	},
	{
		playNum: "▶ 139.22万",
		playName: "治愈系 | 愿每天的坏心情都能在睡前清零",
		songArr: ["xxx", "xxx", "xxx"],
		bgColor: "#85816f",
	},
	{
		playNum: "▶ 139.22万",
		playName: "寂静鸣远：治愈纯音 抚慰心绪 净化心灵",
		songArr: ["xxx", "xxx", "xxx"],
		bgColor: "#D4DED5",
	},
];
for (let i = 0; i < choiceSecArr.length; i++) {
	choiceSecArr[i].src = `https://images-pc.oss-cn-hongkong.aliyuncs.com/music/choice/R-C/${i}.webp`;
	choiceSecArr[i].id = i;
}

const partArr = [
	{
		title: "最新音乐 ▶",
		fifthArr: [
			{
				h4Text: "歌曲名",
				h5Text: "歌手名",
				h6Text: "vip",
				h6OtherText: "10w+评论",
			},
			{
				h4Text: "歌曲名",
				h5Text: "歌手名",
				h6Text: "vip",
				h6OtherText: "10w+评论",
			},
			{
				h4Text: "歌曲名",
				h5Text: "歌手名",
				h6Text: "vip",
				h6OtherText: "10w+评论",
			},
			{
				h4Text: "歌曲名",
				h5Text: "歌手名",
				h6Text: "vip",
				h6OtherText: "10w+评论",
			},
			{
				h4Text: "歌曲名",
				h5Text: "歌手名",
				h6Text: "vip",
				h6OtherText: "10w+评论",
			},
			{
				h4Text: "歌曲名",
				h5Text: "歌手名",
				h6Text: "vip",
				h6OtherText: "10w+评论",
			},
		],
	},
	{
		title: "精选有声书 ▶",
		fifthArr: [
			{
				h4Text: "歌曲名",
				h5Text: "歌手名",
				h6Text: "vip",
				h6OtherText: "10w+评论",
			},
			{
				h4Text: "歌曲名",
				h5Text: "歌手名",
				h6Text: "vip",
				h6OtherText: "10w+评论",
			},
			{
				h4Text: "歌曲名",
				h5Text: "歌手名",
				h6Text: "vip",
				h6OtherText: "10w+评论",
			},
			{
				h4Text: "歌曲名",
				h5Text: "歌手名",
				h6Text: "vip",
				h6OtherText: "10w+评论",
			},
			{
				h4Text: "歌曲名",
				h5Text: "歌手名",
				h6Text: "vip",
				h6OtherText: "10w+评论",
			},
			{
				h4Text: "歌曲名",
				h5Text: "歌手名",
				h6Text: "vip",
				h6OtherText: "10w+评论",
			},
		],
	},
	{
		title: "热门播客 ▶",
		fifthArr: [
			{
				h4Text: "歌曲名",
				h5Text: "歌手名",
				h6Text: "vip",
				h6OtherText: "10w+评论",
			},
			{
				h4Text: "歌曲名",
				h5Text: "歌手名",
				h6Text: "vip",
				h6OtherText: "10w+评论",
			},
			{
				h4Text: "歌曲名",
				h5Text: "歌手名",
				h6Text: "vip",
				h6OtherText: "10w+评论",
			},
			{
				h4Text: "歌曲名",
				h5Text: "歌手名",
				h6Text: "vip",
				h6OtherText: "10w+评论",
			},
			{
				h4Text: "歌曲名",
				h5Text: "歌手名",
				h6Text: "vip",
				h6OtherText: "10w+评论",
			},
			{
				h4Text: "歌曲名",
				h5Text: "歌手名",
				h6Text: "vip",
				h6OtherText: "10w+评论",
			},
		],
	},
];
for (let i = 0; i < partArr.length; i++) {
	partArr[i].partId = i;
	for (let j = 0; j < partArr[i].fifthArr.length; j++) {
		partArr[i].fifthArr[j].id = i;
		partArr[i].fifthArr[j].imgSrc = "http://p1.music.126.net/oJorrgJ3IotZUAbZkBMuFw==/109951167771736533.jpg?param=180y180";
	}
}
let commendIndex = 0;
const changCommendSong = (d, arr, id) => {
	const commendDom = document.querySelectorAll(`#${id} footer span`);
	if (d == 0) {
		commendIndex = Math.abs(commendIndex - 3) % arr.length;
	} else {
		commendIndex = (commendIndex + 3) % arr.length;
	}
	commendDom.forEach((e) => {
		e.style.transform = `translateX(${-commendIndex * 110}%)`;
	});
};
onMounted(() => {
	const choiceSpanDOM = document.querySelectorAll("#choiceFirstTab_Line footer span");

	for (let i = 0; i < choiceSecArr.length; i++) {
		choiceSpanDOM[i].style.background = `url(${choiceSecArr[i].src})`;
		choiceSpanDOM[i].style.backgroundSize = `cover`;
		choiceSpanDOM[i].style.backgroundPosition = `center`;
		choiceSpanDOM[i].childNodes[1].style.background = `${choiceSecArr[i].bgColor}`;
		choiceSpanDOM[i].addEventListener("mouseover", () => {
			choiceSpanDOM[i].childNodes[1].style.boxShadow = ` 0 -3rem 3rem -1px ${choiceSecArr[i].bgColor}`;
		});
		choiceSpanDOM[i].addEventListener("mouseout", () => {
			choiceSpanDOM[i].childNodes[1].style.boxShadow = ` none`;
		});
	}
});
</script>

<style lang="scss" scoped>
* {
	margin: 0;
	padding: 0;
}
#Recommend-C {
	width: 95%;
	height: 100%;
	display: flex;
	flex-direction: column;
	#choiceFirstTab_Line {
		display: flex;
		flex-shrink: 0;
		margin-top: 0.5rem;
		margin-left: 0.5rem;
		height: 50%;
		flex-wrap: wrap;
		svg:hover {
			color: #ff0000;
			cursor: pointer;
		}
		header {
			position: relative;
			width: 100%;
			height: 10%;
			display: flex;
			justify-content: space-between;
			align-items: center;
			h2 {
				position: absolute;
				top: -30%;
				z-index: 1;
				margin: 10px;
				&:hover {
					cursor: pointer;
					color: #ff0000;
				}
				&:nth-of-type(1) {
					left: 40%;
				}
				&:nth-of-type(2) {
					left: 61%;
				}
			}
		}
		footer {
			width: 100%;
			display: flex;
			height: 75%;
			align-items: center;
			span {
				position: relative;
				background-size: cover;
				background-position: center;
				width: 12%;
				flex-shrink: 0;
				height: 100%;
				padding: 0 20px;
				margin-left: 20px;
				border-radius: 10px;
				transition: 0.5s;
				h5 {
					margin: 0.2rem;
					padding-top: 0.3rem;
					text-align: right;
				}
				div {
					position: absolute;
					text-align: center;
					bottom: 0;
					left: 0;
					height: 20%;
					width: 100%;
					color: #ffffff;
					border-radius: 0 0 10px 10px;
					overflow: hidden; /* 溢出的部分隐藏 */
					text-shadow: -1px 1px 0 #000, 1px 1px 0 #000, 1px -1px 0 #000, -1px -1px 0 #000;
				}
				svg {
					display: none;
					transition: 0.5s;
				}
				&:hover {
					cursor: pointer;
				}
				&:hover svg {
					display: inline-block;
				}
				&:hover div {
					transition: 0.5s;
					height: 50%;
				}
				h4,
				ol {
					width: 95%;
					padding: 0 5px;
					font-size: 0.9rem;
				}
				ol {
					text-align: left;
					font-size: 0.7rem;
					white-space: nowrap; /* 文本强制不换行 */
					text-overflow: ellipsis; /* 文本溢出显示省略号 */
					overflow: hidden; /* 溢出的部分隐藏 */

					li {
						list-style-type: decimal; //显示数字
						list-style-position: inside;
					}
				}
			}
		}
	}
	.choiceFirstTab_MulPart {
		width: 99%;
		margin-left: 1%;
		margin-top: 3%;
		height: 60%;
		display: flex;
		flex-shrink: 0;
		flex-direction: column;
		.MP_Line {
			display: flex;
			flex-shrink: 0;
			height: 95%;
			flex-wrap: wrap;
			svg:hover {
				color: #ff0000;
				cursor: pointer;
			}
			header {
				position: relative;
				width: 100%;
				height: 10%;
				display: flex;
				justify-content: space-between;
				align-items: center;
				button {
					font-size: 1.5rem;
					position: absolute;
					background: transparent;
					top: -30%;
					z-index: 1;
					margin: 10px;
					color: #ffffff;
					border: transparent;
					&:hover {
						text-align: center;
						padding: 0 20px;
						transition: 1s;
						cursor: pointer;
						color: #ff0000;
						border-bottom: 1px solid red;
					}
					&:nth-of-type(1) {
						left: 30%;
					}
					&:nth-of-type(2) {
						left: 50%;
					}
				}
			}
			footer {
				width: 100%;
				display: flex;
				flex-wrap: wrap;
				height: 85%;
				flex-direction: column;
				justify-content: space-around;
				span {
					display: grid;
					margin-top: 1%;
					margin-left: 2%;
					border-radius: 10px;
					grid-template-columns: 20% 20% 25% 35%;
					grid-template-rows: 40% 30% 30%;
					width: 40%;
					height: 29%;

					&:hover {
						cursor: pointer;
						background: linear-gradient(to right, #144da8, #000);
					}
					&:hover div {
						width: 100%;
					}
					h4,
					h5,
					h6 {
						margin: 0 0 0 10px;
						transition: 0.5s;
						&:hover {
							cursor: pointer;
							color: #ffffff;
						}
					}
					h6 {
						color: rgb(0, 200, 255);
						width: auto;
						border-radius: 5px;
						padding: 5px;
						line-height: 15px;
						text-align: center;
					}
					h4 {
						grid-column: 2 / span 2;
						grid-row: 1 / span 1;
					}
					h5 {
						color: #b3acac;
						grid-column: 2 / span 2;
						grid-row: 2 / span 1;
					}
					h6:nth-of-type(1) {
						grid-column: 2 / span 1;
						border: 1px solid #0095ff;
						grid-row: 3 / span 1;
					}
					h6:nth-of-type(2) {
						background: linear-gradient(to bottom, #030e36, #01081a);
						grid-column: 3 / span 1;
						grid-row: 3 / span 1;
					}
					div {
						transition: 1s;
						width: 0;
						display: flex;
						justify-content: space-around;
						align-items: center;
						grid-column: 4 / span 1;
						grid-row: 1 / span 3;
					}
					img {
						width: 100%;
						height: 100%;
						border-radius: 10px;
						grid-column: 1 / span 1;
						grid-row: 1 / span 3;
					}
				}
			}
		}
	}
}
</style>
