function setEnvValue(key, value) {
  process.env[key] = value;
}

module.exports = {
  onPreBuild: async ({ constants, utils: { run }, netlifyConfig }) => {
    const { CONTEXT } = process.env;
    const { SITE_ID, IS_LOCAL } = constants;

    console.log(CONTEXT);

    // if (CONTEXT !== "deploy-preview") {
    //   console.log("context is not deploy-preview existing...");
    //   return;
    // }

    const as = await run.command("netlify");
    console.log(as);

    const { stdout } = await run.command(
      "netlify env:list --context deploy-preview --json"
    );
    const envs = JSON.parse(stdout);
    Object.entries(envs).map(([key, value]) => setEnvValue(key, value));
    console.log("Setup environment variables");
  },
};
