import { gql } from '@apollo/client';

const ALL_CITY = gql`
  query allCity($where: CityFilter, $sort: [CitySorting!]) @api(name: "sanity") {
    allCity(where: $where, sort: $sort) {
      _id
      name
    }
  }
`;

export default ALL_CITY;
