// 博物馆推荐数据
export interface Museum {
  id: string;
  name: string;
  location: string;
  description: string;
  highlight: string;
  rating: number;
  visitors: number;
  category: string;
  imageUrl: string;
  treasures: string[];
  openHours: string;
  ticketPrice: string;
  transportation: string;
}

export const museumsData: Museum[] = [
  {
    id: '1',
    name: '故宫博物院',
    location: '北京市东城区景山前街4号',
    description: '故宫博物院是中国明清两代的皇家宫殿，旧称紫禁城，位于北京中轴线的中心。是中国古代宫廷建筑之精华，无与伦比的艺术珍宝馆，世界上现存规模最大、保存最为完整的木质结构古建筑之一。',
    highlight: '世界文化遗产，中国最大的古代文化艺术博物馆',
    rating: 4.9,
    visitors: 1900,
    category: 'national',
    imageUrl: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    treasures: [
      '《清明上河图》',
      '《千里江山图》',
      '翠玉白菜',
      '金瓯永固杯',
      '大禹治水玉山'
    ],
    openHours: '4月1日-10月31日：8:30-17:00；11月1日-次年3月31日：8:30-16:30',
    ticketPrice: '旺季60元，淡季40元',
    transportation: '地铁1号线天安门东站C出口，步行10分钟即可到达'
  },
  {
    id: '2',
    name: '中国国家博物馆',
    location: '北京市东城区东长安街16号',
    description: '中国国家博物馆是中国历史文化艺术的最高殿堂，收藏了140万余件藏品，涵盖了从远古时期到近现代的历史文物和艺术品，是了解中国历史文化的重要窗口。',
    highlight: '中国最大的综合性博物馆，世界上单体建筑面积最大的博物馆',
    rating: 4.8,
    visitors: 1200,
    category: 'national',
    imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    treasures: [
      '司母戊鼎',
      '四羊方尊',
      '利簋',
      '虢季子白盘',
      '王羲之上虞帖'
    ],
    openHours: '周二至周日：9:00-17:00（16:00停止入场），周一闭馆',
    ticketPrice: '免费，需提前预约',
    transportation: '地铁1号线天安门东站C出口，步行5分钟即可到达'
  },
  {
    id: '3',
    name: '秦始皇兵马俑博物馆',
    location: '陕西省西安市临潼区秦始皇陵以东1.5公里处',
    description: '秦始皇兵马俑博物馆是中国第一个封建皇帝秦始皇嬴政的陵园中一处大型从葬坑，被誉为"世界第八大奇迹"。兵马俑坑规模宏大，陶俑、陶马等造型逼真，是中国古代辉煌文明的象征。',
    highlight: '世界文化遗产，被誉为"世界第八大奇迹"',
    rating: 4.8,
    visitors: 800,
    category: 'historical',
    imageUrl: 'https://images.unsplash.com/photo-1587790890044-4a665722283e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    treasures: [
      '兵马俑一号坑',
      '兵马俑二号坑',
      '兵马俑三号坑',
      '铜车马',
      '石甲胄'
    ],
    openHours: '3月16日-11月14日：8:30-17:30；11月15日-次年3月15日：8:30-17:00',
    ticketPrice: '120元',
    transportation: '从西安市区乘坐旅游专线车或地铁9号线至华清池站，换乘公交或出租车即可到达'
  },
  {
    id: '4',
    name: '上海博物馆',
    location: '上海市黄浦区人民大道201号',
    description: '上海博物馆是一座大型的中国古代艺术博物馆，收藏了大量珍贵的文物，尤其是青铜器、陶瓷器、书法、绘画等藏品，在中国博物馆界享有盛誉。',
    highlight: '中国南方最大的综合性博物馆，以青铜器收藏闻名',
    rating: 4.7,
    visitors: 600,
    category: 'provincial',
    imageUrl: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    treasures: [
      '大克鼎',
      '牺尊',
      '商鞅方升',
      '缂丝莲塘乳鸭图',
      '王献之鸭头丸帖'
    ],
    openHours: '周二至周日：9:00-17:00（16:00停止入场），周一闭馆',
    ticketPrice: '免费，需提前预约',
    transportation: '地铁1号线、2号线、8号线人民广场站1号出口，步行5分钟即可到达'
  },
  {
    id: '5',
    name: '南京博物院',
    location: '江苏省南京市玄武区中山东路321号',
    description: '南京博物院是中国三大博物馆之一，其前身是1933年蔡元培等倡建的国立中央博物院，是中国第一座由国家投资兴建的大型综合类博物馆。',
    highlight: '中国三大博物馆之一，历史悠久，藏品丰富',
    rating: 4.7,
    visitors: 500,
    category: 'provincial',
    imageUrl: 'https://images.unsplash.com/photo-1593941707431-f326c02f3f54?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    treasures: [
      '金兽',
      '广陵王玺金印',
      '青花萧何月下追韩信梅瓶',
      '竹林七贤砖画',
      '坤舆万国全图'
    ],
    openHours: '周二至周日：9:00-17:00（16:30停止入场），周一闭馆',
    ticketPrice: '免费，需提前预约',
    transportation: '地铁2号线明故宫站1号出口，步行10分钟即可到达'
  },
  {
    id: '6',
    name: '河南博物院',
    location: '河南省郑州市金水区农业路8号',
    description: '河南博物院是中国建立较早的博物馆之一，也是首批中央地方共建国家级博物馆之一。馆藏文物17万余件(套)，尤以史前文物、商周青铜器、历代陶瓷器、玉器及石刻最具特色。',
    highlight: '中原文化的集中展示，商周青铜器收藏丰富',
    rating: 4.6,
    visitors: 400,
    category: 'provincial',
    imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    treasures: [
      '妇好鸮尊',
      '莲鹤方壶',
      '云纹铜禁',
      '四神云气图壁画',
      '武则天金简'
    ],
    openHours: '周二至周日：9:00-17:30（16:30停止入场），周一闭馆',
    ticketPrice: '免费，需提前预约',
    transportation: '地铁2号线关虎屯站A出口，步行10分钟即可到达'
  },
  {
    id: '7',
    name: '敦煌莫高窟',
    location: '甘肃省敦煌市东南25公里处鸣沙山东麓',
    description: '敦煌莫高窟是世界上现存规模最大、内容最丰富的佛教艺术地，被誉为"沙漠中的艺术宝库"。始建于前秦苻坚时期，历经十六国、北朝、隋、唐、五代、西夏、元等历代的兴建，形成巨大的规模。',
    highlight: '世界文化遗产，中国四大石窟之一',
    rating: 4.9,
    visitors: 200,
    category: 'historical',
    imageUrl: 'https://images.unsplash.com/photo-1586348943529-beaae6c28db9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    treasures: [
      '壁画《飞天》',
      '彩塑佛像',
      '藏经洞文献',
      '《鹿王本生图》',
      '《反弹琵琶图》'
    ],
    openHours: '4月1日-10月31日：8:00-18:00；11月1日-次年3月31日：9:00-17:30',
    ticketPrice: '旺季238元，淡季140元',
    transportation: '从敦煌市区乘坐旅游专线车或出租车即可到达'
  },
  {
    id: '8',
    name: '苏州博物馆',
    location: '江苏省苏州市姑苏区东北街204号',
    description: '苏州博物馆是由世界著名建筑大师贝聿铭设计的现代化博物馆，建筑本身就是一件艺术品。馆藏文物以苏州当地出土文物、明清书画、工艺品为主，体现了苏州地区的历史文化特色。',
    highlight: '贝聿铭设计的现代化建筑，江南文化的集中展示',
    rating: 4.6,
    visitors: 300,
    category: 'provincial',
    imageUrl: 'https://images.unsplash.com/photo-1584539610135-2a2f2286f064?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    treasures: [
      '真珠舍利宝幢',
      '秘色瓷莲花碗',
      '七君子图卷',
      '文徵明手卷',
      '唐寅山水轴'
    ],
    openHours: '周二至周日：9:00-17:00（16:00停止入场），周一闭馆',
    ticketPrice: '免费，需提前预约',
    transportation: '地铁1号线临顿路站3号出口，步行15分钟即可到达'
  },
  {
    id: '9',
    name: '广汉三星堆博物馆',
    location: '四川省广汉市西安路133号',
    description: '三星堆博物馆是中国一座现代化的专题性遗址博物馆，展示了三星堆遗址出土的大量珍贵文物，这些文物以其独特的造型和精湛的工艺，揭示了古蜀文明的神秘面纱。',
    highlight: '古蜀文明的神秘面纱，青铜面具震惊世界',
    rating: 4.7,
    visitors: 200,
    category: 'specialized',
    imageUrl: 'https://images.unsplash.com/photo-1587918889231-27b6334221c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    treasures: [
      '青铜大立人像',
      '青铜面具',
      '青铜神树',
      '金杖',
      '玉璋'
    ],
    openHours: '全年：8:30-18:00（17:00停止入场）',
    ticketPrice: '80元',
    transportation: '从成都市区乘坐高铁至广汉北站，换乘公交或出租车即可到达'
  },
  {
    id: '10',
    name: '中国科学技术馆',
    location: '北京市朝阳区北辰东路5号',
    description: '中国科学技术馆是中国唯一的国家级综合性科技博物馆，是实施科教兴国战略和提高全民族科学文化素养的基础科普设施。',
    highlight: '中国最大的科技博物馆，互动性强，适合全家参观',
    rating: 4.5,
    visitors: 400,
    category: 'specialized',
    imageUrl: 'https://images.unsplash.com/photo-1558981001-5864b325d512?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    treasures: [
      '神舟五号返回舱',
      '嫦娥一号卫星模型',
      '蛟龙号载人潜水器模型',
      'FAST射电望远镜模型',
      '互动科学实验装置'
    ],
    openHours: '周二至周日：9:30-17:00（16:00停止入场），周一闭馆',
    ticketPrice: '30元',
    transportation: '地铁8号线奥林匹克公园站C出口，步行5分钟即可到达'
  },
  {
    id: '11',
    name: '中国美术馆',
    location: '北京市东城区五四大街1号',
    description: '中国美术馆是中国唯一的国家造型艺术博物馆，收藏、研究、展示20世纪以来中国美术作品，推动中国美术事业的发展。',
    highlight: '中国最高艺术殿堂，近现代美术作品收藏丰富',
    rating: 4.5,
    visitors: 200,
    category: 'art',
    imageUrl: 'https://images.unsplash.com/photo-1574267432553-4b4628081c31?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    treasures: [
      '齐白石《虾》',
      '徐悲鸿《奔马》',
      '张大千《长江万里图》',
      '吴冠中《北国风光》',
      '罗中立《父亲》'
    ],
    openHours: '周二至周日：9:00-17:00（16:00停止入场），周一闭馆',
    ticketPrice: '免费，需提前预约',
    transportation: '地铁8号线中国美术馆站A出口，步行3分钟即可到达'
  },
  {
    id: '12',
    name: '秦始皇陵博物院',
    location: '陕西省西安市临潼区秦始皇陵',
    description: '秦始皇陵博物院是以秦始皇陵遗址公园和秦始皇兵马俑博物馆为依托的大型遗址博物院，展示了秦始皇陵的整体布局和丰富的陪葬坑。',
    highlight: '世界文化遗产，秦始皇陵整体保护与展示',
    rating: 4.8,
    visitors: 700,
    category: 'historical',
    imageUrl: 'https://images.unsplash.com/photo-1587790890044-4a665722283e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    treasures: [
      '兵马俑坑',
      '铜车马展厅',
      '石铠甲坑',
      '百戏俑坑',
      '文官俑坑'
    ],
    openHours: '3月16日-11月14日：8:30-17:30；11月15日-次年3月15日：8:30-17:00',
    ticketPrice: '120元',
    transportation: '从西安市区乘坐旅游专线车或地铁9号线至华清池站，换乘公交或出租车即可到达'
  }
];
