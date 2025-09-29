import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { userTypeDefs } from '../modules/user/user.typeDefs';
import { userResolvers } from '../modules/user/user.resolver';
import { taskTypeDefs } from '../modules/task/task.typeDefs';
import { taskResolvers } from '../modules/task/task.resolver';


const typeDefs = mergeTypeDefs([userTypeDefs, taskTypeDefs]);


const resolvers = mergeResolvers([userResolvers, taskResolvers]);


export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});