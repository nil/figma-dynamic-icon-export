import HtmlWebpackInlineSourcePlugin from 'html-webpack-inline-source-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import path from 'path';

module.exports = (env, argv) => ({
  mode: argv.mode === 'production' ? 'production' : 'development',

  // This is necessary because Figma's 'eval' works differently than normal eval
  devtool: argv.mode === 'production' ? false : 'inline-source-map',

  entry: {
    ui: './src/ui.tsx',
    code: './src/code.ts'
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        loader: [
          { loader: 'style-loader' },
          { loader: 'postcss-loader' }
        ]
      },
      {
        test: /\.(png|jpg|gif|webp|svg|zip)$/,
        loader: [
          { loader: 'url-loader' }
        ]
      }
    ]
  },

  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js']
  },

  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: './src/ui.html',
      filename: 'ui.html',
      inlineSource: '.(js)$',
      chunks: ['ui']
    }),
    new HtmlWebpackInlineSourcePlugin()
  ]
});
