const endpointURL = 'http://localhost:9000/graphql';

const loadJobs = async () => {
  const response = await fetch(endpointURL, {
    method: 'POST',
    headers: {'content-type':'application/json'},
    body: JSON.stringify({
      query:`
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
      `
    })
  })

  const responseBody = await response.json();

  return responseBody.data.jobs;
}

const loadJob = async (id) => {
  const response = await fetch(endpointURL, {
    method: 'POST',
    headers: {'content-type':'application/json'},
    body: JSON.stringify({
      query:`
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
        }`,
      variables: {id}
    })
  });

  const responseBody = await response.json();

  if(responseBody.errors){
    console.log("error: ",responseBody.errors);
    return null;
  }

  return responseBody.data.job;
}

module.exports = {loadJobs, loadJob};
