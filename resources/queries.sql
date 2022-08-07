-- INSERT INTO User (email, name, username, pwd, reminder)
-- 	VALUES ("paul.meddaugh@gmail.com", "Paul", "Batblast", "theBat42", "I'm Batman");

INSERT INTO User (email, name, username, pwd, reminder)
	VALUES ("joker@gmail.com", "Joker", "theJoker", "Hahahaha", "Want to see a magic trick?");

INSERT INTO User (email, name, username, pwd, reminder)
	VALUES ("paul.meddaugh@gmail.com", "Paul", "AtLongLast", "Thoughts", "Posted on Twitter");

INSERT INTO Notebooks (idUser, name)
	VALUES (1, "The first");

INSERT INTO Notes (title, idEmotion, text, quotes, idNotebook, idUser, isMain)
	VALUES ("You\'re cruel, you know", null, "to come here and speak of dreams. Yet here you are, watering my withered heart with your smile.", "- Your Lie In April", 1, 1, true);

-- Gets all notes and supporting note ids of certain user
SELECT idNote, title, idEmotion, date, text, quotes, n.idNotebook, s.idMain FROM Notes n 
    INNER JOIN User u ON u.idUser = n.idUser 
    LEFT OUTER JOIN SupportingNotes s ON n.idNote = s.idSupporting 
    WHERE n.idUser = '$idUser' order by idSupporting;

-- Gets all notes and supporting note id's of a certain notebook
SELECT idNote, title, idEmotion, date, text, quotes, n.idNotebook, s.idMain FROM Notes n 
    INNER JOIN User u ON u.idUser = n.idUser 
    LEFT OUTER JOIN SupportingNotes s ON n.idNote = s.idSupporting 
    WHERE n.idNotebook = '$idNotebook' order by idSupporting;

-- Gets columns for the notes, supporting notes id's, and notebook name of a certain idNote and idNotebook
SELECT * FROM Notes n 
    INNER JOIN Notebooks nb ON n.idNotebook = nb.idNotebook 
    INNER JOIN SupportingNotes s ON n.idNote = s.idMain 
    WHERE n.idNotebook = 2 AND s.idMain = 3;

-- User can add to another user's notebook