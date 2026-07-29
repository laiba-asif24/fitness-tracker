import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Box, Grid, Card, Typography, Stack, Button, TextField, MenuItem,
  IconButton, Chip, CircularProgress, Collapse,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Layout from '../components/Layout';
import api from '../api/axios';

const emptyForm = { title: '', category: 'strength', duration: '', notes: '' };
const categories = ['strength', 'cardio', 'flexibility', 'other'];

const Workouts = () => {
  const [workouts, setWorkouts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);

  const fetchWorkouts = () => {
    setLoading(true);
    api
      .get('/workouts')
      .then((res) => setWorkouts(res.data.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load workouts'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchWorkouts(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/workouts', { ...form, duration: Number(form.duration) || 0 });
      setForm(emptyForm);
      setShowForm(false);
      fetchWorkouts();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create workout');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this workout?')) return;
    try {
      await api.delete(`/workouts/${id}`);
      fetchWorkouts();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not delete workout');
    }
  };

  return (
    <Layout>
      <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
        <Box>
          <Typography variant="overline" color="text.secondary">Training log</Typography>
          <Typography variant="h4" sx={{ fontFamily: '"Archivo Black"', mt: 0.5 }}>Workouts</Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={showForm ? <CloseIcon /> : <AddIcon />}
          onClick={() => setShowForm((s) => !s)}
        >
          {showForm ? 'Cancel' : 'New Workout'}
        </Button>
      </Stack>

      {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}

      <Collapse in={showForm}>
        <Card component="form" onSubmit={handleSubmit} sx={{ p: 3, mt: 3 }}>
          <Grid container spacing={2.5}>
            <Grid item xs={12} md={6}>
              <TextField name="title" label="Title" required fullWidth value={form.title} onChange={handleChange} placeholder="Push Day" />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField select name="category" label="Category" fullWidth value={form.category} onChange={handleChange}>
                {categories.map((c) => <MenuItem key={c} value={c} sx={{ textTransform: 'capitalize' }}>{c}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField type="number" name="duration" label="Duration (minutes)" fullWidth value={form.duration} onChange={handleChange} placeholder="60" />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField name="notes" label="Notes" fullWidth value={form.notes} onChange={handleChange} placeholder="Optional" />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained">Save Workout</Button>
            </Grid>
          </Grid>
        </Card>
      </Collapse>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
          <CircularProgress sx={{ color: 'primary.main' }} />
        </Box>
      )}

      {!loading && workouts.length === 0 && (
        <Card sx={{ p: 4, mt: 3, textAlign: 'center' }}>
          <Typography color="text.secondary">No workouts yet — add your first one above.</Typography>
        </Card>
      )}

      <Grid container spacing={2} sx={{ mt: 0.5 }}>
        <AnimatePresence>
          {workouts.map((w) => (
            <Grid item xs={12} sm={6} md={4} key={w._id}>
              <motion.div
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.3 }}
              >
                <Card
                  sx={{
                    p: 3,
                    height: '100%',
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                    '&:hover': { borderColor: 'primary.main', boxShadow: '0 10px 24px rgba(255,90,54,0.1)' },
                  }}
                >
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                    <Chip
                      label={w.category}
                      size="small"
                      sx={{ textTransform: 'capitalize', bgcolor: '#12181B', color: '#fff', fontWeight: 600 }}
                    />
                    <IconButton size="small" onClick={() => handleDelete(w._id)} sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}>
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                  <Typography variant="h6" sx={{ fontFamily: '"Archivo Black"', fontSize: '1.05rem', mt: 2 }}>
                    {w.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    {w.duration || 0} min · {new Date(w.date).toLocaleDateString()}
                  </Typography>
                  {w.notes && (
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1.5, display: 'block' }}>
                      {w.notes}
                    </Typography>
                  )}
                </Card>
              </motion.div>
            </Grid>
          ))}
        </AnimatePresence>
      </Grid>
    </Layout>
  );
};

export default Workouts;
