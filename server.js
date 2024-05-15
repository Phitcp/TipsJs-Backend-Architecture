const app = require('./src/app');

const server = app.listen(3000, () => {
    console.log('App start successfully');
});

process.on('SIGINT', (_) => {
    console.log('Server down');
});
