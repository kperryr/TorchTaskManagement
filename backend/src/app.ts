import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import express from 'express';
import cors from 'cors';
import { schema } from './graphql/index';
import { createGraphQLContext } from './middleware/auth';

//refactored with true factory pattern 
export const startServer = async () => {

  const app = express();

  app.use(cors({
    origin: [
      'https://torchtaskmanagementfrontend.onrender.com',
      'http://localhost:5173',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
  }));

  app.use(express.json());

  const server = new ApolloServer({
    schema,
  });

  await server.start();

  app.use(
    '/graphql',
    expressMiddleware(server, {
      context: async ({ req, res }) => {
        return await createGraphQLContext({ req, res });
      },
    })
  );

  return app;
};