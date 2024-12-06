
const contenedor = document.querySelector(".bloques");
//let infoPlanta = document.querySelector(".")

let masPlantas = document.getElementById("masPlantas");
let cancelarBtn = document.getElementById("cancelarBtn");
let comenzarBtn = document.getElementById("guardarBtn");
let panel = document.getElementById("panel"); 
let cerrarPanelBtn = document.getElementById("cerrarPanel");

connect2Server()

let plantas = [
    { 
        "nombre": "mentita", 
        "estado": "Exelente estado! Sigue así! ", 
        "tipo": "MENTA",
        "imagen":"img/menta.png"
    },
    { 
        "nombre": "potty #1", 
        "estado": "Asegurate de revisar",
        "tipo": "POTUS",
        "imagen":"img/potus.png"
    }
];


fetchData("infoPlanta",(data)=>{
if (data != undefined) {
    data.forEach(crearBloquePlanta)

}
    plantas.forEach(crearBloquePlanta);
    


})


console.log(plantas)



// Crear las plantas iniciales

// Función para crear un bloque de planta y agregarlo al contenedor
function crearBloquePlanta(planta) {
    const bloque1 = document.createElement("div");
    bloque1.classList.add("bloque1");

    const img = document.createElement("img");
    img.classList.add("imagen");
    img.src = planta.imagen;

    const nombre = document.createElement("div");
    nombre.classList.add("nombre");
    nombre.innerHTML = `<p>${planta.nombre}</p>`;

    const barra = document.createElement("div");
    barra.classList.add("barra");

    const tipoPlanta = document.createElement("div");
    tipoPlanta.classList.add("tipoPlanta");

    const tipoTexto = document.createElement("span");
    tipoTexto.classList.add("tipoTexto");
    tipoTexto.textContent = "TIPO DE PLANTA: ";

    const tipoValor = document.createElement("span");
    tipoValor.classList.add("tipoValor");
    tipoValor.textContent = planta.tipo;

    const btnPanel = document.createElement("button");
    btnPanel.id = "btnPanel";
    btnPanel.textContent = "INICIAR RIEGO Y ANÁLISIS";
    btnPanel.addEventListener("click",()=>mostrarPanel())

    bloque1.appendChild(img);
    bloque1.appendChild(nombre);
    bloque1.appendChild(barra);
    bloque1.appendChild(tipoPlanta);
    tipoPlanta.appendChild(tipoTexto);
    tipoPlanta.appendChild(tipoValor);
    bloque1.appendChild(btnPanel);

    contenedor.prepend(bloque1);

    btnPanel.addEventListener("click", mostrarPanel);
}



// ------------------- "+" -------------------

// Botón +
const masDiv = document.createElement("div");
masDiv.classList.add("imgDiv");

const btnMas = document.createElement("img");
btnMas.id = "btnMas";
btnMas.src = "img/btnMas.png";
btnMas.alt = "+";

masDiv.appendChild(btnMas);
contenedor.appendChild(masDiv);

// Mostrar y ocultar cartel de "+"
btnMas.addEventListener("click", function () {
    if (masPlantas.classList.contains("hidden")) {
        masPlantas.classList.remove("hidden");
        setTimeout(() => {
            masPlantas.classList.add("active");
        }, 10);
    } else {
        masPlantas.classList.remove("active");
        setTimeout(() => {
            masPlantas.classList.add("hidden");
        }, 300);
    }
});

// Limpiar, guardar info y cerrar cartel con GUARDAR
comenzarBtn.addEventListener("click", function () {
    let nombrePlanta = document.getElementById("nombre").value;
    let tipoPlanta = document.getElementById("tipo").options[document.getElementById("tipo").selectedIndex].text;


    // Validar que los campos no estén vacíos
    if (nombrePlanta.trim() !== "" && tipoPlanta.trim() !== "") {
        
        const nuevaPlanta = {
            nombre: nombrePlanta,
            tipo: "TOMATE",
            imagen: "img/tomate.png",
        };

        console.log(nuevaPlanta)


        postData("añadirPlanta",nuevaPlanta,(data)=>{

            console.log("ENTRO ACA EL LOG");
                
                mostrarNotificacion("Planta guardada correctamente :)");
                plantas.unshift(nuevaPlanta);

                crearBloquePlanta(nuevaPlanta);
        
        
                // Limpiar
                document.getElementById("nombre").value = "";
                document.getElementById("tipo").selectedIndex = 0;
        
                // Cerrar sin transición
                masPlantas.classList.remove("active");
                setTimeout(() => {
                    masPlantas.classList.add("hidden");
                }, 300); // Esperar a que termine la transición

            }
        )

    
    } else {
        alert("Por favor, complete todos los campos antes de guardar.");
    }
});

// Función para mostrar la notificación
function mostrarNotificacion(mensaje) {
    const notificacion = document.createElement("div");
    notificacion.classList.add("notificacion");
    notificacion.textContent = mensaje;

    document.body.appendChild(notificacion);

    setTimeout(() => {
        notificacion.remove();
    }, 2000);
}

// Cerrar cartel con CANCELAR
cancelarBtn.addEventListener("click", function () {
    masPlantas.classList.remove("active");
    setTimeout(() => {
        masPlantas.classList.add("hidden");
    }, 300);
});

// ------------------- "INICIAR RIEGO Y ANÁLISIS" -------------------
let resHumedad = 0
let temperatura = 0
let luz = 0

// Mostrar panel

receive("enviarDesdeArduino",(data)=>{
    resHumedad = Math.round((1024 - data.h) /10);
    temperatura = data.t
    luz = data.l
    console.log(data)
})
function mostrarPanel() {
    

        document.getElementById("luzPorciento").innerText = luz + "%"
        document.getElementById("tempPorciento").innerText = temperatura + "°C"
        document.getElementById("humedadPorciento").innerText = resHumedad + "%";
        document.getElementById("humedadBarrita").style.width = resHumedad + "%";

        if (resHumedad > 70){
            document.getElementById("humedadMsj").innerText = "EL NIVEL DE AGUA ES EXCESIVO";
        }
        else if(70 > resHumedad > 50){
            document.getElementById("humedadMsj").innerText = "LLa humedad está algo alta, no es necesario regar por ahora.";
        }
        else if(50 > resHumedad > 30) {
            document.getElementById("humedadMsj").innerText = "¡Excelente! La Humedad está manteniendose dentro de los estándares recomendados.";
        }
        else if(30 > resHumedad > 20) {
            document.getElementById("humedadMsj").innerText = "La planta necesitará agua muy pronto.";
        }
        else if(20 > resHumedad > 0){
            document.getElementById("humedadMsj").innerText = "¡URGENTE, TU PLANTA NECESITA AGUA!";
        }
        else {
            document.getElementById("humedadMsj").innerText = "Ha ocurrido un error.";
        }
}

   

    
    panel.classList.remove("hidden");
    setTimeout(() => {
        panel.classList.add("active");
    }, 10);


// Cerrar panel con "X"
cerrarPanelBtn.addEventListener("click", function () {
    panel.classList.remove("active");
    setTimeout(() => {
        panel.classList.add("hidden");
    }, 300);
});

