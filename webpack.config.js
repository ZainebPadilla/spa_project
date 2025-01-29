const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const webpack = require('webpack');
require('dotenv').config();

module.exports = {

    mode: 'development', 


  entry: './src/index.js', // Point d'entrée pour l'application
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),  // Le dossier contenant les fichiers statiques
    },
    open: true,  // Ouvre automatiquement le navigateur
    port: 3000,  
    historyApiFallback: true,  // Cela gère les routes en SPA
  },
  plugins: [
    new HtmlWebpackPlugin({
        template: './src/index.html',
    }),
    // Injection des variables d'environnement
    new webpack.DefinePlugin({
        'process.env.API_KEY': JSON.stringify(process.env.API_KEY),
    }),
  ],
  module: {
    rules: [
      {
        test: /\.scss$/,  // Regle pour traiter les fichiers .scss
        use: [
          'style-loader',
          'css-loader',
          'sass-loader',
        ],
      },
    ],
  },
};
