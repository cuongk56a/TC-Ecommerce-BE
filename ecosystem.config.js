module.exports = {
  apps: [
    {
      name: 'Ecommerce',
      script: 'yarn',
      args: 'dev',  // Sử dụng lệnh `yarn dev`
      // instances: 1,
      // autorestart: true,
      // watch: false,
      env: {
        NODE_ENV: 'development',
      },
    },
  ],
};
