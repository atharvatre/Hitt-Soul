import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./App.css";
import UserForm from "./Components/UserForm";
import ChatBot from "./Components/ChatBot";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<UserForm/>}/>
          <Route path="/chatbot" element={<ChatBot/>}/>

        
        </Routes>
      </Router>
    </>
  );
}

export default App;
