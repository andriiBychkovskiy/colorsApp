import React from "react";
import { useForm } from "react-hook-form";
import {
  TextField,
  Button,
  Typography,
  Box,
  Container,
  Paper,
  Fade,
  Alert,
  Link as MuiLink,
} from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { PersonAdd, Star, Brush, Celebration } from "@mui/icons-material";

interface RegisterFormInputs {
  email: string;
  password: string;
  confirmPassword: string;
}

// Animated gradient background
const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const RegisterContainer = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  background:
    "linear-gradient(-45deg, #FF6B6B, #4ECDC4, #45B7D1, #96CEB4, #FFEAA7, #DDA0DD)",
  backgroundSize: "400% 400%",
  animation: `${gradientAnimation} 15s ease infinite`,
  display: "flex",
  alignItems: "center",
  paddingTop: theme.spacing(10), // Account for header
  paddingBottom: theme.spacing(4),
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
  zIndex: 2,
  "@keyframes float": {
    "0%": { transform: "translateY(0px)" },
    "50%": { transform: "translateY(-20px)" },
    "100%": { transform: "translateY(0px)" },
  },
}));

const RegisterPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: 20,
  boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
  background: "rgba(255,255,255,0.95)",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(255,255,255,0.2)",
  position: "relative",
  zIndex: 3,
  maxWidth: 450,
  width: "100%",
}));

const ColorfulButton = styled(Button)(({ theme }) => ({
  background: "linear-gradient(45deg, #4ECDC4 30%, #45B7D1 90%)",
  border: 0,
  borderRadius: 25,
  boxShadow: "0 3px 5px 2px rgba(78, 205, 196, .3)",
  color: "white",
  height: 56,
  padding: "0 30px",
  fontSize: "1.1rem",
  fontWeight: "bold",
  marginTop: theme.spacing(2),
  "&:hover": {
    background: "linear-gradient(45deg, #26A69A 30%, #1976D2 90%)",
    transform: "translateY(-2px)",
    boxShadow: "0 6px 12px 2px rgba(78, 205, 196, .4)",
  },
  "&:disabled": {
    background: "#ccc",
    color: "#666",
  },
}));

const StyledTextField = styled(TextField)(() => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: 15,
    backgroundColor: "rgba(255,255,255,0.8)",
    "& fieldset": {
      borderColor: "rgba(0,0,0,0.1)",
      borderWidth: 2,
    },
    "&:hover fieldset": {
      borderColor: "#4ECDC4",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#45B7D1",
      borderWidth: 2,
    },
  },
  "& .MuiInputLabel-root": {
    color: "#666",
    fontWeight: 500,
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#45B7D1",
  },
}));

const RegisterPage: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    watch,
  } = useForm<RegisterFormInputs>();
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const password = watch("password");

  const onSubmit = async (data: RegisterFormInputs) => {
    if (data.password !== data.confirmPassword) {
      setError("confirmPassword", { message: "Passwords do not match" });
      return;
    }

    try {
      await registerUser(data.email, data.password);
      navigate("/login");
    } catch (error) {
      if (error instanceof Error) {
        setError("root", { message: error.message });
      } else {
        setError("root", { message: "Registration failed. Please try again." });
      }
    }
  };

  return (
    <RegisterContainer>
      {/* Floating Icons */}
      <FloatingIcon sx={{ top: "15%", left: "10%" }}>
        <Celebration sx={{ fontSize: 60, color: "rgba(255,255,255,0.3)" }} />
      </FloatingIcon>
      <FloatingIcon sx={{ top: "25%", right: "15%", animationDelay: "-2s" }}>
        <Brush sx={{ fontSize: 50, color: "rgba(255,255,255,0.3)" }} />
      </FloatingIcon>
      <FloatingIcon sx={{ bottom: "20%", left: "20%", animationDelay: "-4s" }}>
        <Star sx={{ fontSize: 45, color: "rgba(255,255,255,0.3)" }} />
      </FloatingIcon>
      <FloatingIcon sx={{ bottom: "30%", right: "10%", animationDelay: "-1s" }}>
        <PersonAdd sx={{ fontSize: 55, color: "rgba(255,255,255,0.3)" }} />
      </FloatingIcon>

      <Container maxWidth="sm">
        <Fade in timeout={1000}>
          <RegisterPaper elevation={10}>
            <Box textAlign="center" mb={3}>
              <Celebration sx={{ fontSize: 50, color: "#4ECDC4", mb: 2 }} />
              <Typography
                variant="h3"
                component="h1"
                gutterBottom
                sx={{
                  fontWeight: "bold",
                  background: "linear-gradient(45deg, #4ECDC4, #45B7D1)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  mb: 1,
                }}
              >
                Join the Fun! 🌟
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
                Create your account and start your colorful journey!
              </Typography>
            </Box>

            {errors.root && (
              <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                {errors.root.message}
              </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
              <StyledTextField
                label="✉️ Email Address"
                variant="outlined"
                fullWidth
                margin="normal"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Please enter a valid email address",
                  },
                })}
                error={!!errors.email}
                helperText={
                  errors.email
                    ? String(errors.email.message)
                    : "We'll use this to save your colorful creations!"
                }
              />

              <StyledTextField
                label="🔒 Password"
                type="password"
                variant="outlined"
                fullWidth
                margin="normal"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                error={!!errors.password}
                helperText={
                  errors.password
                    ? errors.password.message
                    : "Choose a strong password to protect your account"
                }
              />

              <StyledTextField
                label="🔐 Confirm Password"
                type="password"
                variant="outlined"
                fullWidth
                margin="normal"
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === password || "Passwords do not match",
                })}
                error={!!errors.confirmPassword}
                helperText={
                  errors.confirmPassword
                    ? errors.confirmPassword.message
                    : "Type your password again to confirm"
                }
              />

              <ColorfulButton type="submit" fullWidth startIcon={<PersonAdd />}>
                🎨 Create Account & Start Coloring!
              </ColorfulButton>
            </form>

            <Box textAlign="center" mt={3}>
              <Typography variant="body2" color="text.secondary">
                Already have an account?{" "}
                <MuiLink
                  component={Link}
                  to="/login"
                  sx={{
                    color: "#4ECDC4",
                    fontWeight: "bold",
                    textDecoration: "none",
                    "&:hover": {
                      textDecoration: "underline",
                      color: "#FF6B6B",
                    },
                  }}
                >
                  Sign in here! 🚀
                </MuiLink>
              </Typography>
            </Box>

            <Box textAlign="center" mt={2}>
              <Typography variant="body2" color="text.secondary">
                <MuiLink
                  component={Link}
                  to="/"
                  sx={{
                    color: "#45B7D1",
                    fontWeight: "bold",
                    textDecoration: "none",
                    "&:hover": {
                      textDecoration: "underline",
                      color: "#FF6B6B",
                    },
                  }}
                >
                  ← Back to Home
                </MuiLink>
              </Typography>
            </Box>

            <Box
              sx={{
                mt: 3,
                p: 2,
                backgroundColor: "rgba(78, 205, 196, 0.1)",
                borderRadius: 2,
                border: "1px solid rgba(78, 205, 196, 0.3)",
              }}
            >
              <Typography
                variant="body2"
                color="text.secondary"
                textAlign="center"
              >
                🎨 <strong>What you'll get:</strong>
                <br />
                • Access to hundreds of coloring pages
                <br />
                • Save your progress automatically
                <br />
                • Beautiful color palettes
                <br />• Fun for the whole family!
              </Typography>
            </Box>
          </RegisterPaper>
        </Fade>
      </Container>
    </RegisterContainer>
  );
};

export default RegisterPage;
