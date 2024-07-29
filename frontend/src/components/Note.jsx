import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Flex, Spinner, Alert, AlertIcon } from '@chakra-ui/react';
import NoteList from '../components/NoteList';
import NoteDetails from '../components/NoteDetails';
import { useNavigate } from 'react-router-dom';

const Notes = () => {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedNote, setSelectedNote] = useState(null);
    const navigate = useNavigate();
    const fetchNotes = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('https://simplenote-qcl4.onrender.com/notes', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setNotes(response.data);
            setError('');
        } catch (err) {
            setError('Failed to fetch notes.');

        } finally {
            setLoading(false);
        }
    };

    console.log("hello");
    useEffect(() => {
        fetchNotes();
    }, []);

    const createNewNote = () => {
        setSelectedNote(null);
    };

    if (loading) return <Spinner size="xl" />;
    if (error) {
        localStorage.removeItem("token");
        setTimeout(() => { navigate("/login")}, 1000)
        return <Alert status="error"><AlertIcon />{error}</Alert>;
    }

    return (
        <Flex>
            <Box flex="1" >
                <NoteList notes={notes} setSelectedNote={setSelectedNote} createNewNote={createNewNote} />
            </Box>
            <Box flex="3" p={5}>
                {selectedNote ? (
                    <NoteDetails note={selectedNote} setNote={setSelectedNote} refreshNotes={fetchNotes} />
                ) : (
                    <NoteDetails note={null} setNote={setSelectedNote} refreshNotes={fetchNotes} />
                )}
            </Box>
        </Flex>
    );
};

export default Notes;
