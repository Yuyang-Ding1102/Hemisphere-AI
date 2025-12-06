import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import multer from "multer";
import chatMCP from "./chat-mcp.js"; // right brain：MCP
import chat from "./chat.js"; // left brain：RAG

dotenv.config();

const app = express();
app.use(cors());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });
const PORT = 5001;

let filePath;

app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }
  filePath = req.file.path;
  console.log("File uploaded:", filePath);
  res.send(filePath + " uploaded successfully");
});

app.get("/chat", async (req, res) => {
  const question = req.query.question;
  console.log("Received Question:", question);

  try {
    const [ragResp, mcpResp] = await Promise.all([
      chat(filePath, question),
      chatMCP(question)
    ]);

    res.send({
      ragAnswer: ragResp.text,
      mcpAnswer: mcpResp.text,
    });

  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).send({
      ragAnswer: "Error processing request",
      mcpAnswer: "Error processing request"
    });
  }
});

app.listen(PORT, () => {
  console.log("server is running on port " + PORT);
});