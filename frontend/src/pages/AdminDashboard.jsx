import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  List,
  ListItem,
  Divider,
  Snackbar,
  Alert
} from '@mui/material';

const roles = [
  { value: 'admin', label: 'Admin' },
  { value: 'manager', label: 'Manager' },
  { value: 'employee', label: 'Employee' }
];

const AdminDashboard = ({ onLogout }) => {
  const [employees, setEmployees] = useState([]);
  const [newRole, setNewRole] = useState('');
  const [newEmployeeId, setNewEmployeeId] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showEmployees, setShowEmployees] = useState(false);

  // Fetch all employees
  const fetchEmployees = () => {
    fetch('http://localhost:5000/api/employees')
      .then(res => res.json())
      .then(data => setEmployees(data.employees || []))
      .catch(() => setError('Failed to fetch employees'));
  };

  // Add new employee
  const handleAddEmployee = async (e) => {
    e.preventDefault();
    if (!newRole || !newEmployeeId || !newPassword) {
      setError('Please fill all fields.');
      return;
    }
    setError('');
    try {
      const response = await fetch('http://localhost:5000/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: newRole,
          employeeId: newEmployeeId,
          password: newPassword
        })
      });
      const data = await response.json();
      if (data.success) {
        setSuccessMsg('Employee added successfully!');
        setNewRole('');
        setNewEmployeeId('');
        setNewPassword('');
        if (showEmployees) fetchEmployees();
      } else {
        setError(data.message || 'Failed to add employee');
      }
    } catch {
      setError('Server error. Please try again later.');
    }
  };

  const handleShowEmployees = () => {
    fetchEmployees();
    setShowEmployees(true);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5', p: 4 }}>
      <Paper elevation={3} sx={{ p: 4, maxWidth: 500, mx: 'auto' }}>
        <Typography variant="h4" align="center" gutterBottom>
          Admin Dashboard
        </Typography>
        <Button variant="outlined" color="secondary" onClick={onLogout} sx={{ mb: 2 }}>
          Logout
        </Button>
        <Typography variant="h6" gutterBottom>
          Add New Employee
        </Typography>
        <form onSubmit={handleAddEmployee}>
          <FormControl fullWidth margin="normal">
            <InputLabel id="new-role-label">Role</InputLabel>
            <Select
              labelId="new-role-label"
              value={newRole}
              label="Role"
              onChange={(e) => setNewRole(e.target.value)}
              required
            >
              {roles
                .filter(r => r.value !== 'admin')
                .map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
          <TextField
            label="Employee ID"
            variant="outlined"
            fullWidth
            margin="normal"
            value={newEmployeeId}
            onChange={(e) => setNewEmployeeId(e.target.value)}
            required
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          {error && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            Add Employee
          </Button>
        </form>
        <Divider sx={{ my: 3 }} />
        <Button
          variant="contained"
          color="info"
          fullWidth
          sx={{ mb: 2 }}
          onClick={handleShowEmployees}
        >
          Show All Employees
        </Button>
        {showEmployees && (
          <>
            <Typography variant="h6" gutterBottom>
              All Employees
            </Typography>
            <List>
              {employees.map((emp, idx) => (
                <ListItem key={idx}>
                  <strong>ID:</strong> {emp.employeeId} &nbsp; | &nbsp;
                  <strong>Role:</strong> {emp.role}
                </ListItem>
              ))}
            </List>
          </>
        )}
      </Paper>
      <Snackbar
        open={!!successMsg}
        autoHideDuration={3000}
        onClose={() => setSuccessMsg('')}
      >
        <Alert onClose={() => setSuccessMsg('')} severity="success" sx={{ width: '100%' }}>
          {successMsg}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminDashboard;