import { gql } from "@apollo/client";

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

export const GET_PAGINATED_TS_CUTOFF_2024S = gql`
  query GetPaginatedTsCutoff2024s($limit: Int, $offset: Int) {
    tsCutoff2024s(limit: $limit, offset: $offset) {
      rows {
        sno
        inst_code
        institute_name
        place
        dist_code
        college_type
        branch_code
        branch_name
        oc_boys
        oc_girls
        bc_a_boys
        bc_a_girls
        bc_b_boys
        bc_b_girls
        bc_c_boys
        bc_c_girls
        bc_d_boys
        bc_d_girls
        bc_e_boys
        bc_e_girls
        sc_boys
        sc_girls
        st_boys
        st_girls
        ews_gen_ou
        ews_girls_ou
        tuition_fee
        affiliated_to
      }
      totalCount
    }
  }
`;

export const GET_TS_CUTOFF_2024 = gql`
  query GetTsCutoff2024($sno: Float!) {
    tsCutoff2024(sno: $sno) {
      sno
      inst_code
      institute_name
      place
      dist_code
      co_education
      college_type
      year_of_estab
      branch_code
      branch_name
      oc_boys
      oc_girls
      bc_a_boys
      bc_a_girls
      bc_b_boys
      bc_b_girls
      bc_c_boys
      bc_c_girls
      bc_d_boys
      bc_d_girls
      bc_e_boys
      bc_e_girls
      sc_boys
      sc_girls
      st_boys
      st_girls
      ews_gen_ou
      ews_girls_ou
      tuition_fee
      affiliated_to
    }
  }
`;

export const GET_TS_CUTOFF_2024S_BY_INST_CODES = gql`
  query GetTsCutoff2024sByInstCodes($inst_codes: [String!]!) {
    tsCutoff2024sByInstCodes(inst_codes: $inst_codes) {
      sno
      inst_code
      institute_name
      place
      dist_code
      college_type
      branch_code
      branch_name
      oc_boys
      oc_girls
      bc_a_boys
      bc_a_girls
      bc_b_boys
      bc_b_girls
      bc_c_boys
      bc_c_girls
      bc_d_boys
      bc_d_girls
      bc_e_boys
      bc_e_girls
      sc_boys
      sc_girls
      st_boys
      st_girls
      ews_gen_ou
      ews_girls_ou
      tuition_fee
      affiliated_to
    }
  }
`;

export const GET_TS_CUTOFFS_2024_BY_RANK = gql`
  query TsCutoff2024sByRank($filter: RankFilterInput!) {
    tsCutoff2024sByRank(filter: $filter) {
      sno
      inst_code
      institute_name
      branch_code
      branch_name
      dist_code
      place
      dynamicCastes
      co_education
    }
  }
`;
export const GET_TS_CUTOFFS_2024_BY_RANK_DIST = gql`
  query TsCutoff2024sByInstDist($filter: InstDistFilterInput!) {
    tsCutoff2024sByInstDist(filter: $filter) {
      sno
      inst_code
      institute_name
      branch_code
      branch_name
      dist_code
      place
      dynamicCastes
    }
  }
`;