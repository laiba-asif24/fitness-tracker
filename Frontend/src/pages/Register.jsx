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
import PersonIcon from '@mui/icons-material/Person';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import LockIcon from '@mui/icons-material/Lock';
import BadgeIcon from '@mui/icons-material/Badge';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { useAuth } from '../context/AuthContext';

const perks = [
  { icon: <FitnessCenterIcon />, text: 'Log every workout in seconds' },
  { icon: <RestaurantIcon />, text: 'Auto-calculated calories & macros' },
  { icon: <TrendingUpIcon />, text: 'Visual progress trends over time' },
  { icon: <DashboardIcon />, text: 'One dashboard for everything' },
];

const Register = () => {
  const [form, setForm] = useState({ name: '', username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form.name, form.username, form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
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
        {/* Decorative animated blobs */}
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute', top: -80, right: -80, width: 280, height: 280,
            borderRadius: '50%', background: 'radial-gradient(circle, #FF5A36 0%, transparent 70%)',
            opacity: 0.35, filter: 'blur(10px)',
          }}
        />
        <motion.div
          animate={{ x: [0, -20, 0], y: [0, -30, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute', bottom: -100, left: -60, width: 320, height: 320,
            borderRadius: '50%', background: 'radial-gradient(circle, #1F7A5C 0%, transparent 70%)',
            opacity: 0.3, filter: 'blur(10px)',
          }}
        />

        <Stack component={RouterLink} to="/" direction="row" alignItems="center" spacing={1} sx={{ position: 'relative', zIndex: 1, textDecoration: 'none' }}>
          <Avatar sx={{ bgcolor: '#FF5A36', width: 34, height: 34 }}>
            <FitnessCenterIcon sx={{ fontSize: 18 }} />
          </Avatar>
          <Typography variant="h6" sx={{ fontFamily: '"Archivo Black"' }}>
            FIT<Box component="span" sx={{ color: '#FF5A36' }}>PULSE</Box>
          </Typography>
        </Stack>

        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Typography variant="h3" sx={{ fontFamily: '"Archivo Black"', fontSize: '2.2rem', lineHeight: 1.15 }}>
            Every rep counts.
            <br />
            Start logging yours today.
          </Typography>

          <Stack spacing={2} sx={{ mt: 5 }}>
            {perks.map((p, i) => (
              <motion.div
                key={p.text}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 * i, duration: 0.5 }}
              >
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.1)', width: 32, height: 32 }}>{p.icon}</Avatar>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>{p.text}</Typography>
                </Stack>
              </motion.div>
            ))}
          </Stack>
        </Box>

        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', position: 'relative', zIndex: 1 }}>
          © {new Date().getFullYear()} FitPulse
        </Typography>
      </Grid>

      {/* Right — form */}
      <Grid item xs={12} md={7} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default', p: 3 }}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ width: '100%', maxWidth: 420 }}>
          <Box component={RouterLink} to="/" sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 1, mb: 4, textDecoration: 'none' }}>
            <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
              <FitnessCenterIcon sx={{ fontSize: 16 }} />
            </Avatar>
            <Typography variant="h6" sx={{ fontFamily: '"Archivo Black"', color: 'text.primary' }}>
              FIT<Box component="span" sx={{ color: 'primary.main' }}>PULSE</Box>
            </Typography>
          </Box>

          <Typography variant="h4" sx={{ fontFamily: '"Archivo Black"', fontSize: '1.8rem' }}>
            Create your account
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Start tracking your fitness journey — it's free.
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
            <Stack spacing={2.5}>
              {error && <Alert severity="error">{error}</Alert>}

              <TextField
                name="name"
                label="Full name"
                required
                fullWidth
                value={form.name}
                onChange={handleChange}
                InputProps={{ startAdornment: <InputAdornment position="start"><BadgeIcon fontSize="small" color="disabled" /></InputAdornment> }}
              />
              <TextField
                name="username"
                label="Username"
                required
                fullWidth
                value={form.username}
                onChange={handleChange}
                InputProps={{ startAdornment: <InputAdornment position="start"><PersonIcon fontSize="small" color="disabled" /></InputAdornment> }}
              />
              <TextField
                type="email"
                name="email"
                label="Email"
                required
                fullWidth
                value={form.email}
                onChange={handleChange}
                InputProps={{ startAdornment: <InputAdornment position="start"><AlternateEmailIcon fontSize="small" color="disabled" /></InputAdornment> }}
              />
              <TextField
                type="password"
                name="password"
                label="Password"
                required
                fullWidth
                inputProps={{ minLength: 6 }}
                helperText="At least 6 characters"
                value={form.password}
                onChange={handleChange}
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
                {loading ? 'Creating account...' : 'Create account'}
              </Button>
            </Stack>
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 3, textAlign: 'center' }}>
            Already have an account?{' '}
            <Typography component={RouterLink} to="/login" sx={{ fontWeight: 600, color: 'text.primary', textDecoration: 'none' }}>
              Sign in
            </Typography>
          </Typography>
        </motion.div>
      </Grid>
    </Grid>
  );
};

export default Register;