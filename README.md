# @govuk-one-login/frontend-passthrough-headers

## Purpose

@govuk-one-login/frontend-passthrough-headers is a set of functions to extract pass-through headers that should be passed through our frontends to our backends.

## Table of Contents

1. [Installation](#installation)
2. [How to use](#how-to-use)
3. [Issues](#issues)

## Installation

Add to your project using `npm i @govuk-one-login/frontend-passthrough-headers`

## How to use

### getPersonalDataHeadersMiddleware

If you attach an axios instance to your requests using middleware you can use this middleware to passthrough the headers based on an allowlist.

```javascript
import axios from "axios";
import express from "express";
import { getPersonalDataHeadersMiddleware } from "@govuk-one-login/frontend-passthrough-headers";

const app = express();

app.use((req, _res, next) => {
  req.axios = axios.create();
  next();
});

app.use(
  getPersonalDataHeadersMiddleware([
    "https://accounts.gov.uk", // allowlist by specific string
    `/.*\.gov\.uk/`, // allowlist by regex
  ])
);

app.get("/", (req) => {
  req.axios.post("https://accounts.gov.uk"); // This will pass through the headers
  req.axios.post("https://accounts.com"); // This will not pass through the headers
});

app.listen(3000, () => {
  console.log(`Example app listening on port ${port}`);
});
```

### createPersonalDataHeaders

> [!WARNING]
> This function extracts headers that contain Personal Data. It must not be passed through to API calls to external services.

```javascript
import { createPersonalDataHeaders } from "@govuk-one-login/frontend-passthrough-headers";

async function routeHandler(req, res, next) {
  const url = "https://internal-service.com/do-something";

  const headers = {
    ...createPersonalDataHeaders(url, req),
  };

  const res = await axios.get(url, {
    headers,
  });

  return res.data;
}
```

## Issues

Please raise any issues on the [GitHub repo](https://github.com/govuk-one-login/frontend-passthrough-headers).
