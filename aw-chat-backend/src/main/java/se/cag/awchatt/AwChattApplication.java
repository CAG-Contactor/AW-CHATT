package se.cag.awchatt;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin(origins = "http://localhost:8080/graphql")
@SpringBootApplication
public class AwChattApplication {

	public static void main(String[] args) {
		SpringApplication.run(AwChattApplication.class, args);
	}

}
