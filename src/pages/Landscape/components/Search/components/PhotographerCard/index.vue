<template>
  <article class="photographer-card">
    <span class="hot-shoe" aria-hidden="true">
      <i class="shoe-rail left"></i>
      <i class="shoe-rail right"></i>
      <i class="shoe-contact c1"></i>
      <i class="shoe-contact c2"></i>
      <i class="shoe-contact c3"></i>
    </span>

    <div class="camera-shell">
      <div class="lens-bay">
        <div class="lens-mount">
          <span class="lens-knurl" aria-hidden="true"></span>
          <span class="lens-barrel" aria-hidden="true"></span>
          <span class="lens-glass">
            <LandscapeImage
              :src="item.thumbnail"
              :alt="displayName"
              loading="lazy"
              class="lens-photo"
              variant="avatar"
            />
            <i class="glass-glare" aria-hidden="true"></i>
            <i class="glass-vignette" aria-hidden="true"></i>
          </span>
          <span class="lens-spec" aria-hidden="true">50mm · f/1.8</span>
          <span v-if="item.verified" class="verified-seal" title="认证摄影师">
            <CheckIcon :stroke-width="3" />
          </span>
          <span
            v-if="item.online"
            class="af-lamp"
            title="当前在线"
            aria-label="当前在线"
          ></span>
        </div>
      </div>

      <header class="body-head">
        <div class="name-plate">
          <span class="plate-eyebrow" aria-hidden="true">
            PHOTOGRAPHER FILE
          </span>
          <h3 class="plate-name" :title="displayName">{{ displayName }}</h3>
          <span class="plate-role" :title="roleTitle">{{ roleTitle }}</span>
        </div>
        <span class="brand-badge">
          <CameraIcon :stroke-width="2.2" />
          <span>摄影师</span>
        </span>
      </header>

      <div v-if="note" class="field-note">
        <span class="note-tab" aria-hidden="true">FIELD NOTE</span>
        <p class="note-text">{{ note }}</p>
      </div>

      <div v-if="displayTags.length > 0" class="film-strip">
        <span
          v-for="tag in displayTags"
          :key="tag"
          class="film-frame"
          :title="tag"
        >
          <span class="frame-text">{{ tag }}</span>
        </span>
        <span class="film-tail" aria-hidden="true">35mm · ISO 400</span>
      </div>

      <div class="meter-strip">
        <div
          class="meter-row fans"
          :class="{
            'sort-highlighted': !isFollowersDimmed && sortMode !== 'relevance',
            'sort-dimmed': isFollowersDimmed,
          }"
        >
          <span class="meter-dial" aria-hidden="true">
            <UsersIcon :stroke-width="2.3" />
          </span>
          <span class="meter-readout">
            <span class="meter-value">{{ formatCount(followersCount) }}</span>
          </span>
          <span class="meter-label">粉丝</span>
        </div>

        <div
          class="meter-row works"
          :class="{
            'sort-highlighted': !isWorksDimmed && sortMode !== 'relevance',
            'sort-dimmed': isWorksDimmed,
          }"
        >
          <span class="meter-dial" aria-hidden="true">
            <ImageIcon :stroke-width="2.3" />
          </span>
          <span class="meter-readout">
            <span class="meter-value">{{ formatCount(worksCount) }}</span>
          </span>
          <span class="meter-label">作品</span>
        </div>

        <div
          class="meter-row likes"
          :class="{
            'sort-highlighted': !isLikeDimmed && sortMode !== 'relevance',
            'sort-dimmed': isLikeDimmed,
          }"
        >
          <span class="meter-dial" aria-hidden="true">
            <ThumbUpIcon :stroke-width="2.3" />
          </span>
          <span class="meter-readout">
            <span class="meter-value">
              {{ formatCount(Number(item.likes) || 0) }}
            </span>
          </span>
          <span class="meter-label">获赞</span>
        </div>

        <div
          class="meter-row views"
          :class="{
            'sort-highlighted': !isViewsDimmed && sortMode !== 'relevance',
            'sort-dimmed': isViewsDimmed,
          }"
        >
          <span class="meter-dial" aria-hidden="true">
            <EyeIcon :stroke-width="2.3" />
          </span>
          <span class="meter-readout">
            <span class="meter-value">{{ formatCount(viewsCount) }}</span>
          </span>
          <span class="meter-label">浏览</span>
        </div>
      </div>

      <footer class="body-foot" :class="{ 'contact-open': contactOpen }">
        <span
          v-if="item.location"
          class="location-plate"
          :title="item.location"
        >
          <span class="loc-icon" aria-hidden="true">
            <LocationIcon :stroke-width="2.2" />
          </span>
          <span class="loc-text">{{ item.location }}</span>
        </span>

        <button
          type="button"
          class="shutter-btn"
          :class="{ following: isFollowing }"
          :aria-pressed="isFollowing"
          @click="handleFollow"
        >
          <span class="shutter-led" aria-hidden="true"></span>
          <CheckIcon
            v-if="isFollowing"
            class="shutter-icon"
            :stroke-width="2.8"
          />
          <UserPlusIcon v-else class="shutter-icon" :stroke-width="2.4" />
          <span class="shutter-label">
            {{ isFollowing ? '已关注' : '关注' }}
          </span>
          <span class="shutter-ridges" aria-hidden="true"></span>
          <span class="shutter-focus" aria-hidden="true"></span>
        </button>

        <button
          v-if="contactChannels.length > 0"
          type="button"
          class="contact-btn"
          :class="{ open: contactOpen }"
          :aria-expanded="contactOpen"
          aria-haspopup="dialog"
          @click="toggleContact"
        >
          <MessageBubbleIcon class="contact-glyph" :stroke-width="2.2" />
          <span class="contact-label">联系我</span>
          <ChevronUpIcon class="contact-caret" :stroke-width="2.6" />
        </button>

        <div
          v-if="contactOpen"
          class="contact-sheet"
          role="dialog"
          aria-label="联系我"
        >
          <span class="sheet-notch" aria-hidden="true"></span>
          <div class="sheet-head">
            <span class="sheet-title">
              <MessageBubbleIcon :stroke-width="2.2" />
              联系我
            </span>
            <span class="sheet-count">{{ contactChannels.length }} 个渠道</span>
            <button
              type="button"
              class="sheet-close"
              aria-label="关闭联系方式"
              @click="closeContact"
            >
              <CloseIcon :stroke-width="2.8" />
            </button>
          </div>
          <div class="sheet-grid">
            <button
              v-for="channel in contactChannels"
              :key="channel.key"
              type="button"
              class="contact-channel"
              :style="{ '--brand': channel.brand }"
              :title="
                channel.handle
                  ? `${channel.label} · ${channel.handle}`
                  : channel.label
              "
              @click="handleContactClick"
            >
              <span class="channel-orb" aria-hidden="true">
                <component
                  :is="channel.icon"
                  v-if="channel.icon"
                  class="channel-svg"
                />
                <span v-else class="channel-mono">{{ channel.mono }}</span>
              </span>
              <span class="channel-meta">
                <span class="channel-name">{{ channel.label }}</span>
                <span v-if="channel.handle" class="channel-handle">
                  {{ channel.handle }}
                </span>
              </span>
            </button>
          </div>
        </div>
      </footer>

      <div
        v-if="contactOpen"
        class="contact-scrim"
        aria-hidden="true"
        @click="closeContact"
      ></div>
    </div>
  </article>
