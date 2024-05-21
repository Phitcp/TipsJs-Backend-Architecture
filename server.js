const app = require('./src/app');

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
    console.log('App start successfully on', PORT);
});

process.on('SIGINT', (_) => {
    console.log('Server down');
});
