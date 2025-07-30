const userSchema = `
    type User {
  username: String!
  friends: [Person!]!
  id: ID!
}

type Token {
  value: String!
}

type Query {
  me: User
}

type Mutation {
  createUser(
    username: String!
  ): User
  
  login(
    username: String!
    password: String!
  ): Token
}
`;
export default userSchema;
