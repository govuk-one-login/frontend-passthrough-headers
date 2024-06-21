# @govuk-one-login/frontend-vital-signs

## Purpose

@govuk-one-login/frontend-vital-signs is a set of functions to extract pass-through headers that should be passed through our frontends to our backends.

## Table of Contents

1. [Installation](#installation)
2. [How to use](#how-to-use)
3. [Issues](#issues)

## Installation

Add to your project using `npm i @govuk-one-login/frontend-vital-signs`

## How to use

### createPersonalDataHeaders

> [!WARNING]
> This function extracts headers that contain Personal Data. It must not be passed through to API calls to external services.

```javascript
import { createPersonalDataHeaders } from "@govuk-one-login/frontend-vital-signs";

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

Please raise any issues on the [GitHub repo](https://github.com/govuk-one-login/frontend-vital-signs).
