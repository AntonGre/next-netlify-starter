"use strict";

const util = require("util");
const exec = util.promisify(require("child_process").exec);

(async () => {
  await exec("netlify link --id '08a94377-dc9d-4a7e-a460-d465edb91e12'");
  const { stdout } = await exec(
    "netlify env:list --context production  --json"
  );

  const netEnvs = JSON.parse(stdout);

  // set branch specific to env names
  for (let [key, value] of Object.entries(netEnvs)) {
    console.log("asd");
    await exec(`netlify env:set ${key} '${value}' --context split-test-branch`);
  }
})()
  .then(() => {
    console.log("done");
  })
  .catch((e) => {
    console.error(e);
    return -1;
  });
