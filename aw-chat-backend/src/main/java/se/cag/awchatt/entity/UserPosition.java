package se.cag.awchatt.entity;

import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.sql.Timestamp;

@Data
@NoArgsConstructor
@Entity
@Table
public class UserPosition {
    @Id
    @GeneratedValue
    private Integer id;
    private Integer x_pos;
    private Integer y_pos;
    private Timestamp updated;

    public UserPosition(Integer xPos, Integer yPos) {
        this.x_pos = xPos;
        this.y_pos = yPos;
        this.updated = new Timestamp(System.currentTimeMillis());
    }
}
