---
Title: Overview of Modern, Single Page Web Apps
PrevPage: index
NextPage: 02-create-and-deploy-react
ExitSign: Deploy a React App
Sort: 2
---
### Workshop Overview

Before we begin, let's define what we mean -- in the context of this workshop -- by modern, or single page, web application and how it differs from a standard Node.js app.

A modern web application is built using something like React, Vue, Angular, or Ember, where there is a build step that produces static HTML, JavaScript, and CSS. This build step usually does a few different tasks, like concatenation, transpilation (e.g. Babel), and minifying of the files. Each of the major frameworks has its own build process and pipeline, but tools like Webpack, Grunt, and Gulp also fall into this category. No matter what tool is used, they all use Node.js to run the build processes.

But the static content that is generated (compiled) doesn’t necessarily need a Node.js process to serve it. Yes, you could use something like the serve module, which is nice for development since you can see your site quickly, but for production deployments, it is usually recommended to use something like NGINX or Apache HTTP Server.

A “pure” Node.js application, on the other hand, will use a Node.js process to run and can be something like an Express.js application (that is, a REST API server), and there isn’t usually a build step. Development dependencies are usually not installed since we only want the dependencies that the app uses to run.

In the next section, you'll create a React app and deploy it to OpenShift.
