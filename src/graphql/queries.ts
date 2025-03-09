import { gql } from '@apollo/client';

export const GET_COLLEGE = gql`
  query GetCollege($institute_code: String!) {
    getCollege(institute_code: $institute_code) {
      sno
      institute_code
      institute_name
      place
      district_name
      college_type
      co_educ
      affiliated_to
    }
  }
`;

export const GET_ALL_COLLEGES = gql`
  query GetAllColleges {
    getColleges {
      sno
      institute_code
      institute_name
      place
      district_name
      college_type
      co_educ
      affiliated_to
    }
  }
`;