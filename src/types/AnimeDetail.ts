export interface AnimeDetail {
    mal_id: number;
    title: string;
    url: string;
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
  
export interface StreamingLink {
  name: string;
  url: string;
}
  