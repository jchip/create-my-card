# create-my-card

Allow you to create your personal [npm] card with `npm init my-card`.

Your card's code is bundled into a single JS file with webpack so it has no dependencies.

# Usage

## Init

```
npm init my-card
```

After answering the questions, it should create a new directory with the code to publish your [npm] card.

> If your current directory is already named the same as `<my-card-repo-name>`, then no new directory is created.

## Test

```
cd <my-card-repo-name>
npm install
node src/card
```

## Publish

### First Version

The very first time you publish your card, do a `npm version major` to bring your package version to `1.0.0`.

```
npm version major
npm publish
```

### Update Versions

To publish patches to your card, do a `npm version patch`.

```
npm version patch
npm publish
```

Your [npm] card package is published with a single JS bundle that's created with webpack so there's no dependencies.

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

## Initializing Card

![Initialize Card][init-your-card]

## Pushing to GitHub

Create empty repo:

![Create empty repo][create-empty-repo]

Push repo:

![Push repo][push-repo]

## Publish to [npm]

Publish first verion (using `npm version major`)

![Publish first version][publish-1]

Scrolling down:

![Publish scroll down][publish-2]

And profit:

![npx][npx]

---

[create-empty-repo]: ./images/new-repo.png
[push-repo]: ./images/push-repo.png
[init-your-card]: ./images/demo1.png
[publish-1]: ./images/publish-1.png
[publish-2]: ./images/publish-2.png
[npx]: ./images/npx.png
[npm]: https://www.npmjs.com/
