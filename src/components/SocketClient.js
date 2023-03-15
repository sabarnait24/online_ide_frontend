// import { Avatar } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { io } from "socket.io-client";
import AvatarUser from "./AvatarUser";

const socket = io("https://mern-online-ide.vercel.app/");

function SocketClient(props) {
  async function copyRoomId() {
    try {
      await navigator.clipboard.writeText(props.roomID);
      toast.success("Room ID Copied");
    } catch (err) {
      toast.error("Could not copy the Room ID");
      console.error(err);
    }
  }
  const [client, setClient] = useState([]);
  const navigate = useNavigate();
  function leaveRoom() {
    navigate("/");
  }

  useEffect(() => {
    socket.on("connection_error", (err) => handleErrors(err));
    socket.on("connection_failed", (err) => handleErrors(err));

    function handleErrors(e) {
      console.log("socket error", e);
      toast.error("Socket connection failed, try again later.");
      navigate("/");
    }

    socket.emit("join", {
      roomID: props.roomID,
      username: props.username,
    });

    socket.on("NewUserJoin", ({ Client, username, socketId }) => {
      if (username !== props.username) {
        toast.success(`${username} joined the room.`, {
          toastId: socketId,
        });
      }
      setClient(Client);
    });
    socket.on("UserDisconnected", ({ socketId, username }) => {
      if(username){
      toast.info(`${username} left the room.`, {
        toastId: socketId,
      });
    }
      setClient((data) => {
        return data.filter((client) => client.socketId !== socketId);
      });
    });
   
    // const editorRef=props.editorRef;
    

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div className="flex justify-end">
        <ToastContainer />
      </div>
      <div className="my-20">
        <h4 className="flex justify-center text-black font-black my-6">
          {" "}
          Connected Members
        </h4>
        {client?.map((element) => (
          <AvatarUser username={element.username} />
        ))}
      </div>
      <div className="flex justify-center items-center my-2">
        <button className="btn btn-outline btn-primary " onClick={copyRoomId}>
          Copy ROOM ID
        </button>
      </div>
      <div className="flex justify-center items-center my-2">
        <button className="btn btn-outline btn-error " onClick={leaveRoom}>
          Leave The Room
        </button>
      </div>
      s
    </div>
  );
}

export default SocketClient;
