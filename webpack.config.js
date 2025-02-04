import path from 'path';
import webpack from 'webpack';
import Dotenv from 'dotenv-webpack';
import HTMLWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CompressionPlugin from 'compression-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
// Comment out BundleAnalyzerPlugin before deploying to staging/prod
// import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

const plugins = [
  // DO NOT CHANGE THE ORDER OF THESE PLUGINS
  new HTMLWebpackPlugin({
    template: './public/index.html',
    publicPath: '/',
  }),
  new MiniCssExtractPlugin(),
];

// Conditionally add plugins by environment
if (process.env.NODE_ENV === 'production') {
  plugins.push(
    // Comment out BundleAnalyzerPlugin before deploying to staging/prod
    // new BundleAnalyzerPlugin(),
    new CompressionPlugin({
      test: /\.(js|css|html|svg)$/,
      compressionOptions: {
        level: 9,
        algorithm: 'gzip',
      },
      filename: '[path][base].gz',
    }),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
      TARGET_ENV: JSON.stringify(process.env.TARGET_ENV),
      REACT_APP_FORM_ENDPOINT: JSON.stringify(process.env.REACT_APP_FORM_ENDPOINT),
      STAGING_URL: JSON.stringify(process.env.STAGING_URL),
      PROD_URL: JSON.stringify(process.env.PROD_URL),
    }),
  );
} else if (process.env.NODE_ENV === 'development') {
  plugins.push(
    new Dotenv(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
      TARGET_ENV: JSON.stringify(process.env.TARGET_ENV),
      REACT_APP_FORM_ENDPOINT: JSON.stringify(process.env.REACT_APP_FORM_ENDPOINT),
    }),
  );
}

export default {
  mode: process.NODE_ENV === 'production' ? 'production' : 'development',
  entry: './client/index.js',
  output: {
    path: path.join(__dirname, 'build'),
    filename: '[name].[contenthash].js',
    publicPath: '/',
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(?:node_modules|__tests__|\.test\.js)$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
      {
        test: /.s?css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[contenthash].[ext]',
              outputPath: 'assets/images',
            },
          },
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                progressive: true,
              },
            },
          },
        ],
      },
      {
        test: /\.(mp4|mov)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[hash].[ext]',
              outputPath: 'assets/videos',
            },
          },
        ],
      },
      {
        test: /\.(mp3|ogg|wav)$/i,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: 'assets/audio',
        },
      },
    ],
  },

  devServer: {
    static: {
      directory: path.resolve(__dirname, 'public'),
      publicPath: '/',
    },
    port: 8080,
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        secure: false,
        pathRewrite: { '^/api': '' },
      },
    },
    historyApiFallback: true,
  },

  optimization: {
    splitChunks: {
      chunks: 'all',
      minSize: 0,
      minChunks: 1,
      cacheGroups: {
        vendorReactDom: {
          test: /[\\/]node_modules[\\/](react-dom)[\\/]/,
          name: 'vendor-react-dom',
          chunks: 'all',
        },
        vendorReactRouterDom: {
          test: /[\\/]node_modules[\\/](react-router-dom)[\\/]/,
          name: 'vendor-react-router-dom',
          chunks: 'all',
        },
        vendorRemixRun: {
          test: /[\\/]node_modules[\\/](@remix-run)[\\/]/,
          name: 'vendor-remix-run',
          chunks: 'all',
        },
        vendorAxios: {
          test: /[\\/]node_modules[\\/](axios)[\\/]/,
          name: 'vendor-axios',
          chunks: 'all',
        },
        vendorDateFns: {
          test: /[\\/]node_modules[\\/](date-fns)[\\/]/,
          name: 'vendor-date-fns',
          chunks: 'all',
        },
      },
    },
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          mangle: true, // Enable to mangle variable names
          compress: {
            drop_console: true, // Remove console.log and console.error statements
          },
        },
      }),
      `...`,
      new CssMinimizerPlugin(),
    ],
  },

  performance: {
    maxAssetSize: 244 * 1024, // 244 KiB
  },

  devtool: 'source-map',

  resolve: {
    fallback: {
      fs: false,
      path: false,
    },
  },

  plugins: plugins.filter(Boolean),
};
