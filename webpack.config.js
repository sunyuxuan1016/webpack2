//引入相对地址获取
const path=require('path');
//引入uglify的js压缩
const uglify=require('uglifyjs-webpack-plugin');
//引入webpack
const webpack=require('webpack');
//引入HTML打包
const htmlplugin=require('html-webpack-plugin');
//css不打包分离插件
const extracttextplugin=require("extract-text-webpack-plugin");
//同步检查html模板，配合消除CSS插件使用
const glob=require('glob');
//消除未使用的CSS,他依赖与purify-css
const purifycssplugin=require('purifycss-webpack');
//静态资源转移的插件
const copyWebpackPlugin=require('copy-webpack-plugin');


//判断打包情况，用于来回切换开发与生产环境的打包，需要在package文件的scripts中配置2中不同的打包命令
if (process.env.type=="build") {
   //配置静态地址
    var website={
        publicPath:"http://yueyangzhenpin.com:1717/"
    }
} else {
    //配置静态地址
    var website={
        publicPath:"http://localhost:1717/"
    }
}
//入口文件的模块引入
//const entry=require('./webpack.config/entry_webpack.js');


module.exports={
    //打包后调试配置
    //devtool:'source-map',
    //js打包入口文件路径
    entry:{
        entry:'./src/entry.js',
        jquery:'jquery',
        vue:'vue'
    },
    //多出口文件
    output:{
        //获取绝对地址
        path:path.resolve(__dirname,'dist'),
        //多文件名出口（name代表多文件名）
        filename:'[name].js',
        //调用上面配置过的公共静态绝对路径
        publicPath:website.publicPath
    },
    module:{
       //打包CSS方法 
        rules:[
            {
              //正则查找CSS
                test:/\.css$/,
                  //css配置有三种写法数组，对象，直接写、
                   //这里需要配置打包CSS的设置
               // use:['style-loader','css-loader'],
                // use:[{
                //     loader:"style-loader"
                // },{
                //     loader:"css-loader"
                // }],
                //loader:['style-loader','css-loader'],
               
                //不打包的css配置
                use: extracttextplugin.extract({
                    //不打包CSS配置
                    fallback: "style-loader",
                    use: [
                        //css识别loader
                        "css-loader",
                        //postcss自动加前缀loader
                        'postcss-loader'
                    ]
                  })
            },{
                //配置图片打包
                test:/\.(png|jpg|gif)/,
                use:[{
                    //当图片小于5000字节自动打包为base64代码格式放入JS文件中
                    loader:'url-loader',
                    options:{
                        limit:5000,
                        //图片打包要放置的文件夹
                        outputPath:'imgs/'

                    }
                }]
            },{
                //img标签路径 打包lober
                 test:/\.(htm|html)$/i,
                 use:['html-withimg-loader']
               
            },{
                //less分离文件打包lober
                test:/\.less$/,
              use:extracttextplugin.extract({
                  use:[{
                      loader:"css-loader"
                  },{
                      loader:"less-loader"
                  }],
                  //分离成css文件，不加入JS文件中
                  fallback:"style-loader"
              })
         },{
             //scss分离文件打包lober
             test:/\.scss/,
             use:extracttextplugin.extract({
                 use:[{
                     loader:"css-loader"
                 },{
                     loader:"sass-loader"
                 }],
                 //分离成css文件，不加入JS文件中
                 fallback:"style-loader"
             })
            
            },{
                //babel转换把es6.es7的语法转换为es5
                test:/\.(jsx|js)$/,
                use:{
                    loader:"babel-loader",
                    //其他配置写在同级目录吓得babelrc文件内
                    // options:{
                    //     presets:["react","env"]
                    // }
                },
                //babel会转换node——modules文件夹下的JS所以要避开他
                exclude:/node_modules/

            }
         
      ]
    },
    //这里是插件方法，插件都需要在本JS头部引入才可以使用
    plugins:[
        //配置JS压缩
       // new uglify(),

        //静态资源转移插件
        new copyWebpackPlugin([{
            //要转移的文件夹地址
            from:__dirname+'/src/public',
            //转移到的文件夹地址
            to:'./public'
        }]),

       //第三方类库抽离插件
       new webpack.optimize.CommonsChunkPlugin({
            //name对应入口文件中的名字，我们起的是jQuery和VUE
             name:['jquery','vue'],
            //把文件打包到那里，是一个路径
            filename:'assets/js/[name].js',
            //最小打包的文件模块数量，这里写2就好了
            minChunks:2
       }),
       //全局引入JQ
       new webpack.ProvidePlugin({
        $:"jquery",
        vue:'vue'
    }),
       //配置HTML页面打包
       new htmlplugin({
           minify:{
               //去掉html中的双引号
               removeAttributeQuotes:true 
           },
           //防止JS缓存
           hash:true,
           //明确文件地址
           template:'./src/index.html'
       }),
       //配置不打包css的插件
       new extracttextplugin("/css/index.css"),
       //配置消除多余CSS插件
       new purifycssplugin({
           //给出解析规则的绝对路径
           paths:glob.sync(path.join(__dirname,'src/*.html'))
       }),
       //此使用后会在JS中加上我们的版权或开发者声明，使用此插件前必须引入webpack
       new webpack.BannerPlugin("版本所有，webpack学习例子源码")
    ],
    //本地服务器
    devServer:{
        //配置webpack热更新服务，并指定更新绝对地址文件夹
        contentBase:path.resolve(__dirname,'dist'),
        //contentBase:path.resolve(__dirname,'dist'),
        //服务器地址，也就是本机IP,
        //建议写为localhost，如果写固定IP下次开机后会因为路由器分配的IP改变而报错
        host:'localhost',
        //启用服务器压缩
        compress:true,
        //确定服务器端口
        port:1717
    },
    watchOptions:{
        //检测修改时间，毫秒单位
        poll:1000,
        //防止短时间按多次，倒持重复编译错误，500毫秒内保存多次，只打包一次
        aggregateTimeout:500,
        //不监听的目录
        ignored:/node_modules/
    }
}