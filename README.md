# wms-ui

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).


压缩
1.cnpm install compression-webpack-plugin@1.1.12
2.config/index.js ->productionGzip:true
3.webpack.prod.conf.js 修改为filename
  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      filename: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp(
        '\\.(' +
        config.build.productionGzipExtensions.join('|') +
        ')$'
      ),
      threshold: 10240,
      minRatio: 0.8
    })
  )

运行服务需要安装的
node 版本 8.11.4

1.npm install stylus--save

2.npm install stylus-loader --save

npm install less less-loader --save

如果允许的时候 代理请求没生效可以修改配置中的本地端口
