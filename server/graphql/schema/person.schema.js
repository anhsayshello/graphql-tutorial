const personSchema = `
  type Address {
    street: String!
    city: String!
  }

  enum YesNo{
  YES
  NO
  }

  type Person {
  name: String!
  phone:String
  address: Address!
  id: ID!
  }

  type Query{
  personCount: Int!
  allPersons(phone: YesNo): [Person!]!
  findPerson(name: String!): Person
  }

  type Mutation{
    addPerson(
    name: String!
    phone: String
    street: String!
    city: String
    ):Person

    addAsFriend(name: String!): User

    updatePerson(
    name: String!
    phone: String!
    street: String!
    city: String!
    ):Person
  }
`;
export default personSchema;
