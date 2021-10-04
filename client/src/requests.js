const endpointURL = 'http://localhost:9000/graphql';

const graphqlRequest = async (query, variables = {}) => {
  const response = await fetch(endpointURL, {
    method: 'POST',
    headers: {'content-type': 'application/json'},
    body: JSON.stringify({
      query: query,
      variables: variables
    })
  })
  const responseBody = await response.json();

  if(responseBody.errors) {
    //goes into the object get erros key and map each error objects into a single array
    //join() turns an array into a string
    const message = responseBody.errors.map((error) => error.message).join('\n');
    throw new Error(message)
  } 

  return responseBody.data;
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
    }
  }
  `;

  const data = await graphqlRequest(query,{id})

  return data.company;
}


module.exports = {loadJobs, loadJob, loadCompany};
