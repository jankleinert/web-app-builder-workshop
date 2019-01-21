---
Title: Understanding Chained Builds
PrevPage: 03-create-and-deploy-vue
NextPage: 05-deploy-app-using-chained-build
ExitSign: Deploy the App Using a Chained Build
Sort: 5
---
### Chained Builds

To quote the official OpenShift documentation on chained builds:

“Two builds can be chained together: one that produces the compiled artifact, and a second build that places that artifact in a separate image that runs the artifact.”

What this means is that we can use the Web App Builder image to run our build, and then we can use a web server image, like NGINX, to serve our content.

This allows us to use the Web App Builder image as a “pure” builder and also keep our runtime image small.

Let’s take a look at an example to see how this all comes together by adding an OpenShift template file to our React app to piece everything together.

You can find can example of the template file [here](https://github.com/jankleinert/react-web-app/blob/master/.openshiftio/application.yaml).

Let’s take a look at some of the more important parts of this file.

```
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
```

The first 3 entries in the parameters section are for specifying your source repo's URL, branch name, and directory within the repo. The OUTPUT_DIR parameter is the location where the compiled static files are located. For our React app, we don’t need to do anything special, since the default value (`build`) is what React uses. If you were using another framework with a differently-named output directory, that's where you could change it.

Now let’s take a look at the image streams.

```
- apiVersion: v1
  kind: ImageStream
  metadata:
    name: react-web-app-builder  // 1 
  spec: {}
- apiVersion: v1
  kind: ImageStream
  metadata:
    name: react-web-app-runtime  // 2 
  spec: {}
- apiVersion: v1
  kind: ImageStream
  metadata:
    name: web-app-builder-runtime // 3
  spec:
    tags:
    - name: latest
      from:
        kind: DockerImage
        name: nodeshift/centos7-s2i-web-app:10.x
- apiVersion: v1
  kind: ImageStream
  metadata:
    name: nginx-image-runtime // 4
  spec:
    tags:
    - name: latest
      from:
        kind: DockerImage
        name: 'centos/nginx-112-centos7:latest'
```

First, let’s take a look at the third and fourth images. We can see that both are defined as Docker images, and we can see where they come from.

The third is the web-app-builder image, nodeshift/centos7-s2i-web-app, which is using the 10.x tag from Docker hub.

The fourth is an NGINX image (version 1.12) using the latest tag from Docker hub.

Now let’s take a look at those first two images. Both images are empty to start. These images will be created during the build phase.

The first image, `react-web-app-builder`, will be the result of the “assemble” phase of the `web-app-builder-runtime` image once it is combined with our source code. 

The second image, `react-web-app-runtime`, will be the result of combining the `nginx-image-runtime` with some of the files from the `react-web-app-builder image`. This image will also be the image that is deployed and will contain only the web server and the static HTML, JavaScript, and CSS for the application.

This might sound a little confusing now, but once we look at the build configurations, things should be a little more clear.

In this template, there are two build configurations. Let’s take a look at them one at a time.

```
  apiVersion: v1
  kind: BuildConfig
  metadata:
    name: react-web-app-builder
  spec:
    output:
      to:
        kind: ImageStreamTag
        name: react-web-app-builder:latest // 1
    source:   // 2 
      git:
        uri: ${SOURCE_REPOSITORY_URL}
        ref: ${SOURCE_REPOSITORY_REF}
      contextDir: ${SOURCE_REPOSITORY_DIR}
      type: Git
    strategy:
      sourceStrategy:
        env:
          - name: OUTPUT_DIR // 3 
            value: ${OUTPUT_DIR}
        from:
          kind: ImageStreamTag
          name: web-app-builder-runtime:latest // 4
        incremental: true // 5
      type: Source
    triggers: // 6
    - generic:
        secret: ${GOGS_WEBHOOK_SECRET}
      type: Generic
    - type: ConfigChange
    - imageChange: {}
      type: ImageChange
```

The first one, `react-web-app-builder` above, is pretty standard. We see that line 1 tells us the result of this build will be put into the `react-web-app-builder` image, which we saw when we took a look at the image stream list above.

Next, line 2 is just telling us where the code is coming from. In this case, it is a git repository, and the location, ref, and context directory are defined by the parameters we saw earlier.

Again, line 3, we saw in the parameters section. This will add the `OUTPUT_DIR` environment variable, which in our example will be build.

Line 4 is telling us to use the `web-app-builder-runtime` image that we saw in the ImageStream section.

Line 5 is saying we want to use an incremental build if the S2I image supports it. The Web App Builder image does support it. On the first run, once the assemble phase is complete, the image will save the `node_modules` folder into an archive file. Then on subsequent runs, the image will un-archive that `node_modules` folder, which will speed up build times.

The last thing to call out, line 6, is just a few triggers that are set up, so when something changes, this build can be kicked off without manual interaction.

 Now let’s take a look at the second build configuration. Most of it is very similar to the first, but there is one important difference:

```
apiVersion: v1
  kind: BuildConfig
  metadata:
    name: react-web-app-runtime
  spec:
    output:
      to:
        kind: ImageStreamTag
        name: react-web-app-runtime:latest // 1
    source: // 2
      type: Image
      images:                              
        - from:
            kind: ImageStreamTag
            name: react-web-app-builder:latest // 3
          paths:
            - sourcePath: /opt/app-root/output/.  // 4
              destinationDir: .  // 5
             
    strategy: // 6
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
          name: react-web-app-builder:latest // 7
```

This second build configuration, `react-web-app-runtime`, starts off in a fairly standard way.

Line 1 isn’t anything new. It is telling us that the result of this build will be put into the `react-web-app-runtime` image.

As with the first build configuration, we have a source section, line 2, but this time we say our source is coming from an image. The image that it is coming from is the one we just created, `react-web-app-builder` (specified in line 3). The files we want to use are located inside the image and that location is specified in line 4: `/opt/app-root/output/`. If you remember, this is where our generated files from our app’s build step ended up.

The destination directory, specified in line 5, is the current directory.

The strategy section, line 6, is also similar to the first build configuration. This time, we are going to use the `nginx-image-runtime` that we looked at in the ImageStream section.

The final thing to point out is the trigger section, line 7, which will trigger this build anytime the `react-web-app-builder` image changes.

The rest of the template is fairly standard deployment configuration, service, and route stuff, which we don’t need to go into. Note that the image that will be deployed will be the `react-web-app-runtime` image.