import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Box, Card, Typography, Stack, Button, IconButton, CircularProgress, Avatar,
} from '@mui/material';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import InfoIcon from '@mui/icons-material/Info';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import Layout from '../components/Layout';
import api from '../api/axios';

const typeIcon = {
  workout_reminder: <FitnessCenterIcon fontSize="small" />,
  meal_reminder: <RestaurantIcon fontSize="small" />,
  goal_achieved: <EmojiEventsIcon fontSize="small" />,
  system: <InfoIcon fontSize="small" />,
  follow: <NotificationsActiveIcon fontSize="small" />,
};

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchNotifications = () => {
    setLoading(true);
    api
      .get('/notifications')
      .then((res) => setNotifications(res.data.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load notifications'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchNotifications(); }, []);

  const markAsRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)));
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update notification');
    }
  };

  const markAllRead = async () => {
    try {
      await api.patch('/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update notifications');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Could not delete notification');
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <Layout>
      <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
        <Box>
          <Typography variant="overline" color="text.secondary">Alerts</Typography>
          <Typography variant="h4" sx={{ fontFamily: '"Archivo Black"', mt: 0.5 }}>Notifications</Typography>
        </Box>
        {unreadCount > 0 && (
          <Button variant="outlined" startIcon={<DoneAllIcon />} onClick={markAllRead} sx={{ borderColor: '#E3DFD6', color: 'text.primary' }}>
            Mark all as read ({unreadCount})
          </Button>
        )}
      </Stack>

      {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
          <CircularProgress sx={{ color: 'primary.main' }} />
        </Box>
      )}

      {!loading && notifications.length === 0 && (
        <Card sx={{ p: 4, mt: 3, textAlign: 'center' }}>
          <Typography color="text.secondary">You're all caught up — no notifications yet.</Typography>
        </Card>
      )}

      <Stack spacing={1.5} sx={{ mt: 3 }}>
        <AnimatePresence>
          {notifications.map((n) => (
            <motion.div
              key={n._id}
              layout
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }}
              whileHover={{ x: 3 }}
              transition={{ duration: 0.25 }}
            >
              <Card
                sx={{
                  p: 2.5,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  bgcolor: n.isRead ? 'background.paper' : '#FFF6F3',
                  borderColor: n.isRead ? '#E3DFD6' : 'primary.main',
                  transition: 'box-shadow 0.2s',
                  '&:hover': { boxShadow: '0 10px 24px rgba(0,0,0,0.06)' },
                }}
              >
                <Avatar sx={{ bgcolor: n.isRead ? '#12181B' : 'primary.main', width: 38, height: 38 }}>
                  {typeIcon[n.type] || <InfoIcon fontSize="small" />}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" fontWeight={n.isRead ? 400 : 700}>{n.message}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(n.createdAt).toLocaleString()}
                  </Typography>
                </Box>
                {!n.isRead && (
                  <Button size="small" onClick={() => markAsRead(n._id)} sx={{ color: 'primary.main', fontWeight: 600 }}>
                    Mark read
                  </Button>
                )}
                <IconButton size="small" onClick={() => handleDelete(n._id)} sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}>
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </Stack>
    </Layout>
  );
};

export default Notifications;
