---
Title: Create and Deploy a Vue App
PrevPage: 02-create-and-deploy-react
NextPage: 04-understanding-chained-builds
ExitSign: Understanding Chained Builds
Sort: 4
---

### Create the Vue App

TODO

Let’s start with the React application. We will use create-react-app to create the React app that we will deploy in this workshop. ***TODO*** learn more link.

Run the following command to create your React app. Note: npx is a tool that comes with npm 5.2+ to run one-off commands. Check out more here.

```execute
npx create-react-app react-web-app
```

You should see output like this:

```
npx: installed 63 in 6.227s

Creating a new React app in /opt/app-root/src/react-web-app.

Installing packages. This might take a couple of minutes.
Installing react, react-dom, and react-scripts...

+ react@16.7.0
+ react-dom@16.7.0
+ react-scripts@2.1.3
added 1923 packages in 70.96s

Success! Created react-web-app at /opt/app-root/src/react-web-app
Inside that directory, you can run several commands:

  npm start
    Starts the development server.

  npm run build
    Bundles the app into static files for production.

  npm test
    Starts the test runner.

  npm run eject
    Removes this tool and copies build dependencies, configuration files
    and scripts into the app directory. If you do this, you can’t go back!

We suggest that you begin by typing:

  cd react-web-app
  npm start

Happy hacking!
```