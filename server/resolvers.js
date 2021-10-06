const db = require('./db.js');

const Query = {
  job: (root, args) => db.jobs.get(args.id),
  jobs: () => {
    //note that req and req on a graphQL methodology is always made in JSON, a proxy to an array of Objects 
    //long form for debugging Object.values(Object.entries(db.jobs)[1])[1] 
    return db.jobs.list();
  },
  company: (root, args) => db.companies.get(args.id),
  companies: () => db.companies.list(),
 
};

const Mutation = {
  createJob: (root, args, context) => {
    console.log('req -> user: ', context.user);
    if(!context.user){
      throw new Error('Unauthorized')
    }
    const id = db.jobs.create( {...args.input, companyId: context.user.companyId} )
    return db.jobs.get(id);
  },
}

const Job = {
  company: (job) => db.companies.get(job.companyId),
}

const Company = {
  jobs: (company) => db.jobs.list().filter((job) => job.companyId === company.id),
}

module.exports = { Query, Mutation, Job, Company }