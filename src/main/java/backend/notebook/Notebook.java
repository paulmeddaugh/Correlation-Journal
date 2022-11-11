package backend.notebook;

import java.util.Date;
import java.util.Objects;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "Notebooks")
public class Notebook {
    private @Id @GeneratedValue(strategy = GenerationType.IDENTITY) Long id;
    private int idUser;
    private String name;
    private Date dateCreated;

    public Notebook() {
        super();
        this.dateCreated = new Date();
    }

    public Notebook(int idUser, String name) {
        this();
        this.idUser = idUser;
        this.name = name;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
    
    public Integer getIdUser() {
        return idUser;
    }

    public void setIdUser(Integer idUser) {
        this.idUser = idUser;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Date getDateCreated() {
        return dateCreated;
    }

    public void setDateCreated(Date dateCreated) {
        this.dateCreated = dateCreated;
    }

    @Override
    public boolean equals(Object o) {

        if (this == o)
            return true;
        if (!(o instanceof Notebook))
            return false;
        Notebook client = (Notebook) o;
        return Objects.equals(this.id, client.id) 
                && Objects.equals(this.idUser, client.idUser)
                && Objects.equals(this.name, client.name);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id, 
                this.idUser,
                this.name);
    }

    @Override
    public String toString() {
        return "Notebook{" + "id=" + this.id 
                + ", idUser='" + this.idUser + '\'' 
                + ", name='" + this.name + '\''
                + '}';
    }
}
