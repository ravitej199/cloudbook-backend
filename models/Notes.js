import mongoose from "mongoose";
const {Schema } = mongoose;

const notesSchema = new Schema({

    user:{

        type: mongoose.Schema.Types.ObjectId,
        ref : 'User' ,
        required: true
    },

    title : {type : String, required: true},
    description : {type: String, required: true},
    tag : {type: [String]},
    createdAt: {type: Date, default: Date.now}
})

const Note = mongoose.model('note',notesSchema);

export default Note;