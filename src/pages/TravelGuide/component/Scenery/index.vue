<template>
  <div class="scenery-container">
    <!-- 轮播图部分 -->
    <div class="carousel" ref="carouselRef">
      <div class="carousel-inner" :style="{ transform: `translateX(-${currentSlide * 100}%)` }">
        <div v-for="(slide, index) in enhancedSlides" :key="index" class="carousel-item">
          <div class="carousel-content">
            <img :src="slide.imageUrl" :alt="slide.title" />
            <div class="carousel-caption">
              <h3>{{ slide.title }}</h3>
              <p>{{ slide.description }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="carousel-indicators">
        <span v-for="(slide, index) in enhancedSlides" :key="index" class="indicator" :class="{ active: index === currentSlide }" @click="goToSlide(index)"></span>
      </div>
      <button class="carousel-control prev" @click="prevSlide">‹</button>
      <button class="carousel-control next" @click="nextSlide">›</button>
    </div>

    <!-- 景区概览部分 -->
    <div class="scenery-overview">
      <div class="overview-content">
        <h2>{{ sceneryOverview.title }}</h2>
        <p>{{ sceneryOverview.description }}</p>
        <div class="overview-stats">
          <div class="stat-item">
            <i class="icon-view"></i>
            <span>{{ sceneryOverview.viewCount }}</span>
            <span>浏览</span>
          </div>
          <div class="stat-item">
            <i class="icon-collection"></i>
            <span>{{ sceneryOverview.collectionCount }}</span>
            <span>收藏</span>
          </div>
          <div class="stat-item">
            <i class="icon-share"></i>
            <span>{{ sceneryOverview.shareCount }}</span>
            <span>分享</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 季节风光部分 -->
    <div class="seasonal-scenery">
      <h2 class="section-title">四季风光</h2>
      <div class="season-selector">
        <button v-for="season in seasons" :key="season.value" :class="{ active: selectedSeason === season.value }" @click="selectSeason(season.value)">
          {{ season.label }}
        </button>
      </div>
      <div class="seasonal-content" v-for="season in seasons" :key="season.value" v-show="selectedSeason === season.value">
        <div class="season-images">
          <img v-for="(image, index) in seasonalScenery[season.value].images" :key="index" :src="image" :alt="`${season.label}风光`" />
        </div>
        <div class="season-description">
          <h3>{{ seasonalScenery[season.value].title }}</h3>
          <p>{{ seasonalScenery[season.value].description }}</p>
        </div>
      </div>
    </div>

    <!-- 分类选择器 -->
    <div class="category-selector">
      <button v-for="category in categories" :key="category.value" :class="{ active: selectedCategory === category.value }" @click="selectCategory(category.value)">
        {{ category.label }}
      </button>
    </div>

    <!-- 景点列表 -->
    <div class="scenery-list">
      <div v-for="spot in sortedAndFilteredScenery" :key="spot.id" class="scenery-item">
        <div class="scenery-image">
          <img :src="spot.imageUrl" :alt="spot.name" />
          <div class="image-overlay">
            <div class="overlay-content">
              <div class="scenery-info">
                <h4>{{ spot.name }}</h4>
                <p>{{ spot.address }}</p>
                <div class="scenery-stats">
                  <span class="view-count">{{ spot.viewCount }} 浏览</span>
                  <span class="rating">{{ spot.rating }} 评分</span>
                </div>
              </div>
              <div class="scenery-actions">
                <button class="action-btn like-btn" @click="toggleLike(spot)">
                  <i :class="spot.isLiked ? 'icon-heart-filled' : 'icon-heart'"></i>
                  {{ spot.isLiked ? '已收藏' : '收藏' }}
                </button>
                <button class="action-btn share-btn" @click="shareScenery(spot)">
                  <i class="icon-share"></i>
                  分享
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 特色活动部分 -->
    <div class="special-activities">
      <h2 class="section-title">特色活动</h2>
      <div class="activities-list">
        <div v-for="activity in specialActivities" :key="activity.id" class="activity-item">
          <div class="activity-image">
            <img :src="activity.imageUrl" :alt="activity.title" />
          </div>
          <div class="activity-content">
            <h3>{{ activity.title }}</h3>
            <p>{{ activity.description }}</p>
            <div class="activity-time">{{ activity.time }}</div>
            <button class="activity-btn" @click="joinActivity(activity)">参加活动</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 旅游路线部分 -->
    <div class="travel-routes">
      <h2 class="section-title">旅游路线</h2>
      <div class="routes-list">
        <div v-for="route in travelRoutes" :key="route.id" class="route-item">
          <div class="route-header">
            <h3>{{ route.title }}</h3>
            <div class="route-duration">{{ route.duration }}</div>
          </div>
          <div class="route-content">
            <p>{{ route.description }}</p>
            <div class="route-highlights">
              <span v-for="(highlight, index) in route.highlights" :key="index" class="highlight-tag">{{ highlight }}</span>
            </div>
          </div>
          <button class="route-btn" @click="viewRouteDetail(route)">查看详情</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  location: {
    type: String,
    default: '黄山'
  }
});

