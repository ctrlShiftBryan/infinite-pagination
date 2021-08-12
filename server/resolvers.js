import list from "./streetNames.json";
import { UserInputError } from "apollo-server-express";

async function getStreetNames(parent, args) {
  // artificial delay
  await new Promise((resolve) => {
    setTimeout(
      () => {
        resolve();
      },
      args.delay ? 1000 : 0
    );
  });

  // init limit
  let first = 5;
  if (args.first !== undefined) {
    const min = 1;
    const max = 25;
    if (args.first < min || args.first > max) {
      throw new UserInputError(
        `Invalid limit value (min: ${min}, max: ${max})`
      );
    }
    first = args.first;
  }
  // init offset
  let after = 0;
  if (args.after !== undefined) {
    const index = list.findIndex((item) => item.hash === args.after);
    if (index === -1) {
      throw new UserInputError(`Invalid after value: cursor not found.`);
    }
    after = index + 1;
    if (after === list.length) {
      throw new UserInputError(
        `Invalid after value: no items after provided cursor.`
      );
    }
  }

  const streetNames = list.slice(after, after + first);
  const lastStreetName = streetNames[streetNames.length - 1];

  return {
    pageInfo: {
      endCursor: lastStreetName.hash,
      hasNextPage: after + first < list.length,
    },
    edges: streetNames.map((streetName) => ({
      cursor: streetName.hash,
      node: streetName,
    })),
  };
}

const resolvers = {
  Query: {
    streetNames: getStreetNames,
  },
};

export default resolvers;
