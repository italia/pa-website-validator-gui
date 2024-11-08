import { readFileSync } from "fs";
import path, { join } from "path";
import { fileURLToPath } from "url";

interface PackageJson {
  name: string;
  version: string;
}

export let VERSION = "";
export let VERSION_VALIDATOR = "";

const packageJsonPath = join(
  path.dirname(fileURLToPath(import.meta.url)),
  "../package.json",
);

const packageJsonString = readFileSync(packageJsonPath, "utf-8");

const packageJson: PackageJson = JSON.parse(packageJsonString);

VERSION = packageJson.version;

const packageJsonPathValidator = join(
  path.dirname(fileURLToPath(import.meta.url)),
  "../node_modules/pa-website-validator-ng/package.json",
);

const packageJsonStringValidator = readFileSync(
  packageJsonPathValidator,
  "utf-8",
);

const packageJsonValidator: PackageJson = JSON.parse(
  packageJsonStringValidator,
);

VERSION_VALIDATOR = packageJsonValidator.version;
