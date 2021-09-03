const grpc = require('@grpc/grpc-js');
const users = require('../server/protos/user_pb');
const service = require('../server/protos/user_grpc_pb');

function listUser(call, callback) {
    let fullName = ''
    call.on('data', request => {
        const firstName = request.getUser().getFirstName();
        const lastName = request.getUser().getLastName();
        fullName = `${firstName} ${lastName}`;
        console.log(fullName);
    });
    call.on('status', status => console.log(status))
    call.on('error', error => console.log(error));
    call.on('end', () => {
        const userResponse = new users.UserResponse();
        userResponse.setResult(`Streaming ... ${fullName}`);
        callback(null, userResponse);
    });
}

function main() {
    const server = new grpc.Server();
    server.addService(service.UserServiceService, { listUser });
    server.bindAsync(
        'localhost:50051', 
        grpc.ServerCredentials.createInsecure(),
        () => {
            console.log(`Server running on port localhost:50051`);
            server.start();
        }
    )
}

main();