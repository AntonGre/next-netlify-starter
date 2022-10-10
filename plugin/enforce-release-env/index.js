function setEnvValue(key, value) {
  process.env[key] = value;
}

module.exports = {
  onPreBuild: async ({ constants, utils: { run }, netlifyConfig }) => {
    const { CONTEXT } = process.env;
    const { SITE_ID, IS_LOCAL } = constants;

    if (CONTEXT !== "deploy-preview") {
      console.log("context is not deploy-preview existing...");
      return;
    }

    const { stdout } = await run.command(
      "netlify env:list --context deploy-preview --json"
    );
    const envs = JSON.parse(stdout);
    Object.entries(envs).map(([key, value]) => setEnvValue(key, value));
    console.log("Setup enviorment variables ");
  },
};
