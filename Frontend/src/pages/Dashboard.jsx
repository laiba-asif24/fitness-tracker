import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Box, Grid, Card, Typography, Stack, Avatar, CircularProgress } from '@mui/material';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import MonitorWeightIcon from '@mui/icons-material/MonitorWeight';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import Layout from '../components/Layout';
import api from '../api/axios';

const StatCard = ({ icon, label, value, accent, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
    whileHover={{ y: -5 }}
  >
    <Card
      sx={{
        p: 3,
        transition: 'box-shadow 0.2s, border-color 0.2s',
        '&:hover': { borderColor: 'primary.main', boxShadow: '0 10px 24px rgba(255,90,54,0.1)' },
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1.5}>
        <Avatar sx={{ bgcolor: accent ? 'primary.main' : '#12181B', width: 36, height: 36 }}>{icon}</Avatar>
        <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: '0.1em' }}>{label}</Typography>
      </Stack>
      <Typography variant="h4" sx={{ fontFamily: '"Archivo Black"', mt: 1.5, color: accent ? 'primary.main' : 'text.primary' }}>
        {value}
      </Typography>
    </Card>
  </motion.div>
);

const ListCard = ({ title, items, renderItem, emptyText, delay }) => (
  <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay }}>
    <Card sx={{ p: 3, height: '100%' }}>
      <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: '0.1em' }}>{title}</Typography>
      {items?.length ? (
        <Stack sx={{ mt: 2 }} divider={<Box sx={{ borderBottom: '1px solid #E3DFD6' }} />} spacing={1.5}>
          {items.map(renderItem)}
        </Stack>
      ) : (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>{emptyText}</Typography>
      )}
    </Card>
  </motion.div>
);

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/dashboard')
      .then((res) => setData(res.data.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout>
      <Typography variant="overline" color="text.secondary">Overview</Typography>
      <Typography variant="h4" sx={{ fontFamily: '"Archivo Black"', mt: 0.5 }}>Dashboard</Typography>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
          <CircularProgress sx={{ color: 'primary.main' }} />
        </Box>
      )}
      {error && <Typography color="error" sx={{ mt: 3 }}>{error}</Typography>}

      {data && (
        <>
          <Grid container spacing={2.5} sx={{ mt: 1 }}>
            <Grid item xs={6} md={3}>
              <StatCard icon={<FitnessCenterIcon fontSize="small" />} label="Total Workouts" value={data.totalWorkouts} delay={0} />
            </Grid>
            <Grid item xs={6} md={3}>
              <StatCard icon={<LocalFireDepartmentIcon fontSize="small" />} label="Weekly Calories" value={data.weeklyCalories} accent delay={0.05} />
            </Grid>
            <Grid item xs={6} md={3}>
              <StatCard
                icon={<MonitorWeightIcon fontSize="small" />}
                label="Latest Weight"
                value={data.latestProgress?.weight ? `${data.latestProgress.weight} kg` : '—'}
                delay={0.1}
              />
            </Grid>
            <Grid item xs={6} md={3}>
              <StatCard icon={<NotificationsActiveIcon fontSize="small" />} label="Unread Alerts" value={data.unreadNotifications} delay={0.15} />
            </Grid>
          </Grid>

          <Grid container spacing={2.5} sx={{ mt: 0.5 }}>
            <Grid item xs={12} md={6}>
              <ListCard
                title="Recent Workouts"
                items={data.recentWorkouts}
                emptyText="No workouts logged yet."
                delay={0.2}
                renderItem={(w) => (
                  <Stack key={w._id} direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="body2" fontWeight={600}>{w.title}</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      {w.category}
                    </Typography>
                  </Stack>
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <ListCard
                title="Recent Nutrition Logs"
                items={data.recentNutrition}
                emptyText="No nutrition logs yet."
                delay={0.25}
                renderItem={(n) => (
                  <Stack key={n._id} direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="body2" fontWeight={600} sx={{ textTransform: 'capitalize' }}>{n.mealType}</Typography>
                    <Typography variant="caption" color="text.secondary">{n.totalCalories} kcal</Typography>
                  </Stack>
                )}
              />
            </Grid>
          </Grid>
        </>
      )}
    </Layout>
  );
};

export default Dashboard;
