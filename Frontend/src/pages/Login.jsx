import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Box,
  Grid,
  Stack,
  TextField,
  Button,
  Typography,
  Avatar,
  Alert,
  InputAdornment,
} from '@mui/material';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import LockIcon from '@mui/icons-material/Lock';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid container sx={{ minHeight: '100vh' }}>
      {/* Left — animated gradient brand panel */}
      <Grid
        item
        xs={false}
        md={5}
        sx={{
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          overflow: 'hidden',
          bgcolor: '#12181B',
          color: '#fff',
          p: 6,
        }}
      >
        <motion.div
          animate={{ x: [0, -25, 0], y: [0, 25, 0] }}
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute', top: -60, left: -60, width: 300, height: 300,
            borderRadius: '50%', background: 'radial-gradient(circle, #FF5A36 0%, transparent 70%)',
            opacity: 0.35, filter: 'blur(10px)',
          }}
        />
        <motion.div
          animate={{ x: [0, 20, 0], y: [0, -20, 0] }}
          transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute', bottom: -90, right: -70, width: 300, height: 300,
            borderRadius: '50%', background: 'radial-gradient(circle, #1F7A5C 0%, transparent 70%)',
            opacity: 0.3, filter: 'blur(10px)',
          }}
        />

        <Stack component={RouterLink} to="/" direction="row" alignItems="center" spacing={1} sx={{ position: 'relative', zIndex: 1, textDecoration: 'none' }}>
          <Avatar sx={{ bgcolor: '#FF5A36', width: 34, height: 34 }}>
            <FitnessCenterIcon sx={{ fontSize: 18 }} />
          </Avatar>
          <Typography variant="h6" sx={{ fontFamily: '"Archivo Black"', color: '#fff' }}>
            FIT<Box component="span" sx={{ color: '#FF5A36' }}>PULSE</Box>
          </Typography>
        </Stack>

        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Typography variant="h3" sx={{ fontFamily: '"Archivo Black"', fontSize: '2.2rem', lineHeight: 1.15 }}>
            Welcome back.
            <br />
            Your progress is waiting.
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mt: 2, maxWidth: 320 }}>
            Sign in to see your dashboard, log today's workout and keep your streak going.
          </Typography>
        </Box>

        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', position: 'relative', zIndex: 1 }}>
          © {new Date().getFullYear()} FitPulse
        </Typography>
      </Grid>

      {/* Right — form */}
      <Grid item xs={12} md={7} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default', p: 3 }}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ width: '100%', maxWidth: 400 }}>
          <Box component={RouterLink} to="/" sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 1, mb: 4, textDecoration: 'none' }}>
            <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
              <FitnessCenterIcon sx={{ fontSize: 16 }} />
            </Avatar>
            <Typography variant="h6" sx={{ fontFamily: '"Archivo Black"', color: 'text.primary' }}>
              FIT<Box component="span" sx={{ color: 'primary.main' }}>PULSE</Box>
            </Typography>
          </Box>

          <Typography variant="h4" sx={{ fontFamily: '"Archivo Black"', fontSize: '1.8rem' }}>
            Welcome back
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Sign in to continue tracking.
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
            <Stack spacing={2.5}>
              {error && <Alert severity="error">{error}</Alert>}

              <TextField
                type="email"
                label="Email"
                required
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                InputProps={{ startAdornment: <InputAdornment position="start"><AlternateEmailIcon fontSize="small" color="disabled" /></InputAdornment> }}
              />
              <TextField
                type="password"
                label="Password"
                required
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{ startAdornment: <InputAdornment position="start"><LockIcon fontSize="small" color="disabled" /></InputAdornment> }}
              />

              <Button
                type="submit"
                size="large"
                variant="contained"
                disabled={loading}
                endIcon={<ArrowForwardIcon />}
                sx={{ py: 1.5 }}
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </Button>
            </Stack>
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 3, textAlign: 'center' }}>
            Don't have an account?{' '}
            <Typography component={RouterLink} to="/register" sx={{ fontWeight: 600, color: 'text.primary', textDecoration: 'none' }}>
              Register
            </Typography>
          </Typography>
        </motion.div>
      </Grid>
    </Grid>
  );
};

export default Login;