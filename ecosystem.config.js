export default {
  apps: [
    {
      name: 'placas',
      script: 'index.js',
      watch: true,
      ignore_watch: ['node_modules'],
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
};