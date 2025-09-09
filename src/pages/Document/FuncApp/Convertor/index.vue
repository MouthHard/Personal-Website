<template>
	<div class="app-container">

		<!-- 标签切换 -->
		<div class="tags_box">
			<div v-for="(item, index) in convertList" class="tags">
				<div :class="{ isActive: index == active }" @click="handelToogel(index)">
					{{ item }}
				</div>
			</div>
		</div>

		<!-- 内容部分 -->
		<div class="con_box">
			<template v-for="item in activeArr">
				<div v-show="active == item.id">
					<input placeholder="0" type="text" v-model="theCoin" @keyup="theToOther(item.exChangeArr, item.id, true)" />
					<select @change="theToOther(item.exChangeArr, item.id, true)">
						<option v-for="it in item.optionArr">
							{{ it }}
						</option>
					</select>
					<input placeholder="0" type="text" v-model="otherCoin" @keyup="theToOther(item.exChangeArr, item.id, false)" />
					<select @change="theToOther(item.exChangeArr, item.id, false)">
						<option v-for="it in item.optionArr">
							{{ it }}
						</option>
					</select>
				</div>
			</template>
		</div>
		<div id="keyboard">
			<template v-for="value in numArr">
				<button>{{ value }}</button>
			</template>
		</div>
	</div>
