import './App.css';
import PostPage from './PostPage';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; // Import BrowserRouter instead of Router
import Home from './Home';
import NavBar from './NavBar';

function App() {
  return (
    <BrowserRouter>
      <div className='App'>
        <NavBar />
        <Routes>
        <Route path="/" element={<Home />} />
          <Route path="/add" element={<PostPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
