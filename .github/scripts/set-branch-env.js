"use strict";

const util = require("util");
const exec = util.promisify(require("child_process").exec);

const { BRANCH, SITE_ID } = process.env;

if (!BRANCH || !SITE_ID) {
  throw "Missing env variable: BRANCH, SITE_ID";
}

(async () => {
  await exec(`netlify link --id ${SITE_ID}`);

  const { stdout } = await exec(
    "netlify env:list --context production  --json"
  );
  const productEnvs = JSON.parse(stdout);

  // set branch specific env
  console.log(`Adding ${Object.keys(productEnvs).length} envs...`);
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
