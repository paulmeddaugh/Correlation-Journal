export default class Note {
    id;
    title;
    idEmotion;
    text;
    quotes;
    idNotebook;
    idMain; // The id of the note that this note supports, if supporting
    date;

    constructor (id, title, idEmotion, text, quotes, idNotebook, idMain, date) {
        this.id = id;
        this.setTitle(title);
        this.idEmotion = idEmotion;
        this.setText(text);
        this.setQuotes(quotes);
        this.setIdNotebook(idNotebook);
        this.setIdMain(idMain);
        this.setDate(date);
    }

    setTitle(title) {
        this.title = title;
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
    setIdMain(idMain) {
        this.idMain = idMain;
    }
    setDate(date) {
        this.date = date;
    }

    setEditables (title, text, quotes) {
        this.setTitle(title);
        this.setText(text);
        this.setQuotes(quotes);
    }
}