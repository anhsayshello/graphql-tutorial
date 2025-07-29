import { gql } from "@apollo/client";

export const CREATE_PERSON = gql`
  mutation createPerson(
    $name: String!
    $phone: String
    $street: String!
    $city: String!
  ) {
    addPerson(name: $name, phone: $phone, street: $street, city: $city) {
      name
      phone
      id
      address {
        street
        city
      }
    }
  }
`;

export const UPDATE_PERSON = gql`
  mutation UpdatePerson(
    $name: String!
    $phone: String!
    $street: String!
    $city: String!
  ) {
    updatePerson(name: $name, phone: $phone, street: $street, city: $city) {
      name
      phone
      address {
        street
        city
      }
    }
  }
`;
