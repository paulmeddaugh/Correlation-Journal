package backend.connection;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

@ControllerAdvice
public class ConnectionNotFoundAdvice {
    @ResponseBody
    @ExceptionHandler(ConnectionNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    String connectionNotFoundHandler(ConnectionNotFoundException ex) {
        return ex.getMessage();
    }
}