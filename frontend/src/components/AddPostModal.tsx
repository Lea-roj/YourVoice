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
  useToast,
  Select,
  useColorModeValue,
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
                                                     isOpen,
                                                     onClose,
                                                     onPostAdded,
                                                     post,
                                                     onSaveDraft,
                                                     draftPost,
                                                   }) => {
  const { user } = useContext(UserContext); // Get the currently logged-in user
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const toast = useToast();
  const titleInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null); // Poskrbi, da `file` sprejema `File | null`

  // Theme-aware colors
  const modalBg = useColorModeValue('white', 'gray.800');
  const modalText = useColorModeValue('gray.800', 'gray.200');
  const inputBg = useColorModeValue('gray.100', 'gray.700');
  const inputText = useColorModeValue('gray.800', 'gray.200');

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
    setFile(null);
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
    const formData = new FormData();
formData.append("title", title);
formData.append("content", content);
formData.append("category", category);
formData.append("userId", user._id);
if (file) {
  formData.append("image", file); // Dodamo datoteko
}
    fetch(url, {
      method: method,
      body: formData,
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
          setFile(null);
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
        <ModalContent bg={modalBg} color={modalText}>
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
                  bg={inputBg}
                  color={inputText}
              />
            </FormControl>

            {/* Kategorija */}
            <FormControl mb={4}>
              <FormLabel>Kategorija</FormLabel>
              <Select
                  placeholder="Izberite kategorijo"
                  value={category}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                      setCategory(e.target.value)
                  }
                  mb={2}
                  bg={inputBg}
                  color={inputText}
              >
                {['Splošno', 'Tehnologija', 'Izobraževanje', 'Šport', 'Zabava'].map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                ))}
              </Select>
            </FormControl>

            <FormControl mb={4}>
  <FormLabel htmlFor="file">Izberi sliko</FormLabel>
  <Input 
    type="file" 
    className="form-control" 
    id="file" 
    accept="image/*" // Dovoli samo slike
    onChange={(e) => {
      const selectedFile = e.target.files?.[0];
      if (selectedFile) {
        setFile(selectedFile);
      }
    }} 
  />
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
                  className="react-quill"
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
