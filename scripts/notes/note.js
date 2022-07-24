export default class Note {
    id;
    title;
    idEmotion;
    text;
    quotes;
    idNotebook;
    isMain; // The id of the note that this note supports, if supporting
    dateCreated;

    constructor (id, title, idEmotion, text, quotes, idNotebook, isMain, dateCreated) {
        this.id = id;
        this.setTitle(title);
        this.idEmotion = idEmotion;
        this.setText(text);
        this.setQuotes(quotes);
        this.setIdNotebook(idNotebook);
        this.setMain(isMain);
        this.setDateCreated(dateCreated);
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
    setMain(main) {
        this.isMain = main;
    }
    setDateCreated(date) {
        this.dateCreated = new Date(date);
    }

    setEditables (title, text, quotes) {
        this.setTitle(title);
        this.setText(text);
        this.setQuotes(quotes);
    }
}