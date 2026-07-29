import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Box, Grid, Card, Typography, Stack, Button, TextField, MenuItem,
  Switch, FormControlLabel, Alert, Avatar, Divider,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import TuneIcon from '@mui/icons-material/Tune';
import LockIcon from '@mui/icons-material/Lock';
import Layout from '../components/Layout';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const SectionCard = ({ icon, title, children, delay }) => (
  <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay }}>
    <Card sx={{ p: 3 }}>
      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2.5 }}>
        <Avatar sx={{ bgcolor: '#12181B', width: 34, height: 34 }}>{icon}</Avatar>
        <Typography variant="h6" sx={{ fontFamily: '"Archivo Black"', fontSize: '1.05rem' }}>{title}</Typography>
      </Stack>
      <Divider sx={{ mb: 2.5 }} />
      {children}
    </Card>
  </motion.div>
);

const Settings = () => {
  const { user, setUser } = useAuth();
  const [profile, setProfile] = useState({ name: user?.name || '', bio: user?.bio || '' });
  const [prefs, setPrefs] = useState({
    units: user?.preferences?.units || 'metric',
    theme: user?.preferences?.theme || 'light',
    notificationsEnabled: user?.preferences?.notificationsEnabled ?? true,
  });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '' });
  const [msg, setMsg] = useState({ type: '', text: '' });

  const showMsg = (type, text) => {
    setMsg({ type, text });
    setTimeout(() => setMsg({ type: '', text: '' }), 3500);
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put('/users/profile', profile);
      setUser((u) => ({ ...u, ...res.data.data }));
      showMsg('success', 'Profile updated successfully');
    } catch (err) {
      showMsg('error', err.response?.data?.message || 'Could not update profile');
    }
  };

  const savePrefs = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put('/users/settings', prefs);
      setUser((u) => ({ ...u, preferences: res.data.data }));
      showMsg('success', 'Preferences updated successfully');
    } catch (err) {
      showMsg('error', err.response?.data?.message || 'Could not update preferences');
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    try {
      await api.put('/users/password', passwords);
      setPasswords({ currentPassword: '', newPassword: '' });
      showMsg('success', 'Password changed successfully');
    } catch (err) {
      showMsg('error', err.response?.data?.message || 'Could not change password');
    }
  };

  return (
    <Layout>
      <Typography variant="overline" color="text.secondary">Account</Typography>
      <Typography variant="h4" sx={{ fontFamily: '"Archivo Black"', mt: 0.5, mb: 3 }}>Settings</Typography>

      {msg.text && <Alert severity={msg.type} sx={{ mb: 3 }}>{msg.text}</Alert>}

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <SectionCard icon={<PersonIcon fontSize="small" />} title="Profile" delay={0}>
            <Box component="form" onSubmit={saveProfile}>
              <Stack spacing={2.5}>
                <TextField
                  label="Full name"
                  fullWidth
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                />
                <TextField
                  label="Bio"
                  fullWidth
                  multiline
                  rows={3}
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                />
                <Button type="submit" variant="contained" sx={{ alignSelf: 'flex-start' }}>Save Profile</Button>
              </Stack>
            </Box>
          </SectionCard>
        </Grid>

        <Grid item xs={12} md={6}>
          <SectionCard icon={<TuneIcon fontSize="small" />} title="Preferences" delay={0.1}>
            <Box component="form" onSubmit={savePrefs}>
              <Stack spacing={2.5}>
                <TextField
                  select
                  label="Units"
                  fullWidth
                  value={prefs.units}
                  onChange={(e) => setPrefs({ ...prefs, units: e.target.value })}
                >
                  <MenuItem value="metric">Metric (kg, cm)</MenuItem>
                  <MenuItem value="imperial">Imperial (lb, in)</MenuItem>
                </TextField>
                <TextField
                  select
                  label="Theme"
                  fullWidth
                  value={prefs.theme}
                  onChange={(e) => setPrefs({ ...prefs, theme: e.target.value })}
                >
                  <MenuItem value="light">Light</MenuItem>
                  <MenuItem value="dark">Dark</MenuItem>
                </TextField>
                <FormControlLabel
                  control={
                    <Switch
                      checked={prefs.notificationsEnabled}
                      onChange={(e) => setPrefs({ ...prefs, notificationsEnabled: e.target.checked })}
                      color="primary"
                    />
                  }
                  label="Enable notifications"
                />
                <Button type="submit" variant="contained" sx={{ alignSelf: 'flex-start' }}>Save Preferences</Button>
              </Stack>
            </Box>
          </SectionCard>
        </Grid>

        <Grid item xs={12} md={6}>
          <SectionCard icon={<LockIcon fontSize="small" />} title="Change Password" delay={0.2}>
            <Box component="form" onSubmit={changePassword}>
              <Stack spacing={2.5}>
                <TextField
                  type="password"
                  label="Current password"
                  fullWidth
                  required
                  value={passwords.currentPassword}
                  onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                />
                <TextField
                  type="password"
                  label="New password"
                  fullWidth
                  required
                  inputProps={{ minLength: 6 }}
                  value={passwords.newPassword}
                  onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                />
                <Button type="submit" variant="contained" sx={{ alignSelf: 'flex-start' }}>Update Password</Button>
              </Stack>
            </Box>
          </SectionCard>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default Settings;
