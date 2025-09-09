const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  // 关闭eslint校验.
  devServer: {
    // proxy:{
    //   '/api':{
    //     target:'http://localhost:8080/',//产生跨域的地址
    //     changeOrigin:true
    //   }
    // },


    // https: true,
    client: {
      overlay: {
        warnings: false, //不显示警告
        errors: false	//不显示错误
      },
    }
  },
  lintOnSave:false //关闭eslint检查

})
