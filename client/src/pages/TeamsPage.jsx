// src/pages/TeamsPage.jsx
import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, TextField, List, ListItem, ListItemText
} from '@mui/material';
import { useAuth } from '../auth';            // your auth hook
import api from '../api';                     // your axios/fetch wrapper

export default function TeamsPage() {
  const { user } = useAuth();
  const [teams, setTeams] = useState([]);
  const [newName, setNewName] = useState('');

  useEffect(() => {
    api.get('/teams').then(res => setTeams(res.data));
  }, []);

  const createTeam = async () => {
    if (!newName.trim()) return;
    await api.post('/teams', { name: newName });
    setNewName('');
    const res = await api.get('/teams');
    setTeams(res.data);
  };

  if (!user?.is_admin) return <Typography>You must be an admin to view this.</Typography>;

  return (
    <Box p={2}>
      <Typography variant="h4" gutterBottom>
        Manage Teams
      </Typography>
      <Box display="flex" mb={2}>
        <TextField
          label="New Team Name"
          value={newName}
          onChange={e => setNewName(e.target.value)}
          sx={{ mr: 1 }}
        />
        <Button variant="contained" onClick={createTeam}>
          Add Team
        </Button>
      </Box>
      <List>
        {teams.map(team => (
          <ListItem key={team.id}>
            <ListItemText primary={team.name} secondary={`ID: ${team.id}`} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
