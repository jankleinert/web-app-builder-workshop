# web-app-builder-workshop

Build workshop content.

```shell
oc new-build https://github.com/jankleinert/web-app-builder-workshop.git
```

or use a binary build from local directory.

```shell
oc new-build --name web-app-builder-workshop --strategy docker --binary
oc start-build web-app-builder-workshop --from-dir .
```

Deploy workshop environment.

```shell
oc new-app https://raw.githubusercontent.com/openshift-labs/workshop-jupyterhub/master/templates/hosted-workshop-production.json
```

Use local workshop for the environment.

```bash
oc tag web-app-builder-workshop:latest workshop-app:latest
```

Run tag again after each re-build of the content if building from local directory and making changes.
