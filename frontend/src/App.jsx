import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignupForm from './components/SignupForm';
import LoginForm from './components/LoginForm';
import Notes from './components/Note';
import PrivateRoute from './components/PrivateRoute';
import { Box } from '@chakra-ui/react';

const App = () => {
  return (
    <Router>
      <Box p={4}>
        <Routes>
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/" element={<PrivateRoute />}>
            <Route path="/notes" element={<Notes />} />
          </Route>
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Box>
    </Router>
  );
};

export default App;