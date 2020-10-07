import React from 'react';
import ReactDOM from 'react-dom';
//import './index.css';
import Firstpage from './Firstpage';
import * as serviceWorker from './serviceWorker';
import 'antd/dist/antd.css';
import {ApolloClient, ApolloProvider, createHttpLink, InMemoryCache} from "@apollo/client";

const link = createHttpLink({
    uri: 'http://localhost:8080/graphql',
    credentials: 'same-origin'
});

const client = new ApolloClient({
        // link: new WebSocketLink({
        //     uri: "http://localhost:8080/graphql/",
        //     options: {
        //         lazy: true,
        //         reconnect: true
        //     }
        // }),
        // cache: new InMemoryCache()
    cache: new InMemoryCache(),
    link
});

ReactDOM.render(
    <React.StrictMode>
        <ApolloProvider client={client}>
            <Firstpage/>
        </ApolloProvider>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
