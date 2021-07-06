const grid = new Muuri('.grid',{
    layout: {
        rounding: false
    }
    
});

//Enlaces

const enlaces = document.querySelectorAll ('#categorias a');
enlaces.forEach((elemento) =>{
    elemento.addEventListener('click', (evento) =>{
        evento.preventDefault();
        enlaces.forEach((enlace) => enlace.classList.remove ('activo') );
        evento.target.classList.add('activo');
        
        const categoria = evento.target.innerHTML.toLowerCase(); 
        grid.filter(`[data-categoria="${categoria}"]`)
        categoria === 'todos los productos' ? grid.filter('[data-categoria]') : grid.filter (`[data-categoria='${categoria}']`);
    });
});

//Barra de busqueda

document.querySelector('#barra-busqueda').addEventListener('input', (evento) => {
    const busqueda = evento.target.value;
    grid.filter ((item) => item.getElement().dataset.etiquetas.includes(busqueda) );
});

// Imagenes 

const overlay = document.getElementById('overlay');
document.querySelectorAll('.grid .item img').forEach( (elemento) => {
    elemento.addEventListener('click', () =>{
        const ruta = elemento.getAttribute ('src');
        const descripcion = elemento.parentNode.parentNode.dataset.descripcion; 
        const precio = elemento.parentNode.parentNode.dataset.precio;
        const id = elemento.parentNode.parentNode.dataset.id;
        
        overlay.classList.add('activo');
        document.querySelector('#overlay img').src = ruta;
        document.querySelector('#overlay .descripcion').innerHTML = descripcion;
        document.querySelector('#overlay .precio').innerHTML = precio;
    });
    
});

// Cerrar 

document.querySelector ('#btn-cerrar').addEventListener('click', () =>{
    overlay.classList.remove('activo');
});



//Carrito
let carrito = [];
const tableCarrito = document.querySelector('#lista-carrito tbody')
document.addEventListener('DOMContentLoaded', () => {
    
    if (JSON.parse(localStorage.getItem('carrito'))) {
        carrito = JSON.parse(localStorage.getItem('carrito'));
        insertarCarritoHTML();
    }
});




const contenedorOverlay = document.querySelector ('#overlay'); 
contenedorOverlay.addEventListener ('click', agregarProductos)

function agregarProductos (e) {
    e.preventDefault();
    
    if(e.target.classList.contains("agregar-carrito")){
        const contenedorProducto = e.target.parentElement;
        
        
        obtenerDatos(contenedorProducto); 
    }
}

function obtenerDatos (contenedorProducto) {
    
    const productoCarrito = {
        imagen: contenedorProducto.querySelector('img').src,
        nombre: contenedorProducto.querySelector('.descripcion').textContent,
        precio: contenedorProducto.querySelector('.precio').textContent,
        cantidad: 0, 
    };
    
    carrito.push(productoCarrito);
    
    const existe = carrito.some(producto => producto.imagen === productoCarrito.imagen);
    
    if (existe) {
        const productos = carrito.map(producto => {
            if (producto.imagen === productoCarrito.imagen) {
                producto.cantidad++;
                producto.precio = `$${Number(productoCarrito.precio.slice(1)) * producto.cantidad}`
                return producto;
            } 
            
        });
        
        carrito = [...productos];
    } else {
        
        carrito = [...carrito, productoCarrito];
    }
    
    insertarCarritoHTML();
}



function insertarCarritoHTML (){
    
    borrarCarrito();
    
    
    carrito.forEach (producto => {
        
        const fila = document.createElement ('tr'); 
        fila.innerHTML = `
        <td>
        <img src="${producto.imagen}" width='100px'>
        </td>
        <td>${producto.nombre}</td>
        <td>${producto.precio}</td>
        <td>${producto.cantidad}</td>
        `
        
        tableCarrito.appendChild(fila);
    });
    
    guardarCarritoStorage();
}

function borrarCarrito (){
    while (tableCarrito.firstChild) {
        tableCarrito.removeChild(tableCarrito.firstChild);
    }
}

function guardarCarritoStorage() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}