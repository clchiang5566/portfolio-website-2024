# Next.js redux starter
An opinionated Next.js starter kit with Redux, axios, eslint, and react-testing-library.

## About
This project is built for common website project structure used for CL CHIANG.

## Features
- ▲ Based on latest [Next.js](https://github.com/zeit/next.js)
- 🚄 Dynamic routing with [next-routes](https://github.com/fridays/next-routes).
- 🗄  State management with [redux](https://github.com/reactjs/redux), [react-redux](https://github.com/reactjs/react-redux), and [next-redux-wrapper](https://github.com/kirill-konshin/next-redux-wrapper)
- 🐐 Unit testing with [react-testing-library](https://github.com/testing-library/react-testing-library)
- 🛀 Linting staged changes on [husky](https://www.npmjs.com/package/husky)
- ⛑ [Immutable.js](https://github.com/facebook/immutable-js/), [dotenv](https://github.com/motdotla/dotenv), and more...

## Getting started
- nodejs version: 18.16.0
```
git clone https://gitlab.com/fitch-hk/nextjs-boilerplate my-project
cd my-project
yarn
yarn develop
```

create a new env file ".env.local" at the root of the project directory, with the following content:
```
LOCAL_BASE=http://localhost:3000
```

Then open `http://localhost:3000/` to see your app.

### Deployment
After `yarn build` finished, run

```
yarn start
```

## Structure overview
```
├── README.md
├── ecosystem.config.js
├── package-lock.json
├── package.json
├── platform-start.js
├── public
├── src
│   ├── components
│   │   └── Todo
│   │       ├── Todo.module.scss
│   │       └── index.jsx
│   ├── pages
│   │   ├── _app.js
│   │   ├── _document.js
│   │   └── index.js
│   ├── redux
│   │   ├── state.js
│   │   ├── store.js
│   │   └── todo
│   │       ├── todo.action.js
│   │       ├── todo.reducer.js
│   │       └── todo.selector.js
│   └── utils
├── yarn-error.log
└── yarn.lock
```

## version history
12 Dec 2022 - NEXT.js updated to version 13, require node version >= 14