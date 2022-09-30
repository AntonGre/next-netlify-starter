"use strict";

const util = require("util");
const exec = util.promisify(require("child_process").exec);

console.log("AUTH_TOKEN", process.env.NETLIFY_AUTH_TOKEN);

(async () => {
  await exec("netlify link --id '08a94377-dc9d-4a7e-a460-d465edb91e12'");
  const test = await exec("netlify env:list --json");
  console.log(test);
})()
  .then(() => {
    console.log("done");
  })
  .catch((e) => {
    console.error(e);
  });
