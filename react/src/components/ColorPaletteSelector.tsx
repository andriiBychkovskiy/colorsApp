import { Stack } from "@mui/material";
import React from "react";
import Grid from "@mui/material/Grid2";
import SectorButton from "../UI/SectorButton";

interface ColorPalette {
  id: string;
  name: string;
  colors: string[];
}

interface ColorPaletteSelectorProps {
  colorPalettes: ColorPalette[];
  selectedPalette: ColorPalette | null;
  onSelectPalette: (palette: ColorPalette) => void;
  onColorChange: (color: string) => void;
}

const ColorPaletteSelector: React.FC<ColorPaletteSelectorProps> = ({
  colorPalettes,
  selectedPalette,
  onSelectPalette,
  onColorChange,
}) => {
  return (
    <Stack
      direction="row"
      justifyContent="flex-end"
      alignItems="flex-start"
      spacing={2}
    >
      {selectedPalette && (
        <Grid container direction="column" justifyContent="flex-end">
          {selectedPalette.colors.map((color, index) => (
            <Grid key={index}>
              <div
                onClick={() => onColorChange(color)}
                style={{
                  backgroundColor: color,
                  width: "60px", // Explicitly set width
                  height: "60px", // Explicitly set height
                  borderRadius: "50%",
                  margin: "10px",
                  cursor: "pointer",
                }}
              ></div>
            </Grid>
          ))}
        </Grid>
      )}
      <Grid container spacing={1} direction="column">
        {colorPalettes.map((palette, index) => (
          <Grid key={index}>
            <SectorButton
              colors={palette.colors}
              onClick={() => onSelectPalette(palette)}
              size={70}
            ></SectorButton>
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
};

export default ColorPaletteSelector;
