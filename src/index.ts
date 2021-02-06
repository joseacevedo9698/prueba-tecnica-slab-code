import Server from './Server/server';

async function uploadFile() { }

const server = Server.init(3000);
server.start(() => {
    console.log('servidor corriendo en el puerto 3000');

});

export { server };