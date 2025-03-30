export type Theme = {
  name: string;
  previewImgPath: string;
  logoImgPath: string;
  styleSheet: string;
  background: { type: backgroundType; color?: string; path?: string };
};

export type backgroundType = 'color' | 'image' | 'video';
