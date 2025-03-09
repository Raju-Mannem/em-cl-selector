const typeDefs= `#graphql
type College {
    sno: ID!
    institute_code: String!
    institute_name: String!
    place: String!
    district_name: String!
    college_type: String!
    co_educ: String!
    affiliated_to: String!
  }
  
  type Query {
    getCollege(institute_code: String!): College
    getColleges: [College!]!
  }

  type Mutation {
    createCollege(
      institute_code: String!
      institute_name: String!
      place: String!
      district_name: String!
      college_type: String!
      co_educ: String!
      affiliated_to: String!
    ): College
}
`
export default typeDefs;