const util = require("util");
const exec = util.promisify(require("child_process").exec);

function setEnvValue(key, value) {
  process.env[key] = value;
}

module.exports = {
  onPreBuild: async ({ constants, utils: { run }, netlifyConfig }) => {
    const { CONTEXT } = process.env;
    const { SITE_ID, IS_LOCAL } = constants;

    // if (CONTEXT !== "deploy-preview") {
    //   console.log("Existing... Context is not deploy-preview...");
    //   return;
    // }

    await run.command(`netlify link --id ${SITE_ID}`);

    const { stdout } = await run.command(
      "netlify env:list --context deploy-preview --json"
    );

    const envs = JSON.parse(stdout);
    Object.entries(envs).map(([key, value]) => setEnvValue(key, value));
    console.log("Setup environment variables");
  },
};
