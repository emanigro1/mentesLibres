module.exports = {
    getPersonsAll,
    getPersonByUser,
    addFavorite,
    removeFavorite,
    addComentario,
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

function addFavorite(user, bookUser, resultado) {
    mongodb.MongoClient.connect(mongoURL, mongoConfig, (err, client) => {
        if (err) {
            resultadoCallback(err);
            client.close();

        } else {
            const mentesLibresDB = client.db("menteslibres");
            const usersCollection = mentesLibresDB.collection("users");

            let array = {
                id: bookUser.id,
                duenio: user,
                titulo: bookUser.titulo,
                autor: bookUser.autor,
                editorial: bookUser.editorial,
                isbn: bookUser.isbn,
                tematica: bookUser.tematica,
                img: bookUser.img
            }

            findQuery = { username: user }
            updateQuery = {
                $push: { favoritos: array }
            }

            usersCollection.updateOne(findQuery, updateQuery, (err, result) => {
                if (err) {
                    resultado(undefined)
                } else {
                    resultado(result);
                }
                client.close();
            })
        }
    })

}

function removeFavorite(user, bookId, resultado) {
    mongodb.MongoClient.connect(mongoURL, mongoConfig, (err, client) => {
        if (err) {
            resultadoCallback(err);
            client.close();
        } else {
            const mentesLibresDB = client.db("menteslibres");
            const usersCollection = mentesLibresDB.collection("users");

            findQuery = { favoritos: { $each: { id: bookId } } }

            usersCollection.update(
                { username: user },
                {
                    $pull:
                        { favoritos: { id: bookId } }
                },
                (err, result) => {
                    if (err) {
                        resultado(undefined)
                    } else {
                        resultado(result);
                    }
                    client.close();
                })
        }
    })
}

function addComentario(bookArray, bookId, resultado) {
    mongodb.MongoClient.connect(mongoURL, mongoConfig, (err, client) => {
        if (err) {
            resultadoCallback(err);
            client.close();

        } else {
            const mentesLibresDB = client.db("menteslibres");
            const usersCollection = mentesLibresDB.collection("books");

            let objeto = {
                usuario: bookArray.comentarios[0].usuario,
                comentario: bookArray.comentarios[0].comentario,
            }

            findQuery = { "_id": mongodb.ObjectId(bookId) }
            updateQuery = {
                $push: { comentarios: objeto }
            }

            usersCollection.updateOne(findQuery, updateQuery, (err, result) => {
                if (err) {
                    resultado(undefined)
                } else {
                    resultado(result);
                }
                client.close();
            })
        }
    })
}