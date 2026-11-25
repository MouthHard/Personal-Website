<template>
  <div v-if="visible" class="modal-overlay" @click.self="handleClose">
    <div class="edit-profile-modal">
      <div class="modal-header">
        <h2 class="modal-title">编辑资料</h2>
        <button class="close-btn" @click="handleClose">
          <CloseIcon />
        </button>
      </div>

      <div class="modal-body">
        <div class="form-section basic-info-section">
          <div class="basic-info-grid">
            <div class="avatar-column">
              <div class="avatar-preview">
                <img
                  v-if="formData.avatar"
                  :src="formData.avatar"
                  alt="avatar"
                />
                <div v-else class="avatar-placeholder">
                  <UserIcon />
                </div>
              </div>
              <button class="upload-btn">
                <UploadIcon />
                <span>更换头像</span>
              </button>
            </div>
            <div class="info-column">
              <div class="form-field">
                <label class="field-label">用户名</label>
                <input
                  v-model="formData.name"
                  type="text"
                  class="field-input"
                  placeholder="输入用户名"
                  maxlength="30"
                />
              </div>
              <div class="form-field">
                <label class="field-label">副标题</label>
                <input
                  v-model="formData.title"
                  type="text"
                  class="field-input"
                  placeholder="一句话介绍自己"
                  maxlength="50"
                />
              </div>
            </div>
          </div>
          <div class="bio-section">
            <label class="field-label">个人简介</label>
            <textarea
              v-model="formData.bio"
              class="field-textarea"
              placeholder="分享你的摄影故事、兴趣爱好或创作理念..."
              maxlength="200"
              rows="3"
            ></textarea>
            <div class="char-count">{{ formData.bio?.length || 0 }}/200</div>
          </div>
          <div class="location-website-section">
            <div class="form-row">
              <div class="form-field">
                <label class="field-label">所在位置</label>
                <RegionCascader
                  v-model="locationValue"
                  :options="chinaRegions"
                  placeholder="选择省/市/区"
                  class="field-input location-cascader"
                  clearable
                  @change="handleLocationChange"
                />
              </div>
              <div class="form-field">
                <label class="field-label">个人网站</label>
                <div class="input-with-icon">
                  <GlobeIcon />
                  <input
                    v-model="formData.website"
                    type="url"
                    class="field-input"
                    placeholder="https://example.com"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="form-section photography-section">
          <label class="section-label photography-label">摄影信息</label>
          <div class="photography-grid">
            <div class="form-field">
              <label class="field-label">相机型号</label>
              <input
                v-model="formData.photography.camera"
                type="text"
                class="field-input photography-input"
                placeholder="例如：Sony A7R4"
              />
            </div>
            <div class="form-field">
              <label class="field-label">常用镜头</label>
              <input
                v-model="formData.photography.lens"
                type="text"
                class="field-input photography-input"
                placeholder="例如：24-70mm f/2.8"
              />
            </div>
          </div>
          <div class="specialty-section">
            <label class="field-label">擅长领域</label>
            <div class="specialty-tags">
              <label
                v-for="specialty in specialtyOptions"
                :key="specialty"
                class="specialty-tag"
                :class="{
                  active: formData.photography.specialties.includes(specialty),
                }"
              >
                <input
                  type="checkbox"
                  :checked="
                    formData.photography.specialties.includes(specialty)
                  "
                  class="specialty-checkbox"
                  @change="toggleSpecialty(specialty)"
                />
                <span>{{ specialty }}</span>
              </label>
            </div>
          </div>
        </div>

        <div class="form-section tags-section">
          <label class="section-label tags-label">兴趣标签</label>
          <div class="tags-input">
            <div class="tags-container">
              <span
                v-for="(tag, index) in formData.tags"
                :key="index"
                class="tag-item"
              >
                {{ tag }}
                <button class="tag-remove" @click="removeTag(index)">×</button>
              </span>
            </div>
            <input
              v-model="tagInput"
              type="text"
              class="tag-input"
              placeholder="输入标签后按回车添加"
              @keydown.enter="addTag"
            />
          </div>
          <div class="tag-suggestions">
            <span class="suggestion-label">推荐标签：</span>
            <button
              v-for="tag in availableSuggestedTags"
              :key="tag"
              class="suggestion-btn"
              @click="addSuggestedTag(tag)"
            >
              {{ tag }}
            </button>
          </div>
        </div>

        <div class="form-section contact-section">
          <label class="section-label contact-label">联系方式</label>
          <div class="contact-grid">
            <div class="form-field">
              <label class="field-label">电子邮箱</label>
              <div class="input-with-icon email-icon">
                <MailIcon />
                <input
                  v-model="formData.contact.email"
                  type="email"
                  class="field-input contact-input"
                  placeholder="your@email.com"
                />
              </div>
            </div>
            <div class="form-field">
              <label class="field-label">联系电话</label>
              <div class="input-with-icon phone-icon">
                <PhoneIcon />
                <input
                  v-model="formData.contact.phone"
                  type="tel"
                  class="field-input contact-input"
                  placeholder="选填"
                />
              </div>
            </div>
          </div>
          <div class="social-links">
            <div class="social-item">
              <div class="social-icon weibo">
                <WeiboIcon />
              </div>
              <input
                v-model="formData.social.weibo"
                type="text"
                class="social-input"
                placeholder="微博用户名"
              />
            </div>
            <div class="social-item">
              <div class="social-icon wechat">
                <WechatIcon />
              </div>
              <input
                v-model="formData.social.wechat"
                type="text"
                class="social-input"
                placeholder="微信号"
              />
            </div>
            <div class="social-item">
              <div class="social-icon bilibili">
                <BilibiliIcon />
              </div>
              <input
                v-model="formData.social.bilibili"
                type="text"
                class="social-input"
                placeholder="B站用户名"
              />
            </div>
            <div class="social-item">
              <div class="social-icon xiaohongshu">
                <XiaohongshuIcon />
              </div>
              <input
                v-model="formData.social.xiaohongshu"
                type="text"
                class="social-input"
                placeholder="小红书ID"
              />
            </div>
            <div class="social-item">
              <div class="social-icon mafengwo">
                <MafengwoIcon />
              </div>
              <input
                v-model="formData.social.mafengwo"
                type="text"
                class="social-input"
                placeholder="马蜂窝账号"
              />
            </div>
            <div class="social-item">
              <div class="social-icon tuchong">
                <TuchongIcon />
              </div>
              <input
                v-model="formData.social.tuchong"
                type="text"
                class="social-input"
                placeholder="图虫账号"
              />
            </div>
            <div class="social-item">
              <div class="social-icon instagram">
                <InstagramFilledIcon />
              </div>
              <input
                v-model="formData.social.instagram"
                type="text"
                class="social-input"
                placeholder="Instagram账号"
              />
            </div>
          </div>
        </div>

        <div class="form-section privacy-section">
          <label class="section-label">隐私设置</label>
          <div class="privacy-options">
            <label class="checkbox-item">
              <input
                v-model="formData.privacy.showLocation"
                type="checkbox"
                class="checkbox-input"
              />
              <span class="checkbox-custom"></span>
              <span class="checkbox-label">公开我的位置信息</span>
            </label>
            <label class="checkbox-item">
              <input
                v-model="formData.privacy.showSocialLinks"
                type="checkbox"
                class="checkbox-input"
              />
              <span class="checkbox-custom"></span>
              <span class="checkbox-label">公开我的社交媒体</span>
            </label>
            <label class="checkbox-item">
              <input
                v-model="formData.privacy.allowMessages"
                type="checkbox"
                class="checkbox-input"
              />
              <span class="checkbox-custom"></span>
              <span class="checkbox-label">允许他人发送私信</span>
            </label>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button class="cancel-btn" @click="handleClose">取消</button>
        <button
          class="save-btn"
          :class="{ disabled: !hasChanges }"
          :disabled="!hasChanges"
          @click="handleSave"
        >
          <CheckIcon />
          <span>保存修改</span>
        </button>
      </div>
    </div>

    <ConfirmDialog
      v-model:visible="confirmVisible"
      title="保存修改"
      message="确定要保存修改吗？"
      confirm-text="确定"
      cancel-text="取消"
      @confirm="handleConfirmSave"
    />
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, computed, watch } from 'vue';
  import RegionCascader from '@/pages/Landscape/components/common/RegionCascader/index.vue';
  import ConfirmDialog from '@/pages/Landscape/components/common/ConfirmDialog/index.vue';
  import { chinaRegions } from '@/constants/landscape/chinaRegions';
  import { ProfileSpecialtyOptions } from '@/constants/landscape';
  import CloseIcon from '@/pages/Landscape/icons/common/CloseIcon.vue';
  import UserIcon from '@/pages/Landscape/icons/common/UserIcon.vue';
  import UploadIcon from '@/pages/Landscape/icons/common/UploadIcon.vue';
  import CheckIcon from '@/pages/Landscape/icons/common/CheckIcon.vue';
  import GlobeIcon from '@/pages/Landscape/icons/common/GlobeIcon.vue';
  import MailIcon from '@/pages/Landscape/icons/common/MailIcon.vue';
  import PhoneIcon from '@/pages/Landscape/icons/common/PhoneIcon.vue';
  import WeiboIcon from '@/pages/Landscape/icons/common/WeiboIcon.vue';
  import WechatIcon from '@/pages/Landscape/icons/common/WechatIcon.vue';
  import BilibiliIcon from '@/pages/Landscape/icons/components/profile/EditProfileModal/BilibiliIcon.vue';
  import XiaohongshuIcon from '@/pages/Landscape/icons/components/profile/EditProfileModal/XiaohongshuIcon.vue';
  import MafengwoIcon from '@/pages/Landscape/icons/components/profile/EditProfileModal/MafengwoIcon.vue';
  import TuchongIcon from '@/pages/Landscape/icons/components/profile/EditProfileModal/TuchongIcon.vue';
  import InstagramFilledIcon from '@/pages/Landscape/icons/common/InstagramFilledIcon.vue';

  interface EditableUser {
    name?: string;
    title?: string;
    bio?: string;
    location?: string;
    avatar?: string;
    tags?: string[];
    verified?: boolean;
  }

  interface Props {
    visible: boolean;
    user: EditableUser;
  }

  const props = defineProps<Props>();
  const emit = defineEmits<{
    'update:visible': [value: boolean];
    save: [data: EditableUser];
  }>();

  const tagInput = ref('');
  const locationValue = ref<string[]>([]);

  const getInitialFormData = () => ({
    avatar: props.user.avatar || '',
    name: props.user.name || '',
    title: props.user.title || '',
    bio: props.user.bio || '',
    location: props.user.location || '',
    website: '',
    tags: [...(props.user.tags || [])],
    photography: {
      camera: '',
      lens: '',
      experience: '',
      specialties: [] as string[],
    },
    contact: {
      email: '',
      phone: '',
    },
    social: {
      weibo: '',
      wechat: '',
      bilibili: '',
      xiaohongshu: '',
      mafengwo: '',
      tuchong: '',
      instagram: '',
    },
    privacy: {
      showLocation: true,
      showSocialLinks: true,
      allowMessages: true,
    },
  });

  const formData = reactive(getInitialFormData());
  const initialData = ref(JSON.stringify(getInitialFormData()));

  const specialtyOptions = ProfileSpecialtyOptions;

  const handleLocationChange = (value: any) => {
    if (Array.isArray(value) && value.length > 0) {
      formData.location = value.join('·');
    } else {
      formData.location = '';
    }
  };

  watch(
    () => props.visible,
    (newVal) => {
      if (newVal) {
        const fresh = getInitialFormData();
        Object.assign(formData, fresh);
        initialData.value = JSON.stringify(fresh);
      }
    },
  );

  const suggestedTags = [
    '风光',
    '星空',
    '城市',
    '夜景',
    '自然',
    '人文',
    '建筑',
    '纪实',
  ];

  const availableSuggestedTags = computed(() => {
    return suggestedTags.filter((tag) => !formData.tags.includes(tag));
  });

  const hasChanges = computed(() => {
    return JSON.stringify(formData) !== initialData.value;
  });

  const addTag = () => {
    const tag = tagInput.value.trim();
    if (tag && !formData.tags.includes(tag) && formData.tags.length < 10) {
      formData.tags.push(tag);
      tagInput.value = '';
    }
  };

  const removeTag = (index: number) => {
    formData.tags.splice(index, 1);
  };

  const addSuggestedTag = (tag: string) => {
    if (!formData.tags.includes(tag) && formData.tags.length < 10) {
      formData.tags.push(tag);
    }
  };

  const toggleSpecialty = (specialty: string) => {
    const index = formData.photography.specialties.indexOf(specialty);
    if (index > -1) {
      formData.photography.specialties.splice(index, 1);
    } else if (formData.photography.specialties.length < 5) {
      formData.photography.specialties.push(specialty);
    }
  };

  const handleClose = () => {
    emit('update:visible', false);
  };

  const confirmVisible = ref(false);

  const handleSave = () => {
    if (!hasChanges.value) return;
    confirmVisible.value = true;
  };

  const handleConfirmSave = () => {
    emit('save', formData);
    handleClose();
  };
</script>

<style scoped lang="scss" src="./index.scss" />
