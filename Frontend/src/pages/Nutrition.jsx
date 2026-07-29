import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Box, Grid, Card, Typography, Stack, Button, TextField, MenuItem,
  IconButton, Chip, CircularProgress, Collapse, Divider,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import Layout from '../components/Layout';
import api from '../api/axios';

const mealTypes = ['breakfast', 'lunch', 'dinner', 'snacks'];
const emptyForm = { mealType: 'breakfast', foodName: '', quantity: '', unit: 'g', calories: '', protein: '', carbs: '', fats: '' };

const Nutrition = () => {
  const [logs, setLogs] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);

  const fetchLogs = () => {
    setLoading(true);
    api
      .get('/nutrition')
      .then((res) => setLogs(res.data.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load nutrition logs'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchLogs(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/nutrition', {
        mealType: form.mealType,
        items: [{
          foodName: form.foodName,
          quantity: Number(form.quantity) || 1,
          unit: form.unit,
          calories: Number(form.calories) || 0,
          protein: Number(form.protein) || 0,
          carbs: Number(form.carbs) || 0,
          fats: Number(form.fats) || 0,
        }],
      });
      setForm(emptyForm);
      setShowForm(false);
      fetchLogs();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create nutrition log');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this log?')) return;
    try {
      await api.delete(`/nutrition/${id}`);
      fetchLogs();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not delete log');
    }
  };

  return (
    <Layout>
      <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
        <Box>
          <Typography variant="overline" color="text.secondary">Food log</Typography>
          <Typography variant="h4" sx={{ fontFamily: '"Archivo Black"', mt: 0.5 }}>Nutrition</Typography>
        </Box>
        <Button variant="contained" startIcon={showForm ? <CloseIcon /> : <AddIcon />} onClick={() => setShowForm((s) => !s)}>
          {showForm ? 'Cancel' : 'New Log'}
        </Button>
      </Stack>

      {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}

      <Collapse in={showForm}>
        <Card component="form" onSubmit={handleSubmit} sx={{ p: 3, mt: 3 }}>
          <Grid container spacing={2.5}>
            <Grid item xs={12} md={4}>
              <TextField select name="mealType" label="Meal type" fullWidth value={form.mealType} onChange={handleChange}>
                {mealTypes.map((m) => <MenuItem key={m} value={m} sx={{ textTransform: 'capitalize' }}>{m}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField name="foodName" label="Food name" required fullWidth value={form.foodName} onChange={handleChange} placeholder="Oatmeal" />
            </Grid>
            <Grid item xs={6} md={2}>
              <TextField type="number" name="quantity" label="Quantity" fullWidth value={form.quantity} onChange={handleChange} placeholder="100" />
            </Grid>
            <Grid item xs={6} md={2}>
              <TextField select name="unit" label="Unit" fullWidth value={form.unit} onChange={handleChange}>
                {['g', 'ml', 'pcs'].map((u) => <MenuItem key={u} value={u}>{u}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={6} md={3}>
              <TextField type="number" name="calories" label="Calories" fullWidth value={form.calories} onChange={handleChange} />
            </Grid>
            <Grid item xs={6} md={3}>
              <TextField type="number" name="protein" label="Protein (g)" fullWidth value={form.protein} onChange={handleChange} />
            </Grid>
            <Grid item xs={6} md={3}>
              <TextField type="number" name="carbs" label="Carbs (g)" fullWidth value={form.carbs} onChange={handleChange} />
            </Grid>
            <Grid item xs={6} md={3}>
              <TextField type="number" name="fats" label="Fats (g)" fullWidth value={form.fats} onChange={handleChange} />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained">Save Log</Button>
            </Grid>
          </Grid>
        </Card>
      </Collapse>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
          <CircularProgress sx={{ color: 'primary.main' }} />
        </Box>
      )}

      {!loading && logs.length === 0 && (
        <Card sx={{ p: 4, mt: 3, textAlign: 'center' }}>
          <Typography color="text.secondary">No nutrition logs yet — add your first meal above.</Typography>
        </Card>
      )}

      <Grid container spacing={2} sx={{ mt: 0.5 }}>
        <AnimatePresence>
          {logs.map((log) => (
            <Grid item xs={12} sm={6} md={4} key={log._id}>
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
                      icon={<RestaurantIcon sx={{ fontSize: 14, color: '#fff !important' }} />}
                      label={log.mealType}
                      size="small"
                      sx={{ textTransform: 'capitalize', bgcolor: '#12181B', color: '#fff', fontWeight: 600 }}
                    />
                    <IconButton size="small" onClick={() => handleDelete(log._id)} sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}>
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </Stack>

                  <Typography variant="h4" sx={{ fontFamily: '"Archivo Black"', color: 'primary.main', mt: 2 }}>
                    {log.totalCalories}
                    <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>kcal</Typography>
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(log.date).toLocaleDateString()}
                  </Typography>

                  <Divider sx={{ my: 1.5 }} />

                  <Stack direction="row" spacing={2}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">Protein</Typography>
                      <Typography variant="body2" fontWeight={600}>{log.totalMacros?.protein || 0}g</Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">Carbs</Typography>
                      <Typography variant="body2" fontWeight={600}>{log.totalMacros?.carbs || 0}g</Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">Fats</Typography>
                      <Typography variant="body2" fontWeight={600}>{log.totalMacros?.fats || 0}g</Typography>
                    </Box>
                  </Stack>

                  {log.items?.length > 0 && (
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1.5, display: 'block' }}>
                      {log.items.map((i) => i.foodName).join(', ')}
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

export default Nutrition;
