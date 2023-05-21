module.exports = {
  apps: [
    {
      name: 'placas',
      script: 'index.js', // Reemplaza esto con el nombre de tu archivo principal de la API
      watch: true,
      ignore_watch: ['node_modules'],
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
};