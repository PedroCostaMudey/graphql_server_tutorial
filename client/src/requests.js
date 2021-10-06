const endpointURL = 'http://localhost:9000/graphql';

const {isLoggedIn, getAccessToken} = require('./auth');

const graphqlRequest = async (query, variables = {}) => {
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

// CREATE JOB (singular) from JobForms component
const createJob = async (input) =>{
  const mutation =`
  mutation Mutation($input: CreateJobInput) {
    createJob(input: $input) {
      id
      title
      company {
        id
        name
      }
    }
  }`;

  const data = await graphqlRequest(mutation, {input})

  return data.createJob
}

// LOAD JOB (sigular)
const loadJob = async (id) => {
  const query =  `
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

  const data = await graphqlRequest(query,{id})

  return data.job;
}

// LOAD JOBS (plural)
const loadJobs = async () => {
  const query =  `
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
  
  const data = await graphqlRequest(query,{})

  return data.jobs;
}

// LOAD COMPANY (sigular)
const loadCompany = async (id) => {
  const query =  `
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

  const data = await graphqlRequest(query,{id})

  return data.company;
}


module.exports = {createJob, loadJobs, loadJob, loadCompany};
