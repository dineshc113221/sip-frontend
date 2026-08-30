const { merge } = require("webpack-merge");
const singleSpaDefaults = require("webpack-config-single-spa-react-ts");
const webpack = require("webpack");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");

module.exports = (webpackConfigEnv, argv) => {
  const defaultConfig = singleSpaDefaults({
    orgName: "consumer",
    projectName: "sip-ui-mf",
    webpackConfigEnv,
    argv,
  });

  // Get the root path (assuming your webpack config is in the root of your project!)
  const currentPath = path.join(__dirname);

  // Create the fallback path (the production .env)
  const basePath = currentPath + "/.env";

  // We're concatenating the environment name to our filename to specify the correct env file!
  const envPath = `${basePath}.${webpackConfigEnv.environment}`;

  // Check if the file exists, otherwise fall back to the production .env
  const finalPath = fs.existsSync(envPath) ? envPath : basePath;

  // Set the path parameter in the dotenv config
  const fileEnv = dotenv.config({ path: finalPath }).parsed;
  // reduce it to a nice object, the same as before (but with the variables from the file)
  const envKeys = Object.keys(fileEnv).reduce((prev, next) => {
    prev[`process.env.${next}`] = JSON.stringify(fileEnv[next]);
    return prev;
  }, {});
  
  return merge(defaultConfig, {
    externals: [],
    // modify the webpack config however you'd like to by adding to this object
    plugins: [new webpack.DefinePlugin(envKeys)],
    resolve: {
      extensions: [".js", ".jsx", ".ts", ".tsx"], // Add .ts and .tsx
    },
    module: {
      rules: [
        {
          test: /\.s[ac]ss$/i,
          use: [
            // Creates `style` nodes from JS strings
            "style-loader",
            // Translates CSS into CommonJS
            "css-loader",
            // Compiles Sass to CSS
            "sass-loader",
          ],
        },
        {
          test: /\.(ts|tsx)$/, // Update the test regex
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              // Ensure Babel uses the updated config
              presets: [
                "@babel/preset-env",
                "@babel/preset-react",
                "@babel/preset-typescript",
              ],
              // ... other Babel options
            },
          },
        },
      ],
    },
  });
};
