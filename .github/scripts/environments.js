"use strict";

const util = require("util");
const exec = util.promisify(require("child_process").exec);

const { BRANCH, SITEID } = process.env;

(async () => {
  await exec(`netlify link --id ${SITEID}`);
  console.log(process.env.BRANCH);

  const { stdout } = await exec(
    "netlify env:list --context production  --json"
  );
  const productEnvs = JSON.parse(stdout);

  // set branch specific env
  for (let [key, value] of Object.entries(productEnvs)) {
    await exec(`netlify env:set ${key} '${value}' --context '${BRANCH}'`);
  }
})()
  .then(() => {
    console.log("done");
  })
  .catch((e) => {
    console.error(e);
    return -1;
  });
