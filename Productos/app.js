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


const container = document.querySelector('.logos-container');
const slides = document.querySelectorAll('.slide');
const prev = document.querySelector('.prev');
const next = document.querySelector('.next');

let currentIndex = 0;

// Función para mover el carrusel
function showSlide(index) {
  const slideWidth = slides[0].offsetWidth;
  container.style.transform = `translateX(-${index * slideWidth}px)`;
}

// Flechas
next.addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % slides.length;
  showSlide(currentIndex);
});

prev.addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + slides.length) % slides.length;
  showSlide(currentIndex);
});

// Auto-slide cada 5 segundos
setInterval(() => {
  currentIndex = (currentIndex + 1) % slides.length;
  showSlide(currentIndex);
}, 5000);

// Ajusta si se cambia el tamaño de la ventana
window.addEventListener('resize', () => showSlide(currentIndex));


// BOTON SCROLL - SUBE ARRIBA DE TODO
  const scrollBtn = document.querySelector('.scroll-to-top');
  scrollBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

    // Api
const API_URL = "https://mayorista-sinlimites-backend-production.up.railway.app/api/productos";


// DOM Elements
const productosContainer = document.getElementById("productos");
const carritoFlotante = document.getElementById("carritoFlotante");
const carritoProductos = document.getElementById("carritoProductos");
const totalCarritoSpan = document.getElementById("totalCarrito");
const cantidadCarritoSpan = document.getElementById("cantidadCarrito");
const iconoCarrito = document.getElementById("iconoCarrito");
const cerrarCarritoBtn = document.getElementById("cerrarCarrito");
const finalizarCompraBtn = document.getElementById("finalizarCompra");
const vaciarCarritoBtn = document.getElementById("vaciarCarrito");
const buscadorTexto = document.getElementById("buscadorTexto");
const filtroCategoria = document.getElementById("filtroCategoria");

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
let productosDB = [];

// MODAL CLIENTE
const modalDatosCliente = document.getElementById("modalDatosCliente");
const formDatosCliente = document.getElementById("formDatosCliente");
const cerrarModalDatos = document.getElementById("cerrarModalDatos");
const btnIrCompras = document.getElementById("btnIrCompras");



iconoCarrito.addEventListener("click", () => {
  carritoFlotante.classList.toggle("abierto");
});

cerrarCarritoBtn.addEventListener("click", () => {
  carritoFlotante.classList.remove("abierto");
});


// Cargar productos
async function cargarProductos() {
  try {
    const res = await fetch(API_URL);
    productosDB = await res.json();

    cargarCategorias();

    // Inicializar paginador
    paginador = new Paginacion({
      data: [...productosDB].sort((a, b) => b.id - a.id), // productos nuevos primero
      container: contenedorPaginacion,
      itemsPorPagina: 12,
      onPageChange: (productosPagina) => {
        renderizarProductos(productosPagina);
      }
    });

    renderizarCarrito();
    actualizarStockVisual();
  } catch (error) {
    console.error("Error cargando productos:", error);
  }
}
// Renderizar productos con nuevo primero
function renderizarProductos(listaProductos) {
  productosContainer.innerHTML = listaProductos.map((p, index) => `
    <div class="producto" data-id="${p.id}" data-aos="fade-right">
     <img src="https://mayorista-sinlimites-backend-production.up.railway.app/img/productos/${p.imagen}" alt="${p.nombre}">
      <h3>${p.nombre}</h3>
      <p class="precio">Precio: $${p.precio.toLocaleString("es-AR")}</p>

      <p class="stock">Stock: ${p.stock}</p>
      <div class="cantidad-control">
        <button class="btn-menos">-</button>
        <span class="cantidad">0</span>
        <button class="btn-mas">+</button>
      </div>
      <button class="btn-agregar">Agregar a carrito</button>
      <button class="btn-eliminar-producto btn-especial" type="button">Eliminar Producto</button>
      <button class="btn-editar-stock btn-especial" type="button">Editar Stock</button>
      <button class="btn-editar-precio btn-especial" type="button">Editar Precio</button>
      <button class="btn-editar-imagen btn-especial" type="button">Editar Imagen</button><button class="btn-editar-nombre btn-especial" type="button">Editar Nombre</button>
<button class="btn-editar-categoria btn-especial" type="button">Editar Categoría</button>

    </div>
  `).join("");

  asignarEventosProductos(listaProductos);

  // Mostrar u ocultar botones especiales según acceso
  const botonesEspeciales = document.querySelectorAll(".btn-especial");
  botonesEspeciales.forEach(btn => {
    btn.style.display = accesoEmpleado ? "inline-block" : "none";
  });

  // 🔹 Actualizar stock visual de los productos renderizados
  actualizarStockVisual();
  // Inicializar AOS en los nuevos elementos
  AOS.refresh();
}



