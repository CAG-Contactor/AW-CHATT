package se.cag.awchatt.entity;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;

import javax.persistence.*;
import java.sql.Timestamp;

@Data
@NoArgsConstructor
@Entity
@Table
public class User {
    @Id
    @GeneratedValue
    private Integer id;
    private String name;
    private String color;
    private Timestamp create_time;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "position_id", referencedColumnName = "id")
    private UserPosition position;

    public User(String name, String color){
        this.name = name;
        this.color = color;
        this.create_time = new Timestamp(System.currentTimeMillis());
    }
}
