export const taskTypeDefs = `#graphql
  enum TaskStatus {
    PENDING
    IN_PROGRESS
    COMPLETED
    CANCELLED
  }

  enum TaskSort {
    CREATED_DESC    # Newest first (default)
    CREATED_ASC     # Oldest first
    DUE_ASC         # Earliest due date first
    DUE_DESC        # Latest due date first
    NAME_ASC        # A-Z
    NAME_DESC       # Z-A
  }

  type Task {
    id: ID!
    taskName: String!
    description: String!
    status: TaskStatus!
    user: User!
    userId: ID!
    createdAt: String!
    updatedAt: String!
    dueDate: String
  }

  input CreateTaskInput {
    taskName: String!
    description: String!
    status: TaskStatus
    dueDate: String
  }

  input UpdateTaskInput {
    taskName: String
    description: String
    status: TaskStatus
    dueDate: String
  }

  input TaskFilters {
    status: TaskStatus
    sortBy: TaskSort = CREATED_DESC  # Default to newest first
  }

  type Query {
    taskByUser(filters: TaskFilters): [Task!]!
    taskById(id: ID!): Task
  }

  type Mutation {
    createTask(input: CreateTaskInput!): Task!
    updateTask(id: ID!, input: UpdateTaskInput!): Task!
    deleteTask(id: ID!): Boolean!
  }
`;