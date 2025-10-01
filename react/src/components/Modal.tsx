import React from "react";
import ReactDOM from "react-dom";
import { Box, IconButton, Typography, Fade } from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";
import { Close, Collections } from "@mui/icons-material";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

// Animated gradient background
const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const ModalOverlay = styled(Box)(() => ({
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background:
    "linear-gradient(-45deg, rgba(255,107,107,0.9), rgba(78,205,196,0.9), rgba(69,183,209,0.9), rgba(150,206,180,0.9))",
  backgroundSize: "400% 400%",
  animation: `${gradientAnimation} 15s ease infinite`,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
  backdropFilter: "blur(5px)",
}));

const ModalContent = styled(Box)(({ theme }) => ({
  background: "rgba(255,255,255,0.98)",
  backdropFilter: "blur(20px)",
  padding: theme.spacing(4),
  borderRadius: 25,
  width: "90%",
  maxWidth: "1000px",
  maxHeight: "85%",
  overflowY: "auto",
  boxShadow: "0 25px 50px rgba(0,0,0,0.2)",
  border: "1px solid rgba(255,255,255,0.3)",
  position: "relative",
}));

const CloseButton = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  top: theme.spacing(2),
  right: theme.spacing(2),
  background: "linear-gradient(45deg, #FF6B6B 30%, #4ECDC4 90%)",
  color: "white",
  width: 48,
  height: 48,
  boxShadow: "0 4px 12px rgba(255,107,107,0.3)",
  transition: "all 0.3s ease",
  "&:hover": {
    background: "linear-gradient(45deg, #FF5252 30%, #26A69A 90%)",
    transform: "scale(1.1)",
    boxShadow: "0 6px 16px rgba(255,107,107,0.4)",
  },
}));

const ModalHeader = styled(Box)(({ theme }) => ({
  textAlign: "center",
  marginBottom: theme.spacing(3),
  paddingRight: theme.spacing(6), // Account for close button
}));

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <ModalOverlay onClick={onClose}>
      <Fade in={isOpen} timeout={300}>
        <ModalContent onClick={(e) => e.stopPropagation()}>
          <CloseButton onClick={onClose}>
            <Close />
          </CloseButton>

          <ModalHeader>
            <Collections sx={{ fontSize: 50, color: "#4ECDC4", mb: 2 }} />
            <Typography
              variant="h3"
              component="h2"
              gutterBottom
              sx={{
                fontWeight: "bold",
                background: "linear-gradient(45deg, #FF6B6B, #4ECDC4)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                mb: 1,
              }}
            >
              🎨 Choose Your Canvas! 🌈
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
              Pick a beautiful coloring page to bring to life!
            </Typography>
          </ModalHeader>

          {children}
        </ModalContent>
      </Fade>
    </ModalOverlay>,
    document.body
  );
};

export default Modal;
