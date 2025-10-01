import React from "react";
import { IconButton } from "@mui/material";
import { Undo } from "@mui/icons-material";

interface SVGEditorProps {
  selectedImage: { id: string; name: string; svgContent: string };
  progress: { layers: { [key: string]: string } };
  currentColor: string;
  cursorSize?: number;
  onLayerClick: (layerId: string) => void;
  onExport: () => void;
  onUndo: () => void;
  applyProgressToSVG: (
    svgContent: string,
    layers: { [key: string]: string }
  ) => string;
  addIdsToPaths: (svgContent: string) => string;
}

const SVGEditor: React.FC<SVGEditorProps> = ({
  selectedImage,
  progress,
  currentColor,
  cursorSize = 16,
  onLayerClick,
  onUndo,
  applyProgressToSVG,
  addIdsToPaths,
}) => {
  return (
    <div style={{ marginTop: "20px", border: "2px solid black" }}>
      <div
        id="svg-image"
        dangerouslySetInnerHTML={{
          __html: applyProgressToSVG(
            addIdsToPaths(selectedImage.svgContent),
            progress.layers
          ),
        }}
        style={{
          width: "100%",
          height: "auto",
          minHeight: "500px",
          cursor: `url('data:image/svg+xml;base64,${btoa(
            `<svg xmlns="http://www.w3.org/2000/svg" width="${
              cursorSize * 2
            }" height="${cursorSize * 2}" viewBox="0 0 ${cursorSize * 2} ${
              cursorSize * 2
            }"><circle cx="${cursorSize}" cy="${cursorSize}" r="${cursorSize}" fill="${currentColor}" stroke="white" stroke-width="2" /></svg>`
          )}') ${cursorSize} ${cursorSize}, auto`,
        }}
        onClick={(e) => {
          const target = e.target as SVGElement;
          if (target && target.id) {
            onLayerClick(target.id);
          }
        }}
      />
      <IconButton
        color="secondary"
        style={{ marginTop: "10px" }}
        onClick={onUndo}
      >
        <Undo />
      </IconButton>
    </div>
  );
};

export default SVGEditor;
