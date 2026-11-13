---
title: API 文档
description: SamWaf 开放平台 API 文档，说明 X-API-Key 认证、管理端调用约定，并提供原始 Swagger 规范、可读取的接口索引和场景手册。
sidebar: false
---

# API 文档

SamWaf 开放平台 API 用于第三方系统和脚本管理网站配置、查询防护日志及维护防护规则。这里提供接口索引、原始 Swagger 规范与交互式文档；接口随 SamWaf 版本变化，接入时请核对所部署版本。

## 认证与请求约定

先在管理端系统配置中启用开放平台，再在「开放平台 → 密钥管理」创建 API Key。调用时携带 `X-API-Key` 请求头，无需后台登录 Token 或防重放头；请求发往自行部署的管理端，默认端口为 `26666`。启用安全访问路径后，调用地址还需包含该路径。

响应使用明文 JSON，常见结构为 `code`、`data`、`msg`；`code=0` 表示成功。分页、参数命名和整条更新的约定请先阅读场景手册。

- [开放平台认证与密钥管理](../guide/OpenPlatform.md)
- [通用约定、失败码与对接场景](../dev/openapi-cookbook.md)
- [可直接读取的 API 接口索引](./operations.html)
- [原始 Swagger JSON 规范](/swagger.json)
- [Swagger UI 独立页面](/swagger-ui/index.html)

接口索引原样使用规范中的路径键，不重复拼接 `basePath`。本站的规范供查阅，实际调用目标为你部署的 SamWaf 实例。

## 交互式文档

<iframe
  title="SamWaf Swagger API 文档"
  src="/swagger-ui/index.html"
  style="width:100%;height:85vh;border:none;display:block;"
  allowfullscreen
></iframe>
