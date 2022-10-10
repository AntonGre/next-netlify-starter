const util = require('util');
const fs = require('fs');
const exec = util.promisify(require('child_process').exec);
const debug = true;

(async () => {
  const envs = JSON.parse(fs.readFileSync('output.json', 'utf-8'));

  if (!debug) {
    const response = await exec(`netlify env:list --json`);
    const envList = JSON.parse(response.stdout);

    for (let key of Object.keys(envList)) {
      await exec(`netlify env:unset ${key}`);
    }
  }

  const newEnvs = {};

  for (let [key, value] of Object.entries(envs)) {
    if (key.startsWith('NEXT_')) {
      insertObject(key, value, 'dev');
      newEnvs[key]['deploy-preview'] = newEnvs[key]['deploy-preview']
        ? newEnvs[key]['deploy-preview']
        : value;
      newEnvs[key]['branch-deploy'] = newEnvs[key]['branch-deploy']
        ? newEnvs[key]['branch-deploy']
        : value;
      newEnvs[key]['production'] = newEnvs[key]['production']
        ? newEnvs[key]['production']
        : value;
    } else if (key.startsWith('PRODUCTION_')) {
      const envKey = key.split('PRODUCTION_')[1];
      insertObject(envKey, value, 'production');
    } else if (key.startsWith('T_TEST_')) {
      // do nothing
    } else if (key.startsWith('TEST_')) {
      // do nothing
    } else if (key.startsWith('MASTER_')) {
      // do nothing
    } else {
      newEnvs[key] = {
        production: value,
        'deploy-preview': value,
        'branch-deploy': value,
        dev: value
      };
    }
  }

  function insertObject(envKey, value, context) {
    if (!newEnvs[envKey]) {
      newEnvs[envKey] = {};
    }

    newEnvs[envKey][context] = value;
  }

  fs.writeFileSync('envEnvs.json', JSON.stringify(newEnvs));

  // inserting env values
  console.log('inserting new env values');
  for (let name of Object.keys(newEnvs)) {
    const config = newEnvs[name];
    console.log(`inserting ${name}`);
    for (let [context, value] of Object.entries(config)) {
      await exec(`netlify env:set ${name} '${value}' --context ${context}`);
    }
  }
})()
  .then(() => {
    console.log('done');
  })
  .catch((e) => {
    console.error(e);
  });
