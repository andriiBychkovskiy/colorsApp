import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Typography,
  Grid,
  Paper,
  IconButton,
  Stack,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import axios from "axios";
import { useForm } from "react-hook-form";
import { PhotoshopPicker } from "react-color";
import { API_ENDPOINTS } from "../config/api";

interface SVGImage {
  id: string;
  name: string;
  url: string;
  svgContent: string;
}

interface ColorPalette {
  id: string;
  name: string;
  colors: string[];
}

const AdminPage: React.FC = () => {
  const [svgImages, setSvgImages] = useState<SVGImage[]>([]);
  const [colorPalettes, setColorPalettes] = useState<ColorPalette[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    fetchSVGImages();
    fetchColorPalettes();
  }, []);

  const fetchSVGImages = async () => {
    const response = await axios.get(API_ENDPOINTS.IMAGES);
    setSvgImages(response.data);
  };

  const fetchColorPalettes = async () => {
    const response = await axios.get(API_ENDPOINTS.PALETTES);
    setColorPalettes(response.data);
  };

  const handleSVGUpload = async (data: any) => {
    const file = data.file[0];
    const reader = new FileReader();
    reader.onloadend = async () => {
      const svgContent = reader.result as string;
      const newSVG: SVGImage = {
        id: Date.now().toString(),
        name: file.name,
        url: URL.createObjectURL(file),
        svgContent: svgContent,
      };
      await axios.post(API_ENDPOINTS.IMAGES, newSVG);
      fetchSVGImages();
      reset();
    };
    reader.readAsText(file);
  };

  const handlePaletteCreate = async (data: any) => {
    const newPalette: ColorPalette = {
      id: Date.now().toString(),
      name: data.name,
      colors: selectedColors.slice(0, 10),
    };
    await axios.post(API_ENDPOINTS.PALETTES, newPalette);
    fetchColorPalettes();
    reset();
    setSelectedColors([]);
  };

  const handleDeleteSVG = async (id: string) => {
    await axios.delete(`${API_ENDPOINTS.IMAGES}/${id}`);
    fetchSVGImages();
  };

  const handleDeletePalette = async (id: string) => {
    await axios.delete(`${API_ENDPOINTS.PALETTES}/${id}`);
    fetchColorPalettes();
  };

  const handleColorChange = (color: any) => {
    if (color.hex !== "#ffffff") {
      setSelectedColors(Array.from(new Set([...selectedColors, color.hex])));
    }
  };
  const handlePaletteReset = () => {
    reset();
    setSelectedColors([]);
  };

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Admin Page
      </Typography>

      <Paper style={{ padding: "20px", marginBottom: "20px" }}>
        <Typography variant="h6">Upload SVG Image</Typography>
        <form onSubmit={handleSubmit(handleSVGUpload)}>
          <TextField
            label="Name"
            {...register("name")}
            fullWidth
            margin="normal"
          />
          <input type="file" {...register("file")} accept=".svg" />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            style={{ marginTop: "10px" }}
            onClick={handleSVGUpload}
          >
            Upload
          </Button>
        </form>
      </Paper>

      <Paper style={{ padding: "20px", marginBottom: "20px" }}>
        <Typography variant="h6">Create Color Palette</Typography>
        <form onSubmit={handleSubmit(handlePaletteCreate)}>
          <TextField
            label="Name"
            {...register("name")}
            fullWidth
            margin="normal"
          />
          <PhotoshopPicker color="#fff" onChangeComplete={handleColorChange} />
          <div style={{ marginTop: "10px" }}>
            {selectedColors.map((color, index) => (
              <span
                key={index}
                style={{
                  backgroundColor: color,
                  padding: "5px 10px",
                  marginRight: "5px",
                  borderRadius: "4px",
                }}
              >
                {color}
              </span>
            ))}
          </div>
          <Button
            type="submit"
            variant="outlined"
            color="primary"
            style={{ marginTop: "10px" }}
            onClick={handlePaletteReset}
          >
            Reset
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            style={{ marginTop: "10px" }}
          >
            Create
          </Button>
        </form>
      </Paper>

      <Typography variant="h6">Manage SVG Images</Typography>
      <Grid container spacing={2}>
        {svgImages.map((image) => (
          <Grid item xs={12} sm={2} md={2} key={image.id}>
            <Paper style={{ padding: "10px", position: "relative" }}>
              <div
                dangerouslySetInnerHTML={{ __html: image.svgContent }}
                style={{ width: "100%", height: "auto" }}
              />
              <IconButton
                style={{ position: "absolute", top: "10px", right: "10px" }}
                onClick={() => handleDeleteSVG(image.id)}
              >
                <Delete />
              </IconButton>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Typography variant="h6" style={{ marginTop: "20px" }}>
        Manage Color Palettes
      </Typography>
      <Grid container spacing={2}>
        {colorPalettes.map((palette) => (
          <Grid item xs={12} sm={6} md={4} key={palette.id}>
            <Paper style={{ padding: "10px", position: "relative" }}>
              <Typography variant="subtitle1">{palette.name}</Typography>
              <Stack
                direction="column"
                spacing={1}
                style={{ marginTop: "10px" }}
              >
                {palette.colors.map((color, index) => (
                  <span
                    key={index}
                    style={{
                      backgroundColor: color,
                      padding: "5px 10px",
                      marginRight: "5px",
                      borderRadius: "4px",
                    }}
                  >
                    {color}
                  </span>
                ))}
              </Stack>
              <IconButton
                style={{ position: "absolute", top: "10px", right: "10px" }}
                onClick={() => handleDeletePalette(palette.id)}
              >
                <Delete />
              </IconButton>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default AdminPage;
