import { gql } from "@apollo/client";

export const PERSON_DETAIL = gql`
  fragment PersonDetail on Person {
    id
    name
    phone
    address {
      street
      city
    }
  }
`;

export const ALL_PERSONS = gql`
  query {
    allPersons {
      ...PersonDetail
    }
  }
  ${PERSON_DETAIL}
`;

// below is query operation, a request send to server
export const FIND_PERSON = gql`
  query findPersonByName($nameToSearch: String!) {
    findPerson(name: $nameToSearch) {
      friendOf {
        username
      }
    }
  }
  ${PERSON_DETAIL}
`;

export const PERSON_ADDED = gql`
  subscription {
    personAdded {
      ...PersonDetail
    }
  }
  ${PERSON_DETAIL}
`;
