"use strict";

const util = require("util");
const exec = util.promisify(require("child_process").exec);

const { BRANCH, SITE_ID } = process.env;

if (!BRANCH || !SITE_ID || !NETLIFY_AUTH_TOKEN) {
  throw "Missing env variable: BRANCH, SITE_ID or NETLIFY_AUTH_TOKEN";
}

(async () => {
  await exec(`netlify link --id ${SITE_ID}`);

  const { stdout } = await exec(`netlify env:list --context ${BRANCH} --json`);
  const envs = JSON.parse(stdout);

  // remove
  console.log(`Removing ${Object.keys(envs).length} envs...`);
  for (let [key, value] of Object.entries(envs)) {
    await exec(`netlify env:unset ${key} --context '${BRANCH}'`);
  }
})()
  .then(() => {
    console.log("done");
  })
  .catch((e) => {
    console.error(e);
    return -1;
  });
