import {Context} from "../pages/api/graphql";

const resolvers = {
  Query: {
    getColleges: async (_parent:any,_args:any, context: Context) => {
      return await context.prisma.college.findMany();
    },
    getCollege: async (_parent:any, args:any, context: Context) => {
      return await context.prisma.college.findUnique({
        where: { institute_code: args.institute_code }
      });
    },
},
  Mutation: {
    createCollege: async (_parent: any, args: any, context: Context) => {
      return await context.prisma.college.create({
        data: args,
      });
    },
  },
};
export default resolvers;