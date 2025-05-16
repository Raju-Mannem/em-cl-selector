import { Context } from "../pages/api/graphql";
import { GraphQLScalarType, Kind } from "graphql";
import { Decimal } from "@prisma/client/runtime/library";

function toNumber(val: any): number | null {
  if (val === null || val === undefined) return null;
  if (typeof val === "number") return val;
  if (typeof val === "string") {
    const n = Number(val);
    return isNaN(n) ? null : n;
  }
  if (val instanceof Decimal) return val.toNumber();
  return null;
}

// JSON Scalar for dynamic fields
const JSONScalar = new GraphQLScalarType({
  name: "JSON",
  description: "Arbitrary JSON value",
  parseValue: (value) => value,
  serialize: (value) => value,
  parseLiteral(ast) {
    switch (ast.kind) {
      case Kind.STRING:
      case Kind.BOOLEAN:
        return ast.value;
      case Kind.INT:
      case Kind.FLOAT:
        return parseFloat(ast.value);
      case Kind.OBJECT: {
        const value = Object.create(null);
        ast.fields.forEach((field) => {
          value[field.name.value] = this.parseLiteral!(field.value);
        });
        return value;
      }
      case Kind.LIST:
        return ast.values.map((n) => this.parseLiteral!(n));
      default:
        return null;
    }
  },
});

const resolvers = {
  JSON: JSONScalar,
  Query: {
    getColleges: async (_parent: any, _args: any, context: Context) => {
      return await context.prisma.college.findMany();
    },
    getCollege: async (_parent: any, args: any, context: Context) => {
      return await context.prisma.college.findUnique({
        where: { institute_code: args.institute_code },
      });
    },
    tsCutoff2025s: async (
      _parent: any,
      args: { limit?: number; offset?: number },
      context: Context
    ) => {
      const limit = args.limit ?? 50;
      const offset = args.offset ?? 0;

      const [rows, totalCount] = await Promise.all([
        context.prisma.ts_cutoff_2025.findMany({
          skip: offset,
          take: limit,
          orderBy: { sno: "asc" }, // Or any other ordering you prefer
        }),
        context.prisma.ts_cutoff_2025.count(),
      ]);

      return { rows, totalCount };
    },
    tsCutoff2025: async (
      _parent: any,
      args: { sno: number },
      context: Context
    ) => {
      return await context.prisma.ts_cutoff_2025.findUnique({
        where: { sno: args.sno },
      });
    },
    tsCutoff2025sByInstCodes: async (
      _parent: any,
      args: { inst_codes: string[] },
      context: Context
    ) => {
      return await context.prisma.ts_cutoff_2025.findMany({
        where: {
          inst_code: { in: args.inst_codes },
        },
      });
    },
    tsCutoff2025sByRank: async (
      __parent: any,
      args: { filter: any },
      context: Context
    ) => {
      const { minRank, maxRank, branchCodes, casteColumns, distCodes } =
        args.filter;

      // 1. Fetch all rows for selected districts
      const rows = await context.prisma.ts_cutoff_2025.findMany({
        where: {
          branch_code: { in: branchCodes },
          dist_code: { in: distCodes },
        },
      });

      // console.log("Rows from DB:", rows.length);
      // if (rows.length > 0) {
      //   console.log("Sample row:", rows[0]);
      //   console.log("Caste columns requested:", casteColumns);
      //   console.log("Min/Max rank:", minRank, maxRank);
      // }

      // 2. Filter rows: ALL selected caste columns must be within [minRank, maxRank]
      const filteredRows = rows.filter((row) =>
        casteColumns.every((col: any) => {
          const value = toNumber(row[col as keyof typeof row]);
          return value !== null && value >= minRank && value <= maxRank;
        })
      );
      // console.log('Filtered rows:', filteredRows.length);

      // ⬇️ NEW GROUP + SORT LOGIC ⬇️

      // Group by inst_code (college)
      const groupedByCollege: Record<string, typeof filteredRows> = {};
      for (const row of filteredRows) {
        if (!groupedByCollege[row.inst_code!]) {
          groupedByCollege[row.inst_code!] = [];
        }
        groupedByCollege[row.inst_code!].push(row);
      }

      // Sort college groups by minimum rank among their caste columns
      const sortedCollegeGroups = Object.values(groupedByCollege).sort(
        (groupA, groupB) => {
          const minRankA = Math.min(
            ...groupA.flatMap((row) =>
              casteColumns
                .map((col: any) => toNumber(row[col as keyof typeof row]))
                .filter((v:any) => v !== null)
            )
          );
          const minRankB = Math.min(
            ...groupB.flatMap((row) =>
              casteColumns
                .map((col: any) => toNumber(row[col as keyof typeof row]))
                .filter((v:any) => v !== null)
            )
          );
          return minRankA - minRankB;
        }
      );

      // Flatten to get final sorted rows
      const sortedRows = sortedCollegeGroups.flat();

      // 4. Map to result
      return sortedRows.map((row) => ({
        sno: row.sno,
        inst_code: row.inst_code,
        institute_name: row.institute_name,
        place: row.place,
        dist_code: row.dist_code,
        branch_code: row.branch_code,
        branch_name: row.branch_name,
        dynamicCastes: Object.fromEntries(
          casteColumns.map((col: any) => [col, row[col as keyof typeof row]])
        ),
      }));
    },
    tsCutoff2025sByInstDist: async (
      __parent: any,
      args: { filter: any },
      context: Context
    ) => {
      const { instCodes, branchCodes, casteColumns, distCodes } = args.filter;

      const rows = await context.prisma.ts_cutoff_2025.findMany({
        where: {
          inst_code: { in: instCodes },
          dist_code: { in: distCodes },
          branch_code: { in: branchCodes },
        },
      });
      // console.log(rows);

      return rows.map((row) => ({
        sno: row.sno,
        inst_code: row.inst_code,
        institute_name: row.institute_name,
        place: row.place,
        dist_code: row.dist_code,
        branch_code: row.branch_code,
        branch_name: row.branch_name,
        dynamicCastes: Object.fromEntries(
          casteColumns.map((col: String) => [col, row[col as keyof typeof row]])
        ),
      }));
    },
  },

  Mutation: {
    createCollege: async (_parent: any, args: any, context: Context) => {
      return await context.prisma.college.create({
        data: args.data,
      });
    },
    createTsCutoff2025: async (_parent: any, args: any, context: Context) => {
      return await context.prisma.ts_cutoff_2025.create({
        data: args.data,
      });
    },
    updateTsCutoff2025: async (
      _parent: any,
      args: { sno: number; data: any },
      context: Context
    ) => {
      return await context.prisma.ts_cutoff_2025.update({
        where: { sno: args.sno },
        data: args.data,
      });
    },
    deleteTsCutoff2025: async (
      _parent: any,
      args: { sno: number },
      context: Context
    ) => {
      return context.prisma.ts_cutoff_2025.delete({
        where: { sno: args.sno },
      });
    },
  },
};
export default resolvers;
