module.exports = {
    getPersonsAll,
    getPersonByUser,
}
const mongodb = require("mongodb");
const mongoURL = "mongodb+srv://dbUser:dbuser@cluster0-0s0ou.mongodb.net/menteslibres?retryWrites=true&w=majority";
const mongoConfig = { useUnifiedTopology: true };


/**
 * Función que retorna lista de personas desde MongoDB Atlas
 * 
 * @param {function} resultadoCallback ( listaPersonas: array )
 */

function getPersonsAll(resultadoCallback) {

    mongodb.MongoClient.connect(mongoURL, mongoConfig, (err, client) => {
        if (err) {
            resultadoCallback(err);
            client.close();

        } else {
            const mentesLibresDB = client.db("menteslibres");
            const usersCollection = mentesLibresDB.collection("users");

            usersCollection.find().toArray((err, personsLista) => {
                if (err) {
                    resultadoCallback(error)
                } else {
                    personsList = personsLista.map(user => ({
                        id: user._id.toString(),
                        username: user.username,
                        password: user.password,
                        email: user.email,
                        provincia: user.provincia,
                        localidad: user.localidad,
                    }));
                    resultadoCallback(personsList);
                }
                client.close();
            })
        }
    })
}


/**
 * Función que retorna lista de libros desde MongoDB Atlas
 * 
 * @param string dato del usuario para buscar
 * @param {function} resultadoCallback ( listaLibros: array )
 */

function getPersonByUser(filterUser, resultadoCallback) {

    mongodb.MongoClient.connect(mongoURL, mongoConfig, (err, client) => {
        if (err) {
            resultadoCallback(err);
            client.close();

        } else {
            const mentesLibresDB = client.db("menteslibres");
            const usersCollection = mentesLibresDB.collection("users");

            usersCollection.findOne({ username: filterUser }, (err, person) => {
                if (err) {
                    resultadoCallback(undefined)
                } else {
                    resultadoCallback(person);
                }
                client.close();
            })
        }
    })
}

