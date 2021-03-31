# Project Repo Helper

This little app intends to make it easier to create repositories on an **organization** GitHub account.

It allows you to:

* Select an organization of which you're a member,
* Select a team within that organization,
* Select members within that team,
* Select a template to generate the repo from (or add your own),
* Set branch permissions in order to enforce a propre Git workflow.

It can come in handy when you want to "automate" repetitive tasks. It has limitations though (see further).

## Setup

For this to work, you need to create a new OAuth app under <https://github.com/organizations/YourOrganization/settings/applications>, so as to get a client id & secret.

* Install [yarn](https://yarnpkg.com/) : `npm install -g yarn`
* In both `client` and `server`, run `yarn install`
* In `client`, copy `.env.local.sample` as `.env.local` and adjust to your
OAuth settings
* In `server`, copy `.env.sample` as `.env` and adjust to your OAuth settings

## Run

* In both `client` and `server`, run `yarn start`

## Deploy

You should probably fork this repo, and change the `homepage` value in `client/package.json`

* Client (to GitHub Pages): `yarn deploy`
* Server (to Heroku): the `package.json` at the repo root should take care of everything.

## Limitations

### Branches and protections

The main limitation is that the branches and restrictions on these branches are "hardcoded" into the app.

* main branch (can be `main` or `master`, no problem)
* `dev` branch

Each of these branches has the same set of protections... Which might not be exactly what you want. This is all in the `setupBranchProtections` function, in the `client/src/api.js` file.

One idea would be to have predefined "sets" of parameters (e.g. in a JSON file), and to be able to choose one of them.

### ESLint

I reverted ESLint from 7.x to 6.8.x. Why in the hell did I do that?

Because React Scripts v4 will make you suffer, crashing your app for the tiniest semicolon error. v3.4.x is less of a pain in the ass.

Problem is, Standard styleguide from v15 doesn't seem to play well with older ESLint. This is why I stuck to v14 of `eslint-config-standard`, and also installed `eslint-plugin-standard` though it's marked as deprecated.
