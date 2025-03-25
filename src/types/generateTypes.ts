import { execSync } from "child_process";
import * as path from "path";

import { generalEnvs } from "../config/envs";

const URL_BACKEND = new URL(generalEnvs.INTERNAL_BACKEND_URL || "http://localhost:4000/v1").origin;
const SWAGGER_URL = URL_BACKEND + "/api-json";
const OUTPUT_PATH = path.join(process.cwd(), "src/types/api.ts");

function generateTypes() {
  try {
    execSync(`pnpx openapi-typescript ${SWAGGER_URL} -o ${OUTPUT_PATH}`, {
      stdio: "inherit",
    });
    console.log("✅ Tipos generados exitosamente");
  } catch (error) {
    console.error("❌ Error generando tipos:", error);
    process.exit(1);
  }
}
//pnpm run generate-types
generateTypes();
