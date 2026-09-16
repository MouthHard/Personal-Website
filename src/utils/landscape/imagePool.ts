const OSS_BASE = 'https://mouthhard-website.oss-cn-hangzhou.aliyuncs.com/landscape';
const POOL_SIZE = 36;

import type { GlobalPhotographer, GlobalImage, GlobalGuide, GlobalPhotographerWork } from '@/typesOfPages/landscape/data';

export function poolImage(index: number): string {
  return `${OSS_BASE}/${((index % POOL_SIZE) + POOL_SIZE) % POOL_SIZE + 1}.webp`;
}

export const imageAssigners = {
  gallery: (i: number) => poolImage(i),
  hotTopic: (i: number) => poolImage(i + 28),
  destination: (i: number, season: number) => poolImage(i * 3 + 8 + season),
  guideCover: (i: number) => poolImage(i * 7 + 4),
  videoPoster: (i: number) => poolImage(i + 18),
  workPreview: (i: number, j: number) => poolImage(i * 4 + j * 7 + 2),
  avatarByAuthorId: (authorId: string) => {
    const num = parseInt(authorId.replace('ph-', '')) || 1;
    return poolImage(num + 19);
  },
};

const SEASONS = ['spring', 'summer', 'autumn', 'winter'] as const;

export function injectImageUrls(data: {
  photographers: GlobalPhotographer[];
  images: GlobalImage[];
  videos: any[];
  guides: GlobalGuide[];
  hotTopics: any[];
  popularDestinations: any[];
}) {
  data.images.forEach((it, i) => {
    it.url = imageAssigners.gallery(i);
  });

  data.hotTopics.forEach((it, i) => {
    it.image = imageAssigners.hotTopic(i);
  });

  data.popularDestinations.forEach((it, i) => {
    if (!it.images || typeof it.images !== 'object') it.images = {};
    SEASONS.forEach((s, j) => {
      it.images[s] = imageAssigners.destination(i, j);
    });
  });

  data.guides.forEach((it, i) => {
    it.cover = imageAssigners.guideCover(i);
    it.authorAvatar = imageAssigners.avatarByAuthorId(it.authorId);
  });

  data.videos.forEach((it, i) => {
    const poster = imageAssigners.videoPoster(i);
    it.poster = poster;
    it.url = poster;
    it.authorAvatar = imageAssigners.avatarByAuthorId(it.authorId);
  });

  data.photographers.forEach((it, i) => {
    it.avatar = imageAssigners.avatarByAuthorId(it.id);
    if (it.worksPreview && Array.isArray(it.worksPreview)) {
      it.worksPreview.forEach((w: GlobalPhotographerWork, j: number) => {
        if (typeof w === 'object' && w !== null) {
          w.image = imageAssigners.workPreview(i, j);
        }
      });
    }
  });
}