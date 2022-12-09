package backend.notebook;

public class NotebookNotFoundException extends RuntimeException {
    NotebookNotFoundException(Long id) {
        super("Could not find notebook " + id);
    }
}