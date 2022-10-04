"use strict";

const util = require("util");
const exec = util.promisify(require("child_process").exec);

const { BRANCH, SITE_ID } = process.env;

if (!BRANCH || !SITE_ID) {
  throw "Missing env variable: BRANCH, SITE_ID";
}

(async () => {
  await exec(`netlify link --id ${SITE_ID}`);

  const { stdout } = await exec(`netlify env:list --context ${BRANCH} --json`);
  const envs = JSON.parse(stdout);

  // remove branch specific envs
  console.log(`Removing ${Object.keys(envs).length} envs...`);
  for (let [key, value] of Object.entries(envs)) {
    await exec(`netlify env:unset ${key} --context '${BRANCH}'`);
  }

  const siteResponse = await exec(
    `netlify api getSite --data '${JSON.stringify({ siteId: SITE_ID })}' --json`
  );
  const siteData = JSON.parse(siteResponse.stdout);
  const allowedBranches = siteData.build_settings.allowed_branches;

  // remove branch to build settings
  if (allowedBranches.indexOf(BRANCH) > -1) {
    allowedBranches.splice(allowedBranches.indexOf(BRANCH), 1);
    console.log("Removing from allowed branches...");
    await exec(
      `netlify api updateSite --data '${JSON.stringify({
        siteId: SITE_ID,
        body: {
          build_settings: {
            allowed_branches: allowedBranches,
          },
        },
      })}'`
    );
  }
})()
  .then(() => {
    console.log("done");
  })
  .catch((e) => {
    console.error(e);
    process.exitCode = -1;
  });
