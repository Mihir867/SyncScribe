import React, { useCallback, useEffect, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import "./style.css";
import { useNavigate, useParams } from "react-router-dom";
  import { v4 as uuidv4 } from "uuid";
import { FaClipboard } from "react-icons/fa";
import io from "socket.io-client";


const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: [] }],
  [{ size: [] }], // Font size
  ["bold", "italic", "underline", "strike"], // Strikethrough
  [{ color: [] }, { background: [] }],
  [{ script: "sub" }, { script: "super" }],
  [{ align: [] }],
  [{ list: "ordered" }, { list: "bullet" }],
  ["blockquote", "code-block"],
  ["link", "image", "video"], // Insert links, images, and videos
  [{ indent: "-1" }, { indent: "+1" }], // Increase/decrease indentation
  ["clean"],
];

const SAVE_INTERVAL_MS = 2000
const Editer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [documentId, setDocumentId] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [socket, setSocket] = useState();
  const [quill, setQuill] = useState(null);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(documentId);
    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, 1500);
  };

  useEffect(()=>{
    const s = io("http://localhost:3001");
    setSocket(s);

    return ()=>{
      s.disconnect();
    }
  },[])


  useEffect(() => {
    if (socket == null || quill == null) return

    socket.once("load-document", document => {
      quill.setContents(document, 'api')
      quill.enable()
    })

    socket.emit("get-document", documentId)
  }, [socket, quill, documentId])

  useEffect(() => {
    if (socket == null || quill == null) return

    const interval = setInterval(() => {
      socket.emit("save-document", quill.getContents())
    }, SAVE_INTERVAL_MS)

    return () => {
      clearInterval(interval)
    }
  }, [socket, quill])


  useEffect(() => {
    if (socket == null || quill == null) return

    const handler = (delta) => {
      quill.updateContents(delta)
    }
    socket.on("receive-changes", handler)

    return () => {
      socket.off("receive-changes", handler)
    }
  }, [socket, quill])

  useEffect(() => {
    if (socket == null || quill == null) return

    const handler = (delta, oldDelta, source) => {
      if (source !== "user") return
      socket.emit("send-changes", delta)
    }
    quill.on("text-change", handler)

    return () => {
      quill.off("text-change", handler)
    }
  }, [socket, quill])

  const wrapperRef = useCallback((wrapper) => {
    if (wrapper == null || !socket || quill) return;
  
    wrapper.innerHTML = "";
    const editor = document.createElement("div");
    wrapper.append(editor);
    const q = new Quill(editor, { theme: "snow", modules: { toolbar: TOOLBAR_OPTIONS } });
    setQuill(q);
  }, [socket, quill]);
  

  

  useEffect(() => {
    if (socket && !documentId) {
      if (id) {
        setDocumentId(id);
      } else {
        const newId = uuidv4();
        navigate(`/editor/${newId}`);
      }
    }
  }, [id, navigate, socket]);

  

  return (
    <>
      <div style={{ textAlign: "center", padding: "10px", backgroundColor: "#f2f2f2", marginBottom: "0px" }}>
        <p>
          Document ID: {documentId}
          <FaClipboard style={{ marginLeft: "5px", marginBottom: "5px", cursor: "pointer" }} onClick={copyToClipboard} />
        </p>
        {isCopied && <p style={{ color: "green" }}>Copied successfully!</p>}
      </div>
      <div className="container" ref={wrapperRef}></div>
    </>
  );
};

export default Editer;