"use strict";
const exec = util.promisify(require("child_process").exec);

console.log("AUTH_TOKEN", process.env.NETLIFY_AUTH_TOKEN);

(async () => {
  await exec("netlify env:list");
})()
  .then(() => {
    console.log("done");
  })
  .catch((e) => {
    console.error(e);
  });
