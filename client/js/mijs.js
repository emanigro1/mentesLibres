function filtcat(click) {

    var todos = document.getElementById("todo");

    var categorias = todos.querySelectorAll("div");

    var i,click;

    for (i = 0; i < categorias.length; i++) {

        if (categorias[i].className == click || click == "all") {categorias[i].style.display = "inline-flex"}

            else {categorias[i].style.display = "none"}
        }
}

var libros = [
{
    nombre:"libro",
    categoria:"rojo"

},
{

    nombre:"libro2",
    categoria:"rojo"

},
{
    nombre:"libro3",
    categoria:"azul"

},
{
    nombre:"libro4",
    categoria:"azul"

}
];

var categorias = [
"rojo","azul","todos"
];

window.onload=()=>{
    const containerFiltros = document.getElementById('container-filtros');
    containerFiltros.addEventListener('click', function(event){
        categorias.forEach(categoria => {
            if(event.target.name === categoria){
                return renderLibrosPorCategoria(categoria);               
            }            
        });        
    })
}

function renderLibrosPorCategoria(categoria){
    const containerLibros=document.getElementById('container-libros')
    let librosFiltrados=traerLibrosPorCategoria(categoria,libros);

    librosFiltrados.forEach(libro => {
        const containerLibro = document.createElement('div');
        containerLibro.innerHTML= `<div class="categoria2 ">
        <h3>${libro.nombre}</h3>
        <p class="">>${libro.categoria}
        </p></div>`;         
        containerLibros.appendChild(containerLibro);         
    });
}


function traerLibrosPorCategoria (categoria,libros){
    let indice=0;
    let librosFiltrados=[];

    libros.forEach((libro) => {
        if(libro.categoria===categoria){
            librosFiltrados[indice]=libro;
            indice++;        }
    });

    return librosFiltrados;
}


