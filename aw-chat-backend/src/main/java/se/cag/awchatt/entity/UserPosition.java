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
    private Integer xPos;
    private Integer yPos;
    private Timestamp updated;

    public UserPosition(Integer xPos, Integer yPos) {
        this.xPos = xPos;
        this.yPos = yPos;
        this.updated = new Timestamp(System.currentTimeMillis());
    }
}
