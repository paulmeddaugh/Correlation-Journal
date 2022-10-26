package backend.notebook;

import java.util.List;
import java.util.stream.Collectors;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.*;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import backend.LoadDatabase;

@RestController
public class NotebookController {
    
    private final NotebookRepository repository;
    private final NotebookModelAssembler assembler;
    private static final Logger log = LoggerFactory.getLogger(LoadDatabase.class);
    
    NotebookController(NotebookRepository repository, NotebookModelAssembler assembler) {
        this.repository = repository;
        this.assembler = assembler;
    }
    
    // Aggregate root
    // tag::get-aggregate-root[]
    @GetMapping("/notebooks")
    CollectionModel<EntityModel<Notebook>> all() {
        List<EntityModel<Notebook>> Notebooks = repository.findAll().stream()
            .map(assembler::toModel)
            .collect(Collectors.toList());
        
        return CollectionModel.of(Notebooks,
            linkTo(methodOn(NotebookController.class).all()).withSelfRel());
    }
    // end::get-aggregate-root[]
    
    @PostMapping("/notebooks/newNotebook")
    Notebook newNotebook(@RequestBody Notebook newNotebook) {
        return repository.save(newNotebook);
    }
    
    // Single Notebook
    @GetMapping("/notebooks/{id}")
    EntityModel<Notebook> one(@PathVariable Long id) {
        Notebook Notebook = repository.findById(id)
                .orElseThrow(() -> new NotebookNotFoundException(id));
        
        return assembler.toModel(Notebook);
    }
    
    @PutMapping("/notebooks/{id}/updateNotebook")
    Notebook replaceNotebook(@RequestBody Notebook newNotebook, @PathVariable Long id) {
        return repository.findById(id)
            .map(Notebook -> {
                Notebook.setIdUser(newNotebook.getIdUser());
                Notebook.setName(newNotebook.getName());
                return repository.save(Notebook);
            })
            .orElseGet(() -> {
                newNotebook.setId(id);
                return repository.save(newNotebook);
            });
    }
    
    @DeleteMapping("/notebooks/{id}/deleteNotebook")
    void deleteNotebook(@PathVariable Long id) {
        repository.deleteById(id);
    }
    
    // All of a user's notebooks
    @GetMapping("/users/{id}/notebooks")
    public CollectionModel<EntityModel<Notebook>> user(@PathVariable Long id) {
        List<EntityModel<Notebook>> notebooks = repository.findByIdUser((int) (long) id).stream()
                .map(assembler::toModel)
                .collect(Collectors.toList());
        
        return CollectionModel.of(notebooks,
                linkTo(methodOn(NotebookController.class).user(id)).withSelfRel());
    }
}