# create-my-card

Allow you to create your personal npm card with `npm init my-card`.

Your card's code is bundled into a single JS file with webpack so it has no dependencies.

# Usage

## Init

```
npm init my-card
```

After answering the questions, it should create a new directory with the code to publish your `npm` card.

> If your current directory is already named the same as `<my-card-repo-name>`, then no new directory is created.

## Test

```
cd <my-card-repo-name>
npm install
node src/card
```

## Publish

### First Version

```
npm version major
npm publish
```

### Update Versions

```
npm version patch
npm publish
```

Your `npm` card package is published with a single JS bundle that's created with webpack so there's no dependencies.

## GitHub Push

To push your repo to your github account:

- First create an empty repo on github with the same repo name.
- Then run the following commands:

```
git init
git add .
git commit -m "first commit"
git remote add origin git@github.com:<your-github-id>/<your-repo-name>.git
git push --set-upstream origin master
```

# Demo

## Creating

![Init your card][init-your-card]

[init-your-card]: ./images/demo1.png
