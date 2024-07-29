import React, { useEffect, useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input, Textarea, VStack, Heading, Checkbox, HStack } from '@chakra-ui/react';
import axios from 'axios';

const NoteDetails = ({ note, setNote, refreshNotes }) => {
  const [title, setTitle] = useState(note ? note.title : '');
  const [description, setDescription] = useState(note ? note.description : '');
  const [tasks, setTasks] = useState(note ? { complete: note.tasks.complete, pending: note.tasks.pending } : { complete: [], pending: [] });
  const [newTask, setNewTask] = useState('');
  const [isNewNote, setIsNewNote] = useState(!note);
    // console.log(note, tasks);
    
  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setDescription(note.description);
      setTasks({ complete: note.tasks.complete || [], pending: note.tasks.pending || [] });
      setIsNewNote(false);
    } else {
      setTitle('');
      setDescription('');
      setTasks({ complete: [], pending: [] });
      setIsNewNote(true);
    }
  }, [note]);

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    try {
      if (isNewNote) {
        await axios.post(
          'https://simplenote-qcl4.onrender.com/notes',
          { title, description, tasks},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          `https://simplenote-qcl4.onrender.com/notes/${note._id}`,
          { title, description, tasks},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      setNote(null);
      refreshNotes();
    } catch (error) {
      console.error('Error saving the note:', error);
    }
  };

  const handleAddTask = () => {
    setTasks({ ...tasks, pending: [...tasks.pending, newTask] });
    setNewTask('');
  };

  const handleToggleTask = (task, index, type) => {
    if (type === 'pending') {
      const updatedPending = tasks.pending.filter((_, i) => i !== index);
      const updatedComplete = [...tasks.complete, task];
      setTasks({ complete: updatedComplete, pending: updatedPending });
    } else {
      const updatedComplete = tasks.complete.filter((_, i) => i !== index);
      const updatedPending = [...tasks.pending, task];
      setTasks({ complete: updatedComplete, pending: updatedPending });
    }
  };

  return (
    <Box p={5}>
      <Heading mb={4}>{isNewNote ? 'Create Note' : 'Edit Note'}</Heading>
      <VStack spacing={4} align="stretch">
        <FormControl id="title" isRequired>
          <FormLabel>Title</FormLabel>
          <Input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
        </FormControl>
        <FormControl id="description" isRequired>
          <FormLabel>Description</FormLabel>
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        </FormControl>
        <FormControl id="tasks">
          <FormLabel>Tasks</FormLabel>
          <VStack spacing={2} align="stretch">
            {tasks.pending.map((task, index) => (
              <HStack key={index} spacing={4}>
                <Checkbox
                  isChecked={false}
                  onChange={() => handleToggleTask(task, index, 'pending')}
                  colorScheme="blue"
                >
                  {task}
                </Checkbox>
              </HStack>
            ))}
            {tasks.complete.map((task, index) => (
              <HStack key={index} spacing={4}>
                <Checkbox
                  isChecked={true}
                  onChange={() => handleToggleTask(task, index, 'complete')}
                  isDisabled={false}
                  colorScheme="gray"
                >
                  {task}
                </Checkbox>
              </HStack>
            ))}
            <HStack spacing={2}>
              <Input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="New Task"
              />
              <Button onClick={handleAddTask}>Add Task</Button>
            </HStack>
          </VStack>
        </FormControl>
        <Button colorScheme="blue" onClick={handleSave}>
          Save
        </Button>
      </VStack>
    </Box>
  );
};

export default NoteDetails;
