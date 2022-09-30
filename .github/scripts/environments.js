"use strict";

const util = require("util");
const exec = util.promisify(require("child_process").exec);

(async () => {
  await exec("netlify link --id '08a94377-dc9d-4a7e-a460-d465edb91e12'");
  const netEnvs = await exec("netlify env:list --context production  --json");

  // set branch specific to env names
  for (let [key, value] of Object.entries(netEnvs)) {
    await exec(`netlify env:set ${key} ${value} --context branch`);
  }
})()
  .then(() => {
    console.log("done");
  })
  .catch((e) => {
    console.error(e);
  });
