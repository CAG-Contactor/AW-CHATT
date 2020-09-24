package se.cag.awchatt.repo;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import se.cag.awchatt.entity.User;

import java.util.List;

@Repository
public interface UserRepo extends CrudRepository<User, Integer> {
    User findByName(String name);
}