// 响应式数据
const currentSlide = ref(0);
const selectedCategory = ref('all');
const selectedSeason = ref('spring');
const sortOrder = ref('desc');
const seasons = [
  { label: '春季', value: 'spring' },
  { label: '夏季', value: 'summer' },
  { label: '秋季', value: 'autumn' },
  { label: '冬季', value: 'winter' }
];

// 静态数据
const staticData = {
  // 轮播图数据
  carouselData: {
    '北京': [
      {
        title: '故宫博物院',
        description: '中国明清两代的皇家宫殿',
        imageUrl: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=Forbidden%20City%20Beijing%20sunset&size=1024x768'
      },
      {
        title: '长城',
        description: '中国古代的伟大防御工程',
        imageUrl: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=Great%20Wall%20of%20China%20mountain%20view&size=1024x768'
      },
      {
        title: '颐和园',
        description: '中国古典园林',
        imageUrl: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=Summer%20Palace%20Beijing%20lake&size=1024x768'
      }
    ],
    '上海': [
      {
        title: '外滩',
        description: '上海的标志性景观',
        imageUrl: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=Shanghai%20Bund%20skyline%20night&size=1024x768'
      },
      {
        title: '东方明珠',
        description: '上海的地标建筑',
        imageUrl: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=Oriental%20Pearl%20Tower%20Shanghai&size=1024x768'
      },
      {
        title: '豫园',
        description: '上海的古典园林',
        imageUrl: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=Yu%20Garden%20Shanghai%20traditional&size=1024x768'
      }
    ],
    'default': [
      {
        title: '黄山云海',
        description: '黄山四绝之一',
        imageUrl: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=Huangshan%20Mountain%20sea%20of%20clouds&size=1024x768'
      },
      {
        title: '宏村',
        description: '中国传统村落',
        imageUrl: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=Hongcun%20ancient%20village%20China&size=1024x768'
      }
    ]
  },

  // 景点数据
  sceneryData: {
    '北京': [
      {
        id: 1,
        name: '故宫博物院',
        address: '北京市东城区景山前街4号',
        imageUrl: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=Forbidden%20City%20Beijing%20detailed&size=1024x768',
        rating: 4.9,
        viewCount: 125800,
        isLiked: false,
        category: 'historical'
      },
      {
        id: 2,
        name: '长城',
        address: '北京市怀柔区',
        imageUrl: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=Great%20Wall%20Mutianyu%20section&size=1024x768',
        rating: 4.8,
        viewCount: 98600,
        isLiked: false,
        category: 'historical'
      },
      {
        id: 3,
        name: '颐和园',
        address: '北京市海淀区新建宫门路19号',
        imageUrl: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=Summer%20Palace%20Kunming%20Lake&size=1024x768',
        rating: 4.7,
        viewCount: 87500,
        isLiked: false,
        category: 'garden'
      },
      {
        id: 4,
        name: '天坛',
        address: '北京市东城区天坛内东路',
        imageUrl: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=Temple%20of%20Heaven%20Beijing&size=1024x768',
        rating: 4.6,
        viewCount: 65400,
        isLiked: false,
        category: 'historical'
      },
      {
        id: 5,
        name: '天安门广场',
        address: '北京市东城区',
        imageUrl: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=Tiananmen%20Square%20Beijing&size=1024x768',
        rating: 4.5,
        viewCount: 112300,
        isLiked: false,
        category: 'landmark'
      },
      {
        id: 6,
        name: '圆明园',
        address: '北京市海淀区清华西路28号',
        imageUrl: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=Old%20Summer%20Palace%20Beijing&size=1024x768',
        rating: 4.4,
        viewCount: 43200,
        isLiked: false,
        category: 'historical'
      },
      {
        id: 7,
        name: '恭王府',
        address: '北京市西城区前海西街17号',
        imageUrl: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=Prince%20Gong%27s%20Mansion%20Beijing&size=1024x768',
        rating: 4.3,
        viewCount: 32100,
        isLiked: false,
        category: 'historical'
      },
      {
        id: 8,
        name: '北海公园',
        address: '北京市西城区文津街1号',
        imageUrl: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=Beihai%20Park%20Beijing&size=1024x768',
        rating: 4.2,
        viewCount: 54300,
        isLiked: false,
        category: 'garden'
      }
    ],
    '上海': [
      {
        id: 1,
        name: '外滩',
        address: '上海市黄浦区中山东一路',
        imageUrl: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=Shanghai%20Bund%20day%20view&size=1024x768',
        rating: 4.8,
        viewCount: 156700,
        isLiked: false,
        category: 'landmark'
      },
      {
        id: 2,
        name: '东方明珠',
        address: '上海市浦东新区世纪大道1号',
        imageUrl: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=Oriental%20Pearl%20Tower%20night&size=1024x768',
        rating: 4.7,
        viewCount: 134500,
        isLiked: false,
        category: 'landmark'
      },
      {
        id: 3,
        name: '豫园',
        address: '上海市黄浦区豫园路132号',
        imageUrl: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=Yu%20Garden%20Shanghai%20detail&size=1024x768',
        rating: 4.6,
        viewCount: 87600,
        isLiked: false,
        category: 'garden'
      },
      {
        id: 4,
        name: '上海迪士尼乐园',
        address: '上海市浦东新区申迪南路753号',
        imageUrl: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=Shanghai%20Disneyland%20castle&size=1024x768',
        rating: 4.9,
        viewCount: 213400,
        isLiked: false,
        category: 'entertainment'
      },
      {
        id: 5,
        name: '南京路步行街',
        address: '上海市黄浦区南京东路',
        imageUrl: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=Nanjing%20Road%20Shanghai%20shopping&size=1024x768',
        rating: 4.5,
        viewCount: 187600,
        isLiked: false,
        category: 'shopping'
      },
      {
        id: 6,
        name: '静安寺',
        address: '上海市静安区南京西路1686号',
        imageUrl: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=Jing%27an%20Temple%20Shanghai&size=1024x768',
        rating: 4.4,
        viewCount: 56700,
        isLiked: false,
        category: 'religious'
      },
      {
        id: 7,
        name: '上海博物馆',
        address: '上海市黄浦区人民大道201号',
        imageUrl: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=Shanghai%20Museum&size=1024x768',
        rating: 4.7,
        viewCount: 78900,
        isLiked: false,
        category: 'museum'
      },
      {
        id: 8,
        name: '新天地',
        address: '上海市黄浦区太仓路181弄',
        imageUrl: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=Xintiandi%20Shanghai%20lifestyle&size=1024x768',
        rating: 4.6,
        viewCount: 98700,
        isLiked: false,
        category: 'lifestyle'
      }
    ],
    'default': [
      {
        id: 1,
        name: '黄山风景区',
        address: '安徽省黄山市黄山区汤口镇',
        imageUrl: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=Huangshan%20Mountain%20peak&size=1024x768',
        rating: 4.9,
        viewCount: 189000,
        isLiked: false,
        category: 'natural'
      },
      {
        id: 2,
        name: '宏村',
        address: '安徽省黄山市黟县宏村镇',
        imageUrl: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=Hongcun%20village%20reflection&size=1024x768',
        rating: 4.8,
        viewCount: 123400,
        isLiked: false,
        category: 'cultural'
      },
      {
        id: 3,
        name: '西递',
        address: '安徽省黄山市黟县西递镇',
        imageUrl: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=Xidi%20ancient%20village&size=1024x768',
        rating: 4.7,
        viewCount: 87600,
        isLiked: false,
        category: 'cultural'
      },
      {
        id: 4,
        name: '屯溪老街',
        address: '安徽省黄山市屯溪区',
        imageUrl: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=Tunxi%20Old%20Street%20Huangshan&size=1024x768',
        rating: 4.6,
        viewCount: 76500,
        isLiked: false,
        category: 'shopping'
      },
      {
        id: 5,
        name: '翡翠谷',
        address: '安徽省黄山市黄山区汤口镇',
        imageUrl: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=Emerald%20Valley%20Huangshan&size=1024x768',
        rating: 4.5,
        viewCount: 65400,
        isLiked: false,
        category: 'natural'
      },
      {
        id: 6,
        name: '光明顶',
        address: '安徽省黄山市黄山区黄山风景区内',
        imageUrl: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=Bright%20Top%20Huangshan%20sunrise&size=1024x768',
        rating: 4.9,
        viewCount: 112300,
        isLiked: false,
        category: 'natural'
      },
      {
        id: 7,
        name: '迎客松',
        address: '安徽省黄山市黄山区黄山风景区内',
        imageUrl: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=Greeting%20Guest%20Pine%20Huangshan&size=1024x768',
        rating: 4.8,
        viewCount: 156700,
        isLiked: false,
        category: 'natural'
      },
      {
        id: 8,
        name: '九龙瀑',
        address: '安徽省黄山市黄山区汤口镇',
        imageUrl: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=Nine%20Dragon%20Waterfall%20Huangshan&size=1024x768',
        rating: 4.4,
        viewCount: 54300,
        isLiked: false,
        category: 'natural'
      }
    ]
  },

  // 季节风光数据
  seasonalData: {
    '北京': {
      spring: {
        title: '北京春季',
        description: '北京的春季，桃花、樱花盛开，颐和园、植物园等地都是赏花的好去处。',
        images: [
          'https://neeko-copilot.bytedance.net/api/text2image?prompt=Beijing%20spring%20cherry%20blossom&size=1024x768',
          'https://neeko-copilot.bytedance.net/api/text2image?prompt=Beijing%20Botanical%20Garden%20spring&size=1024x768',
          'https://neeko-copilot.bytedance.net/api/text2image?prompt=Summer%20Palace%20spring%20flowers&size=1024x768'
        ]
      },
      summer: {
        title: '北京夏季',
        description: '北京的夏季，虽然炎热，但颐和园、北海公园等水域景区是避暑的好地方。',
        images: [
          'https://neeko-copilot.bytedance.net/api/text2image?prompt=Beijing%20Summer%20Palace%20lake&size=1024x768',
          'https://neeko-copilot.bytedance.net/api/text2image?prompt=Beihai%20Park%20summer&size=1024x768',
          'https://neeko-copilot.bytedance.net/api/text2image?prompt=Beijing%20Hutong%20summer&size=1024x768'
        ]
      },
      autumn: {
        title: '北京秋季',
        description: '北京的秋季，红叶满山，香山、颐和园等地都是赏红叶的绝佳地点。',
        images: [
          'https://neeko-copilot.bytedance.net/api/text2image?prompt=Fragrant%20Hills%20red%20leaves&size=1024x768',
          'https://neeko-copilot.bytedance.net/api/text2image?prompt=Beijing%20autumn%20park&size=1024x768',
          'https://neeko-copilot.bytedance.net/api/text2image?prompt=Summer%20Palace%20autumn&size=1024x768'
        ]
      },
      winter: {
        title: '北京冬季',
        description: '北京的冬季，白雪皑皑，故宫、长城等地银装素裹，别有一番风味。',
        images: [
          'https://neeko-copilot.bytedance.net/api/text2image?prompt=Forbidden%20City%20winter%20snow&size=1024x768',
          'https://neeko-copilot.bytedance.net/api/text2image?prompt=Great%20Wall%20winter%20snow&size=1024x768',
          'https://neeko-copilot.bytedance.net/api/text2image?prompt=Beijing%20hutong%20winter&size=1024x768'
        ]
      }
    },
    '上海': {
      spring: {
        title: '上海春季',
        description: '上海的春季，外滩、世纪公园等地鲜花盛开，是踏青的好时节。',
        images: [
          'https://neeko-copilot.bytedance.net/api/text2image?prompt=Shanghai%20spring%20flowers&size=1024x768',
          'https://neeko-copilot.bytedance.net/api/text2image?prompt=Century%20Park%20Shanghai%20spring&size=1024x768',
          'https://neeko-copilot.bytedance.net/api/text2image?prompt=Shanghai%20Bund%20spring&size=1024x768'
        ]
      },
      summer: {
        title: '上海夏季',
        description: '上海的夏季，虽然炎热，但外滩的夜景、迪士尼乐园的水上项目都是不错的选择。',
        images: [
          'https://neeko-copilot.bytedance.net/api/text2image?prompt=Shanghai%20night%20summer&size=1024x768',
          'https://neeko-copilot.bytedance.net/api/text2image?prompt=Shanghai%20Disneyland%20summer&size=1024x768',
          'https://neeko-copilot.bytedance.net/api/text2image?prompt=Yu%20Garden%20summer&size=1024x768'
        ]
      },
      autumn: {
        title: '上海秋季',
        description: '上海的秋季，天气宜人，外滩、豫园等地都是散步的好地方。',
        images: [
          'https://neeko-copilot.bytedance.net/api/text2image?prompt=Shanghai%20Bund%20autumn&size=1024x768',
          'https://neeko-copilot.bytedance.net/api/text2image?prompt=Yu%20Garden%20autumn&size=1024x768',
          'https://neeko-copilot.bytedance.net/api/text2image?prompt=Shanghai%20park%20autumn&size=1024x768'
        ]
      },
      winter: {
        title: '上海冬季',
        description: '上海的冬季，虽然寒冷，但外滩的灯光秀、迪士尼乐园的圣诞活动都很精彩。',
        images: [
          'https://neeko-copilot.bytedance.net/api/text2image?prompt=Shanghai%20Bund%20winter%20lights&size=1024x768',
          'https://neeko-copilot.bytedance.net/api/text2image?prompt=Shanghai%20Disneyland%20Christmas&size=1024x768',
          'https://neeko-copilot.bytedance.net/api/text2image?prompt=Shanghai%20winter%20skyline&size=1024x768'
        ]
      }
    },
    'default': {
      spring: {
        title: '黄山春季',
        description: '黄山的春季，云海缭绕，杜鹃花开，是登山的好时节。',
        images: [
          'https://neeko-copilot.bytedance.net/api/text2image?prompt=Huangshan%20spring%20clouds&size=1024x768',
          'https://neeko-copilot.bytedance.net/api/text2image?prompt=Huangshan%20spring%20azaleas&size=1024x768',
          'https://neeko-copilot.bytedance.net/api/text2image?prompt=Hongcun%20spring&size=1024x768'
        ]
      },
      summer: {
        title: '黄山夏季',
        description: '黄山的夏季，凉爽宜人，是避暑的绝佳胜地。',
        images: [
          'https://neeko-copilot.bytedance.net/api/text2image?prompt=Huangshan%20summer%20waterfall&size=1024x768',
          'https://neeko-copilot.bytedance.net/api/text2image?prompt=Huangshan%20summer%20forest&size=1024x768',
          'https://neeko-copilot.bytedance.net/api/text2image?prompt=Hongcun%20summer&size=1024x768'
        ]
      },
      autumn: {
        title: '黄山秋季',
        description: '黄山的秋季，层林尽染，红叶满山，是赏秋的绝佳地点。',
        images: [
          'https://neeko-copilot.bytedance.net/api/text2image?prompt=Huangshan%20autumn%20red%20leaves&size=1024x768',
          'https://neeko-copilot.bytedance.net/api/text2image?prompt=Huangshan%20autumn%20sunset&size=1024x768',
          'https://neeko-copilot.bytedance.net/api/text2image?prompt=Hongcun%20autumn&size=1024x768'
        ]
      },
      winter: {
        title: '黄山冬季',
        description: '黄山的冬季，银装素裹，雾凇冰挂，是赏雪景的绝佳时节。',
        images: [
          'https://neeko-copilot.bytedance.net/api/text2image?prompt=Huangshan%20winter%20snow&size=1024x768',
          'https://neeko-copilot.bytedance.net/api/text2image?prompt=Huangshan%20winter%20rime&size=1024x768',
          'https://neeko-copilot.bytedance.net/api/text2image?prompt=Hongcun%20winter&size=1024x768'
        ]
      }
    }
  },

  // 特色活动数据
  activitiesData: {
    '北京': [
      {
        id: 1,
        title: '故宫夜场灯光秀',
        description: '故宫博物院举办的夜间灯光秀，让您在夜色中感受紫禁城的神秘魅力。',
        time: '2024年5月1日-5月7日',
        imageUrl: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=Forbidden%20City%20night%20light%20show&size=1024x768'
      },
      {
        id: 2,
        title: '长城马拉松',
        description: '在雄伟的长城脚下举办的马拉松比赛，感受历史与运动的完美结合。',
        time: '2024年4月20日',
        imageUrl: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=Great%20Wall%20marathon&size=1024x768'
      },
      {
        id: 3,
        title: '颐和园荷花节',
        description: '颐和园举办的荷花节，欣赏美丽的荷花，感受夏日的清凉。',
        time: '2024年6月15日-8月15日',
        imageUrl: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=Summer%20Palace%20lotus%20festival&size=1024x768'
      }
    ],
    '上海': [
      {
        id: 1,
        title: '上海国际电影节',
        description: '上海国际电影节是中国最大的国际电影节之一，展示来自世界各地的优秀电影。',
        time: '2024年6月15日-6月23日',
        imageUrl: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=Shanghai%20International%20Film%20Festival&size=1024x768'
      },
      {
        id: 2,
        title: '外滩灯光节',
        description: '外滩举办的灯光节，各种灯光艺术装置让外滩更加绚丽多彩。',
        time: '2024年5月1日-5月31日',
        imageUrl: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=Shanghai%20Bund%20light%20festival&size=1024x768'
      },
      {
        id: 3,
        title: '上海迪士尼夏日狂欢节',
        description: '上海迪士尼乐园举办的夏日狂欢节，各种水上活动和表演让您度过一个快乐的夏天。',
        time: '2024年6月1日-8月31日',
        imageUrl: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=Shanghai%20Disneyland%20summer%20festival&size=1024x768'
      }
    ],
    'default': [
      {
        id: 1,
        title: '黄山国际登山节',
        description: '黄山国际登山节是黄山每年举办的重要活动，吸引了来自世界各地的登山爱好者。',
        time: '2024年9月10日-9月15日',
        imageUrl: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=Huangshan%20Mountain%20climbing%20festival&size=1024x768'
      },
      {
        id: 2,
        title: '宏村国际摄影节',
        description: '宏村国际摄影节是在宏村举办的摄影盛会，展示宏村的美丽风光和人文风情。',
        time: '2024年10月1日-10月7日',
        imageUrl: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=Hongcun%20photography%20festival&size=1024x768'
      },
      {
        id: 3,
        title: '黄山云海节',
        description: '黄山云海节是黄山举办的特色活动，让您在最佳的季节欣赏到最美的云海景观。',
        time: '2024年11月1日-11月30日',
        imageUrl: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=Huangshan%20sea%20of%20clouds%20festival&size=1024x768'
      }
    ]
  },

  // 旅游路线数据
  routesData: {
    '北京': [
      {
        id: 1,
        title: '北京经典一日游',
        description: '游览北京最著名的景点，包括故宫、天安门广场、颐和园等。',
        duration: '1天',
        highlights: ['故宫博物院', '天安门广场', '颐和园', '天坛']
      },
      {
        id: 2,
        title: '北京文化深度游',
        description: '深入了解北京的历史文化，游览长城、恭王府、南锣鼓巷等景点。',
        duration: '2天',
        highlights: ['长城', '恭王府', '南锣鼓巷', '国子监', '雍和宫']
      },
      {
        id: 3,
        title: '北京现代都市游',
        description: '感受北京的现代魅力，游览798艺术区、三里屯、国贸等现代地标。',
        duration: '1天',
        highlights: ['798艺术区', '三里屯', '国贸', '奥林匹克公园', '水立方']
      }
    ],
    '上海': [
      {
        id: 1,
        title: '上海经典一日游',
        description: '游览上海最著名的景点，包括外滩、东方明珠、豫园等。',
        duration: '1天',
        highlights: ['外滩', '东方明珠', '豫园', '南京路步行街']
      },
      {
        id: 2,
        title: '上海迪士尼乐园游',
        description: '在上海迪士尼乐园度过愉快的一天，体验各种游乐设施和表演。',
        duration: '1天',
        highlights: ['上海迪士尼乐园', '米奇大街', '奇想花园', '探险岛', '宝藏湾']
      },
      {
        id: 3,
        title: '上海文化艺术游',
        description: '感受上海的文化艺术氛围，游览上海博物馆、新天地、田子坊等。',
        duration: '1天',
        highlights: ['上海博物馆', '新天地', '田子坊', '上海大剧院', '刘海粟美术馆']
      }
    ],
    'default': [
      {
        id: 1,
        title: '黄山精华二日游',
        description: '游览黄山风景区的精华景点，包括光明顶、迎客松、天都峰等。',
        duration: '2天',
        highlights: ['黄山风景区', '光明顶', '迎客松', '天都峰', '西海大峡谷']
      },
      {
        id: 2,
        title: '徽州古村落游',
        description: '游览安徽南部的徽州古村落，包括宏村、西递、南屏等。',
        duration: '2天',
        highlights: ['宏村', '西递', '南屏', '关麓', '塔川']
      },
      {
        id: 3,
        title: '黄山全景三日游',
        description: '全面游览黄山风景区和周边的徽州古村落，感受黄山的自然美景和徽州的人文风情。',
        duration: '3天',
        highlights: ['黄山风景区', '宏村', '西递', '屯溪老街', '翡翠谷']
      }
    ]
  },

  // 分类数据
  categories: [
    { label: '全部', value: 'all' },
    { label: '自然风光', value: 'natural' },
    { label: '历史古迹', value: 'historical' },
    { label: '文化艺术', value: 'cultural' },
    { label: '园林景观', value: 'garden' },
    { label: '地标建筑', value: 'landmark' },
    { label: '娱乐休闲', value: 'entertainment' },
    { label: '购物美食', value: 'shopping' },
    { label: '宗教场所', value: 'religious' },
    { label: '博物馆', value: 'museum' },
    { label: '生活方式', value: 'lifestyle' }
  ],

  // 景区概览数据
  overviewData: {
    '北京': {
      title: '北京',
      description: '北京是中国的首都，拥有悠久的历史和丰富的文化遗产。这里有世界上最大的古代宫殿建筑群——故宫，有雄伟的万里长城，有美丽的颐和园等众多著名景点。',
      viewCount: 1024567,
      collectionCount: 56789,
      shareCount: 23456
    },
    '上海': {
      title: '上海',
      description: '上海是中国的经济中心，也是一座国际化大都市。这里有现代化的摩天大楼，有充满历史韵味的外滩，有传统的豫园，有全球知名的迪士尼乐园等众多景点。',
      viewCount: 987654,
      collectionCount: 45678,
      shareCount: 12345
    },
    'default': {
      title: '黄山',
      description: '黄山是中国著名的山岳风景区，以奇松、怪石、云海、温泉"四绝"著称于世。这里有壮观的山峰，有美丽的云海，有古朴的徽州古村落，是旅游度假的绝佳去处。',
      viewCount: 876543,
      collectionCount: 34567,
      shareCount: 9876
    }
  }
};

