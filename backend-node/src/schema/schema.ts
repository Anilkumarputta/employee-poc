import { gql } from "apollo-server-express";

export const typeDefs = gql`
  type Employee {
    id: Int!
    name: String!
    email: String!
    position: String
    salary: Float
    createdAt: String!
  }

  type Query {
    employees: [Employee!]!
    employee(id: Int!): Employee
  }

  input CreateEmployeeInput {
    name: String!
    email: String!
    position: String
    salary: Float
  }

  type Mutation {
    createEmployee(input: CreateEmployeeInput!): Employee!
    deleteEmployee(id: Int!): Employee!
  }
`;
