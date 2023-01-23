<a href="https://app.zenhub.com/workspaces/wishing-plan-637b3ad68b9646001dfac86a/board"><img src="https://dxssrr2j0sq4w.cloudfront.net/3.2.0/img/external/zenhub-badge.png" alt="ZenHub logo"></a>
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=Andreasgdp_Wishing-Plan&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=Andreasgdp_Wishing-Plan)
[![CodeQL](https://github.com/Andreasgdp/Wishing-Plan/actions/workflows/codeql.yml/badge.svg)](https://github.com/Andreasgdp/Wishing-Plan/actions/workflows/codeql.yml)
[![CodeScene Code Health](https://codescene.io/projects/33413/status-badges/code-health)](https://codescene.io/projects/33413)
[![CodeScene System Mastery](https://codescene.io/projects/33413/status-badges/system-mastery)](https://codescene.io/projects/33413)

# Wishing Plan

Wishing Plan allows the user to tracks savings and calculates purchase feasibility of the user's wishes. It will also become a hub for planning bigger purchases with others, creating individual or collective wish lists to share on occasions like birthdays, Christmas and more.

<div align="center">
    <img align="center" width="600" alt="" src="https://user-images.githubusercontent.com/39928082/213713001-b72c08f2-e861-4851-b58a-4fcf727ffeff.gif" />
</div>

# Open Source

Wishting Plan is an open source project. We welcome contributions from the community. There are many ways to contribute to the project, from writing tutorials or blog posts, submitting bug reports and feature requests or writing code which can be incorporated into Wishing Plan itself. Here is a list of some of the ways you can contribute to the project:

-   [Report bugs](https://github.com/Andreasgdp/Wishing-Plan/issues/new/choose) - If you find a bug, please report it in the issue tracker.
-   [Suggest new features](https://github.com/Andreasgdp/Wishing-Plan/issues/new/choose) - If you have an idea for a new feature, please suggest it in the issue tracker.
-   [Implement new features](https://github.com/Andreasgdp/Wishing-Plan/issues/new/choose) - If you want to implement a new feature, please create an issue in the issue tracker and describe the feature you want to implement. This will allow us to discuss the feature and make sure it fits with the project.
-   [Improve code quality](https://github.com/Andreasgdp/Wishing-Plan#repo-health-information) - We use SonarCloud and CodeScene to measure the code quality of our project. You can help us improve the code quality by fixing bugs and vulnerabilities.
-   Improve documentation - If you find any errors in the documentation or want to improve it, please contribute with a pull request.
-   In the future, we will want to implement translations of the app. If you are interested in helping us with this, please contact us at [wishing.plan.com@gmail.com](mailto: 'wishing.plan.com@gmail.com').

# Development

## Getting started

### Pre-requisites

-   Use node version "^12.19.0 || ^14.15.0 || ^16.13.0 || ^18.12.0"
    -   This is because of the compatibility of next-auth@4.17.0
-   Install yarn globally `npm install -g yarn`
-   Insdall Docker e.g., Docker Desktop for Windows or Docker Engine for Linux. See [Docker installation](https://docs.docker.com/get-docker/) for more information.
    -   This is to have a local database for development.

#### Windows

-   Install win-node-env globally `npm install -g win-node-env` to be able to run e.g., `yarn db-seed` on Windows.

### Installation and setup

-   Clone the repository
-   Create local .env `cp .env.example .env` and fill in the values
-   Install dependencies `yarn install` or just `yarn`
-   Start the database `docker-compose up -d`
-   Run `yarn db-push` to migrate the database
-   Run `yarn db-seed` to seed the database with test data
-   Run the development server `yarn dev`

## [Project Board](https://app.zenhub.com/workspaces/wishing-plan-637b3ad68b9646001dfac86a/board)

**IMPORTANT**: In order to see our project board on ZenHub, you need to have an account and have connected it with your GitHub account.

For development management we are using [ZenHub Board](https://app.zenhub.com/workspaces/wishing-plan-637b3ad68b9646001dfac86a/board). It is recommended to install the browser [extension for ZenHub](https://chrome.google.com/webstore/detail/zenhub-for-github/ogcgkffhplmphkaahpmffcafajaocjbd?hl=en), to be able to view information from our ZenHub board within GitHub.

**NOTE:** ZenHub is not required however, as the issues we are working on are shared between GitHub and ZenHub.

## Repo health information

Here is the current overview of the code health of the repository measured by:

-   Sonarcloud: https://sonarcloud.io/summary/overall?id=Andreasgdp_Wishing-Plan
-   CodeScene: https://codescene.io/projects/33413/jobs/781250/results

### External links for development

-   Component library: https://chakra-ui.com/docs/components

## Web Info

The smallest width we will accomidate for the webpage is 240px.

# Learn More

This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`.
To learn more about the [T3 Stack](https://create.t3.gg/), take a look at the following resources:

-   [Documentation](https://create.t3.gg/)
-   [Learn the T3 Stack](https://create.t3.gg/en/faq#what-learning-resources-are-currently-available) — Check out these awesome tutorials
