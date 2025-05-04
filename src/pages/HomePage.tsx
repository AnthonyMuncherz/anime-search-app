import { useState, useEffect } from "react";
import { searchAnime } from "../services/api";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Container,
  Grid,
  TextField,
  Pagination,
} from "@mui/material";
import { Skeleton } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { AnimeSearchItem } from "../types/AnimeSearchItem";

const HomePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);

  const [query, setQuery] = useState(params.get("q") || "");
  const [page, setPage] = useState(Number(params.get("page")) || 1);
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const [animeList, setAnimeList] = useState<AnimeSearchItem[]>([]);
  const [pageCount, setPageCount] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
      setPage(1);
    }, 250);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const q = debouncedQuery.trim();
    if (q) {
      navigate(`/?q=${encodeURIComponent(q)}&page=${page}`, { replace: true });
    }
  }, [debouncedQuery, navigate, page]);

  useEffect(() => {
    let active = true;

    if (!debouncedQuery) {
      setAnimeList([]);
      return;
    }

    setLoading(true);
    setError(null);

    searchAnime(debouncedQuery, page)
      .then((res) => {
        if (!active) return;
        setAnimeList(res.data);
        setPageCount(res.pagination.last_visible_page || 1);
      })
      .catch((err) => {
        if (active) {
          console.error(err);
          setError("Something went wrong.");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [debouncedQuery, page]);

  return (
    <Container maxWidth="lg" style={{ paddingTop: "100px" }}>
      <TextField
        fullWidth
        label="Search Anime"
        variant="outlined"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {error && (
        <Typography
          color="error"
          align="center"
          sx={{ mt: 2 }}
          role="alert"
          aria-live="assertive"
        >
          {error}
        </Typography>
      )}

      {loading ? (
        <Grid
          container
          spacing={2}
          justifyContent="center"
          style={{ marginTop: "2rem" }}
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <Grid key={i} style={{ width: 225 }}>
              <Skeleton variant="rectangular" width={225} height={325} />
              <Skeleton width="80%" style={{ marginTop: 6 }} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <>
          {animeList.length === 0 && debouncedQuery && (
            <Typography
              align="center"
              style={{ marginTop: "2rem" }}
              role="status"
            >
              No results found.
            </Typography>
          )}

          <Grid
            container
            spacing={2}
            justifyContent="center"
            style={{ marginTop: "2rem" }}
            role="list"
            aria-label="Search results"
          >
            {animeList.map((anime) => (
              <Grid style={{ width: 225 }}>
                <Card
                  onClick={() => navigate(`/anime/${anime.mal_id}`)}
                  sx={{ cursor: "pointer", height: "100%" }}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") navigate(`/anime/${anime.mal_id}`);
                  }}
                  role="button"
                  aria-label={`Open details for ${anime.title}`}
                >
                  <CardMedia
                    component="img"
                    height="325"
                    image={anime.images.jpg.image_url}
                    alt={anime.title}
                    style={{ objectFit: "cover" }}
                  />
                  <CardContent>
                    <Typography variant="body2" noWrap>
                      {anime.title}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {pageCount > 1 && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "2rem",
              }}
              aria-label="Pagination Navigation"
            >
              <Pagination
                count={pageCount}
                page={page}
                onChange={(_, value) => setPage(value)}
                color="primary"
                aria-current="true"
              />
            </div>
          )}
        </>
      )}
    </Container>
  );
};

export default HomePage;
