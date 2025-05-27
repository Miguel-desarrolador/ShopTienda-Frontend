 // Menú Hamburguesa
const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");
const links = document.querySelectorAll("#nav-links a"); // Selecciona todos los enlaces del menú

menuToggle.addEventListener("click", () => {
navLinks.classList.toggle("active");
menuToggle.classList.toggle("open");
});

// Cerrar el menú al hacer clic en un enlace
links.forEach(link => {
link.addEventListener("click", () => {
navLinks.classList.remove("active"); // Cierra el menú
menuToggle.classList.remove("open"); // Cambia el ícono del menú
});
});

// Obtener los elementos del DOM
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');

// Función para filtrar los productos por texto
function filterProductos() {
const searchText = searchInput.value.toLowerCase(); // Obtener texto en minúsculas
const productos = document.querySelectorAll('.producto'); // Seleccionar todos los productos

productos.forEach(producto => {  
    const nombreProducto = producto.querySelector('h3').textContent.toLowerCase(); // Obtener el nombre del producto  
    if (nombreProducto.includes(searchText)) {  
        producto.style.display = ''; // Mostrar si coincide  
    } else {  
        producto.style.display = 'none'; // Ocultar si no coincide  
    }  
});

}

// Ejecutar filtro al escribir en el input
searchInput.addEventListener('input', filterProductos);

// Ejecutar filtro al hacer clic en el botón de búsqueda
searchBtn.addEventListener('click', filterProductos);



//boton para subir

  const scrollBtn = document.querySelector('.scroll-to-top');
  scrollBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });






