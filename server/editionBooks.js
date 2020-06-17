module.exports = {
    getBooksAll,
    getBooksByUser,
    uploadBooks,
    deleteBook,
    getBookByID,
}
const mongodb = require("mongodb");
const mongoURL = "mongodb+srv://dbUser:dbuser@cluster0-0s0ou.mongodb.net/menteslibres?retryWrites=true&w=majority";
const mongoConfig = { useUnifiedTopology: true };

/**
 * Función que retorna lista de libros desde MongoDB Atlas
 * 
 * @param {function} resultadoCallback ( listaLibros: array )
 */

function uploadBooks(user, titulo, autor, editorial, isbn, tematica, img, successfulUpload) {
    mongodb.MongoClient.connect(mongoURL, mongoConfig, (err, client) => {
        if (err) {
            successfulUpload(err);
            client.close();
        } else {
            const mentesLibresDB = client.db("menteslibres");
            const usersCollection = mentesLibresDB.collection("books");

            let newUser = {
                duenio: user,
                titulo,
                autor,
                editorial,
                isbn,
                tematica,
                img

            }

            usersCollection.insertOne(newUser, (err, result) => {
                if (err) {
                    successfulUpload(err);
                } else {
                    successfulUpload(result);
                }
                client.close();
            })
        }
    })
}

function getBooksAll(resultadoCallback) {

    mongodb.MongoClient.connect(mongoURL, mongoConfig, (err, client) => {
        if (err) {
            resultadoCallback(err);
            client.close();

        } else {
            const mentesLibresDB = client.db("menteslibres");
            const usersCollection = mentesLibresDB.collection("books");


            usersCollection.find().toArray((err, booksList) => {
                if (err) {
                    resultadoCallback(error)
                } else {

                    booksListNew = booksList.map(books => ({
                        id: books._id.toString(),
                        titulo: books.titulo,
                        autor: books.autor,
                        editorial: books.editorial,
                        editorial: books.editorial,
                        isbn: books.isbn,
                        tematica: books.tematica,
                        img: books.img
                    }));


                    resultadoCallback(booksListNew);
                }
                client.close();
            })
        }
    })
}


function getBooksByUser(filterUser, resultadoCallback) {

    mongodb.MongoClient.connect(mongoURL, mongoConfig, (err, client) => {
        if (err) {
            resultadoCallback(err);
            client.close();

        } else {
            const mentesLibresDB = client.db("menteslibres");
            const usersCollection = mentesLibresDB.collection("books");

            usersCollection.find({ duenio: filterUser }).toArray((err, booksUser) => {
                if (err) {
                    resultadoCallback(err)
                } else {

                    booksListNew = booksUser.map(books => ({
                        id: books._id.toString(),
                        titulo: books.titulo,
                        autor: books.autor,
                        editorial: books.editorial,
                        editorial: books.editorial,
                        isbn: books.isbn,
                        tematica: books.tematica,
                        img: books.img
                    }));




                    resultadoCallback(booksListNew);
                }
                client.close();
            })
        }
    })
}

function deleteBook(filterBook, resultadoCallback) {

    mongodb.MongoClient.connect(mongoURL, mongoConfig, (err, client) => {
        if (err) {
            resultadoCallback(err);
            client.close();
        } else {
            const mentesLibresDB = client.db("menteslibres");
            const usersCollection = mentesLibresDB.collection("books");

            usersCollection.deleteOne({ "_id": mongodb.ObjectId(filterBook) }, (err, result) => {
                if (err) {
                    resultadoCallback(err);
                } else {
                    resultadoCallback("Eliminado con exito");
                }
                client.close();
            })
        }
    })
}
function getBookByID(filterId, resultadoCallback) {


    mongodb.MongoClient.connect(mongoURL, mongoConfig, (err, client) => {
        if (err) {
            resultadoCallback(err);
            client.close();

        } else {
            const mentesLibresDB = client.db("menteslibres");
            const usersCollection = mentesLibresDB.collection("books");

            usersCollection.findOne({ "_id": mongodb.ObjectId(filterId), }, (err, book) => {
                if (err) {



                    resultadoCallback(undefined)
                } else {
                    let bookResult = {
                        id: book._id.toString(),
                        duenio: book.duenio,
                        titulo: book.titulo,
                        autor: book.autor,
                        editorial: book.editorial,
                        isbn: book.isbn,
                        tematica: book.tematica,
                        img: book.img
                    }
                    console.log(bookResult);

                    resultadoCallback(bookResult);
                }
                client.close();
            })
        }
    })
}



