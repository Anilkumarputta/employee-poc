import { gql } from "apollo-server-express";

export const typeDefs = gql`
  enum Role {
    ADMIN
    EMPLOYEE
  }

  type User {
    id: Int!
    email: String!
    role: Role!
    createdAt: String!
  }

  type Employee {
    id: Int!
    name: String!
    email: String!
    age: Int!
    class: String!
    subjects: [String!]!
    attendance: Float!
    createdAt: String!
  }

  input EmployeeFilterInput {
    nameContains: String
    classEquals: String
    minAge: Int
    maxAge: Int
  }

  input PaginationInput {
    skip: Int
    take: Int
  }

  input SortInput {
    field: String
    direction: String
  }

  input CreateEmployeeInput {
    name: String!
    email: String!
    age: Int!
    class: String!
    subjects: [String!]
    attendance: Float
  }

  input UpdateEmployeeInput {
    name: String
    email: String
    age: Int
    class: String
    subjects: [String!]
    attendance: Float
  }

  type EmployeeList {
    items: [Employee!]!
    total: Int!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    me: User
    employees(filter: EmployeeFilterInput, pagination: PaginationInput, sort: SortInput): EmployeeList!
    employee(id: Int!): Employee
  }

  type Mutation {
    login(email: String!, password: String!): AuthPayload!
    createEmployee(input: CreateEmployeeInput!): Employee!
    updateEmployee(id: Int!, input: UpdateEmployeeInput!): Employee!
  }
`;