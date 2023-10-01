import React, { useEffect, useState } from 'react';
import { db } from './firebase';
import { Button, ButtonGroup, Card, Grid, Container, Image, Modal, Header } from 'semantic-ui-react';
import { useNavigate } from 'react-router-dom';
import { collection, deleteDoc, onSnapshot, doc } from 'firebase/firestore';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    const unsub = onSnapshot(collection(db, 'posts'), (snapshot) => {
      let list = [];
      snapshot.docs.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
      });
      setPosts(list);
      setLoading(false);
    }, (error) => {
      console.log(error);
    });

    return () => {
      unsub();
    };
  }, []);

  const handleModal = (item) => {
    setSelectedPost(item);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete?')) {
      try {
        setOpen(false);
        await deleteDoc(doc(db, 'posts', id));
        setPosts(posts.filter((post) => post.id !== id));
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <Container>
      <Grid columns={3} stackable>
        {posts &&
          posts.map((item) => (
            <Grid.Column key={item.id}>
              <Card>
                <Card.Content>
                  
                  <Card.Header style={{ marginTop: '10px' }}>{item.title}</Card.Header>
                  <Card.Description>{item.tags}</Card.Description>
                </Card.Content>
                <Card.Content extra>
                  <div>
                    <ButtonGroup>
                      <Button color="green" onClick={() => navigate(`/update/${item.id}`, { user: item })}>
                        Update
                      </Button>
                      <Button color="purple" onClick={() => handleModal(item)}>
                        View
                      </Button>
                    </ButtonGroup>
                    <Modal onClose={() => setOpen(false)} open={open}>
                      <Modal.Header>User Details</Modal.Header>
                      <Modal.Content image>
                        <Image size="medium" src={selectedPost.img} wrapped />
                        <Modal.Description>
                          <Header>{selectedPost.title}</Header>
                          <p>{selectedPost.tags}</p>
                        </Modal.Description>
                      </Modal.Content>
                      <Modal.Actions>
                        <Button color="black" onClick={() => setOpen(false)}>
                          Cancel
                        </Button>
                        <Button
                          color="red"
                          content="Delete"
                          labelPosition="right"
                          icon="checkmark"
                          onClick={() => handleDelete(selectedPost.id)}
                        />
                      </Modal.Actions>
                    </Modal>
                  </div>
                </Card.Content>
              </Card>
            </Grid.Column>
          ))}
      </Grid>
    </Container>
  );
};

export default Home;
