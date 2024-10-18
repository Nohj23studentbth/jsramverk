import { io } from "socket.io-client";
import { useEffect, useState } from "react";

const SERVER_URL = "http://localhost:8337"; // Adjust to your backend's URL

function App() {
  const [socket, setSocket] = useState(null);
  const [documentContent, setDocumentContent] = useState(""); // State to hold document content

  useEffect(() => {
    // Initialize Socket.IO connection
    const newSocket = io(SERVER_URL);
    setSocket(newSocket);

    // Listen for updates from the server
    newSocket.on("document-update", (updatedContent) => {
      setDocumentContent(updatedContent); // Update document content in real-time
    });

    // Cleanup the socket connection when the component is unmounted
    return () => {
      newSocket.disconnect();
    };
  }, []);

  const handleEdit = (newContent) => {
    setDocumentContent(newContent);
    socket.emit("edit-document", newContent); // Send the updated content to the server
  };

  return (
    <div>
      <textarea
        value={documentContent}
        onChange={(e) => handleEdit(e.target.value)} // Handle document editing
      />
    </div>
  );
}

export default App;