package se.cag.awchatt.repo;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import se.cag.awchatt.entity.User;
import se.cag.awchatt.entity.UserPosition;

import java.util.List;

@Repository
public interface UserPositionRepo extends CrudRepository<UserPosition, Integer> {
}
