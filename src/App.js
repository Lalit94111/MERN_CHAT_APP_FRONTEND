import logo from './logo.svg';
import './App.css';
import Navigation from './components/Navigation';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.js';
import Login from './pages/Login.js';
import Signup from './pages/Signup.js';
import Chat from './pages/Chat.js';
import ChangeProfilePicture from './pages/ChangeProfilePicture';
import { useSelector } from 'react-redux';
import { AppContext, socket } from "./context/appContext.js";
import { useState } from 'react';


function App() {
  const [rooms, setRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState([]);
  const [members, setMembers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [privateMemberMsg, setPrivateMemberMsg] = useState({});
  const [newMessages, setNewMessages] = useState({});

  const user = useSelector((state) => state.user);
  return (
    <AppContext.Provider value={{
      socket, currentRoom,
      setCurrentRoom, members, setMembers, messages,
      setMessages, privateMemberMsg, setPrivateMemberMsg,
      rooms, setRooms, newMessages, setNewMessages
    }}>
      <BrowserRouter>
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          {!user && (
            <>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </>
          )}
          <Route path="/change" element={<ChangeProfilePicture />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </BrowserRouter>
    </AppContext.Provider>
  );
}

export default App;
