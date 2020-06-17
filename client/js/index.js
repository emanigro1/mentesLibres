/* const botonForm = document.getElementById("botonForm");


botonForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const contenedor = document.getElementById("contenedorEjemplo");
    const busqueda = document.getElementById("barraBuscar").value;
    const xhr = new XMLHttpRequest();
    let url = "/libros";
    if (busqueda) url += "?all=" + busqueda;

    xhr.addEventListener("load", function () {

        if (this.status == 200) {
            contenedor.textContent = "";
            const array = JSON.parse(this.responseText);

            array.forEach(element => {
                contenedor.innerHTML += `Titulo: ${element.titulo} <br>`;
                contenedor.innerHTML += `Autor: ${element.autor}  <br>`;
                contenedor.innerHTML += `Tematica: ${element.tematica}  <br> <br>`;
            });
            if (array.length == 0) contenedor.innerHTML = `No se ha encontrado coincidencia`;
        }
    })

    xhr.open("GET", url);

    xhr.send();
})

reedirigir pagina

setTimeout(() => {
    window.location.href = "/contact";
}, 2000);


    enviar ajax con post con tipo json

xhr.setRequestHeader("Content-Type","application/json");
*/