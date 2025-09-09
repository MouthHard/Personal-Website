<template>
    <div class="choiceSecondTab">
        <header>
            <h6 v-for="item in choiceSecTab_tags" :key="item.id" :class="{ isSubActive: item.id == subActive }" @click="handelToogel(item.id)">
                {{ item.text }}
            </h6>
            <button @click="showChoiceSecondScene">其他场景 ▼</button>
            <div id="choiceSecond_Scene">
                <div v-for="item in choiceSecTab_suBtags" :key="item.id">
                    <h4>{{ item.text }}</h4>
                    <p v-for="it in item.arr">{{ it }}</p>
                </div>
            </div>
        </header>
        <footer @click="closeChoiceSecondScene">
            <div v-show="item.id == subActive" v-for="item in choiceSecTab_tags" :key="item.id" class="choiceSecondTabFooter">
                <span v-for="it in item.content" :key="it.subId">
                    <h5>{{ it.playNum }}</h5>
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="2rem" height="2rem" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M13 2.05v2c4.39.54 7.5 4.53 6.96 8.92c-.46 3.64-3.32 6.53-6.96 6.96v2c5.5-.55 9.5-5.43 8.95-10.93c-.45-4.75-4.22-8.5-8.95-8.97zM5.67 19.74A9.994 9.994 0 0 0 11 22v-2a8.002 8.002 0 0 1-3.9-1.63zm1.43-14c1.12-.9 2.47-1.48 3.9-1.68v-2c-1.95.19-3.81.94-5.33 2.2zM5.69 7.1L4.26 5.67A9.885 9.885 0 0 0 2.05 11h2c.19-1.42.75-2.77 1.64-3.9M4.06 13h-2c.2 1.96.97 3.81 2.21 5.33l1.42-1.43A8.002 8.002 0 0 1 4.06 13M10 16.5l6-4.5l-6-4.5z" />
                        </svg>
                        <h4>{{ it.playName }}</h4>
                        <ol>
                            <li v-for="temp in it.songArr">{{ temp }}</li>
                        </ol>
                    </div>
                </span>
            </div>
        </footer>
    </div>
</template>
<script setup>
import { onMounted, ref } from "vue";

