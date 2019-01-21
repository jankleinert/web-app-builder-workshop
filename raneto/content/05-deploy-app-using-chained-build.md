---
Title: Deploy the App Using a Chained Build
PrevPage: 04-understanding-chained-builds
NextPage: 06-tbd
ExitSign: Deploy the App Using a Chained Build
Sort: 6
---
### Deploying the App

Now that we’ve taken a look at the template, let’s see how we can easily deploy this application.

First, let's add the template file. From your `react-web-app` directory, run the following commands:

```execute
mkdir .openshiftio
touch .openshiftio/application.yaml
```

Using either `vi` or `nano` as your editor, open .openshiftio/application.yaml and paste in the following and save the file:

```copy
apiVersion: v1
kind: Template
metadata:
  name: react-web-app
  annotations:
    iconClass: icon-jboss
    tags: nodejs, react, web app
    template.openshift.io/provider-display-name: "Red Hat, Inc."
    description: Just building a little react app with a web builder
parameters:
  - name: SOURCE_REPOSITORY_URL
    description: The source URL for the application
    displayName: Source URL
    required: true
  - name: SOURCE_REPOSITORY_REF
    description: The branch name for the application
    displayName: Source Branch
    value: master
    required: true
  - name: SOURCE_REPOSITORY_DIR
    description: The location within the source repo of the application
    displayName: Source Directory
    value: .
    required: true
  - name: OUTPUT_DIR
    description: The location of the compiled static files from your web apps builder
    displayName: Output Directory
    value: build
    required: false
  - name: GOGS_WEBHOOK_SECRET
    description: A secret string used to configure the Gogs webhook.
    displayName: Gogs Webhook Secret
    required: true
    from: '[a-zA-Z0-9]{40}'
    generate: expression
objects:
- apiVersion: v1
  kind: ImageStream
  metadata:
    name: react-web-app-builder
  spec: {}
- apiVersion: v1
  kind: ImageStream
  metadata:
    name: react-web-app-runtime
  spec: {}
- apiVersion: v1
  kind: ImageStream
  metadata:
    name: web-app-builder-runtime
  spec:
    tags:
    - name: latest
      from:
        kind: DockerImage
        name: nodeshift/centos7-s2i-web-app:10.x
- apiVersion: v1
  kind: ImageStream
  metadata:
    name: nginx-image-runtime
  spec:
    tags:
    - name: latest
      from:
        kind: DockerImage
        name: 'centos/nginx-112-centos7:latest'
- apiVersion: v1
  kind: BuildConfig
  metadata:
    name: react-web-app-builder
  spec:
    output:
      to:
        kind: ImageStreamTag
        name: react-web-app-builder:latest
    postCommit: {}
    resources: {}
    source:
      git:
        uri: ${SOURCE_REPOSITORY_URL}
        ref: ${SOURCE_REPOSITORY_REF}
      contextDir: ${SOURCE_REPOSITORY_DIR}
      type: Git
    strategy:
      sourceStrategy:
        env:
          - name: OUTPUT_DIR
            value: ${OUTPUT_DIR}
        from:
          kind: ImageStreamTag
          name: web-app-builder-runtime:latest
        incremental: true
      type: Source
    triggers:
    - generic:
        secret: ${GOGS_WEBHOOK_SECRET}
      type: Generic
    - type: ConfigChange
    - imageChange: {}
      type: ImageChange
  status:
    lastVersion: 0
- apiVersion: v1
  kind: BuildConfig
  metadata:
    name: react-web-app-runtime
  spec:
    output:
      to:
        kind: ImageStreamTag
        name: react-web-app-runtime:latest
    postCommit: {}
    resources: {}
    source:
      type: Image
      images:
        - from:
            kind: ImageStreamTag
            name: react-web-app-builder:latest
          paths:
            - destinationDir: .
              sourcePath: /opt/app-root/output/.
    strategy:
      sourceStrategy:
        from:
          kind: ImageStreamTag
          name: nginx-image-runtime:latest
        incremental: true
      type: Source
    triggers:
    - generic:
        secret: ${GOGS_WEBHOOK_SECRET}
      type: Generic
    - type: ConfigChange
    - type: ImageChange
      imageChange: {}
    - type: ImageChange
      imageChange:
        from:
          kind: ImageStreamTag
          name: react-web-app-builder:latest
  status:
    lastVersion: 0
- apiVersion: v1
  kind: DeploymentConfig
  metadata:
    labels:
      app: react-web-app
    name: react-web-app
  spec:
    replicas: 1
    revisionHistoryLimit: 2
    selector:
      app: react-web-app
    strategy:
      rollingParams:
        timeoutSeconds: 3600
      type: Rolling
    template:
      metadata:
        labels:
          app: react-web-app
      spec:
        containers:
        - env:
          - name: KUBERNETES_NAMESPACE
            valueFrom:
              fieldRef:
                fieldPath: metadata.namespace
          image: react-web-app-runtime
          imagePullPolicy: IfNotPresent
          name: react-web-app-runtime
          ports:
          - containerPort: 8080
            name: http
            protocol: TCP
      metadata:
        labels:
          app: react-web-app
    triggers:
      - type: ConfigChange
      - type: ImageChange
        imageChangeParams:
          automatic: true
          containerNames:
            - react-web-app-runtime
          from:
            kind: ImageStreamTag
            name: 'react-web-app-runtime:latest'
- apiVersion: v1
  kind: Service
  metadata:
    labels:
      app: react-web-app
    name: react-web-app
  spec:
    ports:
    - name: http
      port: 8080
    selector:
      app: react-web-app
- apiVersion: v1
  kind: Route
  metadata:
    labels:
      app: react-web-app
    name: react-web-app
  spec:
    port:
      targetPort: 8080
    to:
      kind: Service
      name: react-web-app
```

Now that we have our application.yaml template file, let's load it into OpenShift.

```execute
oc apply -f ~/react-web-app/.openshiftio/application.yaml
```
Next, we'll create a new application based on that template. Note that we're passing in a name for the app. This is to avoid naming conflicts because we already have an app with the name `react-web-app` that you deployed earlier in the workshop.

```execute
oc new-app --name react-web-app-2 --template react-web-app -p SOURCE_REPOSITORY_URL=http://gogs-workshop.%cluster_subdomain%/%username%/react-web-app.git
```

Running those commands will kick off two builds. Open the web console in another browser tab and click on **Builds > Builds** in the navigation to view them. 

TODO: Screenshot of builds

Once the builds are complete, click **Overview* and you should see the running pod.

TODO: Screen showing the running pod

Click the route URL to navigate to the application. Just as you saw earlier in the workshop, this should load the Create React App example app, but this time it's running using NGINX rather than the serve module. 

TODO: Screenshot of create react app

Congratulations! Now that you've completed this lab, you know how to use templates, s2i, and chained builds to deploy modern, single page web apps on OpenShift.