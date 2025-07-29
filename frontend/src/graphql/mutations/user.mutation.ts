import { gql } from "@apollo/client";

export const LOGIN = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
    }
  }
`;

export const SIGN_UP = gql`
  mutation Signup($username: String!) {
    createUser(username: $username) {
      username
      id
    }
  }
`;