let subActive = ref(0);
const showChoiceSecondScene = () => {
    document.getElementById("choiceSecond_Scene").style.display = document.getElementById("choiceSecond_Scene").style.display == "none" ? "flex" : "none";
};
const closeChoiceSecondScene = () => {
    document.getElementById("choiceSecond_Scene").style.display = "none";
};
const choiceSecTab_tags = [
    {
        text: "推荐",
        prefix: "https://images-pc.oss-cn-hongkong.aliyuncs.com/music/choice/plaza/RC",
        content: [
            {
                playNum: "▶ 1.1亿",
                playName: "每日推荐，从漫漫长夜听起",
                songArr: ["漫漫长夜", "xxx", "xxx"],
                bgColor: "#009895",
            },
            {
                playNum: "▶ 1.23亿",
                playName: "今天从《Mystery of Love》听起|私人雷达",
                songArr: ["Mystery of Love", "xxx", "xxx"],

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
                playNum: "▶ 139.22万",
                playName: "大自然的声音",
                songArr: ["xxx", "xxx", "xxx"],

                bgColor: "#D4DED5",
            },
        ],
    },
    {
        text: "官方",
        prefix: "https://images-pc.oss-cn-hongkong.aliyuncs.com/music/choice/plaza/official",
        content: [
            {
                playNum: "▶ 1.1亿",
                playName: "每日推荐，从漫漫长夜听起",
                songArr: ["漫漫长夜", "xxx", "xxx"],
                bgColor: "#009895",
            },
            {
                playNum: "▶ 1.23亿",
                playName: "今天从《Mystery of Love》听起|私人雷达",
                songArr: ["Mystery of Love", "xxx", "xxx"],

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
                playNum: "▶ 139.22万",
                playName: "大自然的声音",
                songArr: ["xxx", "xxx", "xxx"],

                bgColor: "#D4DED5",
            },
        ],
    },
    {
        text: "华语",
        prefix: "https://images-pc.oss-cn-hongkong.aliyuncs.com/music/choice/plaza/Chinese",
        content: [
            {
                playNum: "▶ 1.1亿",
                playName: "每日推荐，从漫漫长夜听起",
                songArr: ["漫漫长夜", "xxx", "xxx"],

                bgColor: "#009895",
            },
            {
                playNum: "▶ 1.23亿",
                playName: "今天从《Mystery of Love》听起|私人雷达",
                songArr: ["Mystery of Love", "xxx", "xxx"],

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
                playNum: "▶ 139.22万",
                playName: "大自然的声音",
                songArr: ["xxx", "xxx", "xxx"],
                bgColor: "#D4DED5",
            },
        ],
    },
    {
        text: "摇滚",
        prefix: "https://images-pc.oss-cn-hongkong.aliyuncs.com/music/choice/plaza/rock",
        content: [
            {
                playNum: "▶ 1.1亿",
                playName: "每日推荐，从漫漫长夜听起",
                songArr: ["漫漫长夜", "xxx", "xxx"],

                bgColor: "#009895",
            },
            {
                playNum: "▶ 1.23亿",
                playName: "今天从《Mystery of Love》听起|私人雷达",
                songArr: ["Mystery of Love", "xxx", "xxx"],

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
                playNum: "▶ 139.22万",
                playName: "大自然的声音",
                songArr: ["xxx", "xxx", "xxx"],

                bgColor: "#D4DED5",
            },
        ],
    },
    {
        text: "民谣",
        prefix: "https://images-pc.oss-cn-hongkong.aliyuncs.com/music/choice/plaza/Folk",
        content: [
            {
                playNum: "▶ 1.1亿",
                playName: "每日推荐，从漫漫长夜听起",
                songArr: ["漫漫长夜", "xxx", "xxx"],

                bgColor: "#009895",
            },
            {
                playNum: "▶ 1.23亿",
                playName: "今天从《Mystery of Love》听起|私人雷达",
                songArr: ["Mystery of Love", "xxx", "xxx"],

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
                playNum: "▶ 139.22万",
                playName: "大自然的声音",
                songArr: ["xxx", "xxx", "xxx"],

                bgColor: "#D4DED5",
            },
        ],
    },
    {
        text: "电子",
        prefix: "https://images-pc.oss-cn-hongkong.aliyuncs.com/music/choice/plaza/Electronic",
        content: [
            {
                playNum: "▶ 1.1亿",
                playName: "每日推荐，从漫漫长夜听起",
                songArr: ["漫漫长夜", "xxx", "xxx"],

                bgColor: "#009895",
            },
            {
                playNum: "▶ 1.23亿",
                playName: "今天从《Mystery of Love》听起|私人雷达",
                songArr: ["Mystery of Love", "xxx", "xxx"],

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
                playNum: "▶ 139.22万",
                playName: "大自然的声音",
                songArr: ["xxx", "xxx", "xxx"],

                bgColor: "#D4DED5",
            },
        ],
    },
    {
        text: "轻音乐",
        prefix: "https://images-pc.oss-cn-hongkong.aliyuncs.com/music/choice/plaza/Light",
        content: [
            {
                playNum: "▶ 1.1亿",
                playName: "每日推荐，从漫漫长夜听起",
                songArr: ["漫漫长夜", "xxx", "xxx"],

                bgColor: "#009895",
            },
            {
                playNum: "▶ 1.23亿",
                playName: "今天从《Mystery of Love》听起|私人雷达",
                songArr: ["Mystery of Love", "xxx", "xxx"],

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
                playNum: "▶ 139.22万",
                playName: "大自然的声音",
                songArr: ["xxx", "xxx", "xxx"],

                bgColor: "#D4DED5",
            },
        ],
    },
];
for (let i = 0; i < choiceSecTab_tags.length; i++) {
    choiceSecTab_tags[i].id = i;
    for (let j = 0; j < choiceSecTab_tags[i].content.length; j++) {
        choiceSecTab_tags[i].content[j].subId = i;
        choiceSecTab_tags[i].content[j].imgSrc = `${choiceSecTab_tags[i].prefix}${j + 1}.webp`;
    }
}
const choiceSecTab_suBtags = [
    { id: 0, text: "语种", arr: ["欧美", "日语", "普通话", "韩语", "粤语"] },
    {
        id: 1,
        text: "风格",
        arr: ["流行", "舞曲", "说唱", "爵士", "乡村", "R&B/Soul", "古典", "民族", "英伦", "金属", "朋克", "蓝调", "雷鬼", "世界音乐", "拉丁", "New Age", "古风", "后摇", "Bossa Nova"],
    },
    { id: 2, text: "场景", arr: ["清晨", "夜晚", "学习", "工程", "午休", "下午茶", "地铁", "驾车", "运动", "旅游", "散步", "酒吧"] },
    { id: 3, text: "情感", arr: ["怀旧", "清新", "治愈", "浪漫", "伤感", "轻松", "孤独", "感动", "兴奋", "快乐", "安静", "思念"] },
    { id: 4, text: "主题", arr: ["综艺", "影视原声", "ACG", "儿童", "校园", "游戏", "70后", "80后", "90后", "00后", "网络歌曲", "KTV", "经典", "翻唱", "吉他", "钢琴", "器乐", "榜单"] },
];
const handelToogel = (index) => {
    subActive.value = index;
    document.getElementById("choiceSecond_Scene").style.display = "none";
};
onMounted(() => {
    const choiceTwoSpanDOM = document.querySelectorAll(".choiceSecondTabFooter");
    for (let i = 0; i < choiceSecTab_tags.length; i++) {
        let temp = [];

        // 由于choiceTwoSpanDOM[i].childNodes 这个数组的 第一个和最后一个节点都是#text节点 不是span节点
        for (let j = 0; j <= choiceSecTab_tags[i].content.length; j++) {
            //此时j=1,  但是 push进去的第一个满足条件的span元素却是下标0，所以 此处要j <= choiceSecTab_tags[i].content.length
            if (choiceTwoSpanDOM[i].childNodes[j].nodeName == "SPAN") {
                temp.push(choiceTwoSpanDOM[i].childNodes[j]);
            }
        }
        for (let k = 0; k < temp.length; k++) {
            temp[k].style.background = `url(${choiceSecTab_tags[i].content[k].imgSrc})`;
            temp[k].style.backgroundSize = `cover`;
            temp[k].style.backgroundPosition = `center`;
            temp[k].childNodes[1].style.background = `${choiceSecTab_tags[i].content[k].bgColor}`;
            temp[k].addEventListener("mouseover", () => {
                for (let h = 0; h < choiceSecTab_tags[i].content.length; h++) {
                    temp[k].style.opacity = "0.2";
                }
                temp[k].style.opacity = "1";
                temp[k].childNodes[1].style.boxShadow = ` 0 -3rem 3rem -1px ${choiceSecTab_tags[i].content[k].bgColor}`;
            });
            temp[k].addEventListener("mouseout", () => {
                temp[k].childNodes[1].style.boxShadow = ` none`;
                for (let h = 0; h < choiceSecTab_tags[i].content.length; h++) {
                    temp[k].style.opacity = "1";
                }
            });
        }
    }
});
</script>
<style lang="scss" scoped>
* {
    margin: 0;
    padding: 0;
}
.choiceSecondTab {
    width: 97%;
    height: 100%;
    display: flex;
    flex-wrap: wrap;
    header {
        margin-top: 10px;
        display: flex;
        width: 98%;
        height: 7%;
        margin-left: 2%;
        text-align: center;
        position: relative;
        #choiceSecond_Scene {
            position: absolute;
            z-index: 3;
            background: #040729;
            width: 70%;
            top: 3rem;
            right: 10%;
            display: none;
            flex-direction: column;
            justify-content: space-around;

            div {
                width: 100%;
                display: flex;
                flex-wrap: wrap;
                justify-content: flex-start;
                border-bottom: 1px solid #fff;
                h4 {
                    height: 2rem;
                    line-height: 2rem;
                    display: inline;
                    padding: 5px 5px 5px 10px;
                    background: transparent;
                    text-align: center;
                    margin: 0;
                }
                p {
                    height: 2rem;
                    line-height: 2rem;
                    color: #b2b2b2;
                    padding: 5px 15px;
                    margin: 0;
                    transition: 0.5s;
                    border-radius: 30px;
                    border-left: 1px solid transparent;
                    border-right: 1px solid transparent;
                    &:hover {
                        color: #8fbcff;
                        border-radius: 0;
                        font-weight: bolder;
                        cursor: pointer;
                        border-left: 1px solid #fff;
                        border-right: 1px solid #fff;
                        box-shadow: inset 20px 0 15px -15px #fff, inset -20px 0 15px -15px #fff;
                    }
                }
            }
        }
        .isSubActive {
            border-radius: 5px;
            font-weight: bolder;
            transition: 0.5s;

            color: #cbf0ff;
            font-weight: bolder;
            background: rgba(0, 0, 0, 0.5);
            box-shadow: inset 20px 0 15px -15px #00ff666d;
        }
        button {
            background: transparent;
            color: #fcfcfc;
            border: none;
        }
        h6,
        button {
            font-size: 1rem;
            font-weight: bolder;
            white-space: nowrap;
            text-align: center;
            padding: 10px;
            cursor: pointer;
            margin: 0;
            &:hover {
                box-shadow: inset 0 0 15px 2px #ff0202b1;
            }
        }
    }
    footer {
        width: 100%;
        height: 100%;
        display: flex;
        flex-wrap: wrap;
        .choiceSecondTabFooter {
            width: 100%;
            height: 100%;
            display: flex;
            flex-wrap: wrap;
            span {
                position: relative;
                background-size: cover;
                background-position: center;
                width: 11%;
                height: 45%;
                padding: 0 20px;
                margin: 15px 0 0 20px;
                border-radius: 10px;
                text-shadow: -1px 1px 0 #000, 1px 1px 0 #000, 1px -1px 0 #000, -1px -1px 0 #000;
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
                    height: 30%;
                    width: 100%;
                    color: #ffffff;
                    border-radius: 0 0 10px 10px;
                    overflow: hidden; /* 溢出的部分隐藏 */
                }
                svg {
                    margin: auto;
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
}
</style>
