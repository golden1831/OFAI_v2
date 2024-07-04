# Running locally
```
$ cp .env.local .env
$ docker-compose -f docker-compose.local.yml up -d
```
# Running in production

- Provision Cloud Run instances for the API and the client. 
- Provision a Postgres DB instance.
- Proxy the connection from the API to the Postgres DB instance.
- Edit the `cloudbuild.yaml` file to include the correct docker build args.
- Add the necessary runtime env vars to the services. 
- Use the cloudbuild.yaml file to setup a push trigger on Google Cloud, the trigger will build the image and deploy it to Google Cloud Run when you push to main. 