// ==========================
// ELEMENTOS MODAL AGREGAR PRODUCTO
// ==========================
const btnAbrirModal = document.getElementById("btnAbrirModal");
const modalAgregarProducto = document.getElementById("modalAgregarProducto");
const formAgregarProducto = document.getElementById("formAgregarProducto");
const inputImagen = document.getElementById("inputImagen");
const previewImagen = document.getElementById("previewImagen");
const inputCategoria = document.getElementById("inputCategoria");
const inputNuevaCategoria = document.getElementById("inputNuevaCategoria");


// ==========================
// CARGAR CATEGORÍAS EN EL SELECT DEL MODAL
// ==========================
function cargarCategoriasModal() {
  const categorias = [...new Set(productosDB.map(p => p.categoria))]; // Extrae categorías únicas
  inputCategoria.innerHTML = categorias.map(c => `<option value="${c}">${c}</option>`).join("");
  inputCategoria.insertAdjacentHTML("afterbegin", `<option value="">Seleccionar categoría</option>`);
}


// ==========================
// CERRAR MODAL AGREGAR PRODUCTO
// ==========================
const btnCerrarModal = document.getElementById("btnCerrarModal");

btnCerrarModal.addEventListener("click", () => {
  modalAgregarProducto.classList.add("oculto");
  formAgregarProducto.reset();
  previewImagen.src = "";
  previewImagen.style.display = "none";
});

// ==========================
// ABRIR MODAL CON CATEGORÍAS
// ==========================
btnAbrirModal.addEventListener("click", () => {
  modalAgregarProducto.classList.remove("oculto");
  inputNombre.value = "";
  inputPrecio.value = "";
  inputStock.value = "";
  inputNuevaCategoria.value = "";
  inputImagen.value = "";
  previewImagen.src = "";
  previewImagen.style.display = "none";

  cargarCategoriasModal(); // <-- Cargar categorías al abrir modal
});


// ==========================
// PREVIEW DE IMAGEN
// ==========================
inputImagen.addEventListener("change", () => {
  const file = inputImagen.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = e => {
      previewImagen.src = e.target.result;
      previewImagen.style.display = "block";
    };
    reader.readAsDataURL(file);
  } else {
    previewImagen.src = "";
    previewImagen.style.display = "none";
  }
});


// ==========================
// AGREGAR NUEVO PRODUCTO
// ==========================
formAgregarProducto.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Obtener datos del formulario
  const nombre = document.getElementById("inputNombre").value;
  const precio = parseFloat(document.getElementById("inputPrecio").value);
  const stock = parseInt(document.getElementById("inputStock").value);
  let categoria = inputCategoria.value;
  const nuevaCategoria = inputNuevaCategoria.value.trim();

  if (nuevaCategoria) categoria = nuevaCategoria;

  const formData = new FormData();
  formData.append("nombre", nombre);
  formData.append("precio", precio);
  formData.append("stock", stock);
  formData.append("categoria", categoria);
  if (inputImagen.files[0]) formData.append("imagen", inputImagen.files[0]);

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      body: formData
    });

    if (!res.ok) throw new Error("Error al agregar producto");
    const nuevoProducto = await res.json();

    // Agregar al array
    productosDB.unshift(nuevoProducto);

    // Renderizar solo el producto nuevo en el DOM
    renderizarProductos(productosDB);

    // Mantener acceso empleado activo si corresponde
    if (accesoEmpleado) mostrarBotonesEspeciales();

    // Cerrar modal y resetear formulario
    modalAgregarProducto.classList.add("oculto");
    formAgregarProducto.reset();
    previewImagen.style.display = "none";
    mostrarAlerta("Producto agregado correctamente!", "success");

  } catch (err) {
    console.error(err);
    mostrarAlerta("No se pudo agregar el producto. Intenta de nuevo.", "error");
  }
});

