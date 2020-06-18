const port = process.env.port || 3000;


const express = require("express");
const app = express();
const expSession = require("express-session");
const path = require("path");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const multer = require("multer");

const fnCoincidencia = require("./coincidencias")
const users = require("./editionPersons")
const editionBooks = require("./editionBooks")
const auth = require("./auth")
const generateUUID = require("./idUnico");
const editionPersons = require("./editionPersons");



app.use(express.static(path.join(__dirname, "../client")))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(expSession({
    secret: "jamon y queso",
    resave: false,
    saveUninitialized: false
}));



app.engine("handlebars", exphbs({
    defaultLayout: "main",
    layoutsDir: path.join(__dirname, "views/layout")
}))
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));



const uploadStorage = multer.diskStorage({
    destination: (req, file, folderCallback) => {
        folderCallback(null, "./client/images/books")
    },
    filename: (req, file, fileCallback) => {

        fileCallback(null, generateUUID.generateUUID() + path.extname(file.originalname))
    }
})
const upload = multer({ storage: uploadStorage });




//pagina de contacto
app.get("/contact", (req, res) => {
    if (req.session.loggerUser) {
        res.status(200).render("contact", { layout: "loggedIn", name: req.session.loggerUser })
    } else {
        res.render("contact");
    }

})


//pagina principal
app.get("/", (req, res) => {
    if (req.session.loggerUser) {
        editionBooks.getBooksAll((booksList) => {
            res.status(200).render("home", { layout: "loggedIn", books: booksList, name: req.session.loggerUser });
        })
    } else {
        res.status(200).render("login");
    }


})



//endpoint para registrarse
app.get("/register", (req, res) => {
    if (req.session.loggerUser) {
        res.redirect("/")
    } else {
        res.status(200).render("register");
    }
})
app.post("/register", (req, res) => {

    auth.register(req.body.username, req.body.password, req.body.repeatPassword,
        req.body.email, req.body.provincia, req.body.localidad,
        () => {
            res.status(400).render("register", { repeatPasswordError: "La contraseña no coincide." });
        },
        () => {
            res.status(400).render("register", { userAlreadyExists: "Usuario existente. Elija otro nombre de usuario." });
        },
        () => {
            res.status(400).render("register", { emailAlreadyExists: "Su cuenta de e-mail ya esta asociada a una cuenta." });
        },
        () => {
            res.status(200).render("login", { successfulRegistration: "Se ha registrado exitosamente." });
        },
        (error) => {
            res.status(400).send(error);
        }
    )

})

//endpoint para loguearse
app.get("/login", (req, res) => {
    if (req.session.loggerUser) {
        res.redirect("/")
    } else {
        res.status(200).render("login");
    }
})
app.post("/login", (req, res) => {
    auth.login(req.body.username, req.body.password,
        () => {
            req.session.loggerUser = req.body.username;
            res.redirect("/")
        },
        () => {
            res.status(400).render("login", { errorPass: "Contraseña incorrecta." })
        },
        () => {
            res.status(400).render("login", { inexistentUser: "Usuario inexistente." })
        }
    );
})

//deslogueo
app.get("/logout", (req, res) => {
    req.session.destroy();
    res.status(200).render("login", { logout: "Ha cerrado sesión" });
})



//endoint de subida de libros
app.get("/upload", (req, res) => {
    if (req.session.loggerUser) {
        res.status(200).render("upload", { layout: "loggedIn", name: req.session.loggerUser })
        return;
    } else {

        res.status(200).render("login");
    }
})
app.post("/upload", upload.single('imgBook'), (req, res) => {
    if (req.session.loggerUser) {

        editionBooks.uploadBooks(req.session.loggerUser, req.body.titulo, req.body.autor,
            req.body.editorial, req.body.isbn, req.body.tematica, req.file.filename,
            (resultado) => {
                res.redirect("/mybooks")
            })
    }
})



//endpoint para editar libros personales
app.get("/mybooks", (req, res) => {
    if (req.session.loggerUser) {
        editionBooks.getBooksByUser(req.session.loggerUser, (books) => {
            res.status(200).render("mybooks", { layout: "loggedIn", books, name: req.session.loggerUser })
            return;
        })
    } else {
        res.status(200).render("login");
    }
})








app.get("/addfav/:id/:duenio", (req, res) => {
    if (req.session.loggerUser) {
        editionBooks.getBookByID(req.params.id, book => {
            editionPersons.addFavorite(req.session.loggerUser, book, resultado => {
                res.redirect("/favorites")
            })
        })
    } else {
        res.status(200).render("login");
    }
})


app.get("/eliminar/:id", (req, res) => {
    if (req.session.loggerUser) {
        editionBooks.deleteBook(req.params.id, resultado => {
            res.redirect("/mybooks")
        })
    } else {
        res.status(200).render("login");
    }
})

app.get("/detalle/:id", (req, res) => {
    if (req.session.loggerUser) {
        editionBooks.getBookByID(req.params.id, book => {
            editionPersons.getPersonByUser(book.duenio, user => {

                res.status(200).render("detalle", { layout: "loggedIn", book, user, name: req.session.loggerUser })
            })
        })
    } else {
    }
})

app.get("/favorites", (req, res) => {
    if (req.session.loggerUser) {

        editionBooks.getBooksByFavorites(req.session.loggerUser, listBooksFav => {
            res.status(200).render("favorites", { layout: "loggedIn", books: listBooksFav, name: req.session.loggerUser })
        })
    } else {
        res.status(200).render("login");
    }
})


