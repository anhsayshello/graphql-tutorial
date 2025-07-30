import { gql } from "@apollo/client";
import { PERSON_DETAIL } from "../queries/person.query";

export const CREATE_PERSON = gql`
  mutation createPerson(
    $name: String!
    $phone: String
    $street: String!
    $city: String!
  ) {
    addPerson(name: $name, phone: $phone, street: $street, city: $city) {
      ...PersonDetail
    }
  }
  ${PERSON_DETAIL}
`;

export const UPDATE_PERSON = gql`
  mutation UpdatePerson(
    $name: String!
    $phone: String!
    $street: String!
    $city: String!
  ) {
    updatePerson(name: $name, phone: $phone, street: $street, city: $city) {
      ...PersonDetail
    }
  }
  ${PERSON_DETAIL}
`;