// 计算属性
const sceneryOverview = computed(() => {
  return staticData.overviewData[props.location] || staticData.overviewData.default;
});

const enhancedSlides = computed(() => {
  return staticData.carouselData[props.location] || staticData.carouselData.default;
});

const scenerySpots = computed(() => {
  return staticData.sceneryData[props.location] || staticData.sceneryData.default;
});

const filteredScenery = computed(() => {
  if (selectedCategory.value === 'all') {
    return scenerySpots.value;
  }
  return scenerySpots.value.filter(spot => spot.category === selectedCategory.value);
});

const sortedAndFilteredScenery = computed(() => {
  return [...filteredScenery.value].sort((a, b) => {
    if (sortOrder.value === 'desc') {
      return b.viewCount - a.viewCount;
    } else {
      return a.viewCount - b.viewCount;
    }
  });
});

const seasonalScenery = computed(() => {
  return staticData.seasonalData[props.location] || staticData.seasonalData.default;
});

const specialActivities = computed(() => {
  return staticData.activitiesData[props.location] || staticData.activitiesData.default;
});

const travelRoutes = computed(() => {
  return staticData.routesData[props.location] || staticData.routesData.default;
});

const categories = computed(() => {
  return staticData.categories;
});

// 方法
const selectCategory = (category) => {
  selectedCategory.value = category;
};

