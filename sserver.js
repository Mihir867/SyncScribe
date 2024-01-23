import mongoose from "mongoose";
import Document from "./sdatabase.js";
import http from "http";
import { Server } from "socket.io";

mongoose.connect("mongodb://localhost:27017/Meet", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Create an HTTP server
const server = http.createServer();

// Pass the server to the socket.io Server constructor
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const defaultValue = "";

io.on("connection", (socket) => {
  socket.on("get-document", async (documentId) => {
    const document = await findOrCreateDocument(documentId);
    socket.join(documentId);
    socket.emit("load-document", document.data);

    socket.on("send-changes", (delta) => {
      socket.broadcast.to(documentId).emit("receive-changes", delta);
    });

    socket.on("save-document", async (data) => {
      await Document.findByIdAndUpdate(documentId, { data });
    });
  });
});

const findOrCreateDocument = async (id) => {
  if (id == null) return;

  const document = await Document.findById(id);
  if (document) return document;
  return await Document.create({ _id: id, data: defaultValue });
};

// Listen on the specified port
server.listen(3001, () => {
  console.log("Server running on http://localhost:3001");
});
