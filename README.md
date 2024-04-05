# GCP-synthetic-monitoring

## Intro

This repo demos a synthetic monitor on GCP, i've used as example [https://training.zenika.com](https://training.zenika.com/).

The business use-case i'm monitoring :

1. Navigate on the homepage
2. Type in the search bar for a CKA training
3. Consult a search result page and chose the first result
4. Show be redirected to the training detail page.

## Requirements

- [Node.js](https://nodejs.org) 18 or higer
- GCP CLI [`gcloud`](https://cloud.google.com/sdk/gcloud/)

## Getting started

make sure dependencies are installed `npm install`

try executing the monitor locally:

```bash
npx functions-framework --target=<YOUR_CLOUD_FUNC_ENTRYPOINT>
```

next:

- Authenticate to GCP with the gcloud cli: `gcloud auth login`
- Define the correct project: `gcloud set-project <YOUR_PROJECT_ID>`
- Deploy your cloud function :

```bash
gcloud functions deploy <YOUR_CLOUD_FUNC_NAME> --gen2 --runtime=nodejs18 --region=<REGION> --source=. --entry-point=<YOUR_CLOUD_FUNC_ENTRYPOINT> --memory=2G --timeout=60 --trigger-http
```

- Create monitor that relies on our cloud function:

```bash
gcloud monitoring uptime create <YOUR_MONITOR_NAME> --synthetic-target=projects/<PROJECT_ID>/locations/<REGION>/functions/<YOUR_CLOUD_FUNC_NAME> --period=5
```

You should be good to go with monitor setup


### Note

The cloud function relies on puppeteer to run headless browser, to be as close as possible to the user behavior and to match the web best practices it relied on [pptr-testing-library](https://github.com/testing-library/pptr-testing-library) which is an wrapper around puppeteer that provides a set of useful queries.
Feel free to chose to use it or not.
