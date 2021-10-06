import { ApolloClient,ApolloLink, HttpLink, InMemoryCache } from 'apollo-boost';
import { gql } from 'apollo-boost';
import {isLoggedIn, getAccessToken} from './auth';

const endpointURL = 'http://localhost:9000/graphql';

//this is used to pass the authorization token to jwt in the server
const authLink = new ApolloLink( (operation, forward) => {
  if(isLoggedIn()){
    operation.setContext({
      //mind the space after Bearer
      headers:{'authorization': 'Bearer ' + getAccessToken()}
    });
  }
  return forward(operation);
} );


const client = new ApolloClient({
  link: ApolloLink.from([ 
    authLink,
    new HttpLink( { uri: endpointURL }) 
    ]),
  cache: new InMemoryCache(),
});

/*
//used in the previous version to fetch but now is suplanted by the apollo-client
export const graphqlRequest = async (query, variables = {}) => {
  const request = {
    method: 'POST',
    headers: {'content-type': 'application/json'},
    body: JSON.stringify({
      query: query,
      variables: variables
    })
  };

  if(isLoggedIn()){
    //console.log("Access Token: ",getAccessToken());
    request.headers['authorization'] = 'Bearer ' + getAccessToken();
  }

  const response = await fetch(endpointURL, request )
  const responseBody = await response.json();

  if(responseBody.errors) {
    //goes into the object get erros key and map each error objects into a single array
    //join() turns an array into a string
    const message = responseBody.errors.map((error) => error.message).join('\n');
    throw new Error(message)
  } 

  return responseBody.data;
}
*/

const jobQuery =  gql`
  query Query($id: ID!) {
    job(id: $id) {
      id
      title
      description
      company {
        id
        name
        description
      }
    }
  }`;

// CREATE JOB (singular) from JobForms component
export const createJob = async (input) =>{
  const mutation =gql`
  mutation Mutation($input: CreateJobInput) {
     job: createJob(input: $input) {
      id
      title
      description
      company {
        id
        name
        description
      }
    }
  }`;

  const {data} = await client.mutate({ 
    mutation, 
    variables: {input},
    update: (cache, mutationResult) => { 
      console.log('mutation result:', mutationResult) 
      cache.writeQuery( {
        query: jobQuery, 
        variables:{ id: mutationResult.data.job.id },
        data: mutationResult.data
      } )
    }
  }); // with gql and apollo-client
  //const data = await graphqlRequest(mutation, {input}) //old fetchbased

  return data.job
}

// LOAD JOB (sigular)
export const loadJob = async (id) => {
  const query =  jobQuery;

  const {data} = await client.query({query, variables: {id}}); // with gql and apollo-client
  //const data = await graphqlRequest(query,{id}) //regular fetch based string based

  return data.job;
}

// LOAD JOBS (plural)
export const loadJobs = async () => {
  const query =  gql`
    query Query{
      jobs{
        id
        title
        description
        company {
          id
          name
          description
        }
      }
    }
  `;

  const {data} = await client.query({query, fetchPolicy:'no-cache'}); // with gql and apollo-client
  //const data = await graphqlRequest(query,{}) //regular fetch based string based 

  return data.jobs;
}

// LOAD COMPANY (sigular)
export const loadCompany = async (id) => {
  const query = gql`
  query Query($id: ID!) {
    company(id: $id) {
      id
      name
      description
      jobs{
        id
        title
        description
      }
    }
  }
  `;

  const {data} = await client.query({query, variables: {id}}); // with gql and apollo-client
  //const data = await graphqlRequest(query,{id}) //regular fetch based string based

  return data.company;
}