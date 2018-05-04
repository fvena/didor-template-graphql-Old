import validator from 'validator';
import { Prisma } from 'prisma-binding';
import * as config from '../utils/vars';

const prisma = new Prisma({
  typeDefs: 'src/database/prisma.generated.graphql', // the auto-generated GraphQL schema of the Prisma API
  endpoint: config.PRISMA_ENDPOINT, // the endpoint of the Prisma API (value set in `.env`)
  secret: config.PRISMA_MANAGEMENT_API_SECRET, // Secret
  debug: true, // log all GraphQL queries & mutations sent to the Prisma API
});

// Custom Validator Rules
validator.noEmpty = field => !validator.isEmpty(field);
validator.required = field => typeof field !== 'undefined';
// validator.isUser = userId => prisma.exists.User({ id: userId });

async function validate(fields) {
  const errors = [];

  for (let i = 0; i < fields.length; i++) {
    const name = fields[i].name;
    const value = fields[i].value;
    const rules = fields[i].validate;
    const options = fields[i].options;

    for (let j = 0; j < rules.length; j++) {
      const rule = rules[j];

      if (typeof value === 'undefined') {
        if (rule === 'required') {
          errors.push(`Field ${name} no pass rule required`);
        }
      } else {
        const result = (options) ? await validator[rule](value,options) : await validator[rule](value); // eslint-disable-line

        if (!result) {
          errors.push(`Field ${name} no pass rule ${rule}`);
        }
      }
    }
  }

  if (errors.length) {
    throw new Error(errors);
  }

  return true;
}


export default validate;
