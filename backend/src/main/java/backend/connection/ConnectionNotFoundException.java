package backend.connection;

public class ConnectionNotFoundException extends RuntimeException {
    ConnectionNotFoundException(Long id) {
        super("Could not find connection with id " + id);
    }
    
    ConnectionNotFoundException(Integer idNote1, Integer idNote2) {
        super("Could not find connection from a note with id '" + idNote1 + "' to a note "
                + "with id '" + idNote2 + "'");
    }
}