app.get("/favorites/remove/:id", (req, res) => {
    if (req.session.loggerUser) {

        editionPersons.removeFavorite(req.session.loggerUser, req.params.id, () => {
            res.redirect("/favorites");
        })
    } else {
        res.status(200).render("login");
    }
})



app.get("/libros", function (req, res) {
    if (req.session.loggerUser) {
        editionBooks.getBooksAll(listaLibros => {
            if (req.query.arte) {

                let listBooks = listaLibros.filter(item => item.tematica == req.query.arte
                );
                res.status(200).render("home", { layout: "loggedIn", books: listBooks, name: req.session.loggerUser })
            }
            else if (req.query.cienciasnaturales) {

                let listBooks = listaLibros.filter(item => item.tematica == req.query.cienciasnaturales
                );

                res.status(200).render("home", { layout: "loggedIn", books: listBooks, name: req.session.loggerUser })
            }
            else if (req.query.computacion) {

                let listBooks = listaLibros.filter(item => item.tematica == req.query.computacion
                );
                res.status(200).render("home", { layout: "loggedIn", books: listBooks, name: req.session.loggerUser })

            } else if (req.query.enciclopedias) {

                let listBooks = listaLibros.filter(item => item.tematica == req.query.enciclopedias
                );
                res.status(200).render("home", { layout: "loggedIn", books: listBooks, name: req.session.loggerUser })

            } else if (req.query.ficcion) {

                let listBooks = listaLibros.filter(item => item.tematica == req.query.ficcion
                );
                res.status(200).render("home", { layout: "loggedIn", books: listBooks, name: req.session.loggerUser })

            } else if (req.query.gastronomia) {

                let listBooks = listaLibros.filter(item => item.tematica == req.query.gastronomia
                );
                res.status(200).render("home", { layout: "loggedIn", books: listBooks, name: req.session.loggerUser })
            }
            else if (req.query.infantil) {

                let listBooks = listaLibros.filter(item => item.tematica == req.query.infantil
                );
                res.status(200).render("home", { layout: "loggedIn", books: listBooks, name: req.session.loggerUser })

            } else if (req.query.negocio) {
                let listBooks = listaLibros.filter(item => item.tematica == req.query.negocio
                );
                res.status(200).render("home", { layout: "loggedIn", books: listBooks, name: req.session.loggerUser })

            }
            else if (req.query.all) {

                let listBooks = listaLibros.filter(item => item.autor.toUpperCase().includes(req.query.all.toUpperCase()) ||
                    item.titulo.toUpperCase().includes(req.query.all.toUpperCase()) || item.editorial.toUpperCase().includes(req.query.all.toUpperCase())
                    || item.isbn.toUpperCase().includes(req.query.all.toUpperCase()) || item.tematica.toUpperCase().includes(req.query.all.toUpperCase())
                );

                res.status(200).render("home", { layout: "loggedIn", books: listBooks, name: req.session.loggerUser })

            } else {
                res.status(200).render("home", { layout: "loggedIn", books: listaLibros, name: req.session.loggerUser })
            }
        })
    } else {
        res.status(200).render("login");
    }
});


app.get("/mydates", (req, res) => {
    if (req.session.loggerUser) {
        editionPersons.getPersonByUser(req.session.loggerUser, user => {
            res.status(200).render("mydates", { layout: "loggedIn", user, name: req.session.loggerUser })
        })
    } else {
        res.status(200).render("login");
    }
})

app.get("/bookspersons/:duenio", (req, res) => {

    if (req.session.loggerUser) {
        editionBooks.getBooksByUser(req.params.duenio, books => {

            res.status(200).render("bookspersons", { layout: "loggedIn", books, duenio: req.params.duenio, name: req.session.loggerUser })
        })
    } else {
        res.status(200).render("login");
    }
})


app.get("/changepass", (req, res) => {
    if (req.session.loggerUser) {
        res.status(200).render("editpass", { layout: "loggedIn", name: req.session.loggerUser })
    } else {
        res.status(200).render("login");
    }
})

app.post("/editpass", (req, res) => {

    auth.changepass(req.session.loggerUser, req.body.password, req.body.passwordRepeat,
        () => {
            res.status(400).render("editpass", {
                layout: "loggedIn",
                repeatPasswordError: "La contraseña no coincide."
            });
        },
        () => {
            editionPersons.getPersonByUser(req.session.loggerUser, user => {
                res.status(200).render("mydates", { layout: "loggedIn", successfulChangePass: "La contraseña fue cambiada exitosamente.", user, name: req.session.loggerUser })
            })
        }
    )
})

app.get("/message/:id", (req, res) => {
    if (req.session.loggerUser) {
        res.status(200).render("message", { layout: "loggedIn", name: req.session.loggerUser, duenio: req.params.user, idbook: req.params.id })
    } else {
        res.status(200).render("login");
    }
})

app.post("/message/:idbook/:user", (req, res) => {
    editionBooks.saveMessage(req.session.loggerUser, req.body.message, req.params.idbook, bookMessage => {

        if (bookMessage.success) {
            console.log(bookMessage.success);
        } else {
            console.log("no hubo resultado");
        }
    })
})

app.listen(port, () => {
    console.log("escuchando en puerto http://localhost:3000/");
})