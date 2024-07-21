import express from 'express';
import Note from '../models/Notes.js';
import { body, validationResult } from 'express-validator';
import { fetchUserData } from '../Middleware/fetchuser.js';

const notesrouter = express.Router();


notesrouter.get('/fetchallnotes',fetchUserData,async (req,res)=>{

    try {
     
        console.log(req.data.id);
        const note = await Note.find({ user: req.data.id});
        console.log(note);
        res.send(note);
        
    } catch (error) {
        console.log(error);
        res.status(500).json({message : "Internal Server Error"});
        
    }

} )


const validatenote = [
    body('title').isLength({ min: 3 }).withMessage('title must be at least 3 characters long'),
    body('description').isLength({ min: 5 }).withMessage('description must be at least 5 characters long')
  ];

notesrouter.post('/addnote',validatenote,fetchUserData,async(req,res)=>{

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        res.status(500).send(errors.array())
    }

    try {

        const {title, description, tag} = req.body;
        const note = new Note({
            title, description, tag , user: req.data.id
        })

       const savedNote = await note.save();
        

       res.status(200).send(savedNote);

    } catch (error) {
        console.log(error);
        res.status(500).json({message : "Internal Server Error"});
    }

})



notesrouter.put('/updatenote/:id',validatenote,fetchUserData, async (req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        res.status(401).send(errors.array());
    }
    try{
        const {title,description, tag} = req.body;
        const id = req.params.id;
        const updatedNote = {};
        if(title)  {updatedNote.title = title};
        if(description) {updatedNote.description = description};
        if(tag) {updatedNote.tag = tag};

        const note = await Note.findOne({_id : id});
        if(!note) res.status(404).send("Not found");

            console.log(note);
        if(note.user.toString() !== req.data.id){
            res.send(401).send("Unauthorized access");
        }

        const updated = await Note.findByIdAndUpdate(id,updatedNote,{new:true});
        res.send(updated);


    }catch (error) {
        console.log(error);
        res.status(500).json({message : "Internal Server Error"});
    }
})


notesrouter.delete('/deletenote/:id',fetchUserData, async (req,res)=>{

    try{
        const id = req.params.id;
        console.log(id);

        const note = await Note.findOne({_id : id});
        if(!note) res.status(404).send("Not found");
        if(note.user.toString() !== req.data.id){
            res.send(401).send("Unauthorized access");
        }

        const updated = await Note.findByIdAndDelete(id);
        if(updated) res.status(200).send("Note Deleted Successfully");


    }catch (error) {
        console.log(error);
        res.status(500).json({message : "Internal Server Error"});
    }
})

export default notesrouter;
