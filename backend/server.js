import express from 'express';
import { AccessToken } from 'livekit-server-sdk';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const createToken = async (roomName, participantName) => {
  const at = new AccessToken(process.env.LK_API_KEY, process.env.LK_API_SECRET, {
    identity: participantName,
  });
  at.addGrant({ roomJoin: true, room: roomName });
  return await at.toJwt();
};

const app = express();
app.use(cors());

app.get('/getToken', async (req, res) => {
  const { room, name } = req.query;
  
  if (!room || !name) {
    return res.status(400).send("Error: Missing room or name");
  }

  try {
    const token = await createToken(room, name);
    res.json({ token });
  } catch (e) {
    console.error("Error generating token:", e);
    res.status(500).send("Internal Server Error");
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});