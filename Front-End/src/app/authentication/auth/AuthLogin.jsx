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
  Link as MuiLink
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

// Validation schema
const loginSchema = yup.object({
  email: yup.string().email('Хүчинтэй имэйл оруулна уу').required('Имэйлээ оруулна уу'),
  password: yup.string()
    .min(8, 'Нууц үг хамгийн багадаа 8 тэмдэгт байх ёстой')
    .required('Нууц үгээ оруулна уу'),
  role: yup.string().required('Эрхээ сонгоно уу')
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
    redirect: '/admin/dashboard/home'  // Changed to home page
  },
  {
    email: 'admin@ex.com',
    password: 'Password123%',
    role: 'admin',
    name: 'Системийн админ',
    redirect: '/admin/dashboard'
  }
];

export default function AuthLogin() {
  const router = useRouter();
  const [loginError, setLoginError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [rememberMe, setRememberMe] = useState(true);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('USER') ? 
        JSON.parse(localStorage.getItem('USER')).token : 
        document.cookie.split('; ').find(row => row.startsWith('token='));
      
      if (token) {
        try {
          // Verify token if exists
          const { payload } = await jwtVerify(
            typeof token === 'string' ? token.split('=')[1] : token,
            new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET || 'default-secure-key-32-chars')
          );
          
          // Redirect based on role
          const user = demoUsers.find(u => u.role === payload.role);
          if (user) {
            if (user.role === 'doctor') {
              window.location.href = user.redirect;
            } else {
              router.push(user.redirect);
            }
          }
        } catch (error) {
          // Clear invalid token
          document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
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
        
        // Find matching user
        const user = demoUsers.find(u => 
          u.email === values.email && 
          u.password === values.password && 
          u.role === values.role
        );

        if (!user) {
          throw new Error('Имэйл, нууц үг эсвэл эрх буруу байна');
        }

        // Create JWT token
        const token = await new SignJWT({
          email: user.email,
          role: user.role,
          name: user.name
        })
          .setProtectedHeader({ alg: 'HS256' })
          .setExpirationTime('1h')
          .sign(new TextEncoder().encode(
            process.env.NEXT_PUBLIC_JWT_SECRET || 'default-secure-key-32-chars'
          ));

        // Store based on remember me choice
        if (rememberMe) {
          localStorage.setItem('USER', JSON.stringify({ 
            token, 
            user: {
              name: user.name,
              email: user.email,
              role: user.role
            } 
          }));
        } else {
          const isSecure = window.location.protocol === 'https:';
          document.cookie = `token=${token}; path=/; max-age=3600; SameSite=Lax${isSecure ? '; Secure' : ''}`;
        }

        // Redirect - special handling for doctors
        if (user.role === '') {
          window.location.href = user.redirect;
        } else {
          router.push(user.redirect);
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
    <Box sx={{ 
      maxWidth: 400, 
      mx: 'auto', 
      p: 3, 
      boxShadow: 3, 
      borderRadius: 2,
      mt: 8,
      backgroundColor: 'background.paper'
    }}>
      <ToastContainer position="top-center" autoClose={5000} />
      
      <Typography variant="h5" fontWeight="bold" mb={1} textAlign="center" sx={{ color: "#333" }}>
        НЭВТРЭХ
      </Typography>

      <Typography variant="body2" sx={{ color: "#666", mb: 3, textAlign: 'center' }}>
        Та Монгол Улсын Их Сургуулийн <b>Эмнэлгийн Системд</b> тавтай морилно уу?
      </Typography>

      <Button
        variant="outlined"
        fullWidth
        sx={{
          mb: 3,
          textTransform: "none",
          borderColor: "#ddd",
          color: "#333",
          fontWeight: 500,
          "&:hover": {
            backgroundColor: "#fafafa",
            borderColor: "#ccc",
          },
        }}
        onClick={() => {
          window.location.href = "https://sisi.num.edu.mn";
        }}
      >
        СиСи эрхээр нэвтрэх
      </Button>

      <Divider sx={{ mb: 3 }}>
        <Typography variant="body2" sx={{ color: "#999" }}>
          ЭСВЭЛ
        </Typography>
      </Divider>

      {loginError && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setLoginError('')}>
          {loginError}
        </Alert>
      )}

      <form onSubmit={formik.handleSubmit}>
        <Stack spacing={2}>
          <TextField
            select
            fullWidth
            name="role"
            label="Эрх сонгох"
            value={formik.values.role}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.role && Boolean(formik.errors.role)}
            helperText={formik.touched.role && formik.errors.role}
          >
            <MenuItem value="patient">Өвчтөн</MenuItem>
            <MenuItem value="doctor">ЭмчАдмин</MenuItem>
            <MenuItem value="admin">Админ</MenuItem>
          </TextField>

          <TextField
            fullWidth
            name="email"
            label="Цахим шуудан"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon sx={{ color: "#999" }} />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            name="password"
            label="Нууц үг"
            type="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon sx={{ color: "#999" }} />
                </InputAdornment>
              ),
            }}
          />

          <Box display="flex" justifyContent="space-between" alignItems="center">
            <FormControlLabel
              control={<Checkbox checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />}
              label="Намайг сана"
              sx={{ color: "#333" }}
            />
            <MuiLink
              component={Link}
              href="/forgot-password"
              underline="none"
              sx={{ color: "primary.main", fontSize: "0.875rem" }}
            >
              Нууц үг мартсан?
            </MuiLink>
          </Box>

          <Button 
            type="submit" 
            variant="contained" 
            fullWidth
            size="large"
            disabled={isSubmitting}
            sx={{ 
              mt: 2,
              textTransform: "none",
              fontWeight: "none",
              backgroundColor: "#1976d2",
              "&:hover": {
                backgroundColor: "#1565c0",
              },
            }}
            endIcon={isSubmitting ? <CircularProgress size={24} /> : null}
          >
            {isSubmitting ? 'Нэвтэрч байна...' : 'Нэвтрэх'}
          </Button>
        </Stack>
      </form>

      <Box textAlign="center" mt={3}>
        <Typography variant="body2" component="span" sx={{ color: "#666" }}>
          Гишүүн болж амжаагүй байна уу?{" "}
        </Typography>
        <Typography
          variant="body2"
          component={Link}
          href="/authentication/register"
          sx={{
            textDecoration: "none",
            color: "primary.main",
            fontWeight: 500,
          }}
        >
          Бүртгүүлэх
        </Typography>
      </Box>

      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Туршилтын данс: patient@ex.com / Password123% (Өвчтөн)
        </Typography>
        <Typography variant="body2" color="text.secondary">
          doctor@ex.com / Password123% (Эмч/Админ)
        </Typography>
      </Box>
    </Box>
  );
}