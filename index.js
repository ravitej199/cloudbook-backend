import connect from "./db.js";
import express from 'express';
import authrouter from "./routes/auth.js";
import notesrouter from "./routes/note.js";
import cors from 'cors';
connect();

const app = express();
const port = 5000;
app.use(express.json())
app.use(cors());
app.use('/api/auth',authrouter)
app.use('/api/notes',notesrouter)
// app.use('/api/notes',import('./routes/notes'))

app.listen(port, ()=>{
    console.log(`app listening at port ${port}` )
})