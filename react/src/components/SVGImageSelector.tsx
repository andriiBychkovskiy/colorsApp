import React from "react";
import { Grid, Box } from "@mui/material";
import { type SVGImage } from "../pages/UserPage";

interface UserProgress {
  id?: string;
  userId: string;
  svgId: string;
  layers: { [key: string]: string };
}

interface SVGImageSelectorProps {
  svgImages: SVGImage[];
  onSelectImage: (image: SVGImage) => void;
  userProgress?: UserProgress[];
  userId?: string;
}

const SVGImageSelector: React.FC<SVGImageSelectorProps> = ({
  svgImages,
  onSelectImage,
  userProgress = [],
  userId,
}) => {
  // Function to add IDs to SVG paths (same as in UserPage)
  const addIdsToPaths = (svgContent: string): string => {
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgContent, "image/svg+xml");
    const paths = svgDoc.querySelectorAll("path");

    paths.forEach((path, index) => {
      if (!path.id) {
        path.id = `path-${index}`;
      }
    });

    return new XMLSerializer().serializeToString(svgDoc);
  };

  // Function to apply user's coloring progress to SVG
  const applyProgressToSVG = (svgContent: string, imageId: string): string => {
    // First add IDs to paths
    const svgWithIds = addIdsToPaths(svgContent);

    const imageProgress = userProgress.find(
      (p) => p.svgId === imageId && p.userId === userId
    );

    // Debug: Check progress data
    console.log(`Image ${imageId}:`, {
      userId,
      userProgress: userProgress.length,
      imageProgress,
      hasLayers: imageProgress?.layers
        ? Object.keys(imageProgress.layers).length
        : 0,
    });

    if (
      !imageProgress ||
      !imageProgress.layers ||
      Object.keys(imageProgress.layers).length === 0
    ) {
      return svgWithIds;
    }

    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgWithIds, "image/svg+xml");

    Object.keys(imageProgress.layers).forEach((layerId) => {
      const layer = svgDoc.getElementById(layerId);
      if (layer) {
        layer.setAttribute("style", `fill:${imageProgress.layers[layerId]}`);
      }
    });

    return new XMLSerializer().serializeToString(svgDoc);
  };

  return (
    <div>
      <Grid container spacing={3}>
        {svgImages.map((image) => (
          <Grid item xs={12} sm={3} md={3} key={image.id}>
            <Box
              style={{
                padding: "30px",
                cursor: "pointer",
                maxWidth: "200px",
                maxHeight: "200px",
                border: "2px solid black",
                borderRadius: "50%",
              }}
              onClick={() => onSelectImage(image)}
            >
              <div
                dangerouslySetInnerHTML={{
                  __html: applyProgressToSVG(image.svgContent || "", image.id),
                }}
                style={{ width: "100%", height: "auto" }}
              />
            </Box>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default SVGImageSelector;
