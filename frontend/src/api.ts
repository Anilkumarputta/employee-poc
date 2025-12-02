import { GraphQLClient, gql } from "graphql-request";

const endpoint = import.meta.env.VITE_GRAPHQL_URL || "http://localhost:4000/graphql";
export const client = new GraphQLClient(endpoint);

export const GET_EMPLOYEES = gql`
  query {
    employees {
      id
      name
      email
      position
      salary
      createdAt
    }
  }
`;

export const CREATE_EMPLOYEE = gql`
  mutation ($input: CreateEmployeeInput!) {
    createEmployee(input: $input) {
      id
      name
      email
      position
      salary
      createdAt
    }
  }
`;
