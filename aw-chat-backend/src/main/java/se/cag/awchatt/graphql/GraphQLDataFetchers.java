package se.cag.awchatt.graphql;

import com.google.common.collect.ImmutableMap;
import graphql.schema.DataFetcher;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import se.cag.awchatt.entity.User;
import se.cag.awchatt.entity.UserPosition;
import se.cag.awchatt.repo.UserPositionRepo;
import se.cag.awchatt.repo.UserRepo;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

@Component
public class GraphQLDataFetchers {

    @Autowired
    UserRepo userRepo;
    @Autowired
    UserPositionRepo userPositionRepo;

    public DataFetcher getUserByIdFetcher() {
        return dataFetchingEnvironment -> {
            String name = dataFetchingEnvironment.getArgument("name");
            return userRepo.findByName(name);
        };
    }

    public DataFetcher getAllUsers() {
        return dataFetchingEnvironment -> {
            return userRepo.findAll();
        };
    }

    public DataFetcher addUser() {
        return dataFetchingEnvironment -> {
            String name = dataFetchingEnvironment.getArgument("name");
            String color = dataFetchingEnvironment.getArgument("color");
            User user = userRepo.save(new User(name, color));
            user.setPosition(userPositionRepo.save(new UserPosition( 0, 0)));
            return userRepo.save(user);
        };
    }
    public DataFetcher setPosition() {
        return dataFetchingEnvironment -> {
            Integer id = dataFetchingEnvironment.getArgument("id");
            Integer xPos = dataFetchingEnvironment.getArgument("xPos");
            Integer yPos = dataFetchingEnvironment.getArgument("yPos");
            return null;
        };
    }


    public DataFetcher getAllPositions() {
        return dataFetchingEnvironment -> {
            return userPositionRepo.findAll();
        };
    }

    public DataFetcher updatePosition() {
        return dataFetchingEnvironment -> {
            String name = dataFetchingEnvironment.getArgument("name");
            Integer xPos = dataFetchingEnvironment.getArgument("xPos");
            Integer yPos = dataFetchingEnvironment.getArgument("yPos");
            User user = userRepo.findByName(name);
            user.getPosition().setXPos(xPos);
            user.getPosition().setYPos(yPos);
            return userRepo.save(user);
        };
    }

    public DataFetcher removeUser() {
        return dataFetchingEnvironment -> {
            String name = dataFetchingEnvironment.getArgument("name");
            User user = userRepo.findByName(name);
            if(user == null){
                return false;
            }
            userRepo.delete(user);
            return true;
        };
    }
}