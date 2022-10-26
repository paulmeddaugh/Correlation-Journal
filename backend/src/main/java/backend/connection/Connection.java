package backend.connection;

import java.util.Objects;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "Connections")
public class Connection {
    private @Id @GeneratedValue Long id;
    private int idNote1;
    private int idNote2;
    private int idUser;

    public Connection() {}

    public Connection(int idNote1, int idNote2, int idUser) {
        super();
        this.idNote1 = idNote1;
        this.idNote2 = idNote2;
        this.idUser = idUser;
    }
    
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public int getIdNote1() {
        return idNote1;
    }

    public void setIdNote1(int idNote1) {
        this.idNote1 = idNote1;
    }

    public int getIdNote2() {
        return idNote2;
    }

    public void setIdNote2(int idNote2) {
        this.idNote2 = idNote2;
    }

    public int getIdUser() {
        return idUser;
    }

    public void setIdUser(int idUser) {
        this.idUser = idUser;
    }

    @Override
    public boolean equals(Object o) {

        if (this == o)
            return true;
        if (!(o instanceof Connection))
            return false;
        
        Connection client = (Connection) o;
        return Objects.equals(this.idNote1, client.idNote1) 
                && Objects.equals(this.idNote1, client.idNote1)
                && Objects.equals(this.idUser, client.idUser);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.idNote1,
                this.idNote2,
                this.idUser);
    }

    @Override
    public String toString() {
        return "Connection{" + "id=" + this.id
                + ", idNote1='" + this.idNote1 + '\'' 
                + ", idNote2='" + this.idNote2 + '\'' 
                + ", idUser='" + this.idUser + '\'' 
                + '}';
    }
}
