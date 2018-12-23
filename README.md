# create-my-card

Allow you to create your personal npm card with `npm init my-card`.

# Usage

```
npm init my-card
```

After answering the questions, it should create a new directory with the code to publish your `npm` card.

> If your current directory is already named the same as `<my-card-repo-name>`, then no new directory is created.

To test:

```
cd <my-card-repo-name>
npm install
node src/card
```

To publish:

```
npm publish
```

Your `npm` card package is published with a single JS bundle that's created with webpack so there's no dependencies.

To push your repo to your github account:

- First create an empty repo on github with the same repo name.
- Then run the following commands:

```
git init
git add .
git commit -m "first commit"
git remote add origin git@github.com:<your-github-id>/<your-repo-name>.git
git push -u origin master
```
