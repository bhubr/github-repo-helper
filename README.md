# Project Repo Helper

This little app intends to make it easier to create repositories on an **organization** GitHub account.

It allows you to:

* Select an organization of which you're a member,
* Select a team within that organization,
* Select members within that team,
* Select a template to generate the repo from (or add your own),
* Set branch permissions in order to enforce a propre Git workflow.

It can come in handy when you want to "automate" repetitive tasks.

## Limitations

The main limitation is that the branches and restrictions on these branches are "hardcoded" into the app.

* main branch (can be `main` or `master`, no problem)
* `dev` branch

Each of these branches has the same set of protections... Which might not be exactly what you want. This is all in the `setupBranchProtections` function, in the `client/src/api.js` file.

One idea would be to have predefined "sets" of parameters (e.g. in a JSON file), and to be able to choose one of them.

## Setup

For this to work, you need to create a new OAuth app under <https://github.com/organizations/YourOrganization/settings/applications>, so as to get a client id & secret.

* Install [pnpm](https://pnpm.js.org/) : `npm install -g pnpm`
* In both `client` and `server`, run `pnpm install`
* In `client`, copy `.env.local.sample` as `.env.local` and adjust to your
OAuth settings
* In `server`, copy `.env.sample` as `.env` and adjust to your OAuth settings

## Run

* In both `client` and `server`, run `pnpm install`

## Todo

There's definitely room for improvement. Right now