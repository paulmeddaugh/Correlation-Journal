package backend.connection;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import backend.notebook.Notebook;

@Repository
public interface ConnectionRepository extends JpaRepository<Connection, Long> {
    List<Connection> findByIdNote1AndIdNote2(int idNote1, int idNote2);
    Connection deleteByIdNote1AndIdNote2(int idNote1, int idNote2);
    List<Connection> findByIdUser(int idUser);
}