import { GraphQLClient, gql } from "graphql-request";

export const endpoint = import.meta.env.VITE_GRAPHQL_URL || "http://localhost:4000/graphql";

// Default client (no auth) - exported as `client` because some files import it directly
export const client = new GraphQLClient(endpoint);

// Helper to create a client with Authorization header when needed
export function getClient(token?: string) {
  return new GraphQLClient(endpoint, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined
  });
}

export const LOGIN = gql`
  mutation ($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        email
        role
      }
    }
  }
`;

export const GET_EMPLOYEES = gql`
  query ($filter: EmployeeFilterInput, $pagination: PaginationInput, $sort: SortInput) {
    employees(filter: $filter, pagination: $pagination, sort: $sort) {
      total
      items {
        id
        name
        email
        age
        class
        subjects
        attendance
      }
    }
  }
`;

export const GET_EMPLOYEE = gql`
  query ($id: Int!) {
    employee(id: $id) {
      id
      name
      email
      age
      class
      subjects
      attendance
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
    }
  }
`;