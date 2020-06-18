module.exports={
    coincidencias
}

function coincidencias(name,user1,user2) {

    let coincidencia = false;    

    for (let i = 0; i < user1.length; i++) {
        if (user2[i].nombre == name) {
            coincidencia = true;
        }
    }  
       return coincidencia;
}
