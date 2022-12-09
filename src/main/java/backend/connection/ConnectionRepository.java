package backend.connection;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import backend.notebook.Notebook;

@Repository
public interface ConnectionRepository extends JpaRepository<Connection, Long> {
    List<Connection> findByIdNote1AndIdNote2AndIdUser(int idNote1, int idNote2, int idUser);
    List<Connection> deleteByIdNote1AndIdNote2AndIdUser(int idNote1, int idNote2, int idUser);
    List<Connection> findByIdUser(int idUser);
}