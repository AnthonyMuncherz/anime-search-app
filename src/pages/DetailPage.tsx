import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAnimeDetails, getAnimeStreaming } from "../services/api";
import { 
  Container, 
  Grid, 
  Typography, 
  Button, 
  Paper, 
  Box, 
  Chip,
  Card,
  CardContent,
  CircularProgress,
  Backdrop,
  IconButton,
  Tooltip
} from "@mui/material";
import { 
  ArrowBack, 
  Star, 
  TrendingUp, 
  People, 
  EmojiEvents, 
  OpenInNew,
  Movie,
  Tv
} from "@mui/icons-material";
import { AnimeDetail, StreamingLink } from "../types/AnimeDetail";

const DetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [anime, setAnime] = useState<AnimeDetail | null>(null);
  const [streamingLinks, setStreamingLinks] = useState<StreamingLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnime = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);

    try {
      const [animeResult, streamingResult] = await Promise.allSettled([
        getAnimeDetails(id),
        getAnimeStreaming(id)
      ]);

      if (animeResult.status === 'fulfilled') {
        setAnime(animeResult.value.data);
      } else {
        throw new Error("Failed to load anime details");
      }

      if (streamingResult.status === 'fulfilled') {
        setStreamingLinks(streamingResult.value.data);
      }
      
    } catch (err) {
      setError("Failed to load anime details. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnime();
  }, [id]);

  if (loading) {
    return (
      <Backdrop open={loading} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Box display="flex" flexDirection="column" alignItems="center">
          <CircularProgress color="inherit" size={60} />
          <Typography sx={{ mt: 2 }}>Loading anime details...</Typography>
        </Box>
      </Backdrop>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: "120px",
        }}
      >
        <Card sx={{ maxWidth: 400, padding: 4, textAlign: 'center' }}>
          <CardContent>
            <Typography color="error" variant="h6" gutterBottom>{error}</Typography>
            <Button 
              variant="contained" 
              sx={{ mt: 2 }} 
              onClick={fetchAnime}
              startIcon={<ArrowBack />}
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      </Box>
    );
  }

  if (!anime) return null;

  const stats = [
    {
      label: "SCORE",
      value: anime.score ?? "N/A",
      sub: anime.scored_by?.toLocaleString() + " users",
      color: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      icon: <Star sx={{ color: 'white' }} />,
    },
    {
      label: "RANKED",
      value: `#${anime.rank ?? "N/A"}`,
      color: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      icon: <EmojiEvents sx={{ color: 'white' }} />,
    },
    {
      label: "POPULARITY",
      value: `#${anime.popularity ?? "N/A"}`,
      color: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      icon: <TrendingUp sx={{ color: 'white' }} />,
    },
    {
      label: "MEMBERS",
      value: anime.members?.toLocaleString() ?? "N/A",
      color: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
      icon: <People sx={{ color: 'white' }} />,
    },
  ];

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
        <Grid container spacing={4} justifyContent="center">
          <Grid size={{ xs: 12, md: 4 }}>
            <Box 
              sx={{
                position: 'sticky',
                top: '140px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Card
                sx={{
                  borderRadius: '20px',
                  overflow: 'hidden',
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <Box sx={{ position: 'relative' }}>
                  <img
                    src={anime.images.jpg.image_url}
                    alt={`Poster of ${anime.title}`}
                    style={{
                      width: "100%",
                      maxWidth: "300px",
                      height: "auto",
                      objectFit: "cover",
                      display: 'block',
                    }}
                  />
                  {anime.score && (
                    <Chip
                      label={`★ ${anime.score}`}
                      sx={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        background: 'rgba(25, 118, 210, 0.9)',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '0.9rem',
                      }}
                    />
                  )}
                </Box>
              </Card>
              
              <Button
                variant="contained"
                onClick={() => navigate(-1)}
                sx={{ 
                  mt: 3,
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 25px rgba(102, 126, 234, 0.4)',
                  },
                  transition: 'all 0.3s ease',
                }}
                startIcon={<ArrowBack />}
                aria-label="Go back to search page"
              >
                Back to Search
              </Button>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 8 }}>
            <Box
              sx={{
                background: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '20px',
                padding: 4,
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <Typography
                variant="h4"
                gutterBottom
                sx={{
                  fontWeight: 'bold',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  marginBottom: 3,
                }}
                aria-label={`Title: ${anime.title}`}
              >
                {anime.title}
              </Typography>

              <Box sx={{ marginBottom: 3 }}>
                <Chip
                  label="Synopsis"
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '0.9rem',
                    marginBottom: 2,
                  }}
                />
                <Typography
                  sx={{
                    lineHeight: 1.8,
                    color: 'text.secondary',
                    whiteSpace: 'pre-line',
                  }}
                  aria-label="Synopsis content"
                >
                  {anime.synopsis || "No synopsis available."}
                </Typography>
              </Box>

              <Grid container spacing={2}>
                {stats.map((stat, index) => (
                  <Grid
                    size={{ xs: 6, sm: 3 }}
                    key={index}
                  >
                    <Card
                      sx={{
                        background: stat.color,
                        borderRadius: '16px',
                        minHeight: "100px",
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                        transition: 'transform 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                        },
                      }}
                      tabIndex={0}
                      role="group" 
                      aria-label={`${stat.label} statistic`}
                    >
                      <CardContent sx={{ textAlign: 'center', p: 2 }}>
                        {stat.icon}
                        <Typography variant="h5" sx={{ fontWeight: 'bold', mt: 1 }}>
                          {stat.value}
                        </Typography>
                        <Typography fontSize={12} sx={{ opacity: 0.9 }}>
                          {stat.sub || stat.label}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              {/* External Links Section */}
              <Box sx={{ mt: 4 }}>
                <Chip
                  label="External Links"
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '0.9rem',
                    marginBottom: 2,
                  }}
                />
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                  {/* MyAnimeList Link */}
                  {anime.url && (
                    <Tooltip title="View on MyAnimeList">
                      <IconButton
                        component="a"
                        href={anime.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          background: 'linear-gradient(135deg, #2e51a2 0%, #1e3c8b 100%)',
                          color: 'white',
                          borderRadius: '12px',
                          padding: '12px 16px',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #1e3c8b 0%, #2e51a2 100%)',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 6px 20px rgba(46, 81, 162, 0.4)',
                          },
                          transition: 'all 0.3s ease',
                        }}
                        aria-label="View on MyAnimeList"
                      >
                        <Movie sx={{ mr: 1, fontSize: 20 }} />
                        <Typography sx={{ fontWeight: 'bold', fontSize: '0.9rem' }}>
                          MyAnimeList
                        </Typography>
                        <OpenInNew sx={{ ml: 1, fontSize: 16 }} />
                      </IconButton>
                    </Tooltip>
                  )}

                  {/* Streaming Links */}
                  {streamingLinks.map((link, index) => (
                    <Tooltip key={index} title={`Watch on ${link.name}`}>
                      <IconButton
                        component="a"
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          background: link.name.toLowerCase().includes('crunchyroll') 
                            ? 'linear-gradient(135deg, #f47521 0%, #e85d04 100%)'
                            : link.name.toLowerCase().includes('netflix')
                            ? 'linear-gradient(135deg, #e50914 0%, #b81d24 100%)'
                            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          color: 'white',
                          borderRadius: '12px',
                          padding: '12px 16px',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 6px 20px rgba(0, 0, 0, 0.2)',
                          },
                          transition: 'all 0.3s ease',
                        }}
                        aria-label={`Watch on ${link.name}`}
                      >
                        <Tv sx={{ mr: 1, fontSize: 20 }} />
                        <Typography sx={{ fontWeight: 'bold', fontSize: '0.9rem' }}>
                          {link.name}
                        </Typography>
                        <OpenInNew sx={{ ml: 1, fontSize: 16 }} />
                      </IconButton>
                    </Tooltip>
                  ))}
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default DetailPage;
