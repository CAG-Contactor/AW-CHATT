package se.cag.awchatt.graphql;

import com.google.common.base.Charsets;
import com.google.common.io.Resources;
import graphql.GraphQL;
import graphql.execution.SubscriptionExecutionStrategy;
import graphql.schema.DataFetcher;
import graphql.schema.DataFetchingEnvironment;
import graphql.schema.GraphQLSchema;
import graphql.schema.idl.RuntimeWiring;
import graphql.schema.idl.SchemaGenerator;
import graphql.schema.idl.SchemaParser;
import graphql.schema.idl.TypeDefinitionRegistry;
import org.reactivestreams.Publisher;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;
import se.cag.awchatt.entity.User;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.net.URL;

import static graphql.schema.idl.TypeRuntimeWiring.newTypeWiring;

@Component
public class GraphQLProvider {

    private GraphQL graphQL;

    @Bean
    public GraphQL graphQL() {
        return graphQL;
    }

    @PostConstruct
    public void init() throws IOException {
        URL url = Resources.getResource("schema.graphqls");
        String sdl = Resources.toString(url, Charsets.UTF_8);
        GraphQLSchema graphQLSchema = buildSchema(sdl);
        this.graphQL = GraphQL
                .newGraphQL(graphQLSchema)
                .subscriptionExecutionStrategy(new SubscriptionExecutionStrategy())
                .build();
    }

    @Autowired
    GraphQLDataFetchers graphQLDataFetchers;

    private GraphQLSchema buildSchema(String sdl) {
        TypeDefinitionRegistry typeRegistry = new SchemaParser().parse(sdl);
        RuntimeWiring runtimeWiring = buildWiring();
        SchemaGenerator schemaGenerator = new SchemaGenerator();
        return schemaGenerator.makeExecutableSchema(typeRegistry, runtimeWiring);
    }

    private RuntimeWiring buildWiring() {
        return RuntimeWiring.newRuntimeWiring()
                .type(newTypeWiring("Query")
                        .dataFetcher("userByName", graphQLDataFetchers.getUserByIdFetcher())
                        .dataFetcher("allUsers", graphQLDataFetchers.getAllUsers())
                        .dataFetcher("allPositions", graphQLDataFetchers.getAllPositions()))
                .type(newTypeWiring("Mutation")
                        .dataFetcher("addUser", graphQLDataFetchers.addUser())
                        .dataFetcher("removeUser", graphQLDataFetchers.removeUser())
                        .dataFetcher("updatePosition", graphQLDataFetchers.updatePosition()))
//                .type(newTypeWiring("Subscription")
//                        .dataFetcher("getAllUsers", new DataFetcher<Publisher<User>>() {
//                            @Override
//                            public Publisher<User> get(DataFetchingEnvironment dataFetchingEnvironment) throws Exception {
//                                return null;
//                            }
//                        }))
                .build();
    }

}