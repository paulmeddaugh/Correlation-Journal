package backend.user;

import java.util.Date;
import java.util.Objects;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "Users")
public class User {
    private @Id @GeneratedValue Long id;
    private String email;
    private String username;
    private String password;
    private String reminder;
    private Date dateCreated;
    private String name;

    public User() {
        super();
        this.dateCreated = new Date();
    }

    public User(String username, String password) {
        this();
        this.username = username;
        this.password = password;
    }
    
    public User(String email, String username, String password, String reminder, 
            String name) {
        this();
        this.email = email;
        this.username = username;
        this.password = password;
        this.reminder = reminder;
        this.name = name;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getReminder() {
        return reminder;
    }

    public void setReminder(String reminder) {
        this.reminder = reminder;
    }

    public Date getDateCreated() {
        return dateCreated;
    }

    public void setDateCreated(Date dateCreated) {
        this.dateCreated = dateCreated;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public boolean equals(Object o) {

        if (this == o)
            return true;
        if (!(o instanceof User))
            return false;
        User client = (User) o;
        return Objects.equals(this.id, client.id) 
                && Objects.equals(this.email, client.email)
                && Objects.equals(this.username, client.username)
                && Objects.equals(this.password, client.password)
                && Objects.equals(this.reminder, client.reminder)
                && Objects.equals(this.name, client.name)
                && Objects.equals(this.dateCreated, client.dateCreated);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id, 
                this.email,
                this.username,
                this.password,
                this.reminder,
                this.name,
                this.dateCreated);
    }

    @Override
    public String toString() {
        return "User{" + "id=" + this.id 
                + ", email='" + this.email + '\'' 
                + ", username='" + this.username + '\'' 
                + ", password='" + this.password + '\'' 
                + ", reminder='" + this.reminder + '\'' 
                + ", name='" + this.name + '\'' 
                + ", dateCreated='" + this.dateCreated + '\'' 
                + '}';
    }
}
