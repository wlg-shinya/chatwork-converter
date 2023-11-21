import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  const htmlPlugin = () => ({
    name: "html-transform",
    transformIndexHtml: (html: string) => html.replace(/%=(.*?)%/g, (match, p1) => env[p1] ?? match),
  });

  return defineConfig({
    plugins: [vue(), htmlPlugin()],
    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    },
  });
};