// =======================
// Asignar eventos a productos
// =======================
function asignarEventosProductos(productos) {
  productos.forEach(p => {
    const productoDiv = document.querySelector(`.producto[data-id="${p.id}"]`);
    if (!productoDiv) return;

    // Agregar / sumar / restar
    const btnAgregar = productoDiv.querySelector(".btn-agregar");
    if (btnAgregar) btnAgregar.addEventListener("click", () => agregarAlCarrito(p.id));

    const btnMas = productoDiv.querySelector(".btn-mas");
    if (btnMas) btnMas.addEventListener("click", () => agregarAlCarrito(p.id));

    const btnMenos = productoDiv.querySelector(".btn-menos");
    if (btnMenos) btnMenos.addEventListener("click", () => decrementarCantidad(p.id));


    // =======================
// Editar Nombre
// =======================
const btnEditarNombre = productoDiv.querySelector(".btn-editar-nombre");
if (btnEditarNombre) {
  btnEditarNombre.addEventListener("click", () => {
    mostrarModalNombre(p.nombre, async (nuevoNombre) => {
      if (!nuevoNombre) return;

      try {
        const res = await fetch(`${API_URL}/${p.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nombre: nuevoNombre })
        });
        if (!res.ok) throw new Error("Error al actualizar nombre");

        p.nombre = nuevoNombre;
        const titulo = productoDiv.querySelector("h3");
        if (titulo) titulo.textContent = nuevoNombre;

        mostrarAlerta("Nombre actualizado correctamente!", "success");
      } catch (err) {
        console.error(err);
        mostrarAlerta("No se pudo actualizar el nombre.", "error");
      }
    });
  });
}

// =======================
// Editar Categoría
// =======================
const btnEditarCategoria = productoDiv.querySelector(".btn-editar-categoria");
if (btnEditarCategoria) {
  btnEditarCategoria.addEventListener("click", () => {
    mostrarModalCategoria(p.categoria, async (nuevaCategoria) => {
      if (!nuevaCategoria) return;

      try {
        const res = await fetch(`${API_URL}/${p.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ categoria: nuevaCategoria })
        });
        if (!res.ok) throw new Error("Error al actualizar categoría");

        p.categoria = nuevaCategoria;
        mostrarAlerta("Categoría actualizada correctamente!", "success");

        // Actualizar filtros y selects
        if (typeof cargarCategorias === "function") cargarCategorias();
        if (typeof cargarCategoriasModal === "function") cargarCategoriasModal();
      } catch (err) {
        console.error(err);
        mostrarAlerta("No se pudo actualizar la categoría.", "error");
      }
    });
  });
}

// =======================
// Editar Precio
// =======================
const btnEditarPrecio = productoDiv.querySelector(".btn-editar-precio");
if (btnEditarPrecio) {
  btnEditarPrecio.addEventListener("click", () => {
    mostrarModalStock(`Ingrese nuevo precio para "${p.nombre}":`, p.precio, async (nuevoPrecio) => {
      if (nuevoPrecio === null) return;

      const precioNumber = parseFloat(nuevoPrecio);
      if (isNaN(precioNumber) || precioNumber < 0) return;

      try {
        const res = await fetch(`${API_URL}/${p.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ precio: precioNumber })
        });
        if (!res.ok) throw new Error("Error al actualizar precio");

        p.precio = precioNumber;
        const precioElemento = productoDiv.querySelector(".precio");
        if (precioElemento) precioElemento.textContent = `Precio: $${precioNumber}`;

        mostrarAlerta("Precio actualizado correctamente!", "success");
      } catch (err) {
        console.error(err);
        mostrarAlerta("No se pudo actualizar el precio.", "error");
      }
    });
  });
}

// Editar stock
const btnEditarStock = productoDiv.querySelector(".btn-editar-stock");
if (btnEditarStock) btnEditarStock.addEventListener("click", async () => {
  mostrarModalStock(`Ingrese nuevo stock para "${p.nombre}":`, p.stock, async (nuevoStock) => {
    if (nuevoStock === null) return;

    const stockNumber = parseInt(nuevoStock);
    if (isNaN(stockNumber) || stockNumber < 0) return;

    try {
      const res = await fetch(`${API_URL}/${p.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stock: stockNumber }) // Enviar stock al backend
      });
      if (!res.ok) throw new Error("Error al actualizar stock");

      // Actualizar frontend
      p.stock = stockNumber;
      const itemCarrito = carrito.find(c => c.id === p.id);
      if (itemCarrito) itemCarrito.stock = stockNumber;
      guardarCarrito();

      mostrarAlerta("Stock actualizado correctamente!", "success");
      actualizarStockVisual();
    } catch (error) {
      console.error(error);
      mostrarAlerta("No se pudo actualizar el stock.", "error");
    }
  });
});

