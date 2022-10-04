"use strict";

const util = require("util");
const exec = util.promisify(require("child_process").exec);

const { BRANCH, SITE_ID } = process.env;

console.log(process.env);

if (!BRANCH || !SITE_ID) {
  throw "Missing env variable: BRANCH, SITE_ID";
}

(async () => {
  await exec(`netlify link --id ${SITE_ID}`);

  const { stdout } = await exec(
    "netlify env:list --context production  --json"
  );
  const productEnvs = JSON.parse(stdout);

  // set production env to branch specific env
  console.log(
    `Adding production  ${Object.keys(productEnvs).length} envs to branch...`
  );
  for (let [key, value] of Object.entries(productEnvs)) {
    await exec(`netlify env:set ${key} '${value}' --context '${BRANCH}'`);
  }

  const siteResponse = await exec(
    `netlify api getSite --data '${JSON.stringify({ siteId: SITE_ID })}' --json`
  );
  const siteData = JSON.parse(siteResponse.stdout);
  const allowedBranches = siteData.build_settings.allowed_branches;

  // add branch to build settings
  if (allowedBranches.indexOf(BRANCH) === -1) {
    console.log("Adding to allowed branches...");
    await exec(
      `netlify api updateSite --data '${JSON.stringify({
        siteId: SITE_ID,
        body: {
          build_settings: {
            allowed_branches: allowedBranches.concat([BRANCH]),
          },
        },
      })}'`
    );
  }

  // Branch deploy
  console.log("creating branch deploy");
  await exec(
    `netlify api createSiteDeploy --data '${JSON.stringify({
      siteId: SITE_ID,
      body: {
        branch: BRANCH,
      },
    })}'`
  );
})()
  .then(() => {
    console.log("done");
  })
  .catch((e) => {
    console.error(e);
    process.exitCode = -1;
  });
