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
  Box,
  Chip,
  Rating,
} from "@mui/material";
import { Skeleton } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { AnimeSearchItem } from "../types/AnimeSearchItem";
import { Search as SearchIcon } from "@mui/icons-material";

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
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        paddingTop: "120px",
        paddingBottom: "40px"
      }}
    >
      <Container maxWidth="lg">
        {/* Enhanced Search Bar */}
        <Box
          sx={{
            background: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '32px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <TextField
            fullWidth
            label="Search for your favorite anime..."
            variant="outlined"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'action.active' }} />,
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 1)',
                },
                '&.Mui-focused': {
                  backgroundColor: 'rgba(255, 255, 255, 1)',
                },
              },
            }}
          />
          {debouncedQuery && (
            <Typography
              variant="body2"
              sx={{ mt: 1, color: 'text.secondary', textAlign: 'center' }}
            >
              Searching for "{debouncedQuery}"...
            </Typography>
          )}
        </Box>

        {error && (
          <Box
            sx={{
              background: 'rgba(244, 67, 54, 0.1)',
              border: '1px solid rgba(244, 67, 54, 0.3)',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '24px',
            }}
          >
            <Typography
              color="error"
              align="center"
              role="alert"
              aria-live="assertive"
            >
              {error}
            </Typography>
          </Box>
        )}

        {loading ? (
          <Grid
            container
            spacing={3}
            justifyContent="center"
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <Grid key={i} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <Box
                  sx={{
                    background: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <Skeleton variant="rectangular" width="100%" height={300} />
                  <Box sx={{ p: 2 }}>
                    <Skeleton width="80%" height={24} />
                    <Skeleton width="60%" height={20} sx={{ mt: 1 }} />
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        ) : (
          <>
            {animeList.length === 0 && debouncedQuery && (
              <Box
                sx={{
                  textAlign: 'center',
                  padding: '48px',
                  background: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: '16px',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                }}
              >
                <Typography
                  variant="h6"
                  color="text.secondary"
                  role="status"
                >
                  No results found for "{debouncedQuery}"
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Try searching with different keywords
                </Typography>
              </Box>
            )}

            <Grid
              container
              spacing={3}
              justifyContent="center"
              role="list"
              aria-label="Search results"
            >
              {animeList.map((anime) => (
                <Grid key={anime.mal_id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                  <Card
                    onClick={() => navigate(`/anime/${anime.mal_id}`)}
                    sx={{
                      cursor: "pointer",
                      height: "100%",
                      borderRadius: '16px',
                      background: 'rgba(255, 255, 255, 0.95)',
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
                        background: 'rgba(255, 255, 255, 1)',
                      },
                      overflow: 'hidden',
                    }}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") navigate(`/anime/${anime.mal_id}`);
                    }}
                    role="button"
                    aria-label={`Open details for ${anime.title}`}
                  >
                    <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                      <CardMedia
                        component="img"
                        height="300"
                        image={anime.images.jpg.image_url}
                        alt={anime.title}
                        sx={{
                          objectFit: "cover",
                          transition: 'transform 0.3s ease-in-out',
                          '&:hover': {
                            transform: 'scale(1.05)',
                          },
                        }}
                      />
                      {anime.score && (
                        <Chip
                          label={`★ ${anime.score}`}
                          size="small"
                          sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            background: 'rgba(25, 118, 210, 0.9)',
                            color: 'white',
                            fontWeight: 'bold',
                          }}
                        />
                      )}
                    </Box>
                    <CardContent sx={{ p: 2 }}>
                      <Typography 
                        variant="h6" 
                        noWrap
                        sx={{
                          fontWeight: 600,
                          fontSize: '0.95rem',
                          lineHeight: 1.3,
                          marginBottom: 1,
                        }}
                      >
                        {anime.title}
                      </Typography>
                      {anime.year && (
                        <Typography variant="body2" color="text.secondary">
                          {anime.year} • {anime.type || 'TV'}
                        </Typography>
                      )}
                      {anime.score && (
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                          <Rating
                            value={anime.score / 2}
                            readOnly
                            size="small"
                            precision={0.1}
                          />
                          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                            ({anime.score})
                          </Typography>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {pageCount > 1 && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "48px",
                  padding: '24px',
                  background: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: '16px',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                }}
                aria-label="Pagination Navigation"
              >
                <Pagination
                  count={pageCount}
                  page={page}
                  onChange={(_, value) => setPage(value)}
                  color="primary"
                  size="large"
                  aria-current="true"
                  sx={{
                    '& .MuiPaginationItem-root': {
                      borderRadius: '12px',
                      margin: '0 4px',
                      '&:hover': {
                        background: 'rgba(25, 118, 210, 0.1)',
                      },
                    },
                    '& .Mui-selected': {
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      },
                    },
                  }}
                />
              </Box>
            )}
          </>
        )}
      </Container>
    </Box>
  );
};

export default HomePage;