// Editar imagen
const btnEditarImagen = productoDiv.querySelector(".btn-editar-imagen");
if (btnEditarImagen) btnEditarImagen.addEventListener("click", () => {
  const inputFile = document.createElement("input");
  inputFile.type = "file";
  inputFile.accept = "image/*";

  inputFile.addEventListener("change", async () => {
    const archivo = inputFile.files[0];
    if (!archivo) return;

    // Actualizar imagen instantáneamente en el frontend
    const imgElemento = productoDiv.querySelector("img");
    if (imgElemento) imgElemento.src = URL.createObjectURL(archivo);

    // Subir al servidor
    const formData = new FormData();
    formData.append("imagen", archivo);

    try {
      const res = await fetch(`${API_URL}/${p.id}/imagen`, { method: "PUT", body: formData });
      if (!res.ok) throw new Error("Error al subir la imagen");

      const data = await res.json();
      p.imagen = data.imagen;
// Actualizar imagen con la URL de Railway
if (imgElemento) imgElemento.src = `https://mayorista-sinlimites-backend-production.up.railway.app/img/productos/${p.imagen}`;



      mostrarAlerta("Imagen actualizada correctamente!", "success");
    } catch (error) {
      console.error(error);
      mostrarAlerta(error.message, "error");
    }
  });

  inputFile.click();
});


    // Eliminar producto
    const btnEliminar = productoDiv.querySelector(".btn-eliminar-producto");
    if (btnEliminar) btnEliminar.addEventListener("click", async (e) => {
      e.preventDefault();
      modalConfirmacion(`¿Deseas eliminar "${p.nombre}" de la base de datos?`, async (respuesta) => {
        if (!respuesta) return;

        try {
          const res = await fetch(`${API_URL}/${p.id}`, { method: "DELETE" });
          if (!res.ok) throw new Error("Error al eliminar producto");

          productosDB = productosDB.filter(prod => prod.id !== p.id);
          carrito = carrito.filter(c => c.id !== p.id);
          productoDiv.remove();
          guardarCarrito();

          mostrarAlerta("Producto eliminado correctamente!", "success");
        } catch (error) {
          console.error(error);
          mostrarAlerta("No se pudo eliminar el producto.", "error");
        }
      });
    });

  });

  actualizarStockVisual();
}

// Modal Nombre
const modalNombre = document.getElementById("modalNombre");
const inputNombreModal = document.getElementById("inputNombreModal");
const btnAceptarNombre = document.getElementById("btnAceptarNombre");
const btnCancelarNombre = document.getElementById("btnCancelarNombre");
const cerrarModalNombreBtn = document.getElementById("cerrarModalNombre");

function mostrarModalNombre(nombreActual, callback) {
  inputNombreModal.value = nombreActual;
  modalNombre.style.display = "flex";
  inputNombreModal.focus();

  const aceptar = () => {
    cerrarModal();
    callback(inputNombreModal.value.trim());
  };
  const cancelar = () => {
    cerrarModal();
    callback(null);
  };
  const cerrarModal = () => {
    modalNombre.style.display = "none";
    btnAceptarNombre.removeEventListener("click", aceptar);
    btnCancelarNombre.removeEventListener("click", cancelar);
    cerrarModalNombreBtn.removeEventListener("click", cancelar);
    inputNombreModal.onkeydown = null;
  };

  btnAceptarNombre.addEventListener("click", aceptar);
  btnCancelarNombre.addEventListener("click", cancelar);
  cerrarModalNombreBtn.addEventListener("click", cancelar);

  inputNombreModal.onkeydown = (e) => {
    if (e.key === "Enter") aceptar();
    if (e.key === "Escape") cancelar();
  };
}

// Modal Categoría
const modalCategoria = document.getElementById("modalCategoria");
const selectCategoriaModal = document.getElementById("selectCategoriaModal");
const inputNuevaCategoriaModal = document.getElementById("inputNuevaCategoriaModal");
const btnAceptarCategoria = document.getElementById("btnAceptarCategoria");
const btnCancelarCategoria = document.getElementById("btnCancelarCategoria");
const cerrarModalCategoriaBtn = document.getElementById("cerrarModalCategoria");

function mostrarModalCategoria(categoriaActual, callback) {
  // Cargar categorías existentes
  const categorias = [...new Set(productosDB.map(p => p.categoria))];
  selectCategoriaModal.innerHTML = categorias.map(c => `<option value="${c}">${c}</option>`).join("");
  selectCategoriaModal.insertAdjacentHTML("afterbegin", `<option value="">Seleccionar categoría</option>`);

  selectCategoriaModal.value = categoriaActual || "";
  inputNuevaCategoriaModal.value = "";
  modalCategoria.style.display = "flex";
  selectCategoriaModal.focus();

  const aceptar = () => {
    cerrarModal();
    const nuevaCat = inputNuevaCategoriaModal.value.trim();
    callback(nuevaCat || selectCategoriaModal.value);
  };
  const cancelar = () => {
    cerrarModal();
    callback(null);
  };
  const cerrarModal = () => {
    modalCategoria.style.display = "none";
    btnAceptarCategoria.removeEventListener("click", aceptar);
    btnCancelarCategoria.removeEventListener("click", cancelar);
    cerrarModalCategoriaBtn.removeEventListener("click", cancelar);
    inputNuevaCategoriaModal.onkeydown = null;
    selectCategoriaModal.onkeydown = null;
  };

  btnAceptarCategoria.addEventListener("click", aceptar);
  btnCancelarCategoria.addEventListener("click", cancelar);
  cerrarModalCategoriaBtn.addEventListener("click", cancelar);

  // Enter y Escape
  inputNuevaCategoriaModal.onkeydown = (e) => {
    if (e.key === "Enter") aceptar();
    if (e.key === "Escape") cancelar();
  };
  selectCategoriaModal.onkeydown = (e) => {
    if (e.key === "Enter") aceptar();
    if (e.key === "Escape") cancelar();
  };
}


