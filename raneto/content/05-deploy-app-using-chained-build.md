---
Title: Deploy the App Using a Chained Build
PrevPage: 04-understanding-chained-builds
NextPage: 06-tbd
ExitSign: Deploy the App Using a Chained Build
Sort: 6
---
### Deploying the App

Now that we’ve taken a look at the template, let’s see how we can easily deploy this application.

We can use the OpenShift Client tool oc to deploy our template:

```
$ find . | grep openshiftio | grep application | xargs -n 1 oc apply -f

$ oc new-app --template react-web-app -p SOURCE_REPOSITORY_URL=https://github.com/lholmquist/react-web-app
```

The first command above is just an overly engineered way of finding the `./openshiftio/application.yaml` template.

The second creates a new application based on that template.

Once those commands are run, we can see that there are two builds:

Screen showing the two builds

Back on the Overview screen, we should see the running pod:

Screen showing the running pod

Clicking the link should navigate to our application, which is the default React App page:

Screen that is displayed after navigating to the app