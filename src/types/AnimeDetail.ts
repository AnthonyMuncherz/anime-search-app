export interface AnimeDetail {
    mal_id: number;
    title: string;
    images: {
      jpg: {
        image_url: string;
      };
    };
    synopsis: string;
    score: number;
    scored_by: number;
    rank: number;
    popularity: number;
    members: number;
  }
  