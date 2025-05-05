'use client';
import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  TextField, 
  Stack, 
  InputAdornment, 
  MenuItem,
  Alert,
  CircularProgress,
  Divider,
  FormControlLabel,
  Checkbox,
  Link as MuiLink,
  Container,
  Paper,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import Link from 'next/link';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LockIcon from '@mui/icons-material/Lock';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import { useRouter } from 'next/navigation';
import { SignJWT, jwtVerify } from 'jose';
import { useAuth } from '@/app/dashboard/context/AuthContext';

// Validation schema
const loginSchema = yup.object({
  email: yup.string().email('И-мэйл хаяг буруу байна').required('И-мэйл хаяг оруулна уу'),
  password: yup.string()
    .min(8, 'Нууц үг хамгийн багадаа 8 тэмдэгт байх ёстой')
    .required('Нууц үг оруулна уу'),
  role: yup.string().required('Эрх сонгоно уу')
});

// Demo user data with redirect paths
const demoUsers = [
  {
    email: 'patient@ex.com',
    password: 'Password123%',
    role: 'patient',
    name: 'Өвчтөн хэрэглэгч',
    redirect: '/patientProfile/customerProfile'
  },
  {
    email: 'doctor@ex.com',
    password: 'Password123%',
    role: 'doctor',
    name: 'Эмч хэрэглэгч',
    redirect: '/dashboard/home'
  },
  {
    email: 'nurse@ex.com',
    password: 'Password123%',
    role: 'nurse',
    name: 'Сувилагч хэрэглэгч',
    redirect: '/dashboard/home'
  },
  {
    email: 'admin@ex.com',
    password: 'Password123%',
    role: 'admin',
    name: 'Системийн админ',
    redirect: '/dashboard/home'
  }
];

export default function AuthLogin() {
  const router = useRouter();
  const { login } = useAuth();
  const [loginError, setLoginError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [rememberMe, setRememberMe] = useState(true);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      const userData = localStorage.getItem('USER');
      if (userData) {
        try {
          const { token, user } = JSON.parse(userData);
          const { payload } = await jwtVerify(
            token,
            new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET || 'default-secure-key-32-chars')
          );
          
          // Redirect based on role
          const demoUser = demoUsers.find(u => u.role === user.role);
          if (demoUser) {
            router.push(demoUser.redirect);
          }
        } catch (error) {
          localStorage.removeItem('USER');
        }
      }
      setIsCheckingAuth(false);
    };

    checkAuth();
  }, [router]);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      role: 'patient'
    },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      try {
        setIsSubmitting(true);
        setLoginError('');
        
        const response = await fetch("http://localhost:8000/api/auth/signin", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Нэвтрэхэд алдаа гарлаа");
        }

        // Save token and user data
        localStorage.setItem("token", data.accessToken);
        localStorage.setItem("user", JSON.stringify(data.user));

        // Update auth context
        login(data.user, data.accessToken);

        // Redirect based on role
        if (data.user.role === "MedicalStaff" || data.user.role === "admin") {
          router.push("/dashboard/home");
        } else if (data.user.role === "patient") {
          router.push("/patientProfile/customerProfile");
        }
      } catch (error) {
        console.error('Нэвтрэх алдаа:', error);
        setLoginError(error.message);
        toast.error(error.message || 'Нэвтрэхэд алдаа гарлаа');
      } finally {
        setIsSubmitting(false);
      }
    }
  });

  if (isCheckingAuth) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container component="main" maxWidth="xs">
      <Paper
        elevation={3}
        sx={{
          marginTop: 8,
          padding: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          Нэвтрэх
        </Typography>

        {loginError && (
          <Alert severity="error" sx={{ mt: 2, width: "100%" }}>
            {loginError}
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={formik.handleSubmit}
          sx={{ mt: 1, width: "100%" }}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="И-мэйл хаяг"
            name="email"
            autoComplete="email"
            autoFocus
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Нууц үг"
            type="password"
            id="password"
            autoComplete="current-password"
            value={formik.values.password}
            onChange={formik.handleChange}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="role-label">Эрх</InputLabel>
            <Select
              labelId="role-label"
              id="role"
              name="role"
              value={formik.values.role}
              onChange={formik.handleChange}
              label="Эрх"
              error={formik.touched.role && Boolean(formik.errors.role)}
            >
              <MenuItem value="patient">Өвчтөн</MenuItem>
              <MenuItem value="doctor">Эмч</MenuItem>
              <MenuItem value="admin">Админ</MenuItem>
            </Select>
          </FormControl>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Нэвтрэх
          </Button>
        </Box>

        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Туршилтын хэрэглэгчид:
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Өвчтөн: patient@ex.com / Password123%
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Эмч: doctor@ex.com / Password123%
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Админ: admin@ex.com / Password123%
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}