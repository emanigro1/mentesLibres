module.exports = {
    login,
    register
}
const mongodb = require("mongodb");
const mongoURL = "mongodb+srv://dbUser:dbuser@cluster0-0s0ou.mongodb.net/menteslibres?retryWrites=true&w=majority";
const users = require("./editionPersons");
const mongoConfig = { useUnifiedTopology: true };

function login(username, password, registered, errorPass, inexistentUser) {

    users.getPersonsAll(userList => {
        if (userList.filter(user => user.username == username).length > 0) {
            if (userList.filter(user => user.password == password).length > 0) {
                registered();
                return;
            } else {
                errorPass();
                return;
            }
        } else {
            inexistentUser();
            return;
        }
    })
}

function register(username, password, repeatPassword, email, provincia, localidad,
    repeatPasswordError, userAlreadyExists, emailAlreadyExists,
    successfulRegistration, resultErr) {

    users.getPersonsAll(userList => {
        if (password != repeatPassword) {
            repeatPasswordError();
            return;
        }
        if (userList.filter(user => user.username == username).length > 0) {
            userAlreadyExists();
            return;
        }
        if (userList.filter(user => user.email == email).length > 0) {
            emailAlreadyExists();
            return;
        }

        mongodb.MongoClient.connect(mongoURL, mongoConfig, (err, client) => {
            if (err) {
                resultadoCallback(err);
                client.close();

            } else {
                const mentesLibresDB = client.db("menteslibres");
                const usersCollection = mentesLibresDB.collection("users");

                let newUser = {
                    username,
                    password,
                    email,
                    provincia,
                    localidad,
                }

                usersCollection.insertOne(newUser, (err, result) => {
                    if (err) {
                        resultErr(err);
                    } else {
                        successfulRegistration(result);
                    }
                    client.close();
                })
            }
        })
    })
}