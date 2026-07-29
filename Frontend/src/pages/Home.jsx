import { Link as RouterLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  AppBar,
  Toolbar,
  Container,
  Box,
  Typography,
  Button,
  Card,
  Avatar,
  Grid,
  Stack,
  Chip,
} from '@mui/material';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import DashboardIcon from '@mui/icons-material/Dashboard';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import AssessmentIcon from '@mui/icons-material/Assessment';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const features = [
  { icon: <FitnessCenterIcon />, title: 'Workout Tracking', desc: 'Log strength, cardio & flexibility sessions with sets, reps, weight and rest timers.' },
  { icon: <RestaurantIcon />, title: 'Nutrition Tracking', desc: 'Track meals by type and get automatic calorie & macro totals for every log.' },
  { icon: <TrendingUpIcon />, title: 'Progress Tracking', desc: 'Record weight, body measurements and performance metrics over time.' },
  { icon: <DashboardIcon />, title: 'Dashboard & Analytics', desc: 'See recent activity, weekly calories and trend charts in one overview.' },
  { icon: <NotificationsActiveIcon />, title: 'Smart Notifications', desc: 'Reminders for workouts and meals, plus alerts when you hit a goal.' },
  { icon: <AssessmentIcon />, title: 'Reports & Export', desc: 'Generate PDF or CSV reports of your progress, nutrition or workouts.' },
];

const steps = [
  { num: '01', title: 'Create your account', desc: 'Register in seconds and set your units, theme and preferences.' },
  { num: '02', title: 'Log your data', desc: 'Add workouts, meals and body stats as you go through your day.' },
  { num: '03', title: 'Track your progress', desc: 'Watch your dashboard and charts update as your history builds up.' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.08, ease: 'easeOut' },
  }),
};

const Logo = ({ light }) => (
  <Stack direction="row" alignItems="center" spacing={1}>
    <Avatar sx={{ bgcolor: 'primary.main', width: 34, height: 34 }}>
      <FitnessCenterIcon sx={{ fontSize: 18 }} />
    </Avatar>
    <Typography
      variant="h6"
      sx={{ fontFamily: '"Archivo Black", sans-serif', letterSpacing: '-0.02em', color: light ? '#fff' : 'inherit' }}
    >
      FIT<Box component="span" sx={{ color: 'primary.main' }}>PULSE</Box>
    </Typography>
  </Stack>
);

