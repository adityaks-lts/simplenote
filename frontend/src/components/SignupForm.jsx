import React, { useState } from 'react';
import axios from 'axios';
import { Container, Box, Button, FormControl, FormLabel, Input, VStack, Heading, Alert, AlertIcon, Text } from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';

const SignupForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('https://simplenote-qcl4.onrender.com/signup', { username, password, email });
            setSuccess('Signup successful!');
            setTimeout(()=>{
                navigate("/login")
            },1000)
            setError('');
        } catch (error) {
            setError('Signup failed. Please try again.');
            setSuccess('');
        }
    };

    return (
        <Container maxW="xl" centerContent>
            <Box p={5} maxW="xl" borderRadius="30px" boxShadow='rgba(0, 0, 0, 0.24) 0px 3px 8px;' mx="auto">
                <Heading mb={4}>Sign Up</Heading>
                {error && <Alert status="error"><AlertIcon />{error}</Alert>}
                {success && <Alert status="success"><AlertIcon />{success}</Alert>}
                <VStack spacing={4} align="stretch">
                    <FormControl id="username" isRequired>
                        <FormLabel>Username</FormLabel>
                        <Input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                    </FormControl>
                    <FormControl id="password" isRequired>
                        <FormLabel>Password</FormLabel>
                        <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </FormControl>
                    <FormControl id="email" isRequired>
                        <FormLabel>Email</FormLabel>
                        <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </FormControl>
                    <Text mt={4} textAlign="center" bg='white'>
                        Already registered ? try{' '}
                        <Link to="/login">
                            <Text as="u" color="blue.500">
                                Login
                            </Text>
                        </Link>
                    </Text>
                    <Button colorScheme="blue" onClick={handleSubmit}>Sign Up</Button>
                </VStack>
            </Box>
        </Container>
    );
};

export default SignupForm;
