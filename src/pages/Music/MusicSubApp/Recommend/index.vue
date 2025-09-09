<template>
    <div id="recommendCon">
        <div class="recFirstLine">
            <div class="carousel"  @mouseenter="clearDotchange" @mouseleave="setDotchange">
                <h2 @click="leftOrRight(0)">◀</h2>
                <h2 @click="leftOrRight(1)">▶</h2>
                <!-- 轮播图图片容器-->
                <div class="carousel-img">
                    <template v-for="value in imgArr" :key="value.id">
                        <img :src="value.src" alt="" />
                    </template>
                </div>

                <!-- 轮播图圆点 -->
                <div class="carousel-btn">
                    <template v-for="value in imgArr" :key="value.id">
                        <svg xmlns="http://www.w3.org/2000/svg" width="1rem" height="1rem" viewBox="0 0 24 24" :class="{ activeBtn: btnIndex === value.id }" @mouseenter="dotChange(value.id)">
                            <path fill="currentColor" d="m12 14l-2-2l2-2l2 2zM9.875 8.125l-2.5-2.5L12 1l4.625 4.625l-2.5 2.5L12 6zm-4.25 8.5L1 12l4.625-4.625l2.5 2.5L6 12l2.125 2.125zm12.75 0l-2.5-2.5L18 12l-2.125-2.125l2.5-2.5L23 12zM12 23l-4.625-4.625l2.5-2.5L12 18l2.125-2.125l2.5 2.5z" />
                        </svg>
                    </template>
                </div>
            </div>
            <div id="recSongList">
                <p> 夜深了，猜你喜欢听 </p>
                <span v-for="value in recSongList" :key="value.id">
                    <h6>{{ value.text }}</h6>
                    <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24">
                        <path fill="currentColor" fill-rule="evenodd" d="M23 12c0-1.035-.53-2.07-1.591-2.647L8.597 2.385C6.534 1.264 4 2.724 4 5.033V12z" clip-rule="evenodd" />
                        <path fill="currentColor" d="m8.597 21.615l12.812-6.968A2.988 2.988 0 0 0 23 12H4v6.967c0 2.31 2.534 3.769 4.597 2.648" opacity="0.5" />
                    </svg>
                    <img :src="value.src" />
                </span>
            </div>
            <div id="recScene">
                <h3>{{ h5CurText }}</h3>
                <button @click="showRecSubScene">选场景 ▼</button>
                <svg xmlns="http://www.w3.org/2000/svg" width="3em" height="3em" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2m-2 14.5v-9l6 4.5z" />
                </svg>
                <div id="recSubScene">
                    <span v-for="value in sceneArr" :key="value.id" @click="changeSubScene(value.src, value.h5Text)">
                        <h5>{{ value.h5Text }}</h5>
                        <img :src="value.src" alt="" />
                    </span>
                </div>
            </div>
        </div>
        <div id="recSecLine">
            <header>
                <button @click="changCommendSong(0, recSecLineFooterArr, '#recSecLine')">◀</button>
                <button @click="changCommendSong(1, recSecLineFooterArr, '#recSecLine')">▶</button>
                <h3>推荐歌单 ◢</h3>
                <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 512 512">
                    <path fill="currentColor" d="M256 48C141.31 48 48 141.31 48 256s93.31 208 208 208s208-93.31 208-208S370.69 48 256 48m120 182.15a8.62 8.62 0 0 1-8.62 8.62h-59.54a8.61 8.61 0 0 1-6.09-14.71l22.17-22.17l-5.6-6.51a87.38 87.38 0 1 0-62.94 148a87.55 87.55 0 0 0 82.42-58.25A16 16 0 1 1 368 295.8a119.4 119.4 0 1 1-112.62-159.18a118.34 118.34 0 0 1 86.36 36.95l.56.62l4.31 5l14.68-14.68a8.44 8.44 0 0 1 6-2.54a8.61 8.61 0 0 1 8.68 8.63Z" />
                </svg>
            </header>
            <footer>
                <span v-for="item in recSecLineFooterArr" :key="item.id">
                    <h5>{{ item.playNum }}</h5>
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="1.8rem" height="1.8rem" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M13 2.05v2c4.39.54 7.5 4.53 6.96 8.92c-.46 3.64-3.32 6.53-6.96 6.96v2c5.5-.55 9.5-5.43 8.95-10.93c-.45-4.75-4.22-8.5-8.95-8.97zM5.67 19.74A9.994 9.994 0 0 0 11 22v-2a8.002 8.002 0 0 1-3.9-1.63zm1.43-14c1.12-.9 2.47-1.48 3.9-1.68v-2c-1.95.19-3.81.94-5.33 2.2zM5.69 7.1L4.26 5.67A9.885 9.885 0 0 0 2.05 11h2c.19-1.42.75-2.77 1.64-3.9M4.06 13h-2c.2 1.96.97 3.81 2.21 5.33l1.42-1.43A8.002 8.002 0 0 1 4.06 13M10 16.5l6-4.5l-6-4.5z" />
                        </svg>
                        <h4>{{ item.playName }}</h4>
                        <ol>
                            <li v-for="it in item.songArr">{{ it }}</li>
                        </ol>
                    </div>
                </span>
            </footer>
        </div>
        <div id="recThirdLine">
            <header>
                <h3>榜单精选 ✿</h3>
                <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 512 512">
                    <path fill="currentColor" d="M256 48C141.31 48 48 141.31 48 256s93.31 208 208 208s208-93.31 208-208S370.69 48 256 48m120 182.15a8.62 8.62 0 0 1-8.62 8.62h-59.54a8.61 8.61 0 0 1-6.09-14.71l22.17-22.17l-5.6-6.51a87.38 87.38 0 1 0-62.94 148a87.55 87.55 0 0 0 82.42-58.25A16 16 0 1 1 368 295.8a119.4 119.4 0 1 1-112.62-159.18a118.34 118.34 0 0 1 86.36 36.95l.56.62l4.31 5l14.68-14.68a8.44 8.44 0 0 1 6-2.54a8.61 8.61 0 0 1 8.68 8.63Z" />
                </svg>
            </header>
            <footer>
                <div v-for="item in songRank" :key="item.id">
                    <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24">
                        <path fill="currentColor"
                            d="m9.1 19.2l.3-.6c.4-.9.6-1.9.6-2.6L9.99 3.25c0-1.2-.39-1.45-.79-1.55L5.4.5c-.3-.1-1-.2-1.8.5c-.5.4-.9 1-1.2 1.8c-.3.8-.5 1.5-.5 2.2v12.8c0 1 .5 1.3.8 1.5c-1 .4-1.7 1-1.7 1.6v.6c0 1.2 2.3 2.2 5 2.2c2.8 0 5-1 5-2.2v-.6c0-.7-.7-1.3-1.9-1.7M6.6 6.7c0-1.1-.16-2.7 1.24-3.9c1.27-1.12 1.2.71 1.2.71S9 13.7 9 14.8c0 1.8 0 3.4-1.3 4.8c-1 1.2-1.1-.3-1.1-.3zm14.5 12.5l.3-.6c.4-.9.6-1.9.6-2.6l-.01-12.75c0-1.2-.39-1.45-.79-1.55L17.4.5c-.3-.1-1-.2-1.8.5c-.5.4-.9 1-1.2 1.8c-.3.8-.5 1.5-.5 2.2v12.8c0 1 .5 1.3.8 1.5c-1 .4-1.7 1-1.7 1.6v.6c0 1.2 2.3 2.2 5 2.2c2.8 0 5-1 5-2.2v-.6c0-.7-.7-1.3-1.9-1.7M18.6 6.7c0-1.1-.16-2.7 1.24-3.9c1.27-1.12 1.2.71 1.2.71S21 13.7 21 14.8c0 1.8 0 3.4-1.3 4.8c-1 1.2-1.1-.3-1.1-.3z" />
                    </svg>
                    <h3>{{ item.rankName }}</h3>
                    <h6>{{ item.rankUpdate }}</h6>
                    <img :src="item.src" alt="" />
                    <ol>
                        <li v-for="it in item.songArr">{{ it }}</li>
                    </ol>
                </div>
            </footer>
        </div>
        <div id="recFourLine">
            <header>
                <button @click="changCommendSong(0, radarRank, '#recFourLine')">◁</button>
                <button @click="changCommendSong(1, radarRank, '#recFourLine')">▷</button>
                <h3>雷达歌单 ◥</h3>
                <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 512 512">
                    <path fill="currentColor" d="M256 48C141.31 48 48 141.31 48 256s93.31 208 208 208s208-93.31 208-208S370.69 48 256 48m120 182.15a8.62 8.62 0 0 1-8.62 8.62h-59.54a8.61 8.61 0 0 1-6.09-14.71l22.17-22.17l-5.6-6.51a87.38 87.38 0 1 0-62.94 148a87.55 87.55 0 0 0 82.42-58.25A16 16 0 1 1 368 295.8a119.4 119.4 0 1 1-112.62-159.18a118.34 118.34 0 0 1 86.36 36.95l.56.62l4.31 5l14.68-14.68a8.44 8.44 0 0 1 6-2.54a8.61 8.61 0 0 1 8.68 8.63Z" />
                </svg>
            </header>
            <footer>
                <span v-for="item in radarRank" :key="item.id">
                    <h5>{{ item.playNum }}</h5>
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="2rem" height="2rem" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M13 2.05v2c4.39.54 7.5 4.53 6.96 8.92c-.46 3.64-3.32 6.53-6.96 6.96v2c5.5-.55 9.5-5.43 8.95-10.93c-.45-4.75-4.22-8.5-8.95-8.97zM5.67 19.74A9.994 9.994 0 0 0 11 22v-2a8.002 8.002 0 0 1-3.9-1.63zm1.43-14c1.12-.9 2.47-1.48 3.9-1.68v-2c-1.95.19-3.81.94-5.33 2.2zM5.69 7.1L4.26 5.67A9.885 9.885 0 0 0 2.05 11h2c.19-1.42.75-2.77 1.64-3.9M4.06 13h-2c.2 1.96.97 3.81 2.21 5.33l1.42-1.43A8.002 8.002 0 0 1 4.06 13M10 16.5l6-4.5l-6-4.5z" />
                        </svg>
                        <h4>{{ item.playName }}</h4>
                        <ol>
                            <li v-for="it in item.songArr">{{ it }}</li>
                        </ol>
                    </div>
                </span>
            </footer>
        </div>
        <div class="recMulPart" v-for="item in partArr" :key="item.partId">
            <div class="recFiveLine">
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
                        <svg class="FivePlayBtn" xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
                            <path fill="currentColor" fill-rule="evenodd" d="M1 12C1 5.925 5.925 1 12 1s11 4.925 11 11s-4.925 11-11 11S1 18.075 1 12m8.528-4.882a1 1 0 0 1 1.027.05l6 4a1 1 0 0 1 0 1.664l-6 4A1 1 0 0 1 9 16V8a1 1 0 0 1 .528-.882" clip-rule="evenodd" />
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
    import { ref, onUnmounted, onMounted } from "vue";

    let btnIndex = ref(0);
    let h5CurText = ref("夜晚");

    //批量插入图片src和索引id
    function insertImgToArr(arr, length, prefix) {
        for (let i = 0; i < length; i++) {
            //每个对象在原来用于的属性基础上，再加一个图片src和索引id
            arr[i] = {
                ...arr[i],
                src: `${prefix}/${i}.webp`,
                id: i,
            };
        }
    }
    //第一行轮播图图片
    const imgArr = new Array(7).fill({});

    //第一行场景壁纸
    const sceneArr = [
        {
            h5Text: "夜晚",
        },
        {
            h5Text: "学习",
        },
        {
            h5Text: "工作",
        },
        {
            h5Text: "午休",
        },
        {
            h5Text: "旅行",
        },
        {
            h5Text: "散心",
        },
    ];

    //第一行歌单封面图片
    const recSongList = [
        {
            text: "2023年度经典歌单",
        },
        {
            text: "随便收集",
        },
        {
            text: "私人雷达",
        },
        {
            text: "喜欢歌单",
        },
    ];

    //第二行推荐歌单
    const recSecLineFooterArr = [
        {
            playNum: "▶ 1.1亿",
            playName: "每日推荐，从漫漫长夜听起",
            songArr: ["Theme for The Long Dark —— Cris Velasco", "仙剑二主题 (余情幽梦) —— 骆集益", "初恋 —— 林志美"],
            bgColor: "#009895",
        },
        {
            playNum: "▶ 1.23亿",
            playName: "今天从《xxx》听起|私人漫游",
            songArr: ["不见山海 —— 阿YueYue", "xxx", "xxx"],
            bgColor: "#998E7C",
        },
        {
            playNum: "▶ 851.6万",
            playName: "也许我们应该去更远的地方看看",
            songArr: ["xxx", "xxx", "xxx"],
            bgColor: "#FDD56C",
        },
        {
            playNum: "▶ 70万",
            playName: "纯音乐 | 星空之下，绿草至上",
            songArr: ["xxx", "xxx", "xxx"],
            bgColor: "#27416A",
        },
        {
            playNum: "▶ 5401",
            playName: "秋日之歌",
            songArr: ["xxx", "xxx", "xxx"],
            bgColor: "#B8653D",
        },
        {
            id: 5,
            playNum: "▶ 139.22万",
            playName: "大自然的声音",
            songArr: ["xxx", "xxx", "xxx"],
            bgColor: "#D4DED5",
        },
    ];

    //第三行榜单精选
    const songRank = [
        {
            rankUpdate: "刚刚更新",
            rankName: "飙升榜",
            songArr: ["XXX", "XXX", "XXX"],
        },
        {
            rankUpdate: "刚刚更新",
            rankName: "新歌榜",
            songArr: ["XXX", "XXX", "XXX"],
        },
        {
            rankUpdate: "更新30首",
            rankName: "热歌榜",
            songArr: ["XXX", "XXX", "XXX"],
        },
        {
            rankUpdate: "每周四更新",
            rankName: "原创榜",
            songArr: ["XXX", "XXX", "XXX"],
        },
        {
            rankUpdate: "长期更新",
            rankName: "经典榜",
            songArr: ["XXX", "XXX", "XXX"],
        },
        {
            rankUpdate: "每月更新",
            rankName: "共享榜",
            songArr: ["XXX", `XXX`, "XXX"],
        },
    ];

    //第四行雷达歌单
    const radarRank = [
        {
            playNum: "▶ 1.3亿",
            playName: "私人雷达",
            songArr: ["xxx", "xxx", "xxx"],
            bgColor: "#B8653D",
        },
        {
            playNum: "▶ 1.23亿",
            playName: "日系雷达",
            songArr: ["Mystery of Love", "xxx", "xxx"],
            bgColor: "#27416A",
        },
        {
            playNum: "▶ 851.6万",
            playName: "欧美雷达",
            songArr: ["xxx", "xxx", "xxx"],
            bgColor: "#EEE3AE",
        },
        {
            playNum: "▶ 70万",
            playName: "会员雷达",
            songArr: ["xxx", "xxx", "xxx"],
            bgColor: "white",
        },
        {
            playNum: "▶ 5401",
            playName: "小众雷达",
            songArr: ["xxx", "xxx", "xxx"],
            bgColor: "#DEC758",
        },
        {
            playNum: "▶ 139.22万",
            playName: "时光雷达",
            songArr: ["xxx", "xxx", "xxx"],
            bgColor: "black",
        },
        {
            playNum: "▶ 5401",
            playName: "华语雷达",
            songArr: ["xxx", "xxx", "xxx"],
            bgColor: "#D8A163",
        },
        {
            playNum: "▶ 139.22万",
            playName: "老曲雷达",
            songArr: ["xxx", "xxx", "xxx"],
            bgColor: "#D4DED5",
        },
    ];
    insertImgToArr(imgArr, imgArr.length, "https://images-pc.oss-cn-hongkong.aliyuncs.com/music/recommend/carousel");
    insertImgToArr(sceneArr, sceneArr.length, "https://images-pc.oss-cn-hongkong.aliyuncs.com/music/recommend/scene");
    insertImgToArr(recSongList, recSongList.length, "https://images-pc.oss-cn-hongkong.aliyuncs.com/music/recommend/songList");
    insertImgToArr(recSecLineFooterArr, recSecLineFooterArr.length, "https://images-pc.oss-cn-hongkong.aliyuncs.com/music/recommend/secondList");
    insertImgToArr(songRank, songRank.length, "https://images-pc.oss-cn-hongkong.aliyuncs.com/music/recommend/listChoice");
    insertImgToArr(radarRank, radarRank.length, "https://images-pc.oss-cn-hongkong.aliyuncs.com/music/recommend/radar");
    //第五行
    const partArr = [
        {
            title: "◤ 黑胶VIP 专享，请戴上耳机聆听 ◢",
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
            title: "专属于你的【 游戏 】精选 ▶",
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
            title: "每天听点好音乐 ▶",
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
            title: "你的专属博客 ▶",
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
            title: "你的宝藏有声书 ▶",
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
            partArr[i].fifthArr[j].imgSrc = "https://audio-y.com/wp-content/uploads/2022/09/b812c8fcc3cec3fdfc0374801adcc33f8794a5c289b3.jpeg";
        }
    }
    let timerRecommend =  null
    const dotChange = (index) => {
        btnIndex.value = index;
        realTimePicture();
    };
    const clearDotchange = () => {
        clearInterval(timerRecommend);
        
    }
    const setDotchange = () => {
        timerRecommend = setInterval(() => {
            leftOrRight(1);
        }, 3000);
    }
    const realTimePicture = () => {
        const imgArrDom = document.querySelectorAll(".carousel-img img");
        imgArrDom.forEach((e) => {
            e.style.transform = `translateX(${-btnIndex.value * 100}%)`;
        });
    };
    const showRecSubScene = () => {
        document.getElementById("recSubScene").style.display = document.getElementById("recSubScene").style.display == "none" ? "flex" : "none";
    };
    const changeSubScene = (src, text) => {
        document.getElementById("recScene").style.background = `url(${src})`;
        h5CurText.value = text;
        document.getElementById("recScene").style.backgroundSize = "100% 100%";
        document.getElementById("recSubScene").style.display = "none";
    };
    const leftOrRight = (d) => {

        if (d == 0) {
            btnIndex.value = (btnIndex.value - 1 + imgArr.length) % imgArr.length;
        } else {
            btnIndex.value = (btnIndex.value + 1) % imgArr.length;
        }
        realTimePicture();
    };
    let commendIndex = 0;
    const changCommendSong = (d, arr, id) => {
        const commendDom = document.querySelectorAll(`${id} footer span`);
        if (d == 0) {
            commendIndex = Math.abs(commendIndex - arr.length / 2) % arr.length;
        } else {
            commendIndex = (commendIndex + arr.length / 2) % arr.length;
        }
        commendDom.forEach((e) => {
            e.style.transform = `translateX(${-commendIndex * 110}%)`;
            e.style.transition = `0.5s`;
        });
    };
    let partIndex = 0;
    const changPart = (d, arr, childID) => {
        let temp = Array.from(document.querySelectorAll(`.recFiveLine`)[childID].childNodes[1].childNodes);
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
    onMounted(() => {
        setDotchange()
        const twoSpanDOM = document.querySelectorAll("#recSecLine footer span");
        const fourSpanDOM = document.querySelectorAll("#recFourLine footer span");
        for (let i = 0; i < recSecLineFooterArr.length; i++) {
            twoSpanDOM[i].style.background = `url(${recSecLineFooterArr[i].src})`;
            twoSpanDOM[i].style.backgroundSize = `cover`;
            twoSpanDOM[i].style.backgroundPosition = `center`;
            twoSpanDOM[i].childNodes[1].style.background = `${recSecLineFooterArr[i].bgColor}`;
            twoSpanDOM[i].addEventListener("mouseover", () => {
                twoSpanDOM[i].childNodes[1].style.boxShadow = ` 0 -3rem 3rem -1px ${recSecLineFooterArr[i].bgColor}`;
            });
            twoSpanDOM[i].addEventListener("mouseout", () => {
                twoSpanDOM[i].childNodes[1].style.boxShadow = ` none`;
            });
        }
        for (let i = 0; i < radarRank.length; i++) {
            fourSpanDOM[i].style.background = `url(${radarRank[i].src})`;
            fourSpanDOM[i].style.backgroundSize = `cover`;
            fourSpanDOM[i].style.backgroundPosition = `center`;
            fourSpanDOM[i].childNodes[1].style.background = `${radarRank[i].bgColor}`;
            fourSpanDOM[i].addEventListener("mouseover", () => {
                for (let j = 0; j < radarRank.length; j++) {
                    fourSpanDOM[j].style.opacity = "0.2";
                }
                fourSpanDOM[i].style.opacity = "1";
                fourSpanDOM[i].childNodes[1].style.boxShadow = ` 0 -3rem 3rem -1px ${radarRank[i].bgColor}`;
            });
            fourSpanDOM[i].addEventListener("mouseout", () => {
                fourSpanDOM[i].childNodes[1].style.boxShadow = ` none`;
                for (let j = 0; j < radarRank.length; j++) {
                    fourSpanDOM[j].style.opacity = "1";
                }
            });
        }
    });
    onUnmounted(() => {
        clearInterval(timerRecommend);
        timerRecommend = null;
    });
</script>

<style scoped lang="scss" src="./index.scss" />
