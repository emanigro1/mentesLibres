const editionBooks = require("./editionBooks")

module.exports={
    search
}

function search(){
editionBooks.getBooksAll (listaLibros => {

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

}