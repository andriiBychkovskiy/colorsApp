import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";
import { Warning, Close } from "@mui/icons-material";

interface ConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  icon?: React.ReactNode;
}

// Animated gradient background
const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const StyledDialog = styled(Dialog)(() => ({
  "& .MuiDialog-paper": {
    borderRadius: 25,
    background:
      "linear-gradient(-45deg, #FF6B6B, #4ECDC4, #45B7D1, #96CEB4, #FFEAA7)",
    backgroundSize: "400% 400%",
    animation: `${gradientAnimation} 20s ease infinite`,
    padding: 0,
    overflow: "hidden",
    position: "relative",
    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(255,255,255,0.95)",
      backdropFilter: "blur(10px)",
      zIndex: 1,
    },
  },
}));

const ContentWrapper = styled(Box)(({ theme }) => ({
  position: "relative",
  zIndex: 2,
  padding: theme.spacing(3),
  textAlign: "center",
}));

const IconWrapper = styled(Box)(() => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: 80,
  height: 80,
  borderRadius: "50%",
  background: "linear-gradient(45deg, #FF6B6B 30%, #FF8E53 90%)",
  margin: "0 auto 16px auto",
  boxShadow: "0 8px 32px rgba(255, 107, 107, 0.3)",
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  padding: 0,
  marginBottom: theme.spacing(2),
  "& .MuiTypography-root": {
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "#2C3E50",
    textShadow: "1px 1px 2px rgba(0,0,0,0.1)",
  },
}));

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  padding: 0,
  marginBottom: theme.spacing(3),
  "& .MuiTypography-root": {
    fontSize: "1.1rem",
    color: "#34495E",
    lineHeight: 1.6,
  },
}));

const StyledDialogActions = styled(DialogActions)(({ theme }) => ({
  padding: 0,
  justifyContent: "center",
  gap: theme.spacing(2),
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: 20,
  padding: theme.spacing(1.5, 4),
  fontSize: "1rem",
  fontWeight: "bold",
  textTransform: "none",
  minWidth: 120,
  boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 6px 20px rgba(0,0,0,0.3)",
  },
}));

const ConfirmButton = styled(ActionButton)(() => ({
  background: "linear-gradient(45deg, #FF6B6B 30%, #FF8E53 90%)",
  color: "white",
  "&:hover": {
    background: "linear-gradient(45deg, #FF5252 30%, #FF7043 90%)",
  },
}));

const CancelButton = styled(ActionButton)(() => ({
  background: "linear-gradient(45deg, #95A5A6 30%, #BDC3C7 90%)",
  color: "white",
  "&:hover": {
    background: "linear-gradient(45deg, #7F8C8D 30%, #95A5A6 90%)",
  },
}));

const CloseButton = styled(IconButton)(() => ({
  position: "absolute",
  right: 8,
  top: 8,
  zIndex: 3,
  background: "rgba(255,255,255,0.8)",
  "&:hover": {
    background: "rgba(255,255,255,0.9)",
  },
}));

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Yes, Clear All",
  cancelText = "Cancel",
  icon = <Warning sx={{ fontSize: 40, color: "white" }} />,
}) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <StyledDialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          maxWidth: 400,
        },
      }}
    >
      <CloseButton onClick={onClose}>
        <Close />
      </CloseButton>

      <ContentWrapper>
        <IconWrapper>{icon}</IconWrapper>

        <StyledDialogTitle>
          <Typography variant="h5" component="h2">
            {title}
          </Typography>
        </StyledDialogTitle>

        <StyledDialogContent>
          <Typography variant="body1">{message}</Typography>
        </StyledDialogContent>

        <StyledDialogActions>
          <CancelButton onClick={onClose}>{cancelText}</CancelButton>
          <ConfirmButton onClick={handleConfirm}>{confirmText}</ConfirmButton>
        </StyledDialogActions>
      </ContentWrapper>
    </StyledDialog>
  );
};

export default ConfirmationModal;