const selectSeason = (season) => {
  selectedSeason.value = season;
};

const toggleLike = (spot) => {
  spot.isLiked = !spot.isLiked;
};

const shareScenery = (spot) => {
  console.log('分享景点:', spot.name);
  // 这里可以添加分享功能的实现
};

const joinActivity = (activity) => {
  console.log('参加活动:', activity.title);
  // 这里可以添加参加活动功能的实现
};

const viewRouteDetail = (route) => {
  console.log('查看路线详情:', route.title);
  // 这里可以添加查看路线详情功能的实现
};

// 轮播图相关方法
const carouselRef = ref(null);
const autoplayInterval = ref(null);

const goToSlide = (index) => {
  currentSlide.value = index;
};

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % enhancedSlides.value.length;
};

const prevSlide = () => {
  currentSlide.value = (currentSlide.value - 1 + enhancedSlides.value.length) % enhancedSlides.value.length;
};

const startAutoplay = () => {
  autoplayInterval.value = setInterval(nextSlide, 3000);
};

const stopAutoplay = () => {
  if (autoplayInterval.value) {
    clearInterval(autoplayInterval.value);
  }
};

// 生命周期
onMounted(() => {
  startAutoplay();
});

onUnmounted(() => {
  stopAutoplay();
});
</script>

