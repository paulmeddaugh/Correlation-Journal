import { checkIfNoteProps } from "../utility/errorHandling.js";

export default class Note {
    id = null;
    title = "";
    idEmotion = null;
    text = "";
    quotes = "";
    idNotebook = null;
    isMain = null;
    dateCreated = null;

    constructor (id, title, idEmotion, text, quotes, idNotebook, isMain, dateCreated) {

         // Clones a note object
        if (arguments.length == 1 && id && checkIfNoteProps({ id })) {
            let cloneNote = new Note();
            for (let prop in id) {
                cloneNote[prop] = id[prop];
            }
            return cloneNote;
        }

        this.id = id;
        this.setEditables(idNotebook, idEmotion, title, text, quotes, isMain);
        this.setDateCreated(dateCreated);
    }

    setTitle(title) {
        this.title = title;
    }
    setIdEmotion(idEmotion) {
        this.idEmotion = idEmotion;
    }
    setText(text) {
        this.text = text;
    }
    setQuotes(quotes) {
        this.quotes = quotes;
    }
    setIdNotebook(idNotebook) {
        this.idNotebook = idNotebook;
    }
    setMain(main) {
        this.isMain = main;
    }
    setDateCreated(date) {
        this.dateCreated = new Date(date);
    }

    setEditables (idNotebook, idEmotion, title, text, quotes, isMain) {
        this.setIdNotebook(idNotebook);
        this.setIdEmotion(idEmotion);
        this.setTitle(title);
        this.setText(text);
        this.setQuotes(quotes);
        this.setMain(isMain);
    }
}