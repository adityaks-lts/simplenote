import React from 'react';
import { Box, Button, List, ListItem, Heading } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const NoteList = ({ notes, setSelectedNote, createNewNote }) => {
  const navigate = useNavigate()
    const handleSelectNote = (note) => {
    setSelectedNote(note);
  };

  const handleLogout = () =>{
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <Box w="100%" p={5} borderRightWidth="1px">
        <Button onClick={handleLogout}>Logout</Button>
      <Heading mb={4}>My Notes</Heading>
      <Button colorScheme="blue" mb={4} onClick={createNewNote}>
        Create New Note
      </Button>
      <List spacing={3}>
        {notes.map((note) => (
          <ListItem
            key={note._id}
            p={3}
            maxW="300px"
            overflow="hidden"
            borderWidth="1px"
            borderRadius="md"
            onClick={() => handleSelectNote(note)}
            cursor="pointer"
            _hover={{ bg: 'gray.100' }}
          >
            <Heading size="md">{note.title}</Heading>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default NoteList;
