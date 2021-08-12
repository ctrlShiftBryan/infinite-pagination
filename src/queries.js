import { gql } from "@apollo/client";

export const GET_STREETNAMES = gql`
  query streetNames($first: Int, $after: String, $delay: Boolean) {
    streetNames(first: $first, after: $after, delay: $delay) {
      pageInfo {
        endCursor
        hasNextPage
      }
      edges {
        cursor
        node {
          index
          streetName
          hash
        }
      }
    }
  }
`;