</template>

<script setup lang="ts">
  import { computed, onBeforeUnmount, ref, watch, type Component } from 'vue';
  import CameraIcon from '@/pages/Landscape/icons/common/CameraIcon.vue';
  import CheckIcon from '@/pages/Landscape/icons/common/CheckIcon.vue';
  import LocationIcon from '@/pages/Landscape/icons/common/LocationIcon.vue';
  import UsersIcon from '@/pages/Landscape/icons/common/UsersIcon.vue';
  import ImageIcon from '@/pages/Landscape/icons/common/ImageIcon.vue';
  import ThumbUpIcon from '@/pages/Landscape/icons/common/ThumbUpIcon.vue';
  import EyeIcon from '@/pages/Landscape/icons/common/EyeIcon.vue';
  import UserPlusIcon from '@/pages/Landscape/icons/common/UserPlusIcon.vue';
  import InstagramIcon from '@/pages/Landscape/icons/common/InstagramIcon.vue';
  import TwitterIcon from '@/pages/Landscape/icons/common/TwitterIcon.vue';
  import YoutubeIcon from '@/pages/Landscape/icons/common/YoutubeIcon.vue';
  import WeiboIcon from '@/pages/Landscape/icons/common/WeiboIcon.vue';
  import WechatIcon from '@/pages/Landscape/icons/common/WechatIcon.vue';
  import MailIcon from '@/pages/Landscape/icons/common/MailIcon.vue';
  import PhoneIcon from '@/pages/Landscape/icons/common/PhoneIcon.vue';
  import GlobeIcon from '@/pages/Landscape/icons/common/GlobeIcon.vue';
  import CloseIcon from '@/pages/Landscape/icons/common/CloseIcon.vue';
  import ChevronUpIcon from '@/pages/Landscape/icons/common/ChevronUpIcon.vue';
  import XiaohongshuIcon from '@/pages/Landscape/icons/components/profile/EditProfileModal/XiaohongshuIcon.vue';
  import BilibiliIcon from '@/pages/Landscape/icons/components/profile/EditProfileModal/BilibiliIcon.vue';
  import TuchongIcon from '@/pages/Landscape/icons/components/profile/EditProfileModal/TuchongIcon.vue';
  import MafengwoIcon from '@/pages/Landscape/icons/components/profile/EditProfileModal/MafengwoIcon.vue';
  import MessageBubbleIcon from '@/pages/Landscape/icons/common/MessageBubbleIcon.vue';
  import FacebookIcon from '@/pages/Landscape/icons/components/setting/SocialSection/FacebookIcon.vue';
  import LandscapeImage from '@/pages/Landscape/components/common/LandscapeImage/index.vue';

  import type { SearchResultItem } from '@/utils/landscape';
  import { formatNumber as formatCount } from '@/utils/landscape/format';
  import { useInteractionStore } from '@/stores/landscape';
  import { usePhotographerSortDimming } from '../../composables/useSortDimming';

  interface Props {
    item: SearchResultItem;
    sortMode: string;
  }

  const props = defineProps<Props>();

  const emit = defineEmits<{
    follow: [id: string];
    like: [id: string];
  }>();

  /** 联系渠道图标的展示元数据：品牌色用于卡片光晕与图标着色 */
  interface PlatformMeta {
    label: string;
    brand: string;
    icon?: Component;
    mono?: string;
  }

  /** 覆盖国内外主流社交平台 + 摄影社区 + 直接联系方式 */
  const CONTACT_PLATFORMS: Record<string, PlatformMeta> = {
    weibo: { label: '微博', brand: '230, 22, 45', icon: WeiboIcon },
    wechat: { label: '微信', brand: '40, 196, 69', icon: WechatIcon },
    xiaohongshu: {
      label: '小红书',
      brand: '255, 36, 66',
      icon: XiaohongshuIcon,
    },
    douyin: { label: '抖音', brand: '37, 244, 238', mono: '抖' },
    bilibili: { label: '哔哩哔哩', brand: '212, 35, 122', icon: BilibiliIcon },
    tuchong: { label: '图虫', brand: '244, 234, 42', icon: TuchongIcon },
    '500px': { label: '500px', brand: '0, 129, 255', mono: '500' },
    zcool: { label: '站酷', brand: '255, 102, 0', mono: 'Z' },
    mafengwo: { label: '马蜂窝', brand: '255, 195, 0', icon: MafengwoIcon },
    instagram: {
      label: 'Instagram',
      brand: '225, 48, 108',
      icon: InstagramIcon,
    },
    x: { label: 'X', brand: '255, 255, 255', icon: TwitterIcon },
    youtube: { label: 'YouTube', brand: '255, 64, 64', icon: YoutubeIcon },
    facebook: { label: 'Facebook', brand: '24, 119, 242', icon: FacebookIcon },
    vimeo: { label: 'Vimeo', brand: '26, 183, 234', mono: 'V' },
    pinterest: { label: 'Pinterest', brand: '230, 0, 35', mono: 'P' },
    linkedin: { label: 'LinkedIn', brand: '10, 102, 194', mono: 'in' },
    behance: { label: 'Behance', brand: '23, 105, 255', mono: 'Bē' },
    dribbble: { label: 'Dribbble', brand: '234, 76, 137', mono: 'Dr' },
    artstation: { label: 'ArtStation', brand: '19, 200, 255', mono: 'AS' },
    flickr: { label: 'Flickr', brand: '255, 0, 132', mono: 'Fl' },
    email: { label: '邮箱', brand: '245, 196, 105', icon: MailIcon },
    website: { label: '网站', brand: '103, 232, 249', icon: GlobeIcon },
    phone: { label: '电话', brand: '52, 211, 153', icon: PhoneIcon },
  };

  const interactionStore = useInteractionStore();
  const isFollowing = computed(() =>
    interactionStore.isFollowing(String(props.item.id)),
  );

  const contactOpen = ref(false);
  const toggleContact = () => {
    contactOpen.value = !contactOpen.value;
  };
  const closeContact = () => {
    contactOpen.value = false;
  };

  /** 联系渠道点击：跳转逻辑暂未接入，先空置 */
  const handleContactClick = () => undefined;

  const handleEsc = (event: KeyboardEvent) => {
    if (event.key === 'Escape') closeContact();
  };

  watch(contactOpen, (open) => {
    if (open) window.addEventListener('keydown', handleEsc);
    else window.removeEventListener('keydown', handleEsc);
  });
  onBeforeUnmount(() => window.removeEventListener('keydown', handleEsc));

  watch(
    () => props.item.id,
    () => {
      contactOpen.value = false;
      interactionStore.registerCount(String(props.item.id), {
        followers: Number(props.item.followers) || 0,
        likes: Number(props.item.likes) || 0,
        views: Number(props.item.views) || 0,
        loves: Number(props.item.loves) || 0,
        favorites: Number(props.item.bookmarks) || 0,
        shares: Number(props.item.shares) || 0,
      });
    },
    { immediate: true },
  );

  /** 只展示该摄影师本身拥有的联系渠道，并补齐可点击链接 */
  const contactChannels = computed(() => {
    const seen = new Set<string>();
    return (props.item.contacts || [])
      .filter((channel) => {
        if (!channel.platform || seen.has(channel.platform)) return false;
        seen.add(channel.platform);
        return true;
      })
      .map((channel) => {
        const meta = CONTACT_PLATFORMS[channel.platform] || {
          label: channel.platform,
          brand: '255, 255, 255',
          mono: channel.platform.slice(0, 2).toUpperCase(),
        };

        let href = channel.url || '#';
        if (channel.platform === 'email' && !href.startsWith('mailto:')) {
          href = `mailto:${channel.handle || href}`;
        } else if (channel.platform === 'phone' && !href.startsWith('tel:')) {
          href = `tel:${channel.handle || href}`;
        } else if (channel.platform === 'website' && href !== '#') {
          if (!/^https?:\/\//.test(href)) href = `https://${href}`;
        }

        return {
          key: channel.platform,
          label: meta.label,
          brand: meta.brand,
          icon: meta.icon,
          mono: meta.mono,
          handle: channel.handle || '',
          href,
        };
      });
  });

  const counts = computed(() =>
    interactionStore.getCount(String(props.item.id)),
  );

  /** 关注数会随关注操作变化，优先读互动仓，缺省回落到原始数据 */
  const followersCount = computed(
    () => counts.value.followers || Number(props.item.followers) || 0,
  );

  const displayName = computed(() =>
    (props.item.name || props.item.title || '未署名摄影师').trim(),
  );

  const roleTitle = computed(() => {
    const title = (props.item.title || '').trim();
    return title && title !== displayName.value ? title : '风光摄影师';
  });

  /** 名片只保留最核心的专长标签，最多四枚 */
  const displayTags = computed(() =>
    Array.from(new Set((props.item.tags || []).filter(Boolean))).slice(0, 4),
  );

  const note = computed(() => {
    const desc = (props.item.description || '').trim();
    if (!desc || desc === displayName.value || desc === roleTitle.value) {
      return '';
    }
    return desc;
  });

  const worksCount = computed(() => Number(props.item.worksCount) || 0);
  /** 摄影师全部作品的浏览总量，仅用于展示与“最多浏览”排序 */
  const viewsCount = computed(() => Number(props.item.views) || 0);

  const { isFollowersDimmed, isWorksDimmed, isLikeDimmed, isViewsDimmed } =
    usePhotographerSortDimming(() => props.sortMode);

  const handleFollow = () => {
    emit('follow', String(props.item.id));
  };
</script>

<style scoped lang="scss" src="./index.scss" />
