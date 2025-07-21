#!/usr/bin/env node

import pkg from "@apidevtools/swagger-parser";
const { validate } = pkg;
import fs from "fs";
import path from "path";

async function validateOpenAPI() {
  try {
    const openApiPath = path.join(process.cwd(), "openapi.yaml");
    const spec = await validate(openApiPath);

    console.log("✅ OpenAPI specification is valid!");
    console.log(`📋 API Title: ${spec.info.title}`);
    console.log(`📋 API Version: ${spec.info.version}`);
    console.log(`📋 API Description: ${spec.info.description}`);

    // 엔드포인트 개수 확인
    const paths = Object.keys(spec.paths);
    console.log(`📋 Total endpoints: ${paths.length}`);

    paths.forEach((path) => {
      const methods = Object.keys(spec.paths[path]);
      console.log(`  - ${path}: ${methods.join(", ")}`);
    });
  } catch (error) {
    console.error("❌ OpenAPI specification is invalid:");
    console.error(error.message);
    process.exit(1);
  }
}

validateOpenAPI();
