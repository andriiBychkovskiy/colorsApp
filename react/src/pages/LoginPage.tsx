import React, { useEffect } from "react";
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
import { Login, Palette, Star, Brush } from "@mui/icons-material";

interface LoginFormInputs {
  email: string;
  password: string;
}

// Animated gradient background
const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const LoginContainer = styled(Box)(({ theme }) => ({
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

const LoginPaper = styled(Paper)(({ theme }) => ({
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
  background: "linear-gradient(45deg, #FF6B6B 30%, #4ECDC4 90%)",
  border: 0,
  borderRadius: 25,
  boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
  color: "white",
  height: 56,
  padding: "0 30px",
  fontSize: "1.1rem",
  fontWeight: "bold",
  marginTop: theme.spacing(2),
  "&:hover": {
    background: "linear-gradient(45deg, #FF5252 30%, #26A69A 90%)",
    transform: "translateY(-2px)",
    boxShadow: "0 6px 12px 2px rgba(255, 105, 135, .4)",
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
      borderColor: "#FF6B6B",
      borderWidth: 2,
    },
  },
  "& .MuiInputLabel-root": {
    color: "#666",
    fontWeight: 500,
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#FF6B6B",
  },
}));

const LoginPage: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormInputs>();
  const { login, user } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      await login(data.email, data.password);
    } catch (error) {
      if (error instanceof Error) {
        setError("root", { message: error.message });
      } else {
        setError("root", { message: "Login failed. Please try again." });
      }
    }
  };

  useEffect(() => {
    if (user) {
      user?.role === "admin"
        ? navigate("/admin")
        : navigate(`/user/${user.id}`);
    }
  }, [user, navigate]);

  return (
    <LoginContainer>
      {/* Floating Icons */}
      <FloatingIcon sx={{ top: "15%", left: "10%" }}>
        <Palette sx={{ fontSize: 60, color: "rgba(255,255,255,0.3)" }} />
      </FloatingIcon>
      <FloatingIcon sx={{ top: "25%", right: "15%", animationDelay: "-2s" }}>
        <Brush sx={{ fontSize: 50, color: "rgba(255,255,255,0.3)" }} />
      </FloatingIcon>
      <FloatingIcon sx={{ bottom: "20%", left: "20%", animationDelay: "-4s" }}>
        <Star sx={{ fontSize: 45, color: "rgba(255,255,255,0.3)" }} />
      </FloatingIcon>
      <FloatingIcon sx={{ bottom: "30%", right: "10%", animationDelay: "-1s" }}>
        <Login sx={{ fontSize: 55, color: "rgba(255,255,255,0.3)" }} />
      </FloatingIcon>

      <Container maxWidth="sm">
        <Fade in timeout={1000}>
          <LoginPaper elevation={10}>
            <Box textAlign="center" mb={3}>
              <Palette sx={{ fontSize: 50, color: "#FF6B6B", mb: 2 }} />
              <Typography
                variant="h3"
                component="h1"
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
                Welcome Back! 🎨
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
                Sign in to continue your coloring adventure!
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
                helperText={errors.email ? String(errors.email.message) : ""}
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
                helperText={errors.password ? errors.password.message : ""}
              />

              <ColorfulButton type="submit" fullWidth startIcon={<Login />}>
                🚀 Sign In & Start Coloring!
              </ColorfulButton>
            </form>

            <Box textAlign="center" mt={3}>
              <Typography variant="body2" color="text.secondary">
                Don't have an account yet?{" "}
                <MuiLink
                  component={Link}
                  to="/register"
                  sx={{
                    color: "#FF6B6B",
                    fontWeight: "bold",
                    textDecoration: "none",
                    "&:hover": {
                      textDecoration: "underline",
                      color: "#4ECDC4",
                    },
                  }}
                >
                  Create one here! 🌟
                </MuiLink>
              </Typography>
            </Box>

            <Box textAlign="center" mt={2}>
              <Typography variant="body2" color="text.secondary">
                <MuiLink
                  component={Link}
                  to="/"
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
                  ← Back to Home
                </MuiLink>
              </Typography>
            </Box>
          </LoginPaper>
        </Fade>
      </Container>
    </LoginContainer>
  );
};

export default LoginPage;
