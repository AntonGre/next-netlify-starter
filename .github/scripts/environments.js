"use strict";

const core = require("@actions/core");
const github = require("@actions/github");

console.log(process.env.NETLIFY_AUTH_TOKEN);
core.console.log(JSON.stringify(github.context, undefined, 2));
