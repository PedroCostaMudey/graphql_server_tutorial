import React, { Component } from 'react';
import { JobList } from './JobList';

//const { jobs } = require('./fake-data');
import { loadJobs } from './requests';

export class JobBoard extends Component {
  //we want to make this component statful so we initite and the constructor
  //and pass the props to the parent class and declare the field jobs:[] as an empty array
  constructor(props){
    super(props);
    
    //state is stored as an key-value object
    this.state = {jobs: []};
  }
  
  //componentDidMount is similar to onLoad so this only run after the elements in the page are loaded 
  async componentDidMount(){
    const jobs = await loadJobs();
    this.setState({jobs})
  }

  render() {
    const {jobs} = this.state;

    return (
      <div>
        <h1 className="title">Job Board</h1>
        <JobList jobs={jobs} />
      </div>
    );
  }
}
