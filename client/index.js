const users = require('../server/protos/user_pb');
const service = require('../server/protos/user_grpc_pb');
const grpc = require('@grpc/grpc-js');

function main() {
    const client = new service.UserServiceClient(
        'localhost:50051',
        grpc.credentials.createInsecure()
    );

    const userRequest = new users.UserRequest();
    const user = new users.User();
    user.setFirstName("Nguyen");
    user.setLastName("Duy");
    userRequest.setUser(user);
    const call = client.listUser(userRequest, (error, response) => {
        if(!error) {
            console.log(response.getResult());
        } else {
            console.log(error);
        }
    });

    let count = 0;
    let intervalId = setInterval(() => {
        console.log(`Sending message ${count}`);
        const userRequest = new users.UserRequest();
        const user = new users.User();
        user.setFirstName("Nguyen");
        user.setLastName("Duy");
        userRequest.setUser(user);
        call.write(userRequest);

        if(++count > 3) {
            clearInterval(intervalId);
            call.end();
        }
    }, 1000);
}

main();