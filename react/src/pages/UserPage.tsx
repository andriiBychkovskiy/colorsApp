import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid2";
import Box from "@mui/material/Box";
import { styled, keyframes } from "@mui/material/styles";
import {
  Typography,
  Paper,
  Fade,
  IconButton,
  Tooltip,
  Button,
} from "@mui/material";
import {
  Palette,
  Brush,
  Undo,
  Collections,
  Star,
  Celebration,
  Clear,
} from "@mui/icons-material";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import ColorPaletteSelector from "../components/ColorPaletteSelector";
import SVGImageSelector from "../components/SVGImageSelector";
import SVGEditor from "../components/SVGEditor";
import Modal from "../components/Modal";
import ConfirmationModal from "../components/ConfirmationModal";
import RoundButton from "../UI/ RoundButton";
import image from "../assets/150243768_fd25a659-fc17-402c-a5b4-1e5b8d8ad553.jpg";
import { API_ENDPOINTS } from "../config/api";

// Cursor size options
const CURSOR_SIZES = [
  { size: 8, label: "Small" },
  { size: 16, label: "Medium" },
  { size: 20, label: "Large" },
];

export interface SVGImage {
  id: string;
  name: string;
  url: string;
  svgContent?: string;
}

interface ColorPalette {
  id: string;
  name: string;
  colors: string[];
}

interface UserProgress {
  id?: string;
  userId: string;
  svgId: string;
  layers: { [key: string]: string };
}

// Animated gradient background
const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const UserPageContainer = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  background:
    "linear-gradient(-45deg, #FF6B6B, #4ECDC4, #45B7D1, #96CEB4, #FFEAA7, #DDA0DD)",
  backgroundSize: "400% 400%",
  animation: `${gradientAnimation} 20s ease infinite`,
  paddingTop: theme.spacing(10), // Account for header
  paddingBottom: theme.spacing(4),
  paddingLeft: theme.spacing(1),
  paddingRight: theme.spacing(1),
  position: "relative",
  overflow: "hidden",
  [theme.breakpoints.up("sm")]: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  [theme.breakpoints.up("md")]: {
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
  },
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.05)",
    zIndex: 1,
  },
}));

const FloatingIcon = styled(Box)(() => ({
  position: "absolute",
  animation: "float 8s ease-in-out infinite",
  zIndex: 2,
  "@keyframes float": {
    "0%": { transform: "translateY(0px)" },
    "50%": { transform: "translateY(-15px)" },
    "100%": { transform: "translateY(0px)" },
  },
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 20,
  boxShadow: "0 15px 35px rgba(0,0,0,0.1)",
  background: "rgba(255,255,255,0.95)",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(255,255,255,0.2)",
  position: "relative",
  zIndex: 3,
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
  },
}));

const ActionButton = styled(IconButton)(({ theme }) => ({
  background: "linear-gradient(45deg, #4ECDC4 30%, #45B7D1 90%)",
  color: "white",
  margin: theme.spacing(0.5),
  width: 56,
  height: 56,
  borderRadius: "50%",
  boxShadow: "0 4px 12px rgba(78, 205, 196, 0.3)",
  transition: "all 0.3s ease",
  "&:hover": {
    background: "linear-gradient(45deg, #26A69A 30%, #1976D2 90%)",
    transform: "translateY(-2px)",
    boxShadow: "0 8px 20px rgba(78, 205, 196, 0.4)",
  },
}));

const ClearAllButton = styled(Button)(({ theme }) => ({
  borderRadius: 20,
  padding: theme.spacing(1.5, 3),
  fontSize: "1rem",
  fontWeight: "bold",
  textTransform: "none",
  boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 6px 20px rgba(0,0,0,0.3)",
  },
}));

const CursorSizeContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: theme.spacing(1.5),
  marginTop: theme.spacing(2),
  padding: theme.spacing(2),
  background: "rgba(255,255,255,0.15)",
  borderRadius: 15,
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(255,255,255,0.2)",
}));

const CursorSizeButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== "brushSize",
})<{ brushSize: number }>(({ brushSize }) => ({
  minWidth: Math.max(brushSize * 2, 20),
  width: Math.max(brushSize * 2, 20),
  height: Math.max(brushSize * 2, 20),
  borderRadius: "50%",
  border: `1px solid #4ECDC4`,
  background: "rgba(78, 205, 196, 0.3)",
  padding: 0,
  margin: "8px",
  transition: "all 0.3s ease",
  "&:hover": {
    background: "rgba(78, 205, 196, 0.5)",
    border: `1px solid #FF6B6B`,
    transform: "scale(1.1)",
  },
  "&.selected": {
    background: "linear-gradient(45deg, #FF6B6B 30%, #4ECDC4 90%)",
    border: `1px solid #FF6B6B`,
    boxShadow: "0 4px 15px rgba(255, 107, 107, 0.4)",
  },
}));

