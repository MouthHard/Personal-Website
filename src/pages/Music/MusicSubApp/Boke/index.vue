<template>
	<div id="BokeFirst">
		<div id="BokeFm">
			<h4>▁ ▂ ▃ ▄ ▅ ▆ ▇ █ 随身听FM █ ▇ ▆ ▅ ▄ ▃ ▂ ▁</h4>
			<div>
				<img :src="imgSrcFm" alt="" />
				<h3>{{ titleFm }}</h3>
				<h5>{{ listFm }}</h5>
				<h6>{{ numFm }}</h6>
			</div>
			<header>
				<div>
					<h5 v-for="item in fmARR" :key="item.id" :class="{ isFmActive: item.id == fmActive }" @click="handelToogel(item.id)">{{ item.text }}</h5>
				</div>
			</header>
			<footer>
				<button @click="changeFM(0)"></button>
				<h1></h1>
				<button @click="changeFM(1)"></button>
			</footer>
		</div>
		<div id="BokeList">
			<header>
				<h5 v-for="item in bokeListTags" :class="{ isListActive: item.id == listAct }" @click="clickList(item.id)">
					{{ item.text }}
				</h5>
				<button>查看更多</button>
			</header>
			<footer>
				<div v-show="item.id == listAct" v-for="item in bokeListTags" class="choiceSecondTabFooter">
					<span v-for="it in item.content" :key="it.id">
						<img :src="it.imgSrcList" alt="" />
						<h5>{{ it.listId }}</h5>
						<h6>{{ it.h6Text }}</h6>
					</span>
				</div>
			</footer>
		</div>
		<div id="BokeBtn">
			<button v-for="item in bokeBtnArr">{{ item }}</button>
		</div>
	</div>
	<div id="BokeSecond">
		<div class="BokeSecLine" v-for="item in BokeSecLineFooterArr" :key="item.idB">
			<header>
				<h3>{{ item.h3Text }}</h3>
				<svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 512 512">
					<path
						fill="currentColor"
						d="M256 48C141.31 48 48 141.31 48 256s93.31 208 208 208s208-93.31 208-208S370.69 48 256 48m120 182.15a8.62 8.62 0 0 1-8.62 8.62h-59.54a8.61 8.61 0 0 1-6.09-14.71l22.17-22.17l-5.6-6.51a87.38 87.38 0 1 0-62.94 148a87.55 87.55 0 0 0 82.42-58.25A16 16 0 1 1 368 295.8a119.4 119.4 0 1 1-112.62-159.18a118.34 118.34 0 0 1 86.36 36.95l.56.62l4.31 5l14.68-14.68a8.44 8.44 0 0 1 6-2.54a8.61 8.61 0 0 1 8.68 8.63Z" />
				</svg>
			</header>
			<footer>
				<span v-for="it in item.idBArr" :key="it.id">
					<h5>{{ it.playNum }}</h5>
					<div>
						<svg xmlns="http://www.w3.org/2000/svg" width="2rem" height="2rem" viewBox="0 0 24 24">
							<path
								fill="currentColor"
								d="M13 2.05v2c4.39.54 7.5 4.53 6.96 8.92c-.46 3.64-3.32 6.53-6.96 6.96v2c5.5-.55 9.5-5.43 8.95-10.93c-.45-4.75-4.22-8.5-8.95-8.97zM5.67 19.74A9.994 9.994 0 0 0 11 22v-2a8.002 8.002 0 0 1-3.9-1.63zm1.43-14c1.12-.9 2.47-1.48 3.9-1.68v-2c-1.95.19-3.81.94-5.33 2.2zM5.69 7.1L4.26 5.67A9.885 9.885 0 0 0 2.05 11h2c.19-1.42.75-2.77 1.64-3.9M4.06 13h-2c.2 1.96.97 3.81 2.21 5.33l1.42-1.43A8.002 8.002 0 0 1 4.06 13M10 16.5l6-4.5l-6-4.5z" />
						</svg>
						<h4>{{ it.playName }}</h4>
					</div>
				</span>
			</footer>
		</div>
		<div class="bokeMulPart" v-for="item in partArr" :key="item.partId">
			<div class="recFiveLine">
				<header>
					<h3>{{ item.title }}</h3>
					<svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 512 512">
						<path
							fill="currentColor"
							d="M256 48C141.31 48 48 141.31 48 256s93.31 208 208 208s208-93.31 208-208S370.69 48 256 48m120 182.15a8.62 8.62 0 0 1-8.62 8.62h-59.54a8.61 8.61 0 0 1-6.09-14.71l22.17-22.17l-5.6-6.51a87.38 87.38 0 1 0-62.94 148a87.55 87.55 0 0 0 82.42-58.25A16 16 0 1 1 368 295.8a119.4 119.4 0 1 1-112.62-159.18a118.34 118.34 0 0 1 86.36 36.95l.56.62l4.31 5l14.68-14.68a8.44 8.44 0 0 1 6-2.54a8.61 8.61 0 0 1 8.68 8.63Z" />
					</svg>
				</header>
				<footer>
					<span v-for="it in item.fifthArr" :key="it.id">
						<svg class="FivePlayBtn" xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
							<path
								fill="currentColor"
								fill-rule="evenodd"
								d="M1 12C1 5.925 5.925 1 12 1s11 4.925 11 11s-4.925 11-11 11S1 18.075 1 12m8.528-4.882a1 1 0 0 1 1.027.05l6 4a1 1 0 0 1 0 1.664l-6 4A1 1 0 0 1 9 16V8a1 1 0 0 1 .528-.882"
								clip-rule="evenodd" />
						</svg>
						<img :src="it.imgSrc" alt="" />
						<h4>{{ it.h4Text }}</h4>
						<h5>{{ it.h5Text }}</h5>
						<h6>{{ it.h6Text }}</h6>
						<h6>{{ it.h6OtherText }}</h6>
						<div>
							<svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 32 32">
								<path fill="currentColor" d="M15 4v16.563L9.719 15.28L8.28 16.72l7 7l.719.687l.719-.687l7-7l-1.438-1.438l-5.28 5.28V4zM7 26v2h18v-2z" />
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
    import { onMounted, ref } from "vue";

    let listAct = ref(0);
    let fmActive = ref(0);
    let imgSrcFm = ref("https://i0.hdslb.com/bfs/article/86cdd7bfa8a596da0983fa0112c554a0cfaae684.jpg@progressive.webp");
    let titleFm = ref("主播|《傲慢与偏见》：内心越强大的人，心性越沉稳");
    let listFm = ref("播单：晚间读书");
    let numFm = ref("123842次播放");
    const bokeBtnArr = ["排行榜", "创作翻唱", "情感", "咨询", "人文历史", "脱口秀", "更多 ▼"];
    const partArr = [
        {
            partId: 0,
            title: "◤ 新闻咨询 ",
            fifthArr: [
                {
                    id: 0,
                    imgSrc: "http://img.netbian.com/file/2015/0731/d70f74c0680a0603dcf5db47e809088f.jpg",
                    h4Text: "歌曲名",
                    h5Text: "歌手名",
                    h6Text: "vip",
                    h6OtherText: "10w+评论",
                },
                {
                    id: 1,
                    imgSrc: "http://img.netbian.com/file/2015/0731/d70f74c0680a0603dcf5db47e809088f.jpg",
                    h4Text: "歌曲名",
                    h5Text: "歌手名",
                    h6Text: "vip",
                    h6OtherText: "10w+评论",
                },
                {
                    id: 2,
                    imgSrc: "http://img.netbian.com/file/2015/0731/d70f74c0680a0603dcf5db47e809088f.jpg",
                    h4Text: "歌曲名",
                    h5Text: "歌手名",
                    h6Text: "vip",
                    h6OtherText: "10w+评论",
                },
                {
                    id: 3,
                    imgSrc: "http://img.netbian.com/file/2015/0731/d70f74c0680a0603dcf5db47e809088f.jpg",
                    h4Text: "歌曲名",
                    h5Text: "歌手名",
                    h6Text: "vip",
                    h6OtherText: "10w+评论",
                },
                {
                    id: 4,
                    imgSrc: "http://img.netbian.com/file/2015/0731/d70f74c0680a0603dcf5db47e809088f.jpg",
                    h4Text: "歌曲名",
                    h5Text: "歌手名",
                    h6Text: "vip",
                    h6OtherText: "10w+评论",
                },
                {
                    id: 5,
                    imgSrc: "http://img.netbian.com/file/2015/0731/d70f74c0680a0603dcf5db47e809088f.jpg",
                    h4Text: "歌曲名",
                    h5Text: "歌手名",
                    h6Text: "vip",
                    h6OtherText: "10w+评论",
                }
            ],
        },
        {
            partId: 1,
            title: "◤ 情感",
            fifthArr: [
                {
                    id: 0,
                    imgSrc: "http://img.netbian.com/file/2015/0731/d70f74c0680a0603dcf5db47e809088f.jpg",
                    h4Text: "歌曲名",
                    h5Text: "歌手名",
                    h6Text: "vip",
                    h6OtherText: "10w+评论",
                },
                {
                    id: 1,
                    imgSrc: "http://img.netbian.com/file/2015/0731/d70f74c0680a0603dcf5db47e809088f.jpg",
                    h4Text: "歌曲名",
                    h5Text: "歌手名",
                    h6Text: "vip",
                    h6OtherText: "10w+评论",
                },
                {
                    id: 2,
                    imgSrc: "http://img.netbian.com/file/2015/0731/d70f74c0680a0603dcf5db47e809088f.jpg",
                    h4Text: "歌曲名",
                    h5Text: "歌手名",
                    h6Text: "vip",
                    h6OtherText: "10w+评论",
                },
                {
                    id: 3,
                    imgSrc: "http://img.netbian.com/file/2015/0731/d70f74c0680a0603dcf5db47e809088f.jpg",
                    h4Text: "歌曲名",
                    h5Text: "歌手名",
                    h6Text: "vip",
                    h6OtherText: "10w+评论",
                },
                {
                    id: 4,
                    imgSrc: "http://img.netbian.com/file/2015/0731/d70f74c0680a0603dcf5db47e809088f.jpg",
                    h4Text: "歌曲名",
                    h5Text: "歌手名",
                    h6Text: "vip",
                    h6OtherText: "10w+评论",
                },
                {
                    id: 5,
                    imgSrc: "http://img.netbian.com/file/2015/0731/d70f74c0680a0603dcf5db47e809088f.jpg",
                    h4Text: "歌曲名",
                    h5Text: "歌手名",
                    h6Text: "vip",
                    h6OtherText: "10w+评论",
                },
            ],
        },
        {
            partId: 2,
            title: "◤ 本周上新",
            fifthArr: [
                {
                    id: 0,
                    imgSrc: "http://img.netbian.com/file/2015/0731/d70f74c0680a0603dcf5db47e809088f.jpg",
                    h4Text: "歌曲名",
                    h5Text: "歌手名",
                    h6Text: "vip",
                    h6OtherText: "10w+评论",
                },
                {
                    id: 1,
                    imgSrc: "http://img.netbian.com/file/2015/0731/d70f74c0680a0603dcf5db47e809088f.jpg",
                    h4Text: "歌曲名",
                    h5Text: "歌手名",
                    h6Text: "vip",
                    h6OtherText: "10w+评论",
                },
                {
                    id: 2,
                    imgSrc: "http://img.netbian.com/file/2015/0731/d70f74c0680a0603dcf5db47e809088f.jpg",
                    h4Text: "歌曲名",
                    h5Text: "歌手名",
                    h6Text: "vip",
                    h6OtherText: "10w+评论",
                },
                {
                    id: 3,
                    imgSrc: "http://img.netbian.com/file/2015/0731/d70f74c0680a0603dcf5db47e809088f.jpg",
                    h4Text: "歌曲名",
                    h5Text: "歌手名",
                    h6Text: "vip",
                    h6OtherText: "10w+评论",
                },
                {
                    id: 4,
                    imgSrc: "http://img.netbian.com/file/2015/0731/d70f74c0680a0603dcf5db47e809088f.jpg",
                    h4Text: "歌曲名",
                    h5Text: "歌手名",
                    h6Text: "vip",
                    h6OtherText: "10w+评论",
                },
                {
                    id: 5,
                    imgSrc: "http://img.netbian.com/file/2015/0731/d70f74c0680a0603dcf5db47e809088f.jpg",
                    h4Text: "歌曲名",
                    h5Text: "歌手名",
                    h6Text: "vip",
                    h6OtherText: "10w+评论",
                },
            ],
        },
        {
            partId: 3,
            title: "◤ 生活故事",
            fifthArr: [
                {
                    id: 0,
                    imgSrc: "http://img.netbian.com/file/2015/0731/d70f74c0680a0603dcf5db47e809088f.jpg",
                    h4Text: "歌曲名",
                    h5Text: "歌手名",
                    h6Text: "vip",
                    h6OtherText: "10w+评论",
                },
                {
                    id: 1,
                    imgSrc: "http://img.netbian.com/file/2015/0731/d70f74c0680a0603dcf5db47e809088f.jpg",
                    h4Text: "歌曲名",
                    h5Text: "歌手名",
                    h6Text: "vip",
                    h6OtherText: "10w+评论",
                },
                {
                    id: 2,
                    imgSrc: "http://img.netbian.com/file/2015/0731/d70f74c0680a0603dcf5db47e809088f.jpg",
                    h4Text: "歌曲名",
                    h5Text: "歌手名",
                    h6Text: "vip",
                    h6OtherText: "10w+评论",
                },
                {
                    id: 3,
                    imgSrc: "http://img.netbian.com/file/2015/0731/d70f74c0680a0603dcf5db47e809088f.jpg",
                    h4Text: "歌曲名",
                    h5Text: "歌手名",
                    h6Text: "vip",
                    h6OtherText: "10w+评论",
                },
                {
                    id: 4,
                    imgSrc: "http://img.netbian.com/file/2015/0731/d70f74c0680a0603dcf5db47e809088f.jpg",
                    h4Text: "歌曲名",
                    h5Text: "歌手名",
                    h6Text: "vip",
                    h6OtherText: "10w+评论",
                },
                {
                    id: 5,
                    imgSrc: "http://img.netbian.com/file/2015/0731/d70f74c0680a0603dcf5db47e809088f.jpg",
                    h4Text: "歌曲名",
                    h5Text: "歌手名",
                    h6Text: "vip",
                    h6OtherText: "10w+评论",
                },
            ],
        },
        {
            partId: 4,
            title: "◤ 脱口秀",
            fifthArr: [
                {
                    id: 0,
                    imgSrc: "http://img.netbian.com/file/2015/0731/d70f74c0680a0603dcf5db47e809088f.jpg",
                    h4Text: "歌曲名",
                    h5Text: "歌手名",
                    h6Text: "vip",
                    h6OtherText: "10w+评论",
                },
                {
                    id: 1,
                    imgSrc: "http://img.netbian.com/file/2015/0731/d70f74c0680a0603dcf5db47e809088f.jpg",
                    h4Text: "歌曲名",
                    h5Text: "歌手名",
                    h6Text: "vip",
                    h6OtherText: "10w+评论",
                },
                {
                    id: 2,
                    imgSrc: "http://img.netbian.com/file/2015/0731/d70f74c0680a0603dcf5db47e809088f.jpg",
                    h4Text: "歌曲名",
                    h5Text: "歌手名",
                    h6Text: "vip",
                    h6OtherText: "10w+评论",
                },
                {
                    id: 3,
                    imgSrc: "http://img.netbian.com/file/2015/0731/d70f74c0680a0603dcf5db47e809088f.jpg",
                    h4Text: "歌曲名",
                    h5Text: "歌手名",
                    h6Text: "vip",
                    h6OtherText: "10w+评论",
                },
                {
                    id: 4,
                    imgSrc: "http://img.netbian.com/file/2015/0731/d70f74c0680a0603dcf5db47e809088f.jpg",
                    h4Text: "歌曲名",
                    h5Text: "歌手名",
                    h6Text: "vip",
                    h6OtherText: "10w+评论",
                },
                {
                    id: 5,
                    imgSrc: "http://img.netbian.com/file/2015/0731/d70f74c0680a0603dcf5db47e809088f.jpg",
                    h4Text: "歌曲名",
                    h5Text: "歌手名",
                    h6Text: "vip",
                    h6OtherText: "10w+评论",
                },
            ],
        },
    ];
    const BokeSecLineFooterArr = [
        {
            idB: 0,
            h3Text: "猜你喜欢 ◢",
            idBArr: [
                {
                    id: 0,
                    playNum: "▶ 1.1亿",
                    playName: "每日推荐，从漫漫长夜听起",
                    bg: "http://img.netbian.com/file/2015/0731/d70f74c0680a0603dcf5db47e809088f.jpg",
                    bgColor: "#009895",
                },
                {
                    id: 1,
                    playNum: "▶ 1.23亿",
                    playName: "今天从《Mystery of Love》听起|私人雷达",
                    bg: "https://b.zol-img.com.cn/sjbizhi/images/11/1080x1920/1592967802496.jpg",
                    bgColor: "#998E7C",
                },
                {
                    id: 2,
                    playNum: "▶ 851.6万",
                    playName: "也许我们应该去更远的地方看看",
                    bg: "https://sjbz-fd.zol-img.com.cn/t_s1080x1920c/g5/M00/00/02/ChMkJlfJVKaIJ7UkAEC_FYEJoMwAAU9ygMTXtwAQL8t602.jpg",
                    bgColor: "#FDD56C",
                },
                {
                    id: 3,
                    playNum: "▶ 70万",
                    playName: "纯音乐 | 星空之下，绿草至上",
                    bg: "https://pic4.zhimg.com/v2-b1c287fc4ae0faa5deb36c233230b956_r.jpg?source=1940ef5c",
                    bgColor: "#27416A",
                },
                {
                    id: 4,
                    playNum: "▶ 5401",
                    playName: "秋日之歌",
                    bg: "https://ts1.cn.mm.bing.net/th/id/R-C.b9f86c9bc2216285a504d16b7085c085?rik=B3z9rRnZUQfqrw&riu=http%3a%2f%2fpic.zsucai.com%2ffiles%2f2013%2f0923%2fqiutianshuye8.jpg&ehk=ASq8pVlhKb6ED%2bNRexj7tJghtsR6EX74XbCcsdccf6Y%3d&risl=&pid=ImgRaw&r=0",
                    bgColor: "#B8653D",
                },
            ],
        },
        {
            idB: 1,
            h3Text: "创作翻唱 ◢",
            idBArr: [
                {
                    id: 0,
                    playNum: "▶ 1.1亿",
                    playName: "每日推荐，从漫漫长夜听起",
                    bg: "http://img.netbian.com/file/2015/0731/d70f74c0680a0603dcf5db47e809088f.jpg",
                    bgColor: "#009895",
                },
                {
                    id: 1,
                    playNum: "▶ 1.23亿",
                    playName: "今天从《Mystery of Love》听起|私人雷达",
                    bg: "https://b.zol-img.com.cn/sjbizhi/images/11/1080x1920/1592967802496.jpg",
                    bgColor: "#998E7C",
                },
                {
                    id: 2,
                    playNum: "▶ 851.6万",
                    playName: "也许我们应该去更远的地方看看",
                    bg: "https://sjbz-fd.zol-img.com.cn/t_s1080x1920c/g5/M00/00/02/ChMkJlfJVKaIJ7UkAEC_FYEJoMwAAU9ygMTXtwAQL8t602.jpg",
                    bgColor: "#FDD56C",
                },
                {
                    id: 3,
                    playNum: "▶ 70万",
                    playName: "纯音乐 | 星空之下，绿草至上",
                    bg: "https://pic4.zhimg.com/v2-b1c287fc4ae0faa5deb36c233230b956_r.jpg?source=1940ef5c",
                    bgColor: "#27416A",
                },
                {
                    id: 4,
                    playNum: "▶ 5401",
                    playName: "秋日之歌",
                    bg: "https://ts1.cn.mm.bing.net/th/id/R-C.b9f86c9bc2216285a504d16b7085c085?rik=B3z9rRnZUQfqrw&riu=http%3a%2f%2fpic.zsucai.com%2ffiles%2f2013%2f0923%2fqiutianshuye8.jpg&ehk=ASq8pVlhKb6ED%2bNRexj7tJghtsR6EX74XbCcsdccf6Y%3d&risl=&pid=ImgRaw&r=0",
                    bgColor: "#B8653D",
                },
            ],
        },
        {
            idB: 2,
            h3Text: "电影 ◢",
            idBArr: [
                {
                    id: 0,
                    playNum: "▶ 1.1亿",
                    playName: "每日推荐，从漫漫长夜听起",
                    bg: "http://img.netbian.com/file/2015/0731/d70f74c0680a0603dcf5db47e809088f.jpg",
                    bgColor: "#009895",
                },
                {
                    id: 1,
                    playNum: "▶ 1.23亿",
                    playName: "今天从《Mystery of Love》听起|私人雷达",
                    bg: "https://b.zol-img.com.cn/sjbizhi/images/11/1080x1920/1592967802496.jpg",
                    bgColor: "#998E7C",
                },
                {
                    id: 2,
                    playNum: "▶ 851.6万",
                    playName: "也许我们应该去更远的地方看看",
                    bg: "https://sjbz-fd.zol-img.com.cn/t_s1080x1920c/g5/M00/00/02/ChMkJlfJVKaIJ7UkAEC_FYEJoMwAAU9ygMTXtwAQL8t602.jpg",
                    bgColor: "#FDD56C",
                },
                {
                    id: 3,
                    playNum: "▶ 70万",
                    playName: "纯音乐 | 星空之下，绿草至上",
                    bg: "https://pic4.zhimg.com/v2-b1c287fc4ae0faa5deb36c233230b956_r.jpg?source=1940ef5c",
                    bgColor: "#27416A",
                },
                {
                    id: 4,
                    playNum: "▶ 5401",
                    playName: "秋日之歌",
                    bg: "https://ts1.cn.mm.bing.net/th/id/R-C.b9f86c9bc2216285a504d16b7085c085?rik=B3z9rRnZUQfqrw&riu=http%3a%2f%2fpic.zsucai.com%2ffiles%2f2013%2f0923%2fqiutianshuye8.jpg&ehk=ASq8pVlhKb6ED%2bNRexj7tJghtsR6EX74XbCcsdccf6Y%3d&risl=&pid=ImgRaw&r=0",
                    bgColor: "#B8653D",
                },
            ],
        },
        {
            idB: 3,
            h3Text: "历史 ◢",
            idBArr: [
                {
                    id: 0,
                    playNum: "▶ 1.1亿",
                    playName: "每日推荐，从漫漫长夜听起",
                    bg: "http://img.netbian.com/file/2015/0731/d70f74c0680a0603dcf5db47e809088f.jpg",
                    bgColor: "#009895",
                },
                {
                    id: 1,
                    playNum: "▶ 1.23亿",
                    playName: "今天从《Mystery of Love》听起|私人雷达",
                    bg: "https://b.zol-img.com.cn/sjbizhi/images/11/1080x1920/1592967802496.jpg",
                    bgColor: "#998E7C",
                },
                {
                    id: 2,
                    playNum: "▶ 851.6万",
                    playName: "也许我们应该去更远的地方看看",
                    bg: "https://sjbz-fd.zol-img.com.cn/t_s1080x1920c/g5/M00/00/02/ChMkJlfJVKaIJ7UkAEC_FYEJoMwAAU9ygMTXtwAQL8t602.jpg",
                    bgColor: "#FDD56C",
                },
                {
                    id: 3,
                    playNum: "▶ 70万",
                    playName: "纯音乐 | 星空之下，绿草至上",
                    bg: "https://pic4.zhimg.com/v2-b1c287fc4ae0faa5deb36c233230b956_r.jpg?source=1940ef5c",
                    bgColor: "#27416A",
                },
                {
                    id: 4,
                    playNum: "▶ 5401",
                    playName: "秋日之歌",
                    bg: "https://ts1.cn.mm.bing.net/th/id/R-C.b9f86c9bc2216285a504d16b7085c085?rik=B3z9rRnZUQfqrw&riu=http%3a%2f%2fpic.zsucai.com%2ffiles%2f2013%2f0923%2fqiutianshuye8.jpg&ehk=ASq8pVlhKb6ED%2bNRexj7tJghtsR6EX74XbCcsdccf6Y%3d&risl=&pid=ImgRaw&r=0",
                    bgColor: "#B8653D",
                },
            ],
        },
        {
            idB: 4,
            h3Text: "故事 ◢",
            idBArr: [
                {
                    id: 0,
                    playNum: "▶ 1.1亿",
                    playName: "每日推荐，从漫漫长夜听起",
                    bg: "http://img.netbian.com/file/2015/0731/d70f74c0680a0603dcf5db47e809088f.jpg",
                    bgColor: "#009895",
                },
                {
                    id: 1,
                    playNum: "▶ 1.23亿",
                    playName: "今天从《Mystery of Love》听起|私人雷达",
                    bg: "https://b.zol-img.com.cn/sjbizhi/images/11/1080x1920/1592967802496.jpg",
                    bgColor: "#998E7C",
                },
                {
                    id: 2,
                    playNum: "▶ 851.6万",
                    playName: "也许我们应该去更远的地方看看",
                    bg: "https://sjbz-fd.zol-img.com.cn/t_s1080x1920c/g5/M00/00/02/ChMkJlfJVKaIJ7UkAEC_FYEJoMwAAU9ygMTXtwAQL8t602.jpg",
                    bgColor: "#FDD56C",
                },
                {
                    id: 3,
                    playNum: "▶ 70万",
                    playName: "纯音乐 | 星空之下，绿草至上",
                    bg: "https://pic4.zhimg.com/v2-b1c287fc4ae0faa5deb36c233230b956_r.jpg?source=1940ef5c",
                    bgColor: "#27416A",
                },
                {
                    id: 4,
                    playNum: "▶ 5401",
                    playName: "秋日之歌",
                    bg: "https://ts1.cn.mm.bing.net/th/id/R-C.b9f86c9bc2216285a504d16b7085c085?rik=B3z9rRnZUQfqrw&riu=http%3a%2f%2fpic.zsucai.com%2ffiles%2f2013%2f0923%2fqiutianshuye8.jpg&ehk=ASq8pVlhKb6ED%2bNRexj7tJghtsR6EX74XbCcsdccf6Y%3d&risl=&pid=ImgRaw&r=0",
                    bgColor: "#B8653D",
                },
            ],
        },
        {
            idB: 5,
            h3Text: "电音 ◢",
            idBArr: [
                {
                    id: 0,
                    playNum: "▶ 1.1亿",
                    playName: "每日推荐，从漫漫长夜听起",
                    bg: "http://img.netbian.com/file/2015/0731/d70f74c0680a0603dcf5db47e809088f.jpg",
                    bgColor: "#009895",
                },
                {
                    id: 1,
                    playNum: "▶ 1.23亿",
                    playName: "今天从《Mystery of Love》听起|私人雷达",
                    bg: "https://b.zol-img.com.cn/sjbizhi/images/11/1080x1920/1592967802496.jpg",
                    bgColor: "#998E7C",
                },
                {
                    id: 2,
                    playNum: "▶ 851.6万",
                    playName: "也许我们应该去更远的地方看看",
                    bg: "https://sjbz-fd.zol-img.com.cn/t_s1080x1920c/g5/M00/00/02/ChMkJlfJVKaIJ7UkAEC_FYEJoMwAAU9ygMTXtwAQL8t602.jpg",
                    bgColor: "#FDD56C",
                },
                {
                    id: 3,
                    playNum: "▶ 70万",
                    playName: "纯音乐 | 星空之下，绿草至上",
                    bg: "https://pic4.zhimg.com/v2-b1c287fc4ae0faa5deb36c233230b956_r.jpg?source=1940ef5c",
                    bgColor: "#27416A",
                },
                {
                    id: 4,
                    playNum: "▶ 5401",
                    playName: "秋日之歌",
                    bg: "https://ts1.cn.mm.bing.net/th/id/R-C.b9f86c9bc2216285a504d16b7085c085?rik=B3z9rRnZUQfqrw&riu=http%3a%2f%2fpic.zsucai.com%2ffiles%2f2013%2f0923%2fqiutianshuye8.jpg&ehk=ASq8pVlhKb6ED%2bNRexj7tJghtsR6EX74XbCcsdccf6Y%3d&risl=&pid=ImgRaw&r=0",
                    bgColor: "#B8653D",
                },
            ],
        },
        {
            idB: 6,
            h3Text: "有声书 ◢",
            idBArr: [
                {
                    id: 0,
                    playNum: "▶ 1.1亿",
                    playName: "每日推荐，从漫漫长夜听起",
                    bg: "http://img.netbian.com/file/2015/0731/d70f74c0680a0603dcf5db47e809088f.jpg",
                    bgColor: "#009895",
                },
                {
                    id: 1,
                    playNum: "▶ 1.23亿",
                    playName: "今天从《Mystery of Love》听起|私人雷达",
                    bg: "https://b.zol-img.com.cn/sjbizhi/images/11/1080x1920/1592967802496.jpg",
                    bgColor: "#998E7C",
                },
                {
                    id: 2,
                    playNum: "▶ 851.6万",
                    playName: "也许我们应该去更远的地方看看",
                    bg: "https://sjbz-fd.zol-img.com.cn/t_s1080x1920c/g5/M00/00/02/ChMkJlfJVKaIJ7UkAEC_FYEJoMwAAU9ygMTXtwAQL8t602.jpg",
                    bgColor: "#FDD56C",
                },
                {
                    id: 3,
                    playNum: "▶ 70万",
                    playName: "纯音乐 | 星空之下，绿草至上",
                    bg: "https://pic4.zhimg.com/v2-b1c287fc4ae0faa5deb36c233230b956_r.jpg?source=1940ef5c",
                    bgColor: "#27416A",
                },
                {
                    id: 4,
                    playNum: "▶ 5401",
                    playName: "秋日之歌",
                    bg: "https://ts1.cn.mm.bing.net/th/id/R-C.b9f86c9bc2216285a504d16b7085c085?rik=B3z9rRnZUQfqrw&riu=http%3a%2f%2fpic.zsucai.com%2ffiles%2f2013%2f0923%2fqiutianshuye8.jpg&ehk=ASq8pVlhKb6ED%2bNRexj7tJghtsR6EX74XbCcsdccf6Y%3d&risl=&pid=ImgRaw&r=0",
                    bgColor: "#B8653D",
                },
            ],
        },
        {
            idB: 7,
            h3Text: "相声 ◢",
            idBArr: [
                {
                    id: 0,
                    playNum: "▶ 1.1亿",
                    playName: "每日推荐，从漫漫长夜听起",
                    bg: "http://img.netbian.com/file/2015/0731/d70f74c0680a0603dcf5db47e809088f.jpg",
                    bgColor: "#009895",
                },
                {
                    id: 1,
                    playNum: "▶ 1.23亿",
                    playName: "今天从《Mystery of Love》听起|私人雷达",
                    bg: "https://b.zol-img.com.cn/sjbizhi/images/11/1080x1920/1592967802496.jpg",
                    bgColor: "#998E7C",
                },
                {
                    id: 2,
                    playNum: "▶ 851.6万",
                    playName: "也许我们应该去更远的地方看看",
                    bg: "https://sjbz-fd.zol-img.com.cn/t_s1080x1920c/g5/M00/00/02/ChMkJlfJVKaIJ7UkAEC_FYEJoMwAAU9ygMTXtwAQL8t602.jpg",
                    bgColor: "#FDD56C",
                },
                {
                    id: 3,
                    playNum: "▶ 70万",
                    playName: "纯音乐 | 星空之下，绿草至上",
                    bg: "https://pic4.zhimg.com/v2-b1c287fc4ae0faa5deb36c233230b956_r.jpg?source=1940ef5c",
                    bgColor: "#27416A",
                },
                {
                    id: 4,
                    playNum: "▶ 5401",
                    playName: "秋日之歌",
                    bg: "https://ts1.cn.mm.bing.net/th/id/R-C.b9f86c9bc2216285a504d16b7085c085?rik=B3z9rRnZUQfqrw&riu=http%3a%2f%2fpic.zsucai.com%2ffiles%2f2013%2f0923%2fqiutianshuye8.jpg&ehk=ASq8pVlhKb6ED%2bNRexj7tJghtsR6EX74XbCcsdccf6Y%3d&risl=&pid=ImgRaw&r=0",
                    bgColor: "#B8653D",
                },
            ],
        },
        {
            idB: 0,
            h3Text: "广播剧 ◢",
            idBArr: [
                {
                    id: 0,
                    playNum: "▶ 1.1亿",
                    playName: "每日推荐，从漫漫长夜听起",
                    bg: "http://img.netbian.com/file/2015/0731/d70f74c0680a0603dcf5db47e809088f.jpg",
                    bgColor: "#009895",
                },
                {
                    id: 1,
                    playNum: "▶ 1.23亿",
                    playName: "今天从《Mystery of Love》听起|私人雷达",
                    bg: "https://b.zol-img.com.cn/sjbizhi/images/11/1080x1920/1592967802496.jpg",
                    bgColor: "#998E7C",
                },
                {
                    id: 2,
                    playNum: "▶ 851.6万",
                    playName: "也许我们应该去更远的地方看看",
                    bg: "https://sjbz-fd.zol-img.com.cn/t_s1080x1920c/g5/M00/00/02/ChMkJlfJVKaIJ7UkAEC_FYEJoMwAAU9ygMTXtwAQL8t602.jpg",
                    bgColor: "#FDD56C",
                },
                {
                    id: 3,
                    playNum: "▶ 70万",
                    playName: "纯音乐 | 星空之下，绿草至上",
                    bg: "https://pic4.zhimg.com/v2-b1c287fc4ae0faa5deb36c233230b956_r.jpg?source=1940ef5c",
                    bgColor: "#27416A",
                },
                {
                    id: 4,
                    playNum: "▶ 5401",
                    playName: "秋日之歌",
                    bg: "https://ts1.cn.mm.bing.net/th/id/R-C.b9f86c9bc2216285a504d16b7085c085?rik=B3z9rRnZUQfqrw&riu=http%3a%2f%2fpic.zsucai.com%2ffiles%2f2013%2f0923%2fqiutianshuye8.jpg&ehk=ASq8pVlhKb6ED%2bNRexj7tJghtsR6EX74XbCcsdccf6Y%3d&risl=&pid=ImgRaw&r=0",
                    bgColor: "#B8653D",
                },
            ],
        },
        {
            idB: 9,
            h3Text: "娱乐 ◢",
            idBArr: [
                {
                    id: 0,
                    playNum: "▶ 1.1亿",
                    playName: "每日推荐，从漫漫长夜听起",
                    bg: "http://img.netbian.com/file/2015/0731/d70f74c0680a0603dcf5db47e809088f.jpg",
                    bgColor: "#009895",
                },
                {
                    id: 1,
                    playNum: "▶ 1.23亿",
                    playName: "今天从《Mystery of Love》听起|私人雷达",
                    bg: "https://b.zol-img.com.cn/sjbizhi/images/11/1080x1920/1592967802496.jpg",
                    bgColor: "#998E7C",
                },
                {
                    id: 2,
                    playNum: "▶ 851.6万",
                    playName: "也许我们应该去更远的地方看看",
                    bg: "https://sjbz-fd.zol-img.com.cn/t_s1080x1920c/g5/M00/00/02/ChMkJlfJVKaIJ7UkAEC_FYEJoMwAAU9ygMTXtwAQL8t602.jpg",
                    bgColor: "#FDD56C",
                },
                {
                    id: 3,
                    playNum: "▶ 70万",
                    playName: "纯音乐 | 星空之下，绿草至上",
                    bg: "https://pic4.zhimg.com/v2-b1c287fc4ae0faa5deb36c233230b956_r.jpg?source=1940ef5c",
                    bgColor: "#27416A",
                },
                {
                    id: 4,
                    playNum: "▶ 5401",
                    playName: "秋日之歌",
                    bg: "https://ts1.cn.mm.bing.net/th/id/R-C.b9f86c9bc2216285a504d16b7085c085?rik=B3z9rRnZUQfqrw&riu=http%3a%2f%2fpic.zsucai.com%2ffiles%2f2013%2f0923%2fqiutianshuye8.jpg&ehk=ASq8pVlhKb6ED%2bNRexj7tJghtsR6EX74XbCcsdccf6Y%3d&risl=&pid=ImgRaw&r=0",
                    bgColor: "#B8653D",
                },
            ],
        },
    ];
    const fmARR = [
        {
            id: 0,
            text: "听见好书",
            bgcolor: "#703d3d",
            imgSrc: "https://i0.hdslb.com/bfs/article/86cdd7bfa8a596da0983fa0112c554a0cfaae684.jpg@progressive.webp",
            title: "主播 |《傲慢与偏见》：内心越强大的人，心性越沉稳",
            list: "播单：晚间读书",
            num: "123842次播放",
        },
        {
            id: 1,
            text: "历史揭秘",
            bgcolor: "#8e783c",
            imgSrc: "http://p1.music.126.net/aPRt3wBunudMnbKyPXfXAQ==/109951169439997418.jpg?imageView&quality=89",
            title: "诸葛亮，独木难撑益州地",
            list: "播单：历史人文",
            num: "33.1w次播放",
        },
        {
            id: 2,
            text: "情感赫兹",
            bgcolor: "#1c7c5f",
            imgSrc: "https://i0.hdslb.com/bfs/article/7959a846e02699f2421fb1f79ef60c620c7f1f9d.png@1256w_708h_!web-article-pic.webp",
            title: "看看你和他/她是否仍然互相喜欢",
            list: "播单：清晨一读",
            num: "2456次播放",
        },
        {
            id: 3,
            text: "英语美文",
            bgcolor: "#5e9b25",
            imgSrc: "http://p1.music.126.net/qKWuuYVN2XxJ-ASkOF1zKA==/109951169438953008.jpg?imageView&quality=89",
            title: "雅思托福日常练习",
            list: "播单：每日知识",
            num: "1.3w次播放",
        },
        {
            id: 4,
            text: "真实故事",
            bgcolor: "#571c7c",
            imgSrc: "http://p1.music.126.net/ZzzqXVglB-aEIoTku2GBSw==/109951169438946146.jpg?imageView&quality=89",
            title: "深夜故事会 —— 母猪为何排队下水",
            list: "播单：每周选读",
            num: "5900次播放",
        },
    ];
    const bokeListTags = [
        {
            id: 0,
            text: "高分必听",
            bg: "#460404",
            content: [
                {
                    listId: 1,
                    imgSrcList:
                        "https://ts1.cn.mm.bing.net/th/id/R-C.b3c68ef9de1109b0d020e22bc2aacf40?rik=H9R9l7dvJP9Kbw&riu=http%3a%2f%2fpic.bizhi360.com%2fbbpic%2f89%2f8989.jpg&ehk=VyIdtYriq3lSqrO3x0MHd5IyxYaw8jZUCKZbHNtvewU%3d&risl=&pid=ImgRaw&r=0",
                    h6Text: "睡前小故事",
                    h6Color: "#34872d",
                },
                {
                    listId: 2,
                    imgSrcList: "https://tse1-mm.cn.bing.net/th/id/OIP-C.3kYZHISr9w-BGxmo5VKp-wHaFj?w=247&h=185&c=7&r=0&o=5&dpr=1.3&pid=1.7",
                    h6Text: "xxx",
                    h6Color: "#122c6d",
                },
                {
                    listId: 3,
                    imgSrcList: "https://tse2-mm.cn.bing.net/th/id/OIP-C.BGwUAGiZaZWWyQSf1AHvdAAAAA?w=331&h=182&c=7&r=0&o=5&dpr=1.3&pid=1.7",
                    h6Text: "ABC",
                    h6Color: "#7e9040",
                },
                {
                    listId: 4,
                    imgSrcList: "https://tse2-mm.cn.bing.net/th/id/OIP-C.BGwUAGiZaZWWyQSf1AHvdAAAAA?w=331&h=182&c=7&r=0&o=5&dpr=1.3&pid=1.7",
                    h6Text: "ABC",
                    h6Color: "#833d1f",
                },
            ],
        },
        {
            id: 1,
            text: "今日最热",
            bg: "#061f47",
            content: [
                {
                    listId: 1,
                    imgSrcList:
                        "https://ts1.cn.mm.bing.net/th/id/R-C.b3c68ef9de1109b0d020e22bc2aacf40?rik=H9R9l7dvJP9Kbw&riu=http%3a%2f%2fpic.bizhi360.com%2fbbpic%2f89%2f8989.jpg&ehk=VyIdtYriq3lSqrO3x0MHd5IyxYaw8jZUCKZbHNtvewU%3d&risl=&pid=ImgRaw&r=0",
                    h6Text: "睡前小故事",
                    h6Color: "#622059",
                },
                {
                    listId: 2,
                    imgSrcList: "https://tse1-mm.cn.bing.net/th/id/OIP-C.3kYZHISr9w-BGxmo5VKp-wHaFj?w=247&h=185&c=7&r=0&o=5&dpr=1.3&pid=1.7",
                    h6Text: "xxx",
                    h6Color: "#373059",
                },
                {
                    listId: 3,
                    imgSrcList: "https://tse2-mm.cn.bing.net/th/id/OIP-C.BGwUAGiZaZWWyQSf1AHvdAAAAA?w=331&h=182&c=7&r=0&o=5&dpr=1.3&pid=1.7",
                    h6Text: "ABC",
                    h6Color: "#1a654a",
                },
                {
                    listId: 4,
                    imgSrcList: "https://tse2-mm.cn.bing.net/th/id/OIP-C.BGwUAGiZaZWWyQSf1AHvdAAAAA?w=331&h=182&c=7&r=0&o=5&dpr=1.3&pid=1.7",
                    h6Text: "ABC",
                    h6Color: "#8B008B",
                },
            ],
        },
        {
            id: 2,
            text: "本周推荐",
            bg: "#40570e",
            content: [
                {
                    listId: 1,
                    imgSrcList: "https://tse2-mm.cn.bing.net/th/id/OIP-C.BGwUAGiZaZWWyQSf1AHvdAAAAA?w=331&h=182&c=7&r=0&o=5&dpr=1.3&pid=1.7",
                    h6Text: "睡前小故事",
                    h6Color: "#696969",
                },
                {
                    listId: 2,
                    imgSrcList: "https://tse1-mm.cn.bing.net/th/id/OIP-C.3kYZHISr9w-BGxmo5VKp-wHaFj?w=247&h=185&c=7&r=0&o=5&dpr=1.3&pid=1.7",
                    h6Text: "xxx",
                    h6Color: "#383377",
                },
                {
                    listId: 3,
                    imgSrcList: "https://tse2-mm.cn.bing.net/th/id/OIP-C.BGwUAGiZaZWWyQSf1AHvdAAAAA?w=331&h=182&c=7&r=0&o=5&dpr=1.3&pid=1.7",
                    h6Text: "ABC",
                    h6Color: "#5f2549",
                },
                {
                    listId: 4,
                    imgSrcList:
                        "https://ts1.cn.mm.bing.net/th/id/R-C.b3c68ef9de1109b0d020e22bc2aacf40?rik=H9R9l7dvJP9Kbw&riu=http%3a%2f%2fpic.bizhi360.com%2fbbpic%2f89%2f8989.jpg&ehk=VyIdtYriq3lSqrO3x0MHd5IyxYaw8jZUCKZbHNtvewU%3d&risl=&pid=ImgRaw&r=0",
                    h6Text: "ABC",
                    h6Color: "#31766b",
                },
            ],
        },
    ];
    const changeFM = (dir) => {
        let fmDom = document.querySelectorAll("#BokeFm header h5");
        if (dir == 0) {
            fmActive.value--;
            if (fmActive.value < 0) fmActive.value = fmDom.length - 1;
        } else {
            fmActive.value++;
            if (fmActive.value > fmDom.length - 1) fmActive.value = 0;
        }
        handelToogel(fmActive.value);
    };
    const clickList = (id) => {
        listAct.value = id;
        document.getElementById("BokeList").style.background = `${bokeListTags[id].bg}`;
    };
    const handelToogel = (id) => {
        fmActive.value = id;
        for (let it of fmARR) {
            if (it.id == id) {
                imgSrcFm.value = it.imgSrc;
                titleFm.value = it.title;
                listFm.value = it.list;
                numFm.value = it.num;
                document.getElementById("BokeFm").style.background = it.bgcolor;
            }
        }
        let fmDom = document.querySelectorAll("#BokeFm header h5");
        fmDom.forEach((item) => {
            item.style.transform = `translateX(${-fmActive.value * 50}%)`;
        });
    };

    onMounted(() => {
        const listArrDom = document.querySelectorAll("#BokeList footer div");
        const BokeSpanDOM = document.querySelectorAll(".BokeSecLine footer ");
        for (let i = 0; i < BokeSecLineFooterArr.length; i++) {
            for (let j = 1; j < BokeSpanDOM[i].childNodes.length - 1; j++) {
                BokeSpanDOM[i].childNodes[j].style.background = `url(${BokeSecLineFooterArr[i].idBArr[j - 1].bg})`;
                BokeSpanDOM[i].childNodes[j].style.backgroundSize = `cover`;
                BokeSpanDOM[i].childNodes[j].style.backgroundPosition = `center`;
                BokeSpanDOM[i].childNodes[j].childNodes[1].style.background = `${BokeSecLineFooterArr[i].idBArr[j - 1].bgColor}`;
                BokeSpanDOM[i].childNodes[j].addEventListener("mouseover", () => {
                    BokeSpanDOM[i].childNodes[j].childNodes[1].style.boxShadow = ` 0 -3rem 3rem -1px ${BokeSecLineFooterArr[i].idBArr[j - 1].bgColor}`;
                });
                BokeSpanDOM[i].addEventListener("mouseout", () => {
                    BokeSpanDOM[i].childNodes[j].childNodes[1].style.boxShadow = ` none`;
                });
            }
        }
        document.getElementById("BokeFm").style.background = `${fmARR[0].bgcolor}`;
        document.getElementById("BokeList").style.background = `${bokeListTags[0].bg}`;
        for (let i = 0; i < listArrDom.length; i++) {
            for (let j = 1; j < listArrDom[i].childNodes.length - 1; j++) {
                listArrDom[i].childNodes[j].childNodes[1].style.background = bokeListTags[i].content[j - 1].h6Color;
            }
        }
    });
</script>
<style lang="scss" scoped src="./index.scss" />
