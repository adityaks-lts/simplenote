import React, { useState } from 'react';
import axios from 'axios';
import { Container, Box, Button, FormControl, FormLabel, Input, VStack, Heading, Alert, AlertIcon, Text } from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';

const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://simplenote-qcl4.onrender.com/login', { username, password });
            localStorage.setItem('token', response.data.token);
            setTimeout(()=>{
                navigate("/")
            },1000)
            setError('');
        } catch (error) {
            setError('Login failed. Please check your credentials.');
        }
    };

    return (
        <Container maxW="lg"  minW="100%" centerContent>
            <Box p={5} maxW="lg" borderRadius="30px" boxShadow='rgba(0, 0, 0, 0.24) 0px 3px 8px;' mx="auto">
                <Heading mb={4}>Login</Heading>
                {error && <Alert status="error"><AlertIcon />{error}</Alert>}
                {!error && <Alert status="success"><AlertIcon />Login successful!</Alert>}
                {error && <Alert status="error"><AlertIcon />{error}</Alert>}
                <VStack spacing={4} align="stretch">
                    <FormControl id="username" isRequired>
                        <FormLabel>Username</FormLabel>
                        <Input type="text" value={username}  onChange={(e) => setUsername(e.target.value)} />
                    </FormControl>
                    <FormControl id="password" isRequired>
                        <FormLabel>Password</FormLabel>
                        <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </FormControl>
                    <Text mt={4} textAlign="center" bg='white'>
                        Don't have an account?{' '}
                        <Link to="/signup">
                            <Text as="u" color="blue.500">
                                Sign Up
                            </Text>
                        </Link>
                    </Text>
                    <Button colorScheme="blue" onClick={handleSubmit}>Login</Button>
                </VStack>
            </Box>
        </Container>
    );
};

export default LoginForm;