<style scoped>
.scenery-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

/* 轮播图样式 */
.carousel {
  position: relative;
  overflow: hidden;
  border-radius: 10px;
  margin-bottom: 40px;
}

.carousel-inner {
  display: flex;
  transition: transform 0.5s ease;
}

.carousel-item {
  min-width: 100%;
  position: relative;
}

.carousel-content {
  position: relative;
  height: 400px;
}

.carousel-content img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.carousel-caption {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 20px;
}

.carousel-indicators {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
}

.indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: background 0.3s ease;
}

.indicator.active {
  background: white;
}

.carousel-control {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s ease;
}

.carousel-control:hover {
  background: rgba(0, 0, 0, 0.8);
}

.carousel-control.prev {
  left: 10px;
}

.carousel-control.next {
  right: 10px;
}

/* 景区概览样式 */
.scenery-overview {
  background: #f5f5f5;
  border-radius: 10px;
  padding: 30px;
  margin-bottom: 40px;
}

.overview-content h2 {
  margin-top: 0;
  margin-bottom: 20px;
  color: #333;
}

.overview-content p {
  margin-bottom: 30px;
  line-height: 1.6;
  color: #666;
}

.overview-stats {
  display: flex;
  gap: 40px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #666;
}

.stat-item i {
  font-size: 24px;
  color: #007bff;
}

