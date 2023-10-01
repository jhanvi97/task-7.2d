import React, { useEffect, useState } from 'react';
import './PostPage.css';
import { storage, db } from './firebase';
import { uploadBytesResumable, ref, getDownloadURL } from 'firebase/storage';
import { addDoc, collection, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { useNavigate, useParams } from 'react-router-dom';

const initialState = {
  postType: 'question',
  title: '',
  content: '',
  tags: '',
  abstract: '',
  errorMessage: '',
  image: null,
  imgURL: '',
};

const PostPage = () => {
  const [formData, setFormData] = useState(initialState);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    id && getSingleUser(); // Check if id exists before calling getSingleUser
  }, [id]);

  const getSingleUser = async () => {
    const docRef = doc(db, 'users', id);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      setFormData({ ...snapshot.data() });
    }
  };

  


  const handlePostTypeChange = (event) => {
    setFormData({ ...formData, postType: event.target.value });
  };

  const handleInputChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleImageChange = (event) => {
    const selectedImage = event.target.files[0];
    setFormData({ ...formData, image: selectedImage });
  };

  const handleImageUpload = () => {
    if (formData.image) {
      const name = new Date().getTime() + formData.image.name;
      const storageRef = ref(storage, name);
      const uploadTask = uploadBytesResumable(storageRef, formData.image);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Handle upload progress if needed
        },
        (error) => {
          console.error('Error uploading image:', error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref)
            .then((downloadURL) => {
              setFormData({ ...formData, imgURL: downloadURL });
            })
            .catch((error) => {
              console.error('Error getting image URL:', error);
            });
        }
      );
    } else {
      console.log('No image selected for upload.');
    }
  };

  const handleSubmit = async () => {
    // Check for required fields and display an error message if any field is empty
    const { title, content, postType, tags, abstract, imgURL } = formData;
    if (!title || !content || (postType === 'question' && !tags) || (postType === 'article' && !abstract)) {
      setFormData({ ...formData, errorMessage: 'Please fill in all the required fields.' });
      return;
    }

    try {
      const postDocRef = await addDoc(collection(db, 'posts'), {
        postType,
        title,
        content,
        tags,
        abstract,
        imgURL,
        timestamp: serverTimestamp(),
      });

      console.log('Post added with ID: ', postDocRef.id);
      alert('Thank you for your response');
      setFormData(initialState);
      navigate('/');
    } catch (error) {
      console.error('Error adding post: ', error);
    }
  };

  const getDescriptionText = () => {
    return formData.postType === 'question'
      ? 'For posting a question, the following section will appear.'
      : 'For posting an article, the following section will appear.';
  };

  return (
    <div>
      <h3 className="style">New Post</h3>
      <div className="line">
        <label>
          <b>Select Post Type:</b>
        </label>
        <div className="space">
          <label>
            <input
              type="radio"
              value="question"
              checked={formData.postType === 'question'}
              onChange={handlePostTypeChange}
            />
            Question
          </label>
          <label className="space1">
            <input
              type="radio"
              value="article"
              checked={formData.postType === 'article'}
              onChange={handlePostTypeChange}
            />
            Article
          </label>
        </div>
      </div>
      <h3 className="style">What do you want to ask or share</h3>
      <p>
        <b>
          This section is designed based on the type of the post. It could be developed by conditional rendering.{' '}
          <span style={{ color: 'red' }}>{getDescriptionText()}</span>
        </b>
      </p>
      <div className="between">
        <label>
          <b>Title:</b>
        </label>
        <input
          className="title"
          type="text"
          name="title"
          value={formData.title}
          placeholder={
            formData.postType === 'question'
              ? 'Start your question with how, what, why, etc.'
              : 'Enter a descriptive title'
          }
          onChange={handleInputChange}
        />
        {formData.postType === 'article' && (
          <>
            <label>
              <b>Image:</b>
            </label>
            <div>
              <input type="file" accept="image/*" onChange={handleImageChange} />
            </div>
            <div>
              <button className="button" onClick={handleImageUpload}>
                Upload
              </button>
              <button className="button">Browse</button>
            </div>
          </>
        )}
      </div>
      {formData.postType === 'question' && (
        <div>
          <div className="between">
            <label className="bottom">
              <b>Describe Your Problem:</b>
            </label>
            <label className="bottom">
              <textarea
                className="content"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
              />
            </label>
          </div>
          <div className="between">
            <label>
              <b>Tags:</b>
            </label>
            <input
              className="bottom1"
              type="text"
              name="tags"
              value={formData.tags}
              placeholder="Please add up to 3 tags to describe what your question is about e.g., Java"
              onChange={handleInputChange}
            />
          </div>
        </div>
      )}
      {formData.postType === 'article' && (
        <div className="between">
          <label>
            <b>Abstract:</b>
          </label>
          <label>
            <textarea
              className="content"
              name="abstract"
              value={formData.abstract}
              placeholder="Enter a 1-paragraph abstract"
              onChange={handleInputChange}
            />
          </label>
          <div className="between">
            <label>
              <b>Article Text:</b>
            </label>
            <textarea
              className="bottom1"
              name="content"
              value={formData.content}
              placeholder="Enter the article text"
              onChange={handleInputChange}
            />
          </div>
        </div>
      )}
      {formData.errorMessage && <p style={{ color: 'red' }}>{formData.errorMessage}</p>}
      <div className="button-container">
        <button className="button" onClick={handleSubmit}>
          Post
        </button>
      </div>
    </div>
  );
};

export default PostPage;