</template>
<script setup>
import { nextTick, ref, onMounted } from "vue";
const convertList = ["货币转换", "容量与体积转换", "长度与距离转换", "质量与重量转换", "温度转换", "能量/热量转换", "面积转换", "速度转换", "加速度转换", "时间转换", "功率转换", "视在功率转换", "数据转换", "压强转换", "角度转换", "电量转换", "电压转换", "电流转换", "电感转换", "电容转换", "频率转换", "力转换", "密度转换", "流量转换", "流量(质量)转换", " 浓度(质量-体积)转换", "浓度(摩尔-体积)", "声音强度转换", "亮度转换"];
//默认选中第一个tab
let active = ref(0);
let theCoin = ref(0);
let otherCoin = ref(0);
const numArr = ["7", "8", "9", "±", "4", "5", "6", ".", "1", "2", "3", "0", "CE", "◀"];
const activeArr = [
	{
		id: `0`,
		optionArr: [
			`阿尔巴尼亚列克 ALL - L`,
			"阿尔及尼亚第纳尔  DZD — د.ج",
			" 阿富汗阿富汗尼 AFN — ؋",
			"阿根廷比索 ARS — $",
			"阿联酋迪拉姆 AED — د.إ",
			"阿鲁巴弗罗林 AWG — f",
			"阿曼里亚尔 OMR — ر.ع.",
			"阿塞拜疆马纳特 AZN — ₼",
			"埃及镑 EGP — ج.م",
			"埃塞俄比亚比尔 ETB — Br",
			"安哥拉宽扎 AOA — Kz",
			"爱沙尼亚克朗 EEK",
			"澳大利亚元 AUD — $",
			"中国澳门特别行政区澳门币 MOP — P",
			"巴巴多斯元 BBD —$",
			"巴布亚新几内亚基那 PGK — K",
			"巴哈马群岛元 BSD — B$",
			"巴基斯坦卢比  PKR —₨",
			"巴拉圭瓜拉尼  PYG — ₲",
			"巴林第纳尔  BHD — .د.ب",
			"巴拿马巴波亚 PAB — B/.",
			"巴西雷亚尔 BRL — R$",
			"钯金 XPD",
			"白俄罗斯卢布 BYN — Br",
			"白银 —— XAG",
			"百慕大元 BMD — $",
			"保加利亚列弗 BGN — лв.",
			"比特币 BTC",
			"比特币现金 BCH",
			"冰岛克朗 ISK — kr",
			"波兰兹罗提 PLN — zł",
			"波斯尼亚和黑塞哥维那可兑换马尔卡 BAM — KM",
			"玻利维亚币 BOB — Bs.",
			"伯利兹元 BZD — $",
			"铂金 XPT",
			"博茨瓦纳普拉 BWP — P",
			"不丹努尔特鲁姆 BTN — Nu.",
			"布隆迪法郎 BIF — Fr",
			"朝鲜元 KPW — W",
			"丹麦克朗 DKK — kr",
			"东加勒比元 XCD — $",
			"多明尼加比索 DOP — $",
			"俄罗斯卢布 RUB — ₽",
			"厄瓜多尔苏克雷 ECS",
			"菲律宾比索 PHP — ₱",
			"斐济元 FJD — $",
			"佛得角埃斯库多 CVE — $",
			"福克兰群岛(马尔维纳斯群岛)镑 FKP — £",
			"冈比亚达拉西 GMD  — D",
			"刚果法郎 CDF — Fr",
			"中国香港特别行政区港元 HKD —$",
			"哥伦比亚比索 COP — $",
			"哥斯达黎加科郎 CRC — ₡",
			"格鲁吉亚拉里 GEL — ₾",
			"古巴比索 CUP — $",
			"圭亚那元 GYD — $",
			"哈萨克斯坦坚戈 KZT — ₸",
			"海地古德 HTG — G",
			"韩元 KRW — ₩",
			"荷属安的列斯盾 ANG — ƒ",
			"洪都拉斯伦皮拉 HNL — L",
			"黄金 XAU",
			"吉布提法郎 DJF  — Fr",
			"吉尔吉斯斯坦索姆 KGS —  с",
			"几内亚法郎 GNF —Fr",
			"加拿大元 CAD ——$",
			"加纳塞地 GHS — ₵",
			"柬埔寨瑞尔 KHR — ៛",
			"捷克克朗 CZK — Kč",
			"卡塔尔里亚尔 QAR — ر.ق",
			"开曼群岛元 KYD — $",
			"科摩罗法郎 KMF — Fr",
			"科威特第纳尔 KWD — د.ك",
			"克罗地亚库纳 HRK — Kn",
			"肯尼亚先令 KES — Sh",
			"拉脱维亚拉特 LVL",
			"莱索托洛蒂 LSL — L",
			"莱特币 LTC",
			"老挝基普 LAK — ₭",
			"离岸人民币 CNH",
			"黎巴嫩镑 LBP — ل.ل",
			"利比里亚元 LRD — $",
			"利比亚第纳尔 LYD — ل.د",
			"卢旺达法郎 RWF — Fr",
			"罗马尼亚新列伊 RON — lei",
			"马达加斯加阿里亚里 MGA — Ar",
			"马尔代夫拉菲亚 MVR — .ރ",
			"马拉维克瓦查 MWK — MK",
			"马来西亚林吉特 MYR  — RM",
			"北马其顿代纳尔 MKD — ден",
			"毛里求斯卢比 MUR — ₨",
			"毛里塔尼亚乌吉亚 MRO",
			"美元 USD — $",
			"蒙古图格里克 MNT — ₮",
			"孟加拉塔卡 BDT — ৳",
			"秘鲁新索尔 PEN — S/.",
			"缅甸元 MMK — Ks",
			"摩尔多瓦列伊 MDL — L",
			"摩洛哥迪拉姆 MAD — د.م.",
			"莫桑比克美提卡 MZN — MT",
			"墨西哥比索 MXN — $",
			"纳克法 ERN — Nfk",
			"纳米比亚元 NAD — $",
			"南非兰特 ZAR — R",
			"南苏丹镑 SSR — £",
			"尼加拉瓜科多巴 NIO — C$",
			"尼泊尔卢比 NPR — रू",
			"尼日利亚奈拉 NGN — ₦",
			"挪威克朗 NOK — kr",
			"欧元 EUR — €",
			"潘加 TOP — T$",
			"人民币 CNY — ￥",
			"日元 JPY — ￥",
			"瑞波币 XRP",
			"瑞典克朗 SEK — kr",
			"瑞士法郎 CHF — Fr.",
			"萨尔瓦多科朗 SVC",
			"塞尔维亚第纳尔 RSD — дин.",
			"塞拉利昂利昂 SLL — Le",
			"塞舌尔卢比 SCR — ₨",
			"沙特里亚尔 SAR — ر.س",
			"圣多美的多布拉 STD",
			"圣赫勒拿镑 SHP — £",
			"斯里兰卡卢比 LKR — ரூ",
			"斯威士马兰吉尼 SZL — L",
			"苏丹镑 SDG — ج.س.",
			"苏里南元 SRD — $",
			"所罗门群岛元 SBD — $",
			"索马里先令 SOS — Sh",
			"索莫尼 TJS — SM",
			"塔拉 WST — T",
			"中国台湾台币 TWD  — $",
			"太平洋法郎 XPF — ₣",
			"泰铢 THB — ฿",
			"坦桑尼亚先令 TZS-Sh",
			"特别提款权 XDR",
			"特立尼达和多巴哥元 TTD-$",
			"突尼斯第纳尔 TND-د.ت",
			"土耳其新里拉 TRY-₺",
			"土库曼斯坦马纳特 TMT-m",
			"瓦努阿图瓦图 VUV-Vt",
			"危地马拉格查尔 GTQ-Q",
			"委内瑞拉玻利瓦尔 VEF-Bs.",
			"文莱元 BND-$",
			"乌干达先令 UGX-Sh",
			"乌吉亚 MRU-UM",
			"乌克兰格里夫纳 UAH-₴",
			"乌拉圭比索 UYU-$",
			`乌兹别克斯坦索姆 UZS-so'm`,
			`西非法郎 XOF-Fr`,
			`新加坡元 SGD-$`,
			`新西兰元 NZD-$`,
			`匈牙利福林 HUF-Ft`,
			`叙利亚镑 SYP-ل.س`,
			`牙买加元 JMD-$`,
			`亚美尼亚德拉姆 AMD-֏`,
			`也门里亚尔 YER-﷼`,
			`伊拉克第纳尔 IQD-ع.د`,
			`伊朗里亚尔 IRR-﷼`,
			`以色列新谢克尔 ILS-₪`,
			`以太坊 ETH`,
			`印度卢比 INR-₹`,
			`印度尼西亚卢比 IDR - Rp`,
			`英镑 GBP-£`,
			`约旦第纳尔 JOD-د.ا`,
			`越南盾 VND-₫`,
			`赞比亚克瓦查 ZMW-ZK`,
			`直布罗陀镑 GIP-£`,
			`智利比索 CLP-$`,
			`中非法郎 XAF-Fr`,
		],
	},

	{ id: `1`, optionArr: ["立方千米 ( km³ )", "立方米 ( m³ )", "立方分米 ( dm³ )", "立方厘米 ( cm³ )", "立方毫米 ( mm³ )", "毫升 ( ml )", "升 ( L )", "立方英寸 ( inch³ )", "立方英尺 ( foot³ )", "立方码 ( yard³ )", "英制茶匙 ( tsp )", "英制汤匙 ( Tbs )", "英制液盎司 ( fl-oz )", "英制品脱 ( pnt )", "英制夸脱 (qt)", "英制加仑 ( gal )", "美制茶匙 ( tsp )", "美制汤匙 ( Tbs )", "美制液盎司 ( fl-oz ) ", "美制品脱 ( pnt ) ", "美制夸脱 (qt)", "美制加仑 ( gal )"] },

	{ id: `2`, optionArr: ["千米 ( km )", "米 ( m )", "分米 ( dm )", "厘米 ( cm )", "毫米 ( mm )", "微米 ( μm )", "纳米 ( nm )", "皮米 ( pm )", "光年 ( ly )", "天文单位 ( A.U. )"] },

	{
		id: `3`,
		optionArr: ["纳克 ( ng )", "微克 ( μg )", "毫克 ( mg )", "克拉 ( ct )", "克 ( g )", "千克 ( kg )", "公吨 ( t )", "千吨 ( kt )", "原子质量单位 ( u )", "道尔顿 ( D )", "公担 ( quintal )", "普朗克质量 (  )", "电子质量 (  )", "μ子质量 (  )", "质子质量 (  )", "中子质量 (  )", "氘核质量 (  )", "地球质量 (  )", "太阳质量 (  )", "盎司 ( oz )", "磅 ( lb )", "长吨 ( ton )", "英石 ( st )", "格令 ( gr )", "英担 ( hundredweight )", "打兰 ( dr )", "英制夸特 ( qr )", "短吨 ( ton )", "美石 ( st )", "美担 ( hundredweight )", "美制夸特 ( qr )", "担 ( dan )", "斤 ( jin )", "两 ( liang )", "钱 ( qian )"],
	},

	{ id: `4`, optionArr: ["摄氏度 ( ℃ )", "开尔文 ( K )", "华氏度 ( °F )", "兰氏度 ( °R )", "列氏度 ( °Re )"] },

	{ id: `5`, optionArr: ["瓦时 ( Wh )", "毫瓦时 ( mWh )", "千瓦时 ( kWh )", "兆瓦时 ( MWh )", "吉瓦时 ( GWh )", "焦耳 ( J )", "千焦 ( kJ )", "兆焦 ( MJ )", "吉焦 ( GJ )", "牛米 ( N*m )", "电子伏特 ( eV )", "卡路里 ( cal )", "千卡路里 ( kcal )", "马力时 ( hp*h )", "英尺磅 ( ft*lbf )", "马力时 ( hp*h )", "英国热量单位 ( btuUK )", "度"] },

	{ id: `6`, optionArr: ["平方纳米 ( nm² )", "平方微米 ( μm² )", "平方毫米 ( mm² )", "平方厘米 ( cm² )", "平方分米 ( dm² )", "平方米 ( m² )", "公顷 ( ha )", "平方千米 ( km² )", "平方英寸 ( in² )", "平方码 ( yd² )", "平方英尺 ( ft² )", "英亩 ( ac )", "平方英里 ( mi² )", "顷", "亩", "分", "平方尺", "平方寸"] },

	{
		id: `7`,
		optionArr: ["厘米每秒(cm/s)", "米每秒(m/s)", "千米每秒(km/s)", "千米每时(km/h)", "光速", "马赫(Ma)", "英里每时(mph)", "英尺每秒(ft/s)", "英尺每分钟(ft/min)", "英寸每秒 (in/s)", "节(kn)"],
		exChangeArr: new Map([
			["厘米每秒(cm/s)", [{ "厘米每秒(cm/s)": 1, "米每秒(m/s)": 0.01, "千米每秒(km/s)": 0.000001 }]],
			["米每秒(m/s)", { "重力加速度(g)": 0.101971621298, "米每二次方秒(m/s²)": 1 }],
			["千米每秒(km/s)", [{ "重力加速度(g)": 1, "米每二次方秒(m/s²)": 9.80665 }]],
			["千米每时(km/h)", { "重力加速度(g)": 0.101971621298, "米每二次方秒(m/s²)": 1 }],
			["光速", [{ "重力加速度(g)": 1, "米每二次方秒(m/s²)": 9.80665 }]],
			["马赫(Ma)", { "重力加速度(g)": 0.101971621298, "米每二次方秒(m/s²)": 1 }],
			["英里每时(mph)", [{ "重力加速度(g)": 1, "米每二次方秒(m/s²)": 9.80665 }]],
			["英尺每秒(ft/s)", { "重力加速度(g)": 0.101971621298, "米每二次方秒(m/s²)": 1 }],
			["英尺每分钟(ft/min)", { "重力加速度(g)": 0.101971621298, "米每二次方秒(m/s²)": 1 }],
			["英寸每秒(in/s)", [{ "重力加速度(g)": 1, "米每二次方秒(m/s²)": 9.80665 }]],
			["节(kn)", { "重力加速度(g)": 0.101971621298, "米每二次方秒(m/s²)": 1 }],
		]),
	},
	{
		id: `8`,
		optionArr: ["重力加速度(g)", "米每二次方秒(m/s²)"],
		exChangeArr: new Map([
			["重力加速度(g)", [{ "重力加速度(g)": 1, "米每二次方秒(m/s²)": 9.80665 }]],
			["米每二次方秒(m/s²)", { "重力加速度(g)": 0.101971621298, "米每二次方秒(m/s²)": 1 }],
		]),
	},
];
const theToOther = (arr, id, type) => {
	let selectArray = document.querySelectorAll(".con_box select");
	//selectedIndex 属性设置或返回下拉列表select的option中被选定的选项的索引（下标）
	let theIndex = selectArray[2 * id].selectedIndex;
	let otherIndex = selectArray[2 * id + 1].selectedIndex;

	let theValue;
	let otherValue;
	let db = 0;
	if (type === true) {
		theValue = selectArray[2 * id].options[theIndex].value;
		otherValue = selectArray[2 * id + 1].options[otherIndex].value;
	} else {
		theValue = selectArray[2 * id].options[otherIndex].value;
		otherValue = selectArray[2 * id + 1].options[theIndex].value;
	}

	for (const [key, value] of Object.entries(arr.get(theValue))) {
		if (key == Object.keys(arr.get(theValue)).find((key) => key == otherValue)) {
			db = value;
		}
	}
	if (type === true) {
		otherCoin.value = theCoin.value * db;
	} else {
		theCoin.value = otherCoin.value * db;
	}
};

const handelToogel = (index) => {
	active.value = index;
	theCoin.value = 0;
	otherCoin.value = 0;
};
</script>
<style scoped lang="scss" src="./index.scss" />
