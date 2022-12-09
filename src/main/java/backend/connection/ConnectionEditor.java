package backend.connection;

import java.beans.PropertyEditorSupport;

import org.springframework.util.StringUtils;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

public class ConnectionEditor extends PropertyEditorSupport {

    private ObjectMapper objectMapper;

    public ConnectionEditor(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @Override
    public void setAsText(String text) throws IllegalArgumentException {
        if (StringUtils.isEmpty(text)) {
            setValue(null);
        } else {
            Connection conn = new Connection();
            try {
                conn = objectMapper.readValue(text, Connection.class);
            } catch (JsonProcessingException e) {
                throw new IllegalArgumentException(e);
            }
            setValue(conn);
        }
    }

}