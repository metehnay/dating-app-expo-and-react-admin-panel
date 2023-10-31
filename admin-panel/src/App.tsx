import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import UserCreation from "./components/CreateUser/CreateUser";
import Sidebar from './components/Sidebar/Sidebar';
import "./index.css"
import { library } from "@fortawesome/fontawesome-svg-core";
import { faCoffee, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { faCircle } from "@fortawesome/free-regular-svg-icons";
import AdminManageData from "./components/ManageData/ManageData";
import UserMessageSender from "./components/SendMessage/SendMessage";
import AdminMessageLog from "./components/Messages/Messages";
import UsersList from "./components/UserList/UserList";
import AllData from "./components/AllUsers/AllData";
import ConversationsCard from './components/Conversations/Conversations';
import Chat from './components/Conversations/Chat';
import UpdateBotUsers from "./components/TokenUpdate/TokenUpdate";
import Stats from './components/Stats/Stats';

library.add(faCoffee, faCheckCircle, faCircle);


const App: React.FC = () => {
  return (
    <Router>
      <div style={{ display: "flex" }}>
        <Sidebar />
        <Routes>
          <Route path="/createuser" element={<UserCreation />} />
          <Route path="/managedata" element={<AdminManageData />} />
          <Route path="/sendmessage" element={<UserMessageSender />} />
          <Route path="/answermessage" element={<AdminMessageLog />} />
          <Route path="/userlist" element={<UsersList />} />
          <Route path="/" element={<AllData />} />
          <Route path="/conversations" element={<ConversationsCard />} />
          <Route path="/chat/:id" element={<Chat />} />
          <Route path="/tokenupdate" element={<UpdateBotUsers />} />
          <Route path="/stats" element={<Stats />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
