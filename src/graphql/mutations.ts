import { gql } from '@apollo/client';

export const CREATE_COLLEGE = gql`
  mutation CreateCollege(
    $institute_code: String!
    $institute_name: String!
    $place: String!
    $district_name: String!
    $college_type: String!
    $co_educ: Boolean!
    $affiliated_to: String!
  ) {
    createCollege(
      institute_code: $institute_code
      institute_name: $institute_name
      place: $place
      district_name: $district_name
      college_type: $college_type
      co_educ: $co_educ
      affiliated_to: $affiliated_to
    )
  }
`;