// Carrito
function guardarCarrito() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
  renderizarCarrito();
  actualizarStockVisual();
}

function agregarAlCarrito(id) {
  const productoDB = productosDB.find(p => p.id === id);
  if (!productoDB) return;
  const productoExistente = carrito.find(p => p.id === id);
  if (productoExistente) {
    if (productoExistente.cantidad < productoDB.stock) productoExistente.cantidad++;
    else { mostrarAlerta("Ya llegaste al stock maximo!", "error"); return; }
  } else {
    carrito.push({ id: productoDB.id, nombre: productoDB.nombre, precio: productoDB.precio, imagen: productoDB.imagen, cantidad: 1, stock: productoDB.stock });
  }
  guardarCarrito();
}

function decrementarCantidad(id) {
  const producto = carrito.find(p => p.id === id);
  if (producto) {
    if (producto.cantidad > 1) producto.cantidad--;
    else carrito = carrito.filter(p => p.id !== id);
    guardarCarrito();
  }
}

function eliminarDelCarrito(id) {
  const producto = carrito.find(p => p.id === id);
  if (!producto) return;

  // 🔹 Confirmación moderna
  modalConfirmacion(`¿Deseas eliminar "${producto.nombre}" del carrito?`, (respuesta) => {
    if (!respuesta) return;

    carrito = carrito.filter(p => p.id !== id);
    guardarCarrito();

    // ✅ Aviso en verde
    mostrarAlerta(`"${producto.nombre}" fue eliminado del carrito.`, "success");
  });
}


// Renderizar carrito
function renderizarCarrito() {
  carritoProductos.innerHTML = "";
  let total = 0, cantidadTotal = 0;

  carrito.forEach(p => {
    const subtotal = p.precio * p.cantidad;
    total += subtotal;
    cantidadTotal += p.cantidad;

    const div = document.createElement("div");
    div.classList.add("carrito-item");
    div.innerHTML = `
    <img src="https://mayorista-sinlimites-backend-production.up.railway.app/img/productos/${p.imagen}" alt="${p.nombre}">

      <div class="carrito-info">
        <p><strong>${p.nombre}</strong></p>
        <p class="precio">Precio: $${p.precio.toLocaleString("es-AR")}</p>

        <p>Stock: ${p.stock}</p>
        <p class="subtotal">Subtotal: $${subtotal.toLocaleString("es-AR")}</p>

        <div class="carrito-cantidad">
          <button class="btn-menos">-</button>
          <span>${p.cantidad}</span>
          <button class="btn-mas">+</button>
        </div>
      </div>
      <button class="btn-eliminar-carrito">Eliminar</button>
    `;

    div.querySelector(".btn-mas").addEventListener("click", () => agregarAlCarrito(p.id));
    div.querySelector(".btn-menos").addEventListener("click", () => decrementarCantidad(p.id));
    div.querySelector(".btn-eliminar-carrito").addEventListener("click", () => eliminarDelCarrito(p.id));

    carritoProductos.appendChild(div);
  });

  // 🔹 Mostrar el total y la cantidad con formato
  totalCarritoSpan.textContent = total.toLocaleString("es-AR");
  cantidadCarritoSpan.textContent = cantidadTotal;
}

// Stock visual
function actualizarStockVisual() {
  productosDB.forEach(prod => {
    const productoDiv = document.querySelector(`.producto[data-id="${prod.id}"]`);
    if (!productoDiv) return;

    const stockSpan = productoDiv.querySelector(".stock");
    const cantidadSpan = productoDiv.querySelector(".cantidad");
    const btnAgregar = productoDiv.querySelector(".btn-agregar");
    const btnMas = productoDiv.querySelector(".btn-mas");

    const carritoItem = carrito.find(p => p.id === prod.id);
    const cantidadEnCarrito = carritoItem ? carritoItem.cantidad : 0;
    const stockRestante = Math.max(prod.stock - cantidadEnCarrito, 0);

    // Actualizar texto de stock
    stockSpan.textContent = `Stock: ${stockRestante}`;
    if (cantidadSpan) cantidadSpan.textContent = cantidadEnCarrito;

    // Manejo botón "Agregar a carrito"
    if (btnAgregar) {
      if (stockRestante === 0) {
        btnAgregar.textContent = "Sin stock";
        btnAgregar.disabled = true;
        btnAgregar.style.background = "red";
        btnAgregar.style.cursor = "not-allowed";
      } else {
        btnAgregar.textContent = "AGREGAR A CARRITO";
        btnAgregar.disabled = false;
        btnAgregar.style.background = "#28a745";
        btnAgregar.style.cursor = "pointer";
      }
    }

    // Manejo botón "+"
    if (btnMas) {
      if (stockRestante === 0) {
        btnMas.disabled = true;
        btnMas.style.background = "red";
        btnMas.style.cursor = "not-allowed";
      } else {
        btnMas.disabled = false;
        btnMas.style.background = "#28a745";
        btnMas.style.cursor = "pointer";
      }
    }

    // Actualizar stock en carrito
    if (carritoItem) carritoItem.stock = prod.stock;
  });
}

