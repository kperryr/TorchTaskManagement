import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import express from 'express';
import cors from 'cors';
import { schema } from './graphql/index';
import { createGraphQLContext } from './middleware/auth';

const app = express();

app.use(cors());
app.use(express.json());


const server = new ApolloServer({
  schema,
});

export default app;

export const startServer = async () => {
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