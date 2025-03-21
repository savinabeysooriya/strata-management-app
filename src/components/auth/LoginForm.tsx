import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, TextField, Box, Typography, Alert } from '@mui/material';
import { authService } from '../../services/auth';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LoginFormData } from '../../types/auth';

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
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 8 }}>
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
  );
};