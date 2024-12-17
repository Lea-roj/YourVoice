// AddPostModal.tsx
import React, { useState, useRef, useContext, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  useToast,
  Select
} from '@chakra-ui/react';
import { UserContext } from '../userContext';
import { Post } from '../interfaces/Post';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface AddPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostAdded: () => void;
  post: Post | null;
  onSaveDraft: (draft: any) => void;
  draftPost: Post | null;
}

const AddPostModal: React.FC<AddPostModalProps> = ({
  isOpen, onClose, onPostAdded, post, onSaveDraft, draftPost,
}) => {
  const { user } = useContext(UserContext); // Get the currently logged-in user
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const toast = useToast();
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setContent(post.content);
      setCategory(post.category);
    } else {
      setTitle('');
      setContent('');
      setCategory('');
    }
  }, [post]);

  useEffect(() => {
    if (draftPost) {
      setTitle(draftPost.title || '');
      setContent(draftPost.content || '');
    }
  }, [draftPost]);

  const handleSaveDraft = () => {
    const draft = {
      title,
      content,
    };
    onSaveDraft(draft as Post);
    onClose();
  };

  const handleModalClose = () => {
    setTitle('');
    setContent('');
    setCategory('');
    onClose(); // Close the modal
  };

  const handleSubmit = () => {
    if (!user) {
      toast({ title: 'Napaka: Uporabnik ni prijavljen.', status: 'error' });
      return;
    }

    const url = post
      ? `http://localhost:3000/post/${post._id}`
      : 'http://localhost:3000/post';
    const method = post ? 'PUT' : 'POST';

    fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        content,
        category,
        userId: user._id, // Include userId
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(() => {
        toast({
          title: post
            ? 'Objava uspešno posodobljena!'
            : 'Objava uspešno dodana!',
          status: 'success',
        });
        setTitle('');
        setContent('');
        setCategory('');
        onPostAdded();
        onClose();
      })
      .catch((error) => {
        console.error('Error adding/updating post:', error);
        toast({
          title: 'Napaka pri dodajanju/posodabljanju objave.',
          status: 'error',
        });
      });
    onSaveDraft(null);
  };

  return (
      <Modal
          isOpen={isOpen}
          onClose={() => {
            onClose();
            handleSaveDraft();
          }}
          initialFocusRef={titleInputRef}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{post ? 'Uredi objavo' : 'Dodaj novo objavo'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {/* Naslov */}
            <FormControl mb={4}>
              <FormLabel>Naslov</FormLabel>
              <Input
                  ref={titleInputRef}
                  placeholder="Vnesite naslov"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
              />
            </FormControl>

            {/* Kategorija */}
            <FormControl mb={4}>
              <FormLabel>Kategorija</FormLabel>
              <Select
                  placeholder="Izberite kategorijo"
                  value={category}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setCategory(e.target.value)}
                  mb={2}
              >
                {['Splošno', 'Tehnologija', 'Izobraževanje', 'Šport', 'Zabava'].map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                ))}
              </Select>
            </FormControl>

            {/* Vsebina */}
            <FormControl mb={4}>
              <FormLabel>Vsebina</FormLabel>
              <ReactQuill
                  theme="snow"
                  value={content}
                  onChange={setContent}
                  modules={{
                    toolbar: [
                      [{ header: [1, 2, 3, false] }],
                      ['bold', 'italic', 'underline'],
                      [{ color: [] }, { background: [] }],
                      [{ list: 'ordered' }, { list: 'bullet' }],
                      [{ align: [] }],
                      ['link'],
                      ['clean'],
                    ],
                  }}
                  placeholder="Vnesite vsebino"
              />
            </FormControl>
          </ModalBody>

          {/* Footer Buttons */}
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleSubmit} mr={3}>
              {post ? 'Shrani' : 'Dodaj'}
            </Button>
            <Button colorScheme="gray" onClick={handleSaveDraft} mr={3}>
              Shrani kot osnutek
            </Button>
            <Button onClick={handleModalClose}>Prekliči</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
  );
};

export default AddPostModal;
