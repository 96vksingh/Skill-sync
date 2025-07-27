import React, { useState, useEffect } from 'react';
import {
  Container, Paper, Typography, Table, TableBody, TableCell, TableHead, TableRow,
  IconButton, Chip, TextField, Button, MenuItem, Box
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import { getSkills, addSkill, deleteSkill } from '../services/api';

const skillCategories = [
  'Technical', 'Design', 'Management', 'Marketing', 'Sales', 'Operations', 'HR', 'Finance', 'Other'
];
const proficiencyLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

function SkillsForm() {
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState({
    name: '', category: '', proficiency: '', yearsOfExperience: 1
  });
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    loadSkills();
  }, []);

  const loadSkills = async () => {
    const res = await getSkills();
    setSkills(res);
  };

  const handleAddSkill = async e => {
    e.preventDefault();
    setAdding(true);
    await addSkill(newSkill);
    setAdding(false);
    setNewSkill({ name: '', category: '', proficiency: '', yearsOfExperience: 1 });
    loadSkills();
  };

  const handleDeleteSkill = async id => {
    await deleteSkill(id);
    loadSkills();
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Manage Your Skills
        </Typography>
        <form onSubmit={handleAddSkill}>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              label="Skill Name"
              required
              value={newSkill.name}
              onChange={e => setNewSkill(s => ({ ...s, name: e.target.value }))}
            />
            <TextField
              select
              label="Category"
              required
              value={newSkill.category}
              onChange={e => setNewSkill(s => ({ ...s, category: e.target.value }))}
            >
              {skillCategories.map(cat => (
                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Proficiency"
              required
              value={newSkill.proficiency}
              onChange={e => setNewSkill(s => ({ ...s, proficiency: e.target.value }))}
            >
              {proficiencyLevels.map(level => (
                <MenuItem key={level} value={level}>{level}</MenuItem>
              ))}
            </TextField>
            <TextField
              label="Years"
              type="number"
              inputProps={{ min: 0, max: 50 }}
              value={newSkill.yearsOfExperience}
              onChange={e => setNewSkill(s => ({ ...s, yearsOfExperience: e.target.value }))}
              sx={{ width: 100 }}
            />
            <Button variant="contained" type="submit" startIcon={<Add />} disabled={adding}>
              Add
            </Button>
          </Box>
        </form>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Proficiency</TableCell>
              <TableCell>Years</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {skills.map(skill => (
              <TableRow key={skill._id}>
                <TableCell>
                  <Chip label={skill.name} />
                </TableCell>
                <TableCell>{skill.category}</TableCell>
                <TableCell>{skill.proficiency}</TableCell>
                <TableCell>{skill.yearsOfExperience}</TableCell>
                <TableCell>
                  <IconButton color="error" onClick={() => handleDeleteSkill(skill._id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
}

export default SkillsForm;
