export interface AnimeSearchItem {
  mal_id: number;
  title: string;
  images: {
    jpg: {
      image_url: string;
    };
  };
  score: number;
  year?: number;
  type?: string;
}
