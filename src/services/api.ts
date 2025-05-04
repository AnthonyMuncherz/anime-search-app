import axios from "axios";
import { AnimeDetail } from "../types/AnimeDetail";
import { SearchResponse } from "../types/SearchResponse";

const BASE_URL = "https://api.jikan.moe/v4";

export const searchAnime = async (
  query: string,
  page = 1
): Promise<SearchResponse> => {
  const response = await axios.get(`${BASE_URL}/anime`, {
    params: { q: query, page },
  });
  console.log(response.data);
  return response.data;
};

export const getAnimeDetails = async (
  id: string
): Promise<{ data: AnimeDetail }> => {
  const response = await axios.get(`${BASE_URL}/anime/${id}`);
  return response.data;
};
