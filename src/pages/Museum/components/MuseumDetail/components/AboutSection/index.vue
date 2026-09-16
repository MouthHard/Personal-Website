<template>
  <section class="tab-content-section">
    <div class="page-header">
      <h2 class="section-title">参观指南</h2>
      <p class="section-subtitle">为您提供全方位的参观服务信息</p>
    </div>

    <div class="info-grid">
      <div v-if="visitInfo?.openTime" class="info-card">
        <div class="card-header">
          <div class="icon-wrapper">
            <ClockFilledIcon />
          </div>
          <h3>开放时间</h3>
        </div>
        <div class="card-body">
          <div class="time-item">
            <span class="label">常规时间</span>
            <span class="value">
              {{
                typeof visitInfo?.openTime === 'string'
                  ? visitInfo.openTime
                  : visitInfo?.openTime?.regularTime || '周二至周日 9:00-17:00'
              }}
            </span>
          </div>
          <div
            v-if="typeof visitInfo?.openTime !== 'string'"
            class="time-item highlight"
          >
            <span class="label">停止入馆</span>
            <span class="value">
              {{ visitInfo?.openTime?.stopEntryTime || '16:00' }}
            </span>
          </div>
          <div v-if="typeof visitInfo?.openTime !== 'string'" class="time-item">
            <span class="label">闭馆日</span>
            <span class="value">
              {{ visitInfo?.openTime?.closeDay || '周一（法定节假日除外）' }}
            </span>
          </div>
          <div
            v-if="
              typeof visitInfo?.openTime !== 'string' &&
              visitInfo?.openTime?.holidayNotice
            "
            class="notice-badge"
          >
            <NotificationIcon />
            <span>{{ visitInfo.openTime.holidayNotice }}</span>
          </div>
        </div>
      </div>

      <!-- 票务信息 -->
      <div v-if="visitInfo?.ticket" class="info-card">
        <div class="card-header">
          <div class="icon-wrapper">
            <TicketFilledIcon />
          </div>
          <h3>票务信息</h3>
        </div>
        <div class="card-body">
          <div class="price-row">
            <span class="price-label">门票价格</span>
            <span
              class="price-value"
              :class="{
                free:
                  typeof visitInfo?.ticket !== 'string' &&
                  visitInfo?.ticket.isFree,
              }"
            >
              {{
                typeof visitInfo?.ticket === 'string'
                  ? visitInfo.ticket
                  : visitInfo?.ticket?.price || '免费'
              }}
            </span>
          </div>
          <div
            v-if="typeof visitInfo?.ticket !== 'string'"
            class="booking-info"
          >
            <div v-if="visitInfo?.ticket.needReservation" class="booking-item">
              <CalendarCheckIcon />
              <span>需提前预约</span>
            </div>
            <div v-if="visitInfo?.ticket.idRequired" class="booking-item">
              <CalendarCheckIcon />
              <span>{{ visitInfo.ticket.idRequired }}</span>
            </div>
          </div>
          <div
            v-if="
              typeof visitInfo?.ticket !== 'string' &&
              visitInfo?.ticket.discountPolicy &&
              visitInfo.ticket.discountPolicy.length > 0
            "
            class="discount-list"
          >
            <p class="discount-title">优惠政策</p>
            <p
              v-for="(policy, index) in visitInfo.ticket.discountPolicy"
              :key="index"
            >
              • {{ policy }}
            </p>
          </div>
        </div>
      </div>

      <!-- 参观须知 -->
      <div v-if="visitInfo?.rules" class="info-card">
        <div class="card-header">
          <div class="icon-wrapper">
            <DocumentIcon />
          </div>
          <h3>参观须知</h3>
        </div>
        <div class="card-body">
          <div v-if="visitInfo?.rules" class="rule-list">
            <div
              v-for="(rule, index) in visitInfo.rules.allowed"
              :key="`allow-${index}`"
              class="rule-item"
            >
              <span class="rule-icon allow"><CheckIcon /></span>
              <span>{{ rule }}</span>
            </div>
            <div
              v-for="(rule, index) in visitInfo.rules.forbidden"
              :key="`forbid-${index}`"
              class="rule-item"
            >
              <span class="rule-icon forbid"><CloseIcon /></span>
              <span>{{ rule }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 交通指南 -->
      <div v-if="visitInfo?.transportation" class="info-card">
        <div class="card-header">
          <div class="icon-wrapper">
            <MapPageIcon />
          </div>
          <h3>交通指南</h3>
        </div>
        <div class="card-body">
          <div v-if="visitInfo?.transportation" class="transport-item">
            <div class="transport-icon">
              <AddressIcon />
            </div>
            <div class="transport-content">
              <span class="transport-label">地址</span>
              <span class="transport-value">
                {{ visitInfo.transportation.address || '博物馆详细地址信息' }}
              </span>
            </div>
          </div>
          <div v-if="visitInfo?.transportation?.metro" class="transport-item">
            <div class="transport-icon metro">
              <span>M</span>
            </div>
            <div class="transport-content">
              <span class="transport-label">地铁</span>
              <span class="transport-value">
                {{ visitInfo.transportation.metro }}
              </span>
            </div>
          </div>
          <div v-if="visitInfo?.transportation?.bus" class="transport-item">
            <div class="transport-icon bus">
              <BusIcon />
            </div>
            <div class="transport-content">
              <span class="transport-label">公交</span>
              <span class="transport-value">
                {{ visitInfo.transportation.bus }}
              </span>
            </div>
          </div>
          <div v-if="visitInfo?.transportation?.parking" class="transport-item">
            <div class="transport-icon">
              <ParkingIcon />
            </div>
            <div class="transport-content">
              <span class="transport-label">停车</span>
              <span class="transport-value">
                {{ visitInfo.transportation.parking }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 服务设施 -->
      <div v-if="visitInfo?.services" class="info-card">
        <div class="card-header">
          <div class="icon-wrapper">
            <MuseumIcon />
          </div>
          <h3>服务设施</h3>
        </div>
        <div class="card-body">
          <div v-if="visitInfo?.services" class="service-grid">
            <div v-if="visitInfo.services.hasGuide" class="service-item">
              <PersonIcon />
              <span>讲解服务</span>
            </div>
            <div v-if="visitInfo.services.hasStorage" class="service-item">
              <StorageIcon />
              <span>物品寄存</span>
            </div>
            <div v-if="visitInfo.services.hasRestaurant" class="service-item">
              <RestaurantIcon />
              <span>餐饮服务</span>
            </div>
            <div
              v-if="visitInfo.services.hasAccessibility"
              class="service-item"
            >
              <AccessibilityIcon />
              <span>无障碍设施</span>
            </div>
            <div v-if="visitInfo.services.hasRestArea" class="service-item">
              <RestAreaIcon />
              <span>休息区</span>
            </div>
            <div v-if="visitInfo.services.hasWiFi" class="service-item">
              <WifiIcon />
              <span>免费WiFi</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 联系方式 -->
      <div v-if="visitInfo?.contact" class="info-card">
        <div class="card-header">
          <div class="icon-wrapper">
            <PhoneIcon />
          </div>
          <h3>联系我们</h3>
        </div>
        <div class="card-body">
          <div v-if="visitInfo?.contact" class="contact-item">
            <PhoneIcon2 />
            <div class="contact-content">
              <span class="contact-label">咨询电话</span>
              <span class="contact-value">
                {{ visitInfo.contact.phone || '咨询电话' }}
              </span>
            </div>
          </div>
          <div v-if="visitInfo?.contact" class="contact-item">
            <EmailIcon />
            <div class="contact-content">
              <span class="contact-label">电子邮箱</span>
              <span class="contact-value">
                {{ visitInfo.contact.email || 'museum@example.com' }}
              </span>
            </div>
          </div>
          <div v-if="visitInfo?.contact?.complaintPhone" class="contact-item">
            <ComplaintIcon />
            <div class="contact-content">
              <span class="contact-label">投诉建议</span>
              <span class="contact-value">
                {{ visitInfo.contact.complaintPhone }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 参观路线推荐 -->
      <div v-if="visitInfo?.visitRoutes?.length" class="info-card">
        <div class="card-header">
          <div class="icon-wrapper">
            <RouteIcon />
          </div>
          <h3>参观路线</h3>
        </div>
        <div class="card-body">
          <div
            v-for="(route, index) in visitInfo.visitRoutes"
            :key="index"
            class="route-item"
          >
            <div class="route-header">
              <span class="route-name">{{ route.name }}</span>
              <span class="route-duration">{{ route.duration }}</span>
            </div>
            <p class="route-desc">{{ route.description }}</p>
            <div class="route-stops">
              <span
                v-for="(stop, sIndex) in route.stops"
                :key="sIndex"
                class="route-stop"
              >
                {{ stop }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 楼层导览 -->
      <div v-if="visitInfo?.floorGuides?.length" class="info-card">
        <div class="card-header">
          <div class="icon-wrapper">
            <FloorIcon />
          </div>
          <h3>楼层导览</h3>
        </div>
        <div class="card-body">
          <div
            v-for="(floor, index) in visitInfo.floorGuides"
            :key="index"
            class="floor-item"
          >
            <div class="floor-badge">{{ floor.floor }}</div>
            <div class="floor-content">
              <span class="floor-name">{{ floor.name }}</span>
              <div class="floor-exhibits">
                <span
                  v-for="(exhibit, eIndex) in floor.exhibits"
                  :key="eIndex"
                  class="floor-exhibit"
                >
                  {{ exhibit }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 常见问题 -->
      <div v-if="visitInfo?.faqs?.length" class="info-card">
        <div class="card-header">
          <div class="icon-wrapper">
            <FAQIcon />
          </div>
          <h3>常见问题</h3>
        </div>
        <div class="card-body">
          <div
            v-for="(faq, index) in visitInfo.faqs"
            :key="index"
            class="faq-item"
          >
            <div class="faq-question">
              <span class="faq-q-icon">Q</span>
              <span>{{ faq.question }}</span>
            </div>
            <div class="faq-answer">
              <span class="faq-a-icon">A</span>
              <span>{{ faq.answer }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <footer class="museum-footer">
      <div class="footer-content">
        <div class="footer-info">
          <h3>
            <MuseumInfoIcon />
            博物馆信息
          </h3>
          <div class="info-item">
            <div class="info-icon">
              <MapPageIcon />
            </div>
            <div class="info-content">
              <span class="info-label">地址</span>
              <span class="info-value">
                {{ visitInfo?.transportation?.address || '博物馆地址' }}
              </span>
            </div>
          </div>
          <div class="info-item">
            <div class="info-icon">
              <PhoneIcon3 />
            </div>
            <div class="info-content">
              <span class="info-label">电话</span>
              <span class="info-value">
                {{ visitInfo?.contact?.phone || '咨询电话' }}
              </span>
            </div>
          </div>
          <div class="info-item">
            <div class="info-icon">
              <OpenTimeIcon />
            </div>
            <div class="info-content">
              <span class="info-label">开放时间</span>
              <span class="info-value">
                {{
                  typeof visitInfo?.openTime === 'string'
                    ? visitInfo.openTime
                    : visitInfo?.openTime?.regularTime ||
                      '周二至周日 9:00-17:00'
                }}
              </span>
            </div>
          </div>
        </div>
        <div class="footer-links">
          <h4>
            <QuickLinkIcon />
            快速链接
          </h4>
          <ul>
            <li>
              <a href="#" @click.prevent="switchTab('home')">
                <HomeFilledIcon />
                首页
              </a>
            </li>
            <li>
              <a href="#" @click.prevent="switchTab('artifacts')">
                <ArtifactIcon />
                文物
              </a>
            </li>
            <li>
              <a href="#" @click.prevent="switchTab('exhibitions')">
                <ExhibitionIcon />
                展览
              </a>
            </li>
            <li>
              <a href="#" @click.prevent="switchTab('special')">
                <SpecialHallIcon />
                专馆
              </a>
            </li>
            <li>
              <a href="#" @click.prevent="switchTab('creative')">
                <CreativeIcon />
                文创
              </a>
            </li>

          </ul>
        </div>
        <div class="footer-links">
          <h4>
            <LinkFilledIcon />
            博物馆友链
          </h4>
          <ul>
            <li v-for="link in friendLinks" :key="link.id">
              <span class="official-tag">官方网站</span>
              <a
                href="#"
                @click.prevent="goToMuseum(link.id)"
              >
                {{ link.name }}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  </section>
</template>

<script setup lang="ts">
  import { ref, computed, watch } from 'vue';
  import { useRouter } from 'vue-router';
  import { useMuseumDataStore } from '@/stores/museum';
  import type { MuseumDetailInfo } from '@/typesOfPages/museum';
  import { generateMuseumRoute } from '@/utils/museum';
  import { CheckIcon, CloseIcon } from '@/pages/Museum/icons/common';

  // 批量导入图标组件
  import {
    ClockFilledIcon,
    NotificationIcon,
    TicketFilledIcon,
    CalendarCheckIcon,
    DocumentIcon,
    MapPageIcon,
    AddressIcon,
    BusIcon,
    ParkingIcon,
    MuseumIcon,
    PersonIcon,
    StorageIcon,
    RestaurantIcon,
    AccessibilityIcon,
    RestAreaIcon,
    WifiIcon,
    PhoneIcon,
    EmailIcon,
    ComplaintIcon,
    HomeFilledIcon,
    ArtifactIcon,
    ExhibitionIcon,
    CreativeIcon,
    SpecialHallIcon,
    PhoneIcon2,
    MuseumInfoIcon,
    PhoneIcon3,
    OpenTimeIcon,
    QuickLinkIcon,
    LinkFilledIcon,
    RouteIcon,
    FloorIcon,
    FAQIcon,
  } from '@/pages/Museum/icons/pages/AboutSection';

  const props = defineProps<{
    museumId: number;
  }>();

  const emit = defineEmits<{
    'update:activeTab': [tab: string];
  }>();

  const store = useMuseumDataStore();
  const router = useRouter();

  const museumDetails = ref<MuseumDetailInfo | null>(null);

  watch(
    () => props.museumId,
    async (id) => {
      museumDetails.value = await store.getMuseumDetailsById(id);
    },
    { immediate: true },
  );

  const visitInfo = computed(() => {
    return museumDetails.value?.visitInfo;
  });

  const friendLinks = computed(() => {
    return museumDetails.value?.friendLinks || [];
  });

  const goToMuseum = async (id: number) => {
    const museum = await store.getMuseum(id);
    if (museum) {
      router.push(generateMuseumRoute(museum.province, id));
    }
  };

  const switchTab = (tab: string) => {
    emit('update:activeTab', tab);
  };
</script>

<style lang="scss" scoped src="./index.scss"></style>
