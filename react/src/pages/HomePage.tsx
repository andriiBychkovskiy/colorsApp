import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  Fade,
  Paper,
  Stack,
  Chip,
} from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { Palette, Brush, Save, Star } from "@mui/icons-material";
import { API_ENDPOINTS } from "../config/api";

// Animated gradient background
const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const HeroSection = styled(Box)(() => ({
  background:
    "linear-gradient(-45deg, #FF6B6B, #4ECDC4, #45B7D1, #96CEB4, #FFEAA7, #DDA0DD)",
  backgroundSize: "400% 400%",
  animation: `${gradientAnimation} 15s ease infinite`,
  minHeight: "60vh",
  display: "flex",
  alignItems: "center",
  color: "white",
  textAlign: "center",
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.1)",
    zIndex: 1,
  },
}));

const FloatingIcon = styled(Box)(() => ({
  position: "absolute",
  animation: "float 6s ease-in-out infinite",
  "@keyframes float": {
    "0%": { transform: "translateY(0px)" },
    "50%": { transform: "translateY(-20px)" },
    "100%": { transform: "translateY(0px)" },
  },
}));

const FeatureCard = styled(Card)(({ theme }) => ({
  height: "100%",
  transition: "all 0.3s ease-in-out",
  cursor: "pointer",
  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow: theme.shadows[8],
  },
}));

const ColorfulButton = styled(Button)(() => ({
  background: "linear-gradient(45deg, #FF6B6B 30%, #4ECDC4 90%)",
  border: 0,
  borderRadius: 25,
  boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
  color: "white",
  height: 56,
  padding: "0 30px",
  fontSize: "1.2rem",
  fontWeight: "bold",
  "&:hover": {
    background: "linear-gradient(45deg, #FF5252 30%, #26A69A 90%)",
    transform: "scale(1.05)",
  },
}));