// Vaciar carrito
vaciarCarritoBtn.addEventListener("click", () => {
  if (carrito.length === 0) {
    // ⚠️ Aviso en rojo
    mostrarAlerta("El carrito ya está vacío!", "error");
    return;
  }

  // 🔹 Confirmación moderna
  modalConfirmacion("¿Deseas vaciar todo el carrito?", (respuesta) => {
    if (!respuesta) return;

    carrito = [];
    guardarCarrito();

    // ✅ Aviso en verde
    mostrarAlerta("Carrito vaciado correctamente!", "success");
  });
});

// Filtros
buscadorTexto.addEventListener("input", filtrarProductos);
filtroCategoria.addEventListener("change", filtrarProductos);
function filtrarProductos() {
  const texto = buscadorTexto.value.toLowerCase();
  const categoria = filtroCategoria.value;

  const filtrados = productosDB.filter(p =>
    p.nombre.toLowerCase().includes(texto) &&
    (categoria === "" || p.categoria === categoria)
  );

  // Ordenar productos nuevos primero
  const filtradosOrdenados = [...filtrados].sort((a, b) => b.id - a.id);

  // Actualizar paginador
  paginador.setData(filtradosOrdenados);
}

// Categorías
function cargarCategorias() {
  const categorias = [...new Set(productosDB.map(p => p.categoria))];
  filtroCategoria.innerHTML = `<option value="">Todas las categorías</option>` + categorias.map(c => `<option value="${c}">${c}</option>`).join("");
}
// ==========================
// ELEMENTOS DEL DOM
// ==========================
const btnAutocompletar = document.getElementById("btnAutocompletar");

// ==========================
// ABRIR MODAL
// ==========================
finalizarCompraBtn.addEventListener("click", async () => {
  if (carrito.length === 0) { 
    mostrarAlerta("¡El carrito está vacío!", "error"); 
    return; 
  }

  // ✅ Validar mínimo de 5 unidades (antes era 15)
  const totalUnidades = carrito.reduce((sum, item) => sum + item.cantidad, 0);
  if (totalUnidades < 5) {
    mostrarAlerta("Debes comprar al menos 5 unidades para finalizar la compra", "error");
    return;
  }

  try {
    const res = await fetch(API_URL);
    const productosDB = await res.json();

    const sinStock = carrito.filter(item => {
      const prod = productosDB.find(p => p.id === item.id);
      return !prod || prod.stock < item.cantidad;
    });

    if (sinStock.length > 0) {
      mostrarAlerta(`Productos sin stock suficiente: ${sinStock.map(p => p.nombre).join(", ")}`, "error");

      carrito = carrito.filter(item => !sinStock.includes(item));
      guardarCarrito();
      return;
    }

    modalDatosCliente.classList.remove("oculto");
  } catch (err) {
    console.error(err);
    mostrarAlerta("Error al verificar stock", "error");
  }
});

// ==========================
// CERRAR MODAL
// ==========================
cerrarModalDatos.addEventListener("click", () => {
  modalDatosCliente.classList.add("oculto");
  formDatosCliente.reset();
});

// ==========================
// AUTOCOMPLETAR DATOS DEL CLIENTE
// ==========================
btnAutocompletar.addEventListener("click", () => {
  const datosGuardados = JSON.parse(localStorage.getItem("datosCliente"));
  if (!datosGuardados) {
   mostrarAlerta("No se encontraron datos guardados previamente.", "error");
    return;
  }

  document.getElementById("inputNombreCliente").value = datosGuardados.nombre || "";
  document.getElementById("inputDNI").value = datosGuardados.dni || "";
  document.getElementById("inputCelular").value = datosGuardados.celular || "";
  document.getElementById("inputProvincia").value = datosGuardados.provincia || "";
  document.getElementById("inputLocalidad").value = datosGuardados.localidad || "";
  document.getElementById("inputCodigoPostal").value = datosGuardados.codigoPostal || "";
  document.getElementById("inputEmailCliente").value = datosGuardados.email || "";
  document.getElementById("selectEnvio").value = datosGuardados.envio || "Correo Argentino";
  document.getElementById("selectDispositivo").value = datosGuardados.dispositivo || "Android";
});


