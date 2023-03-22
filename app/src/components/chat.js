import "./chat.css";
import { MdSend } from "react-icons/md";
import { useState } from "react";
import { Button } from "@mui/material";
import uniqid from "uniqid";
import Message from "./message";
import { Menu, MenuItem } from "@mui/material";

import Api from "../lib/api";

const Chat = ({ messages, setMessages }) => {
  const [currentMessage, setCurrentMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [waitingNewMessage, setWaitingNewMessage] = useState(false);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      sendMessage();
      e.target.value = "";
    }
  };

  async function sendMessage() {
    setCurrentMessage("");
    setWaitingNewMessage(true);
    const message_id = uniqid();
    let newMessages = [
      ...messages,
      { id: message_id, role: "user", content: currentMessage },
    ];

    setMessages(newMessages);

    await Api.sendMessage(newMessages).then((message) => {
      newMessages = [
        ...newMessages,
        { id: uniqid(), role: "assistant", content: message },
      ];
      setMessages(newMessages);
      setWaitingNewMessage(false);
    });
  }

  async function handleFileUpload(e) {
    const formData = new FormData();
    formData.append("video", e.target.files[0]);

    setLoading(true);
    await Api.transcribeVideo(formData).then((message) => {
      setMessages([
        ...messages,
        { id: uniqid(), role: "user", content: message },
      ]);
      setCurrentMessage(
        "Crie uma aula baseada na transcrição enviada e retorne em formato de markdown!"
      );
    });

    setLoading(false);
  }

  return (
    <section className="chatbox">
      <div className="chatbox__messages">
        {messages.map((message, index) => {
          return (
            <Message key={index} message={message} setMessages={setMessages} />
          );
        })}
      </div>
      <div className="chatbox__inputHolder">
        <input
          type="text"
          className="chatbox__input"
          placeholder="Type a message"
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={waitingNewMessage}
        />
        <MdSend className="chatbox__sendIcon" onClick={sendMessage} />
      </div>

      <Button
        id="chat-menu"
        aria-controls="basic-menu"
        aria-haspopup="true"
        aria-expanded={anchorEl ? "true" : undefined}
        onClick={(e) => setAnchorEl(e.currentTarget)}
      >
        ...
      </Button>

      <Menu
        id="chat-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem>
          <Button
            variant="contained"
            component="label"
            disabled={loading ? "true" : false}
          >
            {loading ? "Transcrevendo..." : "Carregar Aula"}
            <input type="file" hidden onChange={handleFileUpload} />
          </Button>
        </MenuItem>
      </Menu>
    </section>
  );
};

export default Chat;
