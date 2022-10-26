package backend.note;

public class NoteNotFoundException extends RuntimeException {
    NoteNotFoundException(Long id) {
        super("Could not find note with id " + id);
    }
}