// @ts-strict-ignore
import { gql } from "@apollo/client";
import {
  SearchWarehousesDocument,
  SearchWarehousesQuery,
  SearchWarehousesQueryVariables,
} from "@dashboard/graphql";
import makeTopLevelSearch from "@dashboard/hooks/makeTopLevelSearch";

export const searchWarehouses = gql`
  query SearchWarehouses($after: String, $first: Int!, $query: String!, $channnelsId: [ID!]) {
    search: warehouses(
      after: $after
      first: $first
      sortBy: { direction: ASC, field: NAME }
      filter: { search: $query, channels: $channnelsId }
    ) {
      totalCount
      edges {
        node {
          id
          name
          address {
            streetAddress1
            streetAddress2
            city
            postalCode
            country {
              code
              country
            }
          }
        }
      }
      pageInfo {
        ...PageInfo
      }
    }
  }
`;

export default makeTopLevelSearch<SearchWarehousesQuery, SearchWarehousesQueryVariables>(
  SearchWarehousesDocument,
);
