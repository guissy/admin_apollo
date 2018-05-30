'use strict';

const path = require('path');
const paths = require('../config/paths');
const tsImportPluginFactory = require('ts-import-plugin');
const genDefaultConfig = require("@storybook/react/dist/server/config/defaults/webpack.config.js");

module.exports = (baseConfig, env) => {
  const config = genDefaultConfig(baseConfig, env);
  config.resolve.extensions.push(".ts", ".tsx");
  const rules = {
    oneOf: [
      {
        test: /\.(ts|tsx)$/,
        // include: paths.appSrc,
        include: [path.resolve(__dirname, "../src"), path.resolve(__dirname, "../stories")],
        loader: require.resolve('ts-loader'),
        options: {
          transpileOnly: true,
          getCustomTransformers: () => ({
            before: [
              tsImportPluginFactory([
                {
                  libraryName: 'antd',
                  libraryDirectory: 'lib',
                },
                {
                  libraryName: 'antd-mobile',
                  libraryDirectory: 'lib',
                }
              ])
            ]
          })
        }
      },
      {
        test: /\.scss$/,
        include: path.resolve(__dirname, paths.appSrc),
        exclude: path.resolve(__dirname, `${paths.appSrc}/assets`),
        use: [
          require.resolve('style-loader'),
          {
            loader: require.resolve('css-loader'),
            options: {
              importLoaders: 2,
              modules: true,
              localIdentName: '[name]__[local]--[hash:5]',
            },
          },
          {
            loader: require.resolve('postcss-loader'),
            options: {
              config: {
                path: path.resolve(__dirname, 'config/postcss.config.js')
              }
            }
          },
          require.resolve('sass-loader'),
        ],
      },
      {
        test: /\.(scss|css)$/,
        include: [
          path.resolve(__dirname, `${paths.appSrc}/assets`),
          /antd/,
        ],
        use: [
          require.resolve('style-loader'),
          {
            loader: require.resolve('css-loader'),
            options: {
              importLoaders: 2,
            },
          },
          {
            loader: require.resolve('postcss-loader'),
            options: {
              config: {
                path: path.resolve(__dirname, '../config/postcss.config.js')
              }
            }
          },
          require.resolve('sass-loader'),
        ],
      },
      // {
      //     exclude: [/\.js$/, /\.ejs$/, /\.html$/, /\.json$/],
      //     loader: require.resolve('file-loader'),
      //     options: {
      //         name: 'static/media/[name].[hash:8].[ext]',
      //     },
      // },
    ],
  };
  config.module.rules.push(rules);
  return config;
};
