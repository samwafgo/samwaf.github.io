---
title: API Documentation
description: SamWaf Open API reference covering X-API-Key authentication and management service conventions, with links to the raw Swagger specification, readable operation index and integration cookbook.
sidebar: false
---

# API Documentation

The SamWaf Open API lets third-party systems and scripts manage website configuration, query protection logs and maintain protection rules. This page provides an operation index, the raw Swagger specification and interactive documentation. Check the version deployed on your own instance when integrating.

## Authentication and request conventions

Enable the Open Platform in system configuration, then create an API Key under Open Platform → Key Management. Send it in the `X-API-Key` header. No admin login token or replay-protection headers are required. Requests go to your own management service, on port `26666` by default. Include the secure access path in request URLs if you have enabled that setting.

Responses are plain JSON with `code`, `data` and `msg`; `code=0` indicates success. Read the cookbook for pagination, parameter names and full-record update conventions.

- [Authentication and API key management](../guide/OpenPlatform.md)
- [Request conventions, failure codes and integration scenarios](../dev/openapi-cookbook.md)
- [Readable API operation index](./operations.html)
- [Raw Swagger JSON specification](/swagger.json)
- [Standalone Swagger UI](/swagger-ui/index.html)

The operation index preserves paths exactly as written in the specification, without prepending `basePath` again. Tags and summaries retain the specification's original language. The documentation site provides reference material; API calls target your own SamWaf instance.

## Interactive documentation

<iframe
  title="SamWaf Swagger API documentation"
  src="/swagger-ui/index.html"
  style="width:100%;height:85vh;border:none;display:block;"
  allowfullscreen
></iframe>
