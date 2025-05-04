import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAnimeDetails } from "../services/api";
import { Container, Grid, Typography, Button, Paper, Box } from "@mui/material";
import { AnimeDetail } from "../types/AnimeDetail";

const DetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [anime, setAnime] = useState<AnimeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnime = () => {
    if (!id) return;
    setLoading(true);
    setError(null);

    getAnimeDetails(id)
      .then((res) => {
        setAnime(res.data);
      })
      .catch(() => {
        setError("Failed to load anime details. Please try again.");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAnime();
  }, [id]);

  if (loading) {
    return (
      <Container sx={{ pt: "100px", textAlign: "center" }}>
        <Typography>Loading anime details...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ pt: "100px", textAlign: "center" }}>
        <Typography color="error">{error}</Typography>
        <Button variant="outlined" sx={{ mt: 2 }} onClick={fetchAnime}>
          Retry
        </Button>
      </Container>
    );
  }

  if (!anime) return null;

  return (
    <Container maxWidth="lg" sx={{ pt: "100px" }}>
      <Grid container spacing={4} justifyContent="center">
        <Grid size={{ xs: 12, md: 3 }}>
          <Box display="flex" flexDirection="column" alignItems="center">
            <img
              src={anime.images.jpg.image_url}
              alt={`Poster of ${anime.title}`}
              style={{
                width: "150px",
                height: "225px",
                objectFit: "cover",
                borderRadius: 8,
              }}
            />
            <Button
              variant="contained"
              color="secondary"
              onClick={() => navigate(-1)}
              sx={{ mt: 2 }}
              aria-label="Go back to search page"
            >
              ← Back
            </Button>
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 9 }}>
          <Typography
            variant="h5"
            gutterBottom
            aria-label={`Title: ${anime.title}`}
          >
            {anime.title}
          </Typography>

          <Box
            component="span"
            sx={{
              backgroundColor: "#1976d2",
              color: "white",
              px: 1,
              py: 0.5,
              borderRadius: "4px",
              fontWeight: "bold",
            }}
            role="heading"
            aria-level={2}
            aria-label="Synopsis"
          >
            Synopsis
          </Box>

          <Typography
            sx={{
              mt: 1,
              maxHeight: "150px",
              overflow: "auto",
              whiteSpace: "pre-line",
            }}
            aria-label={`Synopsis content`}
          >
            {anime.synopsis || "No synopsis available."}
          </Typography>

          <Grid container spacing={2} sx={{ mt: 1 }}>
            {[
              {
                label: "USERS",
                value: anime.score ?? "N/A",
                sub: anime.scored_by?.toLocaleString(),
                color: "#e3f2fd",
              },
              {
                label: "RANKED",
                value: `#${anime.rank ?? "N/A"}`,
                color: "#fce4ec",
              },
              {
                label: "POPULARITY",
                value: `#${anime.popularity ?? "N/A"}`,
                color: "#f8bbd0",
              },
              {
                label: "MEMBERS",
                value: anime.members?.toLocaleString(),
                color: "#c8e6c9",
              },
            ].map((stat, index) => (
              <Grid
                size={{ xs: 6, sm: 3 }}
                key={index}
                tabIndex={0}
                role="group" 
                aria-label={`${stat.label} statistic`}
              >
                <Paper sx={{ p: 2, bgcolor: stat.color, minHeight: "80px" }}>
                  <Typography variant="h6" align="center">
                    {stat.value}
                  </Typography>
                  <Typography fontSize={12} align="center">
                    {stat.sub ? `${stat.sub} ${stat.label}` : stat.label}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DetailPage;