/*document.addEventListener("DOMContentLoaded", () => {
    const productos = [
        { id: 1, precio: 120, stock: 4, imagen: "img-2/1.jpg", nombre: "Gorra Nike 1" },
        { id: 2, precio: 150, stock: 4, imagen: "img-2/2.jpg", nombre: "Gorra Nike 2" },
        { id: 3, precio: 110, stock: 4, imagen: "img-2/3.jpg", nombre: "Gorra Nike 3" },
        { id: 4, precio: 130, stock: 4, imagen: "img-2/4.jpg", nombre: "Gorra Nike 4" }
    ];

    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    const productosDetails = document.querySelector(".productos-details");
    const carritoLista = document.querySelector("#carrito-lista");
    const carritoContador = document.querySelector("#contador");
    const totalCarrito = document.querySelector("#total-carrito");
    const btnVaciarCarrito = document.querySelector("#vaciar-carrito");
    const carritoIcono = document.querySelector(".carrito-icono");
    const contenidoCarrito = document.querySelector(".contenido-carrito");
    const btnVerMas = document.querySelector(".ver-mas");

    btnVerMas.addEventListener("click", () => {
        const estaAbierto = productosDetails.style.display === "block";
        if (estaAbierto) {
            productosDetails.style.display = "none";
            btnVerMas.innerText = "Ver más";
        } else {
            mostrarProductos();
            productosDetails.style.display = "block";
            btnVerMas.innerText = "Ver menos";
        }
    });

    function mostrarProductos() {
        productosDetails.innerHTML = "";
        const gridProductos = document.createElement("div");
        gridProductos.classList.add("grid-productos");

        productos.forEach((producto, index) => {
            const productoItem = document.createElement("div");
            productoItem.classList.add("producto-item");

            productoItem.innerHTML = `
                <img src="${producto.imagen}" alt="${producto.nombre}">
                <p class="precio">Precio: $${producto.precio}</p>
                <p class="stock" data-id="${producto.id}">Stock: ${producto.stock} unidades</p>
                <button class="agregar-carrito" data-index="${index}" ${producto.stock === 0 ? 'disabled' : ''}>
                    ${producto.stock === 0 ? 'Sin stock' : 'Agregar al carrito'}
                </button>
            `;

            gridProductos.appendChild(productoItem);
        });

        productosDetails.appendChild(gridProductos);
        document.querySelectorAll(".agregar-carrito").forEach((btn) => {
            btn.addEventListener("click", (e) => {
                const index = e.target.dataset.index;
                agregarAlCarrito(index, e.target);
            });
        });
    }

    function agregarAlCarrito(index, boton) {
        let producto = productos[index];

        const productoEnCarrito = carrito.find(item => item.id === producto.id);
        if (productoEnCarrito) {
            productoEnCarrito.cantidad += 1;
        } else {
            carrito.push({ ...producto, cantidad: 1 });
        }

        producto.stock--;
        actualizarCarrito();
        actualizarStock(producto.id, producto.stock);

        if (producto.stock === 0) {
            boton.disabled = true;
            boton.innerText = "Sin stock";
        }
    }

    function actualizarStock(id, stock) {
        const stockElemento = document.querySelector(`.stock[data-id="${id}"]`);
        if (stockElemento) {
            stockElemento.textContent = `Stock: ${stock} unidades`;
        }

        // Habilitar o deshabilitar botón
        const index = productos.findIndex(p => p.id === id);
        if (index !== -1) {
            const boton = document.querySelector(`.agregar-carrito[data-index="${index}"]`);
            if (boton) {
                boton.disabled = stock === 0;
                boton.innerText = stock === 0 ? "Sin stock" : "Agregar al carrito";
            }
        }
    }

    function actualizarCarrito() {
        carritoLista.innerHTML = "";
        let total = 0;

        carrito.forEach((producto, index) => {
            total += producto.precio * producto.cantidad;

            const item = document.createElement("div");
            item.innerHTML = ` <div class="nom-elimi">
                <img class="img-product" src="${producto.imagen}" alt="${producto.nombre}">
                
                    <h3>${producto.nombre}  $${producto.precio}</h3>
                <div>
                    <button class="decrementar" data-index="${index}">-</button>
                    <span>${producto.cantidad}</span>
                    <button class="incrementar" data-index="${index}">+</button>
                </div>
                    <button class="eliminar" data-index="${index}">Eliminar</button>
                </div>
            `;
            carritoLista.appendChild(item);
        });

        carritoContador.innerText = carrito.length;
        totalCarrito.innerText = `Total: $${total}`;

        document.querySelectorAll(".eliminar").forEach(btn => {
            btn.addEventListener("click", (e) => {
                e.stopPropagation();
                eliminarDelCarrito(e.target.dataset.index);
            });
        });

        localStorage.setItem("carrito", JSON.stringify(carrito));
    }
    
    function incrementarCantidad(index) {
    let productoEnCarrito = carrito[index];
    let productoOriginal = productos.find(p => p.id === productoEnCarrito.id);

    if (productoOriginal.stock > 0) {
        productoEnCarrito.cantidad++;
        productoOriginal.stock--;  // Reducimos el stock
        actualizarCarrito();
        actualizarStock(productoOriginal.id, productoOriginal.stock);
    } else {
        alert("No hay más stock disponible");
    }
}
function decrementarCantidad(index) {
    let productoEnCarrito = carrito[index];
    let productoOriginal = productos.find(p => p.id === productoEnCarrito.id);

    if (productoEnCarrito.cantidad > 1) {
        productoEnCarrito.cantidad--;
        productoOriginal.stock++; // Devolvemos el stock
    } else {
        carrito.splice(index, 1); // Si la cantidad es 1, lo eliminamos
        productoOriginal.stock++; // Devolvemos el stock también
    }

    actualizarCarrito();
    actualizarStock(productoOriginal.id, productoOriginal.stock);
}
// Agregar eventos a los botones de incrementar y decrementar
document.addEventListener("click", (e) => {
    if (e.target.classList.contains("incrementar")) {
        e.stopPropagation(); // Evita que se cierre el carrito
        incrementarCantidad(e.target.dataset.index);
    }
    if (e.target.classList.contains("decrementar")) {
        e.stopPropagation(); // Evita que se cierre el carrito
        decrementarCantidad(e.target.dataset.index);
    }
});

    function eliminarDelCarrito(index) {
        let producto = carrito[index];
        const productoOriginal = productos.find(p => p.id === producto.id);

        if (productoOriginal) {
            productoOriginal.stock += producto.cantidad;
            carrito.splice(index, 1);
            actualizarCarrito();
            actualizarStock(productoOriginal.id, productoOriginal.stock);
        }
    }

    btnVaciarCarrito.addEventListener("click", () => {
        if (confirm("¿Estás seguro de que quieres vaciar el carrito?")) {
            carrito = [];
            productos.forEach(producto => producto.stock = 4);
            actualizarCarrito();
            productos.forEach(producto => actualizarStock(producto.id, producto.stock));
            localStorage.removeItem("carrito");
        }
    });

    carritoIcono.addEventListener("click", () => {
        contenidoCarrito.classList.toggle("show");
        contenidoCarrito.style.display = contenidoCarrito.classList.contains("show") ;
    });

    // Cargar carrito al inicio
    actualizarCarrito();
});


    // Sincronizar cambios entre ambas páginas
    window.addEventListener("storage", (e) => {
        if (e.key === "carrito") {
            carrito = JSON.parse(e.newValue) || [];
            renderizarCarrito();
        }
    });

    contenedorCarrito.addEventListener("click", (e) => {
        if (e.target.classList.contains("incrementar")) {
            carrito[e.target.dataset.index].cantidad++;
        } else if (e.target.classList.contains("decrementar") && carrito[e.target.dataset.index].cantidad > 1) {
            carrito[e.target.dataset.index].cantidad--;
        } else if (e.target.classList.contains("eliminar")) {
            carrito.splice(e.target.dataset.index, 1);
        }

        localStorage.setItem("carrito", JSON.stringify(carrito));
        renderizarCarrito();
    });*/