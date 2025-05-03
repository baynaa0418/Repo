"use client";
import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  TextField, 
  Stack, 
  InputAdornment, 
  MenuItem,
  Alert
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LockIcon from '@mui/icons-material/Lock';
import EmailIcon from '@mui/icons-material/Email';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/(DashboardLayout)/context/AuthContext';

const loginSchema = yup.object({
  email: yup.string().email('Хүчинтэй имэйл оруулна уу').required('Имэйлээ оруулна уу'),
  password: yup.string()
    .min(8, 'Нууц үг хамгийн багадаа 8 тэмдэгт байх ёстой')
    .required('Нууц үгээ оруулна уу'),
  role: yup.string().required('Эрхээ сонгоно уу')
});

const demoUsers = [
  {
    email: 'patient@ex.com',
    password: 'Password123%',
    role: 'patient',
    redirectPath: '/patientProfile/customerProfile',
    name: 'Өвчтөн хэрэглэгч'
  },
  {
    email: 'doctor@ex.com',
    password: 'Password123%',
    role: 'doctor',
    redirectPath: '/',
    name: 'Эмч хэрэглэгч'
  }
];

export default function AuthLogin() {
  const router = useRouter();
  const { setUser } = useAuth();
  const [loginError, setLoginError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        
        const user = demoUsers.find(u => 
          u.email === values.email && 
          u.password === values.password && 
          u.role === values.role
        );

        if (!user) {
          throw new Error('Имэйл, нууц үг эсвэл эрх буруу байна');
        }

        const userData = {
          name: user.name,
          email: user.email,
          role: user.role
        };
        
        setUser(userData);
        await new Promise(resolve => setTimeout(resolve, 500)); // Small delay for UX
        router.push(user.redirectPath);

      } catch (error) {
        console.error('Нэвтрэх алдаа:', error);
        setLoginError(error.message);
        toast.error(error.message);
      } finally {
        setIsSubmitting(false);
      }
    }
  });

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
      <ToastContainer position="top-center" />
      <Typography variant="h5" fontWeight="bold" mb={3} textAlign="center">
        НЭВТРЭХ
      </Typography>

      {loginError && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setLoginError('')}>
          {loginError}
        </Alert>
      )}

      <form onSubmit={formik.handleSubmit}>
        <Stack spacing={3}>
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
            <MenuItem value="doctor">Эмч</MenuItem>
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
                  <EmailIcon />
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
                  <LockIcon />
                </InputAdornment>
              ),
            }}
          />

          <Button 
            type="submit" 
            variant="contained" 
            fullWidth
            size="large"
            disabled={isSubmitting}
            sx={{ mt: 2 }}
          >
            {isSubmitting ? 'Нэвтэрч байна...' : 'Нэвтрэх'}
          </Button>
        </Stack>
      </form>

      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Туршилтын данс: patient@ex.com / Password123% (Өвчтөн)
        </Typography>
        <Typography variant="body2" color="text.secondary">
          doctor@ex.com / Password123% (Эмч)
        </Typography>
      </Box>
    </Box>
  );
}