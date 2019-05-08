---
Title: Web App Builder Workshop Introduction
NextPage: 01-web-app-overview
ExitSign: Web App Overview 
Sort: 1
---
### Workshop Overview

In this workshop, you will learn how to deploy modern single page web apps, such as ones created with React or Vue, to Red Hat OpenShift using a source-to-image (S2I) builder image for web apps.

First, you'll learn how to quickly deploy single page web apps for development purposes. Then, we'll cover how to combine the S2I image with a current HTTP server image, like NGINX, using an OpenShift chained build.

During the workshop, we will deploy a React app, but you could follow a similar process for other frameworks as well.

### Getting Familiar with the Workshop Environment

During the workshop, all of the instructions will be here in this panel on the left side of your screen. The right side of the screen a browser-based terminal window.

As you complete the workshop, you will encounter commands that you need to execute, like the one below. When you see the play button icon in a code block, you can click that code block and the command will execute in the terminal.

Try it now!

#### Click the code block to execute:

```execute-1
echo "Hello from the terminal"
```

You will also see some code blocks with the scissors icon. When you click those code blocks, the text inside will be copied to your clipboard so that you can paste it to a different application or browser window.

#### Click the text to copy and then paste it in the terminal:

```copy
echo "Copying text to the clipboard"
```

### Logging into OpenShift

In order to log in, we will use the `oc login` command. Using the terminal to the right, you can use:

```execute
oc login
```

You don't need to specify the endpoint for the OpenShift cluster, as the terminal has been pre-configured with the correct location for the workshop environment.

Enter the username and password provided to you by the instructor. Your username should be `%username%`. You should see output similar to the following:

```
Login successful.

You have one project on this server: "%username%"

Using project "%username%".
```

You are now authenticated to the OpenShift server.

Projects are a top level concept to help you organize your deployments. An OpenShift project allows a community of users (or a user) to organize and manage their content in isolation from other communities. Each project has its own resources, policies (who can or cannot perform actions), and constraints (quotas and limits on resources, etc). Projects act as a “wrapper” around all the application services and endpoints you (or your teams) are using for your work.

You should already have a project created, and the name of the project should match your username.

If you did not see a project listed when you logged in, then create one now. Use your username as the argument to `oc new-project`:

```execute
oc new-project %username%
```

### Viewing the OpenShift Web Console

OpenShift also ships with a web-based console that will allow users to perform various tasks via a browser. The web console can be accessed at:

https://%web_console_url%

The first screen you will see is the authentication screen. Enter your username and password and then log in. After you have authenticated to the web console, you will be presented with a list of projects that your user has permission to work with.

Click on the `%username%` project to be taken to the project overview page which will list all of the routes, services, deployments, and pods that you have running as part of your project. There’s nothing there now, but that’s about to change.

### Acknowledgements

A lot of the content for this workshop was adapted from Lucas Holmquist's [series of blog posts](https://developers.redhat.com/blog/2018/10/04/modern-web-apps-openshift-part-1/) on the Red Hat Developer blog. Thanks, Lucas!

Let's get started!