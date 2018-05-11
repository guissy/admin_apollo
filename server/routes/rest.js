const login = require('./graphql_login');
const router = require('express').Router

const resolvers = { ...login.resolvers.Query, ...login.resolvers.Mutation };
