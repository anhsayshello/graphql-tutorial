import { gql } from "@apollo/client";

export const ME = gql`
  query GetMe {
    me {
      username
      friends {
        name
        phone
        address {
          street
          city
        }
      }
    }
  }
`;
