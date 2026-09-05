<template>
  <section class="profile-hero">
    <div class="hero-container">
      <!-- 左侧：头像与基本信息 -->
      <div class="profile-main">
        <div class="avatar-cosmos">
          <div class="avatar-ring ring-outer"></div>
          <div class="avatar-ring ring-inner"></div>
          <div class="avatar-glow"></div>
          <div class="avatar-container">
            <img v-if="user.avatar" loading="lazy" :src="user.avatar" :alt="user.name" class="avatar-image" />
            <div v-else class="avatar-placeholder">
              <UserIcon />
            </div>
          </div>
        </div>
        
        <div class="profile-info">
          <div class="name-section">
            <h1 class="user-name">{{ user.name }}</h1>
            <div v-if="user.verified" class="verified-badge">
              <CheckCircleIcon />
            </div>
          </div>
          <p class="user-title">{{ user.title }}</p>
          <p class="user-bio">{{ user.bio }}</p>
          
          <div class="profile-meta">
            <div v-if="user.location" class="meta-item">
              <LocationIcon />
              <span>{{ user.location }}</span>
            </div>
            <div v-if="user.joinDate" class="meta-item">
              <CalendarIcon />
              <span>{{ user.joinDate }}</span>
            </div>
            <div v-if="user.tags && user.tags.length > 0" class="tags-wrapper">
              <LayersIcon class="tags-icon" />
              <div class="tags-list">
                <span v-for="tag in user.tags" :key="tag" class="tag-chip">{{ tag }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧：数据统计 -->
      <div class="stats-cosmos">
        <div v-for="(stat, index) in stats" :key="stat.label" class="stat-card" :style="{ '--delay': `${index * 0.1}s` }">
          <div class="stat-content">
            <div class="stat-value">{{ stat.value }}</div>
            <div class="stat-label">{{ stat.label }}</div>
          </div>

          <div class="stat-trend" :class="stat.trend > 0 ? 'up' : 'down'">
            <ChevronUpIcon v-if="stat.trend > 0" />
            <ChevronDownIcon v-else />
            <span>{{ Math.abs(stat.trend) }}%</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="hero-actions">
      <button class="action-btn primary" @click="showEditModal = true">
        <EditIcon />
        <span>编辑资料</span>
      </button>
    </div>

    <!-- 编辑资料弹窗 -->
    <Teleport to="body">
      <EditProfileModal
        v-model:visible="showEditModal"
        :user="user"
        @save="handleSaveProfile"
      />
    </Teleport>
  </section>
</template>

<script setup lang="ts">
import { ref, type VNode } from 'vue';
import EditProfileModal from './components/EditProfileModal/index.vue';
import type { User } from '@/typesOfPages/landscape';
import UserIcon from '@/pages/Landscape/icon/common/UserIcon.vue';
import CheckCircleIcon from '@/pages/Landscape/icon/components/profile/ProfileHeader/CheckCircleIcon.vue';
import LocationIcon from '@/pages/Landscape/icon/common/LocationIcon.vue';
import CalendarIcon from '@/pages/Landscape/icon/common/CalendarIcon.vue';
import LayersIcon from '@/pages/Landscape/icon/common/LayersIcon.vue';
import ChevronUpIcon from '@/pages/Landscape/icon/common/ChevronUpIcon.vue';
import ChevronDownIcon from '@/pages/Landscape/icon/common/ChevronDownIcon.vue';
import EditIcon from '@/pages/Landscape/icon/common/EditIcon.vue';

interface Stat {
  label: string;
  value: string;
  trend: number;
  icon: VNode;
}

const props = defineProps<{
  user: User;
  stats: Stat[];
}>();

const emit = defineEmits<{
  'update:user': [value: User];
}>();

const showEditModal = ref(false);

const handleSaveProfile = (data: Partial<User> & { avatar?: string; tags?: string[] }) => {
  const updatedUser: User = {
    ...props.user,
    name: data.name || props.user.name || '',
    title: data.title || props.user.title || '',
    bio: data.bio || props.user.bio || '',
    location: data.location || props.user.location || '',
    joinDate: props.user.joinDate || '',
    tags: data.tags || props.user.tags || [],
    verified: props.user.verified || false,
    avatar: data.avatar || props.user.avatar,
  };
  emit('update:user', updatedUser);
};
</script>

<style scoped lang="scss" src="./index.scss" />

