//** AXIOS CONFIG */

import axios from 'axios';

const loc = window.location;

// Create an instance of Axios with a custom configuration
const instance = axios.create({
  // Set the base URL for requests
  baseURL: `${loc.protocol}//${loc.hostname}${loc.hostname === 'localhost' ? ':8080' : ''}`,
});

// Set withCredentials for the instance
instance.defaults.withCredentials = true;

export default instance;
