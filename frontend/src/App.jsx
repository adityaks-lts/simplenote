import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignupForm from './components/SignupForm';
import LoginForm from './components/LoginForm';
import Notes from './components/Note';
import PrivateRoute from './components/PrivateRoute';
import { Box, Heading } from '@chakra-ui/react';

const App = () => {
  return (
    <Router>
        <header style={{background:"#142d4c"}}>
          <Heading py="15px" textAlign="center" color="white" >My Simple Note</Heading>    
        </header>
      <Box p={4}>
        <Routes>
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/" element={<PrivateRoute><Notes /></PrivateRoute>}/>
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Box>
    </Router>
  );
};

export default App;