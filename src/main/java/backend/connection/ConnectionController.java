package backend.connection;

import java.util.List;
import java.util.stream.Collectors;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.*;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import backend.LoadDatabase;
import backend.notebook.Notebook;
import backend.notebook.NotebookController;
import backend.user.User;
import backend.user.UserController;
import backend.user.UserNotFoundException;

@RestController
public class ConnectionController {
    
    private final ConnectionRepository repository;
    private final ConnectionModelAssembler assembler;
    private static final Logger log = LoggerFactory.getLogger(LoadDatabase.class);
    
    ConnectionController(ConnectionRepository repository, 
            ConnectionModelAssembler assembler) {
        this.repository = repository;
        this.assembler = assembler;
    }
    
    // Aggregate root
    // tag::get-aggregate-root[]
    @GetMapping("/connections")
    CollectionModel<EntityModel<Connection>> all() {
        List<EntityModel<Connection>> notes = repository.findAll().stream()
            .map(assembler::toModel)
            .collect(Collectors.toList());
        
        return CollectionModel.of(notes,
            linkTo(methodOn(ConnectionController.class).all()).withSelfRel());
    }
    // end::get-aggregate-root[]
    
    @PostMapping("/connections/newConnection")
    Connection newNote(@RequestBody Connection newConnection) {
        return repository.save(newConnection);
    }
    
    // Single Connection by id
    @GetMapping("/connections/{id}")
    EntityModel<Connection> one(@PathVariable Long id) {
        Connection conn = repository.findById(id)
                .orElseThrow(() -> new ConnectionNotFoundException(id));
        
        return assembler.toModel(conn);
    }
    
    // Query for a connection from a note to another
    @GetMapping("/connections/queryConnection")
    CollectionModel<EntityModel<Connection>> fromIdNote1AndIdNote2(
            @RequestParam Integer idNote1, @RequestParam Integer idNote2) {
        
        List<EntityModel<Connection>> conn = repository
                .findByIdNote1AndIdNote2(idNote1, idNote2)
                .stream()
                .map(assembler::toModel)
                .collect(Collectors.toList());
        
        if (conn.size() == 0) {
            // Searches for idNote1 with idNote2 val, and idNote2 with idNote1 val
            conn = repository
                    .findByIdNote1AndIdNote2(idNote2, idNote1)
                    .stream()
                    .map(assembler::toModel)
                    .collect(Collectors.toList());
        }
        
        if (conn.size() == 0) {
            throw new ConnectionNotFoundException(idNote1, idNote2);
        }
        
        return CollectionModel.of(conn,
                linkTo(methodOn(ConnectionController.class)
                        .fromIdNote1AndIdNote2(idNote1, idNote2)).withSelfRel());
    }
    
    @DeleteMapping("/connections/deleteConnection/{id}")
    void deleteConnection(@PathVariable Long id) {
        repository.deleteById(id);
    }
    
    @DeleteMapping("/connections/deleteConnection")
    void deleteConnection(@RequestParam Integer idNote1, @RequestParam Integer idNote2) {
        if (repository.deleteByIdNote1AndIdNote2(idNote1, idNote2) == null) {
            repository.deleteByIdNote1AndIdNote2(idNote2, idNote1);
        }
    }
    
    // All of a user's connections
    @GetMapping("/users/{id}/connections")
    public CollectionModel<EntityModel<Connection>> user(@PathVariable Long id) {
        List<EntityModel<Connection>> conns = repository.findByIdUser((int) (long) id).stream()
                .map(assembler::toModel)
                .collect(Collectors.toList());
        
        return CollectionModel.of(conns,
                linkTo(methodOn(ConnectionController.class).user(id)).withSelfRel());
    }
}