const SizeLabel = styled(Typography)(() => ({
  color: "white",
  fontSize: "0.9rem",
  fontWeight: "bold",
  textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
  marginBottom: "8px",
}));

const UserPage: React.FC = () => {
  const { user } = useAuth();
  const [svgImages, setSvgImages] = useState<SVGImage[]>([]);
  const [colorPalettes, setColorPalettes] = useState<ColorPalette[]>([]);
  const [selectedPalette, setSelectedPalette] = useState<ColorPalette | null>(
    null
  );
  const [selectedImage, setSelectedImage] = useState<SVGImage | null>(null);
  const [currentColor, setCurrentColor] = useState<string>("#90EE90");
  const [progress, setProgress] = useState<UserProgress>({
    userId: "",
    svgId: "",
    layers: {},
  });
  const [undoStack, setUndoStack] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [allUserProgress, setAllUserProgress] = useState<UserProgress[]>([]);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
  const [cursorSize, setCursorSize] = useState<number>(16);

  useEffect(() => {
    fetchSVGImages();
    fetchColorPalettes();
  }, []);

  useEffect(() => {
    if (user) {
      fetchAllUserProgress(user.id);
    }
  }, [user]);
  useEffect(() => {
    if (selectedImage && user) {
      fetchProgress(user.id, selectedImage.id);
    }
  }, [selectedImage, user]);

  // Function to get user progress (backend automatically creates if not exists)
  const fetchProgress = async (userId: string, svgId: string) => {
    try {
      const response = await axios.get(
        `${API_ENDPOINTS.PROGRESS}/user/${userId}/svg/${svgId}`
      );
      setProgress(response.data);
    } catch (error) {
      console.error("Failed to fetch progress:", error);
      // Fallback to creating a new progress object
      setProgress({
        userId,
        svgId,
        layers: {},
      });
    }
  };
  useEffect(() => {
    const saveProgress = async () => {
      if (progress.userId && progress.svgId) {
        console.log("Saving progress...");
        try {
          if (progress.id) {
            await axios.put(
              `${API_ENDPOINTS.PROGRESS}/${progress.id}`,
              progress
            );
          } else {
            const response = await axios.post(API_ENDPOINTS.PROGRESS, progress);
            setProgress((prev) => ({ ...prev, id: response.data.id }));
          }
          // Refresh the all user progress data after saving
          if (user) {
            await fetchAllUserProgress(user.id);
          }
          console.log("Progress saved successfully");
        } catch (error) {
          console.error("Failed to save progress:", error);
        }
      }
    };

    const interval = setInterval(() => {
      saveProgress();
    }, 3000); // 30 cекунд

    return () => clearInterval(interval); // Очистка интервала при размонтировании
  }, [progress, user]);

  const fetchSVGImages = async () => {
    const response = await axios.get(API_ENDPOINTS.IMAGES);
    setSvgImages(response.data);
  };

  const fetchColorPalettes = async () => {
    const response = await axios.get(API_ENDPOINTS.PALETTES);
    setColorPalettes(response.data);
  };

  // Function to fetch all progress for the current user
  const fetchAllUserProgress = async (userId: string) => {
    try {
      const response = await axios.get(
        `${API_ENDPOINTS.PROGRESS}?userId=${userId}`
      );
      console.log("Fetched all user progress:", response.data);
      setAllUserProgress(response.data);
    } catch (error) {
      console.error("Failed to fetch user progress:", error);
    }
  };

  const handleSelectImage = (image: SVGImage) => {
    setSelectedImage(image);
    setIsModalOpen(false); // Close the modal after selecting an image
  };

  // Clear all progress for current image
  const handleClearAll = async () => {
    if (!selectedImage || !user) return;

    try {
      // Clear the current progress
      setProgress({
        userId: user.id,
        svgId: selectedImage.id,
        layers: {},
      });

      // Delete all progress entries for this user and image
      const response = await axios.get(
        `${API_ENDPOINTS.PROGRESS}?userId=${user.id}&svgId=${selectedImage.id}`
      );
      const progressEntries = response.data;

      // Delete each progress entry
      for (const entry of progressEntries) {
        await axios.delete(`${API_ENDPOINTS.PROGRESS}/${entry.id}`);
      }

      // Refresh the all user progress data
      await fetchAllUserProgress(user.id);

      console.log("All progress cleared successfully");
    } catch (error) {
      console.error("Failed to clear progress:", error);
    }
  };

  return (
    <UserPageContainer>
      {/* Floating Icons */}
      <FloatingIcon sx={{ top: "10%", left: "5%", animationDelay: "0s" }}>
        <Palette sx={{ fontSize: 40, color: "rgba(255,255,255,0.2)" }} />
      </FloatingIcon>
      <FloatingIcon sx={{ top: "20%", right: "8%", animationDelay: "-2s" }}>
        <Brush sx={{ fontSize: 35, color: "rgba(255,255,255,0.2)" }} />
      </FloatingIcon>
      <FloatingIcon sx={{ bottom: "15%", left: "10%", animationDelay: "-4s" }}>
        <Star sx={{ fontSize: 30, color: "rgba(255,255,255,0.2)" }} />
      </FloatingIcon>
      <FloatingIcon sx={{ bottom: "25%", right: "5%", animationDelay: "-1s" }}>
        <Celebration sx={{ fontSize: 38, color: "rgba(255,255,255,0.2)" }} />
      </FloatingIcon>

      <Box
        sx={{
          maxWidth: "1600px",
          margin: "0 auto",
          padding: 3,
          position: "relative",
          zIndex: 3,
        }}
      >
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <SVGImageSelector
            svgImages={svgImages}
            onSelectImage={handleSelectImage}
            userProgress={allUserProgress}
            userId={user?.id}
          />
        </Modal>

        <Grid container spacing={3}>
          {/* Image Selector */}
          <Grid size={{ xs: 12, sm: 12, md: 3, lg: 2 }}>
            <Fade in timeout={1200}>
              <StyledPaper>
                <Box textAlign="center">
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ fontWeight: "bold", color: "#333" }}
                  >
                    <Collections sx={{ mr: 1, verticalAlign: "middle" }} />
                    Choose Image
                  </Typography>
                  <RoundButton
                    imageSrc={image}
                    onClick={() => {
                      setIsModalOpen(true);
                      // Refresh progress when opening modal
                      if (user) {
                        fetchAllUserProgress(user.id);
                      }
                    }}
                    size={120}
                  />
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                  >
                    Click to browse coloring pages
                  </Typography>
                </Box>

                {/* Cursor Size Selector */}
                <CursorSizeContainer>
                  <SizeLabel>Brush Size</SizeLabel>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "row", md: "column" },
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 1,
                      width: "100%",
                    }}
                  >
                    <CursorSizeButton
                      brushSize={8}
                      className={cursorSize === 8 ? "selected" : ""}
                      onClick={() => setCursorSize(8)}
                    />
                    <CursorSizeButton
                      brushSize={16}
                      className={cursorSize === 16 ? "selected" : ""}
                      onClick={() => setCursorSize(16)}
                    />
                    <CursorSizeButton
                      brushSize={20}
                      className={cursorSize === 20 ? "selected" : ""}
                      onClick={() => setCursorSize(20)}
                    />
                  </Box>
                  <Typography
                    variant="caption"
                    sx={{ color: "rgba(255,255,255,0.8)", textAlign: "center" }}
                  >
                    Current:{" "}
                    {CURSOR_SIZES.find((s) => s.size === cursorSize)?.label} (
                    {cursorSize}px)
                  </Typography>
                </CursorSizeContainer>
              </StyledPaper>
            </Fade>
          </Grid>

          {/* Main Canvas */}
          <Grid size={{ xs: 12, sm: 12, md: 6, lg: 8 }}>
            <Fade in timeout={1400}>
              <StyledPaper sx={{ minHeight: "70vh" }}>
                {selectedImage ? (
                  <Box>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      mb={2}
                    >
                      <Box>
                        <Tooltip title="Undo last action">
                          <ActionButton
                            onClick={() => {
                              if (undoStack.length > 0) {
                                const lastLayer = undoStack.pop()!;
                                const newProgress = { ...progress };
                                delete newProgress.layers[lastLayer];
                                setProgress(newProgress);
                                setUndoStack([...undoStack]);
                              }
                            }}
                            disabled={undoStack.length === 0}
                          >
                            <Undo />
                          </ActionButton>
                        </Tooltip>
                      </Box>
                    </Box>
                    <SVGEditor
                      selectedImage={{
                        ...selectedImage,
                        svgContent: selectedImage.svgContent || "",
                      }}
                      progress={progress}
                      currentColor={currentColor}
                      cursorSize={cursorSize}
                      onLayerClick={(layerId) => {
                        const newProgress = {
                          ...progress,
                          layers: {
                            ...progress.layers,
                            [layerId]: currentColor,
                          },
                          userId: user?.id || "",
                          svgId: selectedImage.id,
                        };
                        setProgress(newProgress);
                        setUndoStack([...undoStack, layerId]);
                      }}
                      onExport={() => {
                        // Export functionality removed
                      }}
                      onUndo={() => {
                        if (undoStack.length > 0) {
                          const lastLayer = undoStack.pop()!;
                          const newProgress = { ...progress };
                          delete newProgress.layers[lastLayer];
                          setProgress(newProgress);
                          setUndoStack([...undoStack]);
                        }
                      }}
                      applyProgressToSVG={(svgContent, layers) => {
                        const parser = new DOMParser();
                        const svgDoc = parser.parseFromString(
                          svgContent,
                          "image/svg+xml"
                        );
                        if (layers && typeof layers === "object") {
                          Object.keys(layers).forEach((layerId) => {
                            const layer = svgDoc.getElementById(layerId);
                            if (layer) {
                              layer.setAttribute(
                                "style",
                                `fill:${layers[layerId]}`
                              );
                            }
                          });
                        }
                        return new XMLSerializer().serializeToString(svgDoc);
                      }}
                      addIdsToPaths={(svgContent) => {
                        const parser = new DOMParser();
                        const svgDoc = parser.parseFromString(
                          svgContent,
                          "image/svg+xml"
                        );
                        const paths = svgDoc.querySelectorAll("path");
                        paths.forEach((path, index) => {
                          if (!path.id) {
                            path.id = `path-${index}`;
                          }
                        });
                        return new XMLSerializer().serializeToString(svgDoc);
                      }}
                    />

                    {/* Clear All Button */}
                    <Box sx={{ mt: 2, textAlign: "center" }}>
                      <ClearAllButton
                        variant="contained"
                        startIcon={<Clear />}
                        onClick={() => setIsConfirmModalOpen(true)}
                        sx={{
                          background:
                            "linear-gradient(45deg, #FF6B6B 30%, #FF8E53 90%)",
                          color: "white",
                          "&:hover": {
                            background:
                              "linear-gradient(45deg, #FF5252 30%, #FF7043 90%)",
                          },
                        }}
                      >
                        Clear All
                      </ClearAllButton>
                    </Box>
                  </Box>
                ) : (
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    minHeight="400px"
                    textAlign="center"
                  >
                    <Palette sx={{ fontSize: 80, color: "#ddd", mb: 2 }} />
                    <Typography
                      variant="h4"
                      color="text.secondary"
                      gutterBottom
                    >
                      Choose a Coloring Page! 🎨
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Select an image from the gallery to start your creative
                      journey
                    </Typography>
                  </Box>
                )}
              </StyledPaper>
            </Fade>
          </Grid>

          {/* Color Palette */}
          <Grid size={{ xs: 12, sm: 12, md: 3, lg: 2 }}>
            <Fade in timeout={1600}>
              <StyledPaper>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{
                    fontWeight: "bold",
                    color: "#333",
                    textAlign: "center",
                  }}
                >
                  <Palette sx={{ mr: 1, verticalAlign: "middle" }} />
                  Colors
                </Typography>
                <ColorPaletteSelector
                  colorPalettes={colorPalettes}
                  selectedPalette={selectedPalette}
                  onSelectPalette={setSelectedPalette}
                  onColorChange={setCurrentColor}
                />

                {currentColor && (
                  <Box textAlign="center" mt={2}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      Current Color:
                    </Typography>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        backgroundColor: currentColor,
                        borderRadius: "50%",
                        margin: "0 auto",
                        border: "3px solid white",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                      }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {currentColor}
                    </Typography>
                  </Box>
                )}
              </StyledPaper>
            </Fade>
          </Grid>
        </Grid>
      </Box>

      {/* Confirmation Modal */}
      <ConfirmationModal
        open={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleClearAll}
        title="Clear All Colors?"
        message="Are you sure you want to clear all colors from this image? This action cannot be undone."
        confirmText="Yes, Clear All"
        cancelText="Cancel"
      />
    </UserPageContainer>
  );
};

export default UserPage;