const Home = () => {
  return (
    <Box sx={{ bgcolor: 'background.default' }}>
      {/* Navbar */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{ bgcolor: 'rgba(247,245,240,0.9)', backdropFilter: 'blur(8px)', borderBottom: '1px solid #E3DFD6' }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ py: 1, justifyContent: 'space-between' }}>
            <Logo />
            <Stack direction="row" spacing={1.5}>
              <Button component={RouterLink} to="/login" variant="outlined" sx={{ borderColor: '#E3DFD6', color: 'text.primary' }}>
                Sign in
              </Button>
              <Button component={RouterLink} to="/register" variant="contained" endIcon={<ArrowForwardIcon />}>
                Get started
              </Button>
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Hero */}
      <Container maxWidth="lg" sx={{ pt: { xs: 8, md: 12 }, pb: { xs: 8, md: 10 } }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <motion.div initial="hidden" animate="visible" variants={fadeUp}>
              <Chip label="MERN FITNESS TRACKER" size="small" sx={{ mb: 2, fontFamily: 'monospace', letterSpacing: '0.1em', bgcolor: 'transparent', border: '1px solid #E3DFD6' }} />
              <Typography variant="h2" sx={{ fontSize: { xs: '2.4rem', md: '3.2rem' }, lineHeight: 1.05, letterSpacing: '-0.02em' }}>
                Track every rep.
                <br />
                Every meal.
                <br />
                <Box component="span" sx={{ color: 'primary.main' }}>Every milestone.</Box>
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mt: 3, maxWidth: 420 }}>
                One place for your workouts, nutrition and body progress — with a dashboard
                that pulls it all together automatically.
              </Typography>
              <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
                <Button component={RouterLink} to="/register" size="large" variant="contained" endIcon={<ArrowForwardIcon />}>
                  Get started free
                </Button>
                <Button component={RouterLink} to="/login" size="large" variant="outlined" sx={{ borderColor: '#E3DFD6', color: 'text.primary' }}>
                  Sign in
                </Button>
              </Stack>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ position: 'relative', height: { xs: 280, md: 380 } }}>
              <motion.div
                initial={{ opacity: 0, y: 30, rotate: -6 }}
                animate={{ opacity: 1, y: [0, -10, 0], rotate: -4 }}
                transition={{ y: { duration: 4, repeat: Infinity, ease: 'easeInOut' }, opacity: { duration: 0.6 } }}
                style={{ position: 'absolute', top: 10, left: 0, width: 240 }}
              >
                <Card sx={{ p: 3, borderRadius: '18px' }}>
                  <Typography variant="overline" color="text.secondary">Today</Typography>
                  <Typography variant="h5" sx={{ fontFamily: '"Archivo Black"', mt: 1 }}>Push Day</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>4 exercises · 60 min</Typography>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30, rotate: 6 }}
                animate={{ opacity: 1, y: [0, 12, 0], rotate: 3 }}
                transition={{ y: { duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }, opacity: { duration: 0.6, delay: 0.2 } }}
                style={{ position: 'absolute', bottom: 10, right: 0, width: 240 }}
              >
                <Card sx={{ p: 3, borderRadius: '18px', bgcolor: '#12181B', color: '#fff', border: 'none' }}>
                  <Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.5)' }}>Weight trend</Typography>
                  <Typography variant="h5" sx={{ fontFamily: '"Archivo Black"', mt: 1, color: 'primary.main' }}>−1.2 kg</Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mt: 0.5 }}>Last 30 days</Typography>
                </Card>
              </motion.div>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Features - hover cards */}
      <Box id="features" sx={{ bgcolor: '#12181B', color: '#fff', py: { xs: 8, md: 10 } }}>
        <Container maxWidth="lg">
          <Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.5)' }}>What it offers</Typography>
          <Typography variant="h3" sx={{ fontSize: { xs: '1.8rem', md: '2.2rem' }, mt: 1, mb: 5 }}>
            Six modules, one app
          </Typography>

          <Grid container spacing={3}>
            {features.map((f, i) => (
              <Grid item xs={12} sm={6} md={4} key={f.title}>
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  variants={fadeUp}
                  custom={i}
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <Card
                    sx={{
                      p: 3,
                      height: '100%',
                      bgcolor: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      color: '#fff',
                      transition: 'border-color 0.25s, box-shadow 0.25s',
                      '&:hover': {
                        borderColor: 'primary.main',
                        boxShadow: '0 12px 30px rgba(255,90,54,0.15)',
                      },
                    }}
                  >
                    <Avatar sx={{ bgcolor: 'primary.main', mb: 2 }}>{f.icon}</Avatar>
                    <Typography variant="h6" sx={{ fontFamily: '"Archivo Black"', fontSize: '1.05rem' }}>
                      {f.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.65)', mt: 1 }}>
                      {f.desc}
                    </Typography>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* How it works */}
      <Container id="how-it-works" maxWidth="lg" sx={{ py: { xs: 8, md: 10 } }}>
        <Typography variant="overline" color="text.secondary">Getting started</Typography>
        <Typography variant="h3" sx={{ fontSize: { xs: '1.8rem', md: '2.2rem' }, mt: 1, mb: 5 }}>
          How it works
        </Typography>

        <Grid container spacing={3}>
          {steps.map((s, i) => (
            <Grid item xs={12} md={4} key={s.num}>
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.4 }}
                variants={fadeUp}
                custom={i}
                whileHover={{ y: -6 }}
              >
                <Card sx={{ p: 3, height: '100%', '&:hover': { borderColor: 'primary.main' } }}>
                  <Typography sx={{ fontFamily: 'monospace', color: 'primary.main', fontWeight: 700 }}>{s.num}</Typography>
                  <Typography variant="h6" sx={{ fontFamily: '"Archivo Black"', fontSize: '1.05rem', mt: 1.5 }}>
                    {s.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {s.desc}
                  </Typography>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA */}
      <Container maxWidth="lg" sx={{ pb: { xs: 8, md: 10 } }}>
        <Card
          sx={{
            p: { xs: 4, md: 5 },
            bgcolor: '#12181B',
            color: '#fff',
            border: 'none',
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { md: 'center' },
            justifyContent: 'space-between',
            gap: 3,
          }}
        >
          <Box>
            <Typography variant="h4" sx={{ fontFamily: '"Archivo Black"', fontSize: '1.6rem' }}>
              Ready to start tracking?
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.7)', mt: 1 }}>
              Create your free account and log your first workout today.
            </Typography>
          </Box>
          <Button
            component={RouterLink}
            to="/register"
            size="large"
            variant="contained"
            endIcon={<ArrowForwardIcon />}
            sx={{ bgcolor: 'primary.main', flexShrink: 0, '&:hover': { bgcolor: '#fff', color: '#12181B' } }}
          >
            Get started free
          </Button>
        </Card>
      </Container>

      {/* Footer */}
      <Box sx={{ borderTop: '1px solid #E3DFD6', py: 4 }}>
        <Container maxWidth="lg" sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { md: 'center' }, gap: 2 }}>
          <Logo />
          <Typography variant="body2" color="text.secondary">
            (c) {new Date().getFullYear()} FitPulse. Built with the MERN stack.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