// ==========================
// FUNCION HELPER PARA CAPITALIZAR
// ==========================
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// ==========================
// FINALIZAR COMPRA Y GENERAR PDF
// ==========================
formDatosCliente.addEventListener("submit", async (e) => {
  e.preventDefault();

  const datosCliente = {
    nombre: document.getElementById("inputNombreCliente").value,
    dni: document.getElementById("inputDNI").value,
    celular: document.getElementById("inputCelular").value,
    provincia: document.getElementById("inputProvincia").value,
    localidad: document.getElementById("inputLocalidad").value,
    codigoPostal: document.getElementById("inputCodigoPostal").value,
    email: document.getElementById("inputEmailCliente").value,
    envio: document.getElementById("selectEnvio").value,
    dispositivo: document.getElementById("selectDispositivo").value
  };

  try {
    // Actualizar stock en el servidor y local
    for (let item of carrito) {
      const res = await fetch(`${API_URL}/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stock: item.stock - item.cantidad })
      });
      if (!res.ok) throw new Error(`Error actualizando stock de ${item.nombre}`);

      const productoLocal = productosDB.find(p => p.id === item.id);
      if (productoLocal) productoLocal.stock -= item.cantidad;
    }

    // Guardar datos en localStorage
    localStorage.setItem("datosCliente", JSON.stringify(datosCliente));

    // --------------------------
    // CREAR PDF CORRECTO
    // --------------------------
    await generarPDF(datosCliente, carrito); // <--- Aquí estaba el error, ahora pasamos carrito

    // Limpiar carrito y modal
    carrito = [];
    guardarCarrito();
    actualizarStockVisual();
    modalDatosCliente.classList.add("oculto");
    formDatosCliente.reset();
    mostrarAlerta("Compra realizada con éxito!", "success");
  } catch (err) {
    console.error(err);
   mostrarAlerta("Error finalizando la compra, intente más tarde.", "error");
  }
});

// ==========================
// GENERAR PDF EN BACKEND
// ==========================
async function generarPDF(datosCliente, carrito) {
 try {
  const res = await fetch("https://mayorista-sinlimites-backend-production.up.railway.app/api/compras/pdf", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ datosCliente, carrito }) // carrito ya definido
  });


    const data = await res.json();
    console.log("PDF guardado en backend:", data.filePath);
    console.log("Link WhatsApp:", data.urlWhatsApp);

    // Abrir WhatsApp
    window.open(data.urlWhatsApp, "_blank");
  } catch (err) {
    console.error("Error generando PDF:", err);
  }
}


// ==========================
// ACCESO EMPLEADOS
// ==========================
const btnAbrirCodigo = document.getElementById("btnAbrirCodigo");
const modalCodigo = document.getElementById("modalCodigo");
const btnCerrarModalCodigo = document.getElementById("btnCerrarModalCodigo");
const btnValidarCodigo = document.getElementById("btnValidarCodigo");
const inputCodigoAcceso = document.getElementById("inputCodigoAcceso");
const btnAgregarProducto = document.getElementById("btnAbrirModal");

const CODIGO_EMPLEADO = "5030";

// Recuperar estado del localStorage
let accesoEmpleado = localStorage.getItem("accesoEmpleado") === "true";

// ==========================
// FUNCIONES
// ==========================
function abrirModalCodigo() {
  modalCodigo.classList.remove("oculto");
  inputCodigoAcceso.value = "";
  inputCodigoAcceso.focus();
}

function cerrarModalCodigo() {
  modalCodigo.classList.add("oculto");
  inputCodigoAcceso.value = "";
}
function mostrarBotonesEspeciales() {
  document.querySelectorAll(".btn-especial").forEach(btn => {
    btn.style.display = "inline-block";
  });
  btnAgregarProducto.style.display = "inline-block";
  if (btnIrCompras) btnIrCompras.style.display = "inline-block";
}

function ocultarBotonesEspeciales() {
  document.querySelectorAll(".btn-especial").forEach(btn => {
    btn.style.display = "none";
  });
  btnAgregarProducto.style.display = "none";
  if (btnIrCompras) btnIrCompras.style.display = "none";
}



// ==========================
// EVENTOS
// ==========================
btnAbrirCodigo.addEventListener("click", () => {
  if (accesoEmpleado) {
    // Cerrar sesión
    accesoEmpleado = false;
    localStorage.setItem("accesoEmpleado", "false");
    ocultarBotonesEspeciales();
    btnAbrirCodigo.textContent = "💼 Acceso Empleados";
    mostrarAlerta("Sesión de empleado cerrada.", "success");
  } else {
    abrirModalCodigo();
  }
});

btnValidarCodigo.addEventListener("click", () => {
  const codigoIngresado = inputCodigoAcceso.value.trim();
  if (codigoIngresado === CODIGO_EMPLEADO) {
    accesoEmpleado = true;
    localStorage.setItem("accesoEmpleado", "true");
    mostrarBotonesEspeciales();
    btnAbrirCodigo.textContent = "Cerrar Sesión";
    mostrarAlerta("Código correcto. Acceso concedido.", "success");
    cerrarModalCodigo();
  } else {
    mostrarAlerta("Código incorrecto. Intente nuevamente.", "error");
    inputCodigoAcceso.value = "";
    inputCodigoAcceso.focus();
  }
});

inputCodigoAcceso.addEventListener("keydown", (e) => {
  if (e.key === "Enter") btnValidarCodigo.click();
});

modalCodigo.addEventListener("click", (e) => {
  if (e.target === modalCodigo) cerrarModalCodigo();
});

btnCerrarModalCodigo.addEventListener("click", cerrarModalCodigo);

// ==========================
// ESTADO INICIAL
// ==========================
if (accesoEmpleado) {
  mostrarBotonesEspeciales();
  btnAbrirCodigo.textContent = "Cerrar Sesión";
} else {
  ocultarBotonesEspeciales();
  btnAbrirCodigo.textContent = "💼 Acceso Empleados";
}


import { Paginacion } from "./paginacion.js";

const contenedorPaginacion = document.getElementById("paginacion");

let paginador = new Paginacion({
  data: productosDB,
  container: contenedorPaginacion,
  itemsPorPagina: 12,
  onPageChange: (productosPagina) => {
    renderizarProductos(productosPagina);
  }
});

// Actualizar si cambias filtros
function actualizarProductosFiltrados(filtrados) {
  paginador.setData(filtrados);
}



function mostrarAlerta(mensaje, tipo = "success") {
  const container = document.getElementById("alert-container");

  const alerta = document.createElement("div");
  alerta.classList.add("alert");
  alerta.classList.add(tipo === "success" ? "alert-success" : "alert-error");
  alerta.textContent = mensaje;

  container.appendChild(alerta);

  // Quitar después de 3s con animación
  setTimeout(() => {
    alerta.style.animation = "fadeOut 0.5s forwards";
    setTimeout(() => alerta.remove(), 500);
  }, 3000);
}


function modalConfirmacion(mensaje, callback) {
  const modal = document.getElementById("modalConfirmacion");
  const mensajeBox = document.getElementById("confirmacion-mensaje");
  const btnSi = document.getElementById("confirmacion-si");
  const btnNo = document.getElementById("confirmacion-no");

  mensajeBox.textContent = mensaje;
  modal.style.display = "flex";

  btnSi.onclick = () => {
    modal.style.display = "none";
    callback(true);
  };

  btnNo.onclick = () => {
    modal.style.display = "none";
    callback(false);
  };
}


// Referencias
const modalStock = document.getElementById("modalStock");
const modalStockMensaje = document.getElementById("modalStockMensaje");
const modalStockInput = document.getElementById("modalStockInput");
const modalStockAceptar = document.getElementById("modalStockAceptar");
const modalStockCancelar = document.getElementById("modalStockCancelar");
const modalStockClose = document.querySelector(".modalStock-close");

// Función para mostrar modalStock como prompt
function mostrarModalStock(mensaje, valorInicial = "", callback) {
  modalStockMensaje.textContent = mensaje;
  modalStockInput.value = valorInicial;
  modalStock.style.display = "block";
  modalStockInput.focus();

  // Aceptar
  const aceptarHandler = () => {
    const valor = modalStockInput.value;
    cerrarModalStock();
    callback(valor);
  };

  // Cancelar
  const cancelarHandler = () => {
    cerrarModalStock();
    callback(null);
  };

  // Cerrar modal
  const cerrarModalStock = () => {
    modalStock.style.display = "none";
    modalStockAceptar.removeEventListener("click", aceptarHandler);
    modalStockCancelar.removeEventListener("click", cancelarHandler);
    modalStockClose.removeEventListener("click", cancelarHandler);
  };

  modalStockAceptar.addEventListener("click", aceptarHandler);
  modalStockCancelar.addEventListener("click", cancelarHandler);
  modalStockClose.addEventListener("click", cancelarHandler);

  // Enter para aceptar
  modalStockInput.onkeydown = (e) => {
    if (e.key === "Enter") aceptarHandler();
    if (e.key === "Escape") cancelarHandler();
  };
}



// Inicializar
cargarProductos();
