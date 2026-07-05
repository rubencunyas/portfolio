import fs from 'fs';
import path from 'path';

export interface ProjectImages {
  cover: string | null;
  gallery: string[];
  gallerySlider: string[];
}

const IMAGE_RE = /\.(webp|png|jpg|jpeg)$/i;
const COVER_RE = /^cover\.(webp|png|jpg|jpeg)$/i;
const SLIDER_RE = /^slider-(\d+)\.(webp|png|jpg|jpeg)$/i;
const GALLERY_RE = /^gallery-(\d+)\.(webp|png|jpg|jpeg)$/i;

const numericSorter = (a: string, b: string) => {
  const na = parseInt(a.match(/\d+/)?.[0] || '0', 10);
  const nb = parseInt(b.match(/\d+/)?.[0] || '0', 10);
  return na - nb;
};

export function getProjectImages(slug: string): ProjectImages {
  const result: ProjectImages = {
    cover: null,
    gallery: [],
    gallerySlider: [],
  };

  const imagesDir = path.join(process.cwd(), 'public', 'projects', slug);

  if (!fs.existsSync(imagesDir)) {
    return result;
  }

  const files = fs.readdirSync(imagesDir).filter(f => IMAGE_RE.test(f));

  if (files.length === 0) return result;

  const basePath = `/projects/${slug}`;

  const coverFile = files.find(f => COVER_RE.test(f));
  if (coverFile) {
    result.cover = `${basePath}/${coverFile}`;
  }

  const sliderFiles = files.filter(f => SLIDER_RE.test(f)).sort(numericSorter);
  if (sliderFiles.length > 0) {
    result.gallerySlider = sliderFiles.map(f => `${basePath}/${f}`);
  }

  const galleryFiles = files.filter(f => GALLERY_RE.test(f)).sort(numericSorter);
  if (galleryFiles.length > 0) {
    result.gallery = galleryFiles.map(f => `${basePath}/${f}`);
  }

  return result;
}
