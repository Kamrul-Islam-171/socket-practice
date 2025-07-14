import { useEffect } from "react";
import { io } from "socket.io-client";

import { Button, Container, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useMemo } from "react";
function App() {
  //connect with backend
  // bar bar render hoile bar bar connection build korto. but useMemo hook use korle connection tahkle r build korbe na
  const socket = useMemo(() => io("http://localhost:5000/", {
    withCredentials: true
  }), []);
  const [message, setMessage] = useState("");
  const [id, setId] = useState("");
  const [messages, setMessages] = useState([]);
  const [room, setRoom] = useState("");
  const [roomName, setRoomName] = useState("");

  useEffect(() => {
    // front end e connected dekhanor jonno
    // soccent connect thakle show korbe
    socket.on("connect", () => {
      console.log("connected", socket.id);
      setId(socket.id);
    });
    // socket.on('welcome', (s) => {
    //   console.log(s)
    // })

    socket.on("sent_msg", (msg) => {
      // console.log('recied_msg = ', msg)
      setMessages((prev) => [...prev, msg]);
    });
    return () => {
      // socket.disconnect();
      
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("message", { message, room });
  };
  const joinRoomHandelder = (e) => {
    e.preventDefault();
    socket.emit("roomName", roomName);
  };
  return (
    <>
      <div>
        <Container maxWidth="sm">
          <Typography variant="h1" component="div" gutterBottom>
            {" "}
            Wellcome to Socket
          </Typography>
          id = {id}

          <form onSubmit={joinRoomHandelder}>
            <TextField
              onChange={(e) => setRoomName(e.target.value)}
              value={roomName}
              id="outlined-basic"
              label="Room Name"
              variant="outlined"
            ></TextField>
            
            <Button type="submit" variant="contained" color="primary">
              Join
            </Button>
          </form>
          <form onSubmit={handleSubmit}>
            <TextField
              onChange={(e) => setRoom(e.target.value)}
              value={room}
              id="outlined-basic"
              label="Room"
              variant="outlined"
            ></TextField>
            <TextField
              onChange={(e) => setMessage(e.target.value)}
              value={message}
              id="outlined-basic"
              label="Message"
              variant="outlined"
            ></TextField>
            <Button type="submit" variant="contained" color="primary">
              Send
            </Button>
          </form>
          <p>{message}</p>
        </Container>
        <div>
            {
              messages?.map((item, idx) => (<div key={idx}>{item}</div>))
            }
          </div>
      </div>
    </>
  );
}

export default App;
