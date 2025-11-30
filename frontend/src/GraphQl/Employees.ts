import { gql } from "graphql-request";

export const EMPLOYEES_QUERY = gql`
  query Employees($page: Int, $perPage: Int, $filter: EmployeeFilter) {
    employees(page: $page, perPage: $perPage, filter: $filter) {
      items {
        id
        fullName
        className
        attendancePercentage
      }
      total
      page
      perPage
    }
  }
`;

export const CREATE_EMPLOYEE = gql`
  mutation CreateEmployee($input: EmployeeInput!) {
    createEmployee(input: $input) {
      id
      fullName
      className
      attendancePercentage
    }
  }
`;

export const UPDATE_EMPLOYEE = gql`
  mutation UpdateEmployee($id: Int!, $input: EmployeeInput!) {
    updateEmployee(id: $id, input: $input) {
      id
      fullName
      className
      attendancePercentage
    }
  }
`;

export const DELETE_EMPLOYEE = gql`
  mutation DeleteEmployee($id: Int!) {
    deleteEmployee(id: $id)
  }
`;
