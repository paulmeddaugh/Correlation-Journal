package backend.note;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import backend.notebook.Notebook;

@Repository
public interface NoteRepository extends JpaRepository<Note, Long> {
    List<Note> findByIdUser(int idUser);
    List<Note> findByIdNotebook(int idNotebook);
}