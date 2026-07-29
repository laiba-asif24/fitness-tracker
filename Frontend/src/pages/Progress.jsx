import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Box, Grid, Card, Typography, Stack, Button, TextField,
  IconButton, CircularProgress, Collapse,
} from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Layout from '../components/Layout';
import api from '../api/axios';

const emptyForm = { weight: '', chest: '', waist: '', hips: '', arms: '', thighs: '' };

const Progress = () => {
  const [logs, setLogs] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);

  const fetchLogs = () => {
    setLoading(true);
    api
      .get('/progress')
      .then((res) => setLogs(res.data.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load progress logs'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchLogs(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/progress', {
        weight: Number(form.weight) || undefined,
        bodyMeasurements: {
          chest: Number(form.chest) || undefined,
          waist: Number(form.waist) || undefined,
          hips: Number(form.hips) || undefined,
          arms: Number(form.arms) || undefined,
          thighs: Number(form.thighs) || undefined,
        },
      });
      setForm(emptyForm);
      setShowForm(false);
      fetchLogs();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save progress log');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this entry?')) return;
    try {
      await api.delete(`/progress/${id}`);
      fetchLogs();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not delete entry');
    }
  };

  const chartData = logs
    .filter((l) => l.weight)
    .map((l) => ({ date: new Date(l.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }), weight: l.weight }));

  return (
    <Layout>
      <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
        <Box>
          <Typography variant="overline" color="text.secondary">Body tracking</Typography>
          <Typography variant="h4" sx={{ fontFamily: '"Archivo Black"', mt: 0.5 }}>Progress</Typography>
        </Box>
        <Button variant="contained" startIcon={showForm ? <CloseIcon /> : <AddIcon />} onClick={() => setShowForm((s) => !s)}>
          {showForm ? 'Cancel' : 'New Entry'}
        </Button>
      </Stack>

      {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}

      <Collapse in={showForm}>
        <Card component="form" onSubmit={handleSubmit} sx={{ p: 3, mt: 3 }}>
          <Grid container spacing={2.5}>
            <Grid item xs={12} md={4}>
              <TextField type="number" name="weight" label="Weight (kg)" fullWidth value={form.weight} onChange={handleChange} />
            </Grid>
            <Grid item xs={6} md={4}>
              <TextField type="number" name="chest" label="Chest (cm)" fullWidth value={form.chest} onChange={handleChange} />
            </Grid>
            <Grid item xs={6} md={4}>
              <TextField type="number" name="waist" label="Waist (cm)" fullWidth value={form.waist} onChange={handleChange} />
            </Grid>
            <Grid item xs={6} md={4}>
              <TextField type="number" name="hips" label="Hips (cm)" fullWidth value={form.hips} onChange={handleChange} />
            </Grid>
            <Grid item xs={6} md={4}>
              <TextField type="number" name="arms" label="Arms (cm)" fullWidth value={form.arms} onChange={handleChange} />
            </Grid>
            <Grid item xs={6} md={4}>
              <TextField type="number" name="thighs" label="Thighs (cm)" fullWidth value={form.thighs} onChange={handleChange} />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained">Save Entry</Button>
            </Grid>
          </Grid>
        </Card>
      </Collapse>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
          <CircularProgress sx={{ color: 'primary.main' }} />
        </Box>
      )}

      {!loading && chartData.length > 1 && (
        <Card sx={{ p: 3, mt: 3 }}>
          <Typography variant="overline" color="text.secondary">Weight trend</Typography>
          <Box sx={{ height: 260, mt: 2 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E3DFD6" />
                <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#5B6169' }} />
                <YAxis tick={{ fontSize: 12, fill: '#5B6169' }} domain={['auto', 'auto']} />
                <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #E3DFD6' }} />
                <Line type="monotone" dataKey="weight" stroke="#FF5A36" strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </Card>
      )}

      {!loading && logs.length === 0 && (
        <Card sx={{ p: 4, mt: 3, textAlign: 'center' }}>
          <Typography color="text.secondary">No progress entries yet — add your first one above.</Typography>
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
                    <Typography variant="caption" color="text.secondary">
                      {new Date(log.date).toLocaleDateString()}
                    </Typography>
                    <IconButton size="small" onClick={() => handleDelete(log._id)} sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}>
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                  <Typography variant="h4" sx={{ fontFamily: '"Archivo Black"', color: 'primary.main', mt: 1 }}>
                    {log.weight ? `${log.weight} kg` : '—'}
                  </Typography>
                  {log.bodyMeasurements && (
                    <Stack direction="row" flexWrap="wrap" gap={2} sx={{ mt: 1.5 }}>
                      {Object.entries(log.bodyMeasurements).filter(([, v]) => v).map(([k, v]) => (
                        <Box key={k}>
                          <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'capitalize' }}>{k}</Typography>
                          <Typography variant="body2" fontWeight={600}>{v} cm</Typography>
                        </Box>
                      ))}
                    </Stack>
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

export default Progress;
