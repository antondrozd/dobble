import { defineConfig } from "tsdown";

export default defineConfig({
  entry: {
    types: "src/types/index.ts",
    constants: "src/constants.ts",
    utils: "src/utils/index.ts",
  },
  format: ["esm"],
  dts: true,
  clean: false,
});
