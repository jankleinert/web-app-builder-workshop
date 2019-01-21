---
Title: Create and Deploy a React App
PrevPage: 01-web-app-overview
NextPage: 03-create-and-deploy-vue
ExitSign: Create and Deploy a Vue App
Sort: 3
---

### Create the React App

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

Assuming you are in the newly created project directory, you can now run the second command to deploy the app to OpenShift:

```execute
oc new-app nodeshift/centos7-s2i-web-app
```

Your OpenShift web console will look something like this:

Screenshot of OpenShift web console after deploying the React app

And here’s what the web console looks like when you run the application:

Screenshot of what the web console looks like when you run the React app

Before we get into the Angular example, let’s see what that last command was doing.

First, we see npx nodeshift. We are using npx to run the nodeshift module. As I’ve mentioned in previous posts, nodeshift is a module for easily deploying node apps to OpenShift.

Next, let’s see what options are being passed to nodeshift. The first is --strictSSL=false. Since we are using minishift, which is using a self-signed certificate, we need to tell nodeshift (really, we are telling the request library, which is used under the covers), about this so a security error isn’t thrown.

Next is --dockerImage=bucharestgold/centos7-s2i-web-app --imageTag=10.x. This tells nodeshift we want to use the new Web App Builder image and we want to use its 10.x tag.

Next, we want to tell the S2I image that we want to use yarn: --build.env YARN_ENABLED=true. And finally, the --expose flag tells nodeshift to create an OpenShift route for us, so we can get a publicly available link to our application.

Since this is a “get on OpenShift quickly” post, the S2I image uses the serve module to serve the generated static files. In a later post, we will see how to use this S2I image with NGINX.