.stat-item span:first-of-type {
  font-size: 20px;
  font-weight: bold;
  color: #333;
}

/* 季节风光样式 */
.seasonal-scenery {
  margin-bottom: 40px;
}

.section-title {
  font-size: 24px;
  color: #333;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #007bff;
}

.season-selector {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.season-selector button {
  padding: 10px 20px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.season-selector button.active {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

.seasonal-content {
  background: #f5f5f5;
  border-radius: 10px;
  padding: 20px;
}

.season-images {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 20px;
}

.season-images img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 5px;
}

.season-description h3 {
  margin-top: 0;
  margin-bottom: 10px;
  color: #333;
}

.season-description p {
  line-height: 1.6;
  color: #666;
}

/* 分类选择器样式 */
.category-selector {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
  padding: 20px;
  background: #f5f5f5;
  border-radius: 10px;
}

.category-selector button {
  padding: 8px 16px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
}

.category-selector button.active {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

/* 景点列表样式 */
.scenery-list {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 40px;
}

.scenery-item {
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.scenery-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
}

.scenery-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.scenery-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.scenery-item:hover .scenery-image img {
  transform: scale(1.1);
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.scenery-item:hover .image-overlay {
  opacity: 1;
}

.overlay-content {
  text-align: center;
  color: white;
  padding: 20px;
}

.scenery-info h4 {
  margin-top: 0;
  margin-bottom: 10px;
  font-size: 18px;
}

.scenery-info p {
  margin-bottom: 15px;
  font-size: 14px;
  opacity: 0.9;
}

.scenery-stats {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 20px;
  font-size: 14px;
}

.scenery-actions {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.action-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.like-btn {
  background: #ff4757;
  color: white;
}

.like-btn:hover {
  background: #ff3742;
}

.share-btn {
  background: #3742fa;
  color: white;
}

.share-btn:hover {
  background: #2f3542;
}

/* 特色活动样式 */
.special-activities {
  margin-bottom: 40px;
}

.activities-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.activity-item {
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.activity-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
}

.activity-image {
  height: 200px;
  overflow: hidden;
}

.activity-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.activity-content {
  padding: 20px;
}

.activity-content h3 {
  margin-top: 0;
  margin-bottom: 10px;
  font-size: 18px;
  color: #333;
}

.activity-content p {
  margin-bottom: 15px;
  line-height: 1.6;
  color: #666;
  font-size: 14px;
}

.activity-time {
  display: inline-block;
  padding: 5px 10px;
  background: #f5f5f5;
  border-radius: 5px;
  margin-bottom: 20px;
  font-size: 14px;
  color: #666;
}

.activity-btn {
  display: block;
  width: 100%;
  padding: 10px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s ease;
}

.activity-btn:hover {
  background: #0069d9;
}

/* 旅游路线样式 */
.travel-routes {
  margin-bottom: 40px;
}

.routes-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.route-item {
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  padding: 20px;
}

.route-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
}

.route-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.route-header h3 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.route-duration {
  padding: 5px 10px;
  background: #007bff;
  color: white;
  border-radius: 5px;
  font-size: 14px;
  font-weight: bold;
}

.route-content p {
  margin-bottom: 20px;
  line-height: 1.6;
  color: #666;
  font-size: 14px;
}

.route-highlights {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
}

.highlight-tag {
  padding: 5px 10px;
  background: #f5f5f5;
  border-radius: 20px;
  font-size: 12px;
  color: #666;
}

.route-btn {
  display: block;
  width: 100%;
  padding: 10px;
  background: #2ed573;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s ease;
}

.route-btn:hover {
  background: #27ae60;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .scenery-list {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 992px) {
  .scenery-list {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .activities-list,
  .routes-list {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .scenery-list {
    grid-template-columns: 1fr;
  }
  
  .activities-list,
  .routes-list {
    grid-template-columns: 1fr;
  }
  
  .season-images {
    grid-template-columns: 1fr;
  }
  
  .overview-stats {
    flex-direction: column;
    gap: 20px;
  }
  
  .category-selector {
    flex-wrap: wrap;
  }
  
  .season-selector {
    flex-wrap: wrap;
  }
}
</style>