import { AppBar, Toolbar, Typography, Box, IconButton } from "@mui/material";
import { Movie as MovieIcon, Search as SearchIcon } from "@mui/icons-material";

const Header = () => {
  return (
    <AppBar 
      position="fixed"
      sx={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)',
      }}
    >
      <Toolbar>
        <Box display="flex" alignItems="center" flexGrow={1}>
          <MovieIcon sx={{ mr: 1, fontSize: 28 }} />
          <Typography 
            variant="h6" 
            component="div"
            sx={{
              fontWeight: 'bold',
              fontSize: '1.4rem',
              background: 'linear-gradient(45deg, #fff 30%, #f0f8ff 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            Anime Search App
          </Typography>
        </Box>
        <IconButton color="inherit" sx={{ opacity: 0.8 }}>
          <SearchIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