interface SVGImage {
  id: string;
  name: string;
  url: string;
  svgContent?: string;
}

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [sampleImages, setSampleImages] = useState<SVGImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSampleImages();
  }, []);

  const fetchSampleImages = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.IMAGES);
      setSampleImages(response.data.slice(0, 3)); // Get first 3 images for preview
    } catch (error) {
      console.error("Failed to fetch sample images:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartColoring = () => {
    if (isAuthenticated && user) {
      navigate(`/user/${user.id}`);
    } else {
      navigate("/login");
    }
  };

  const features = [
    {
      icon: <Brush sx={{ fontSize: 40, color: "#FF6B6B" }} />,
      title: "Interactive Coloring",
      description:
        "Click and color beautiful SVG images with smooth, responsive interactions",
    },
    {
      icon: <Palette sx={{ fontSize: 40, color: "#4ECDC4" }} />,
      title: "Amazing Color Palettes",
      description:
        "Choose from carefully curated color palettes designed for creativity",
    },
    {
      icon: <Save sx={{ fontSize: 40, color: "#45B7D1" }} />,
      title: "Save Your Progress",
      description:
        "Never lose your work! Your coloring progress is automatically saved",
    },
    {
      icon: <Star sx={{ fontSize: 40, color: "#FFEAA7" }} />,
      title: "Fun for Everyone",
      description:
        "Perfect for kids, adults, and anyone who loves creative expression",
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <HeroSection>
        <FloatingIcon sx={{ top: "10%", left: "10%", zIndex: 2 }}>
          <Brush sx={{ fontSize: 60, color: "rgba(255,255,255,0.3)" }} />
        </FloatingIcon>
        <FloatingIcon
          sx={{ top: "20%", right: "15%", zIndex: 2, animationDelay: "-2s" }}
        >
          <Palette sx={{ fontSize: 50, color: "rgba(255,255,255,0.3)" }} />
        </FloatingIcon>
        <FloatingIcon
          sx={{ bottom: "15%", left: "20%", zIndex: 2, animationDelay: "-4s" }}
        >
          <Star sx={{ fontSize: 45, color: "rgba(255,255,255,0.3)" }} />
        </FloatingIcon>

        <Container maxWidth="md" sx={{ position: "relative", zIndex: 2 }}>
          <Fade in timeout={1000}>
            <Box>
              <Typography
                variant="h1"
                component="h1"
                gutterBottom
                sx={{
                  fontWeight: "bold",
                  fontSize: { xs: "2.5rem", md: "4rem" },
                  textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
                  mb: 2,
                }}
              >
                🎨 Kids Colors 🌈
              </Typography>
              <Typography
                variant="h4"
                component="h2"
                gutterBottom
                sx={{
                  fontSize: { xs: "1.2rem", md: "1.8rem" },
                  textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
                  mb: 4,
                  fontWeight: 300,
                }}
              >
                The magical world of digital coloring awaits!
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  mb: 4,
                  fontSize: { xs: "1rem", md: "1.2rem" },
                  opacity: 0.9,
                }}
              >
                Create beautiful artwork, save your progress, and let your
                creativity shine!
              </Typography>
              <ColorfulButton
                size="large"
                onClick={handleStartColoring}
                sx={{ mr: 2, mb: 2 }}
              >
                🚀 Start Coloring Now!
              </ColorfulButton>
              {!isAuthenticated && (
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate("/register")}
                  sx={{
                    color: "white",
                    borderColor: "white",
                    mb: 2,
                    "&:hover": {
                      backgroundColor: "rgba(255,255,255,0.1)",
                      borderColor: "white",
                    },
                  }}
                >
                  Create Account
                </Button>
              )}
            </Box>
          </Fade>
        </Container>
      </HeroSection>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography
          variant="h3"
          component="h2"
          textAlign="center"
          gutterBottom
          sx={{
            fontWeight: "bold",
            color: "#333",
            mb: 6,
          }}
        >
          Why Kids Love Our App? ✨
        </Typography>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Fade in timeout={1000 + index * 200}>
                <FeatureCard>
                  <CardContent sx={{ textAlign: "center", p: 3 }}>
                    <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                    <Typography
                      variant="h6"
                      component="h3"
                      gutterBottom
                      sx={{ fontWeight: "bold" }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </FeatureCard>
              </Fade>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Sample Gallery Section */}
      {!loading && sampleImages.length > 0 && (
        <Box sx={{ backgroundColor: "#f8f9fa", py: 8 }}>
          <Container maxWidth="lg">
            <Typography
              variant="h3"
              component="h2"
              textAlign="center"
              gutterBottom
              sx={{
                fontWeight: "bold",
                color: "#333",
                mb: 6,
              }}
            >
              🎨 Sample Coloring Pages
            </Typography>

            <Grid container spacing={4} justifyContent="center">
              {sampleImages.map((image, index) => (
                <Grid item xs={12} sm={6} md={4} key={image.id}>
                  <Fade in timeout={1200 + index * 300}>
                    <Paper
                      elevation={4}
                      sx={{
                        p: 3,
                        textAlign: "center",
                        transition: "all 0.3s ease",
                        cursor: "pointer",
                        "&:hover": {
                          transform: "scale(1.05)",
                          boxShadow: 8,
                        },
                      }}
                      onClick={handleStartColoring}
                    >
                      <Box
                        sx={{
                          height: 200,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          mb: 2,
                          "& svg": {
                            maxWidth: "100%",
                            maxHeight: "100%",
                          },
                        }}
                        dangerouslySetInnerHTML={{
                          __html: image.svgContent || "",
                        }}
                      />
                      <Chip
                        label="Click to Color!"
                        color="primary"
                        size="small"
                        sx={{ mt: 1 }}
                      />
                    </Paper>
                  </Fade>
                </Grid>
              ))}
            </Grid>

            <Box textAlign="center" sx={{ mt: 6 }}>
              <ColorfulButton onClick={handleStartColoring}>
                🎨 See All Coloring Pages
              </ColorfulButton>
            </Box>
          </Container>
        </Box>
      )}

      {/* Call to Action Section */}
      <Box sx={{ backgroundColor: "#4ECDC4", py: 8 }}>
        <Container maxWidth="md">
          <Box textAlign="center">
            <Typography
              variant="h3"
              component="h2"
              gutterBottom
              sx={{
                color: "white",
                fontWeight: "bold",
                textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
              }}
            >
              Ready to Create Magic? ✨
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: "white",
                mb: 4,
                opacity: 0.9,
              }}
            >
              Join thousands of kids already having fun with digital coloring!
            </Typography>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              justifyContent="center"
              alignItems="center"
            >
              <Button
                variant="contained"
                size="large"
                onClick={handleStartColoring}
                sx={{
                  backgroundColor: "white",
                  color: "#4ECDC4",
                  fontWeight: "bold",
                  px: 4,
                  py: 1.5,
                  "&:hover": {
                    backgroundColor: "#f0f0f0",
                    transform: "scale(1.05)",
                  },
                }}
              >
                🚀 Start Your Journey
              </Button>
              {!isAuthenticated && (
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate("/register")}
                  sx={{
                    color: "white",
                    borderColor: "white",
                    fontWeight: "bold",
                    px: 4,
                    py: 1.5,
                    "&:hover": {
                      backgroundColor: "rgba(255,255,255,0.1)",
                      borderColor: "white",
                    },
                  }}
                >
                  📝 Create Free Account
                </Button>
              )}
            </Stack>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;
