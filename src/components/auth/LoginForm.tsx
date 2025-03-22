import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, TextField, Box, Typography, Alert } from '@mui/material';
import { authService } from '../../services/auth';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LoginFormData } from '../../types/auth';
import backgroundImage from '../../assets/images/background.jpg'

const schema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

export const LoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError
  } = useForm<LoginFormData>({
    resolver: zodResolver(schema)
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await authService.login(data);
      login(response.token, response.userRole);
      navigate('/');
    } catch (error) {
      setError('root', {
        type: 'manual',
        message: 'Invalid credentials'
      });
    }
  };

  return (
    <Box
      sx={{
        height: '100vh', 
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundImage: `url(${backgroundImage})`, 
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed', 
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.2)', 
          zIndex: 1,
        },
      }}
    >
      <Box sx={{
         width: '30%',
         zIndex: 2, 
         padding: 4,
         backgroundColor: 'rgba(255, 255, 255, 0.9)', 
         borderRadius: 2,
         boxShadow: 3, 
      }}>
        <Typography variant="h4" gutterBottom>
          Login
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ display: 'grid', gap: 2 }}>
            <TextField
              label="Username"
              {...register('username')}
              error={!!errors.username}
              helperText={errors.username?.message}
              fullWidth
            />
            <TextField
              label="Password"
              type="password"
              {...register('password')}
              error={!!errors.password}
              helperText={errors.password?.message}
              fullWidth
            />
            {errors.root && <Alert severity="error">{errors.root.message}</Alert>}
            <Button type="submit" variant="contained" fullWidth>
              Sign In
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  );
};