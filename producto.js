
 window.verificarCodigo = function() {
  const codigoIngresado = document.getElementById('codigoEmpleado').value;
  const codigoCorrecto = '3425'; // Cambia por tu código real

  if (codigoIngresado === codigoCorrecto) {
    // Mostrar inputs y botones solo para empleados
    document.querySelectorAll('.solo-empleado').forEach(div => {
      div.style.display = 'block';
    });

    // Mostrar los botones "Agregar producto"
    document.querySelectorAll('.btn-agregar-producto').forEach(btn => {
      btn.style.display = 'inline-block';  // o 'block', como prefieras
    });

    // Ocultar formulario de verificación
    document.getElementById('verificarEmpleado').style.display = 'none';

    // Crear botón "Cerrar empleados" si no existe
    if (!document.getElementById('cerrarEmpleadoBtn')) {
      const botonCerrar = document.createElement('button');
      botonCerrar.id = 'cerrarEmpleadoBtn';
      botonCerrar.textContent = 'CERRAR EMPLEADOS';
      botonCerrar.onclick = function() {
        // Ocultar inputs y botones para empleados
        document.querySelectorAll('.solo-empleado').forEach(div => {
          div.style.display = 'none';
        });

        // Ocultar botones "Agregar producto"
        document.querySelectorAll('.btn-agregar-producto').forEach(btn => {
          btn.style.display = 'none';
        });

        // Mostrar formulario de verificación
        document.getElementById('verificarEmpleado').style.display = 'block';

        // Eliminar botón "Cerrar empleados"
        botonCerrar.remove();

        // Limpiar input código
        document.getElementById('codigoEmpleado').value = '';
      };

      document.getElementById('botonCerrarEmpleadoContainer').appendChild(botonCerrar);
    }
  } else {
    alert('Código incorrecto');
  }
};


// Abrir el carrito flotante
const carritoIcono = document.getElementById('carrito-icono');
const carritoContenido = document.getElementById('carrito');

carritoIcono.addEventListener('click', function () {
  carritoContenido.classList.toggle('show'); // Cambiar el estado abierto/cerrado
});

function actualizarContadorCarrito() {
  const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  const totalCantidad = carrito.reduce((acc, item) => acc + item.cantidad, 0);
  document.getElementById('contador').textContent = totalCantidad;
}

// Función para agregar producto al carrito, fuera de obtenerProductos
function agregarAlCarrito(event) {
  const id = Number(event.target.getAttribute('data-id'));
  const nombre = event.target.getAttribute('data-nombre');
  const precio = parseFloat(event.target.getAttribute('data-precio')) || 0;
  const imagen = event.target.getAttribute('data-imagen');

  let stockElemento = document.getElementById(`stock-${id}`);
  let stock = Number(stockElemento.textContent) || 0;

  if (stock > 0) {
    stock -= 1;
    stockElemento.textContent = stock;
    event.target.setAttribute('data-stock', stock);

    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const productoExistente = carrito.find(item => item.id === id);

    if (productoExistente) {
      productoExistente.cantidad += 1;
    } else {
      carrito.push({ id, nombre, cantidad: 1, precio, imagen });
    }

    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarContadorCarrito();
    renderizarCarrito();

    if (stock === 0) {
      event.target.textContent = "Sin stock";
      event.target.style.backgroundColor = "red";
      event.target.disabled = true;
    }
  } else {
    event.target.textContent = "Sin stock";
    event.target.style.backgroundColor = "red";
    event.target.disabled = true;
    console.log('¡Stock agotado!');
    mostrarAlerta('No hay más stock disponible');
  }
}
// Variable global para controlar si el usuario es empleado
let esEmpleado = false;

// Función para mostrar el modal de agregar producto
function mostrarFormularioAgregarProducto(contenedor, nombreProducto) {
  // Evitar duplicados
  if (document.getElementById('modalAgregarProducto')) return;

  // Crear modal fondo
  const modalFondo = document.createElement('div');
  modalFondo.id = 'modalAgregarProducto';
  modalFondo.style.position = 'fixed';
  modalFondo.style.top = 0;
  modalFondo.style.left = 0;
  modalFondo.style.width = '100vw';
  modalFondo.style.height = '100vh';
  modalFondo.style.backgroundColor = 'rgba(0,0,0,0.5)';
  modalFondo.style.display = 'flex';
  modalFondo.style.justifyContent = 'center';
  modalFondo.style.alignItems = 'center';
  modalFondo.style.zIndex = 1000;

  // Contenedor formulario
  const formContenedor = document.createElement('div');
  formContenedor.style.backgroundColor = '#fff';
  formContenedor.style.padding = '20px';
  formContenedor.style.borderRadius = '8px';
  formContenedor.style.width = '320px';
  formContenedor.style.boxShadow = '0 0 10px rgba(0,0,0,0.25)';
  formContenedor.innerHTML = `
    <h3>Agregar nueva variante a ${nombreProducto}</h3>
    <form id="formAgregarProducto" enctype="multipart/form-data">
      <label>Precio: <input type="number" name="precio" required min="0"></label><br><br>
      <label>Stock: <input type="number" name="stock" required min="0"></label><br><br>
      <label>Imagen: <input type="file" name="imagen" accept="image/*" required></label><br><br>
      <button type="submit" style="background-color:#28a745; color:#fff; border:none; padding:8px 16px; border-radius:4px; cursor:pointer;">Guardar</button>
      <button type="button" id="btnCancelarAgregar" style="margin-left: 10px; padding:8px 16px; border-radius:4px; cursor:pointer;">Cancelar</button>
    </form>
  `;

  modalFondo.appendChild(formContenedor);
  document.body.appendChild(modalFondo);

  // Cancelar cierra modal
  formContenedor.querySelector('#btnCancelarAgregar').addEventListener('click', () => {
    modalFondo.remove();
  });

  // Manejar submit del formulario
  formContenedor.querySelector('#formAgregarProducto').addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;
    const precio = Number(form.precio.value);
    const stock = Number(form.stock.value);
    const imagenFile = form.imagen.files[0];

    if (!precio || !stock || !imagenFile) {
      alert('Completa todos los campos.');
      return;
    }

    // Crear FormData para enviar archivo al backend
    const formData = new FormData();
    formData.append('precio', precio);
    formData.append('stock', stock);
    formData.append('imagen', imagenFile);
    formData.append('nombreProducto', nombreProducto);

    try {
      // Enviar formulario a tu backend (debes crear la ruta backend que acepte esto)
      const res = await fetch('https://tu-backend.com/api/agregar-producto', {
        method: 'POST',
        body: formData
      });

      if (!res.ok) throw new Error('Error al agregar producto');

      const data = await res.json();
      alert('Producto agregado correctamente');

      // Opcional: cerrar modal y refrescar lista productos
      modalFondo.remove();
      obtenerProductos(); // recarga productos
    } catch (error) {
      console.error(error);
      alert('Error al agregar producto');
    }
  });
}

// Función para obtener productos y renderizarlos
async function obtenerProductos() {
  try {
    const response = await fetch('https://mayorista-sinlimites-backend-production.up.railway.app/productos');
    if (!response.ok) throw new Error('No se pudieron obtener los productos');

    const productos = await response.json();
    const container = document.getElementById('productos');
    container.innerHTML = '';

    productos.forEach(producto => {
      const productoDiv = document.createElement('div');
      productoDiv.classList.add('producto');

      productoDiv.innerHTML = `
        <h3>${producto.nombre}</h3>
        <img src="${producto.imagen}" alt="${producto.nombre}" onError="this.onerror=null;this.src='path/to/default-image.jpg';">
      `;

      const toggleButton = document.createElement('button');
      toggleButton.textContent = 'Ver Más';
      toggleButton.classList.add('ver-mas-btn');

      // Botón "Agregar producto" solo visible para empleados
      const btnAgregarProducto = document.createElement('button');
      btnAgregarProducto.textContent = '➕ Agregar producto';
      btnAgregarProducto.classList.add('btn-agregar-producto');
      btnAgregarProducto.style.display = esEmpleado ? 'block' : 'none';
      btnAgregarProducto.style.marginTop = '10px';
      btnAgregarProducto.style.backgroundColor = '#28a745';
      btnAgregarProducto.style.color = 'white';
      btnAgregarProducto.style.border = 'none';
      btnAgregarProducto.style.padding = '8px 16px';
      btnAgregarProducto.style.borderRadius = '6px';
      btnAgregarProducto.style.cursor = 'pointer';

      btnAgregarProducto.addEventListener('click', () => {
        mostrarFormularioAgregarProducto(productoDiv, producto.nombre);
      });

      const variantesContainer = document.createElement('div');
      variantesContainer.classList.add('variantes');
      variantesContainer.style.display = 'none';

      producto.variantes.forEach(vari => {
        const varianteDiv = document.createElement('div');
        varianteDiv.classList.add('variant');
        varianteDiv.id = `variant-${vari.id}`;
        varianteDiv.innerHTML = `
          <img src="${vari.imagen}" alt="Variante de ${producto.nombre}" onError="this.onerror=null;this.src='path/to/default-image.jpg';">
          <p>Precio: $${vari.precio}</p>
          <p>Stock: <span id="stock-${vari.id}">${vari.stock}</span></p>

          <button class="agregar-carrito"
            data-id="${vari.id}"
            data-nombre="${producto.nombre}"
            data-precio="${vari.precio}"
            data-stock="${vari.stock}"
            data-imagen="${vari.imagen}"
            ${vari.stock === 0 ? 'disabled style="background-color:gray;"' : ''}>
            ${vari.stock === 0 ? 'Sin stock' : 'Agregar al carrito'}
          </button>

          <div class="solo-empleado" style="display: none; margin-top: 6px;">
            <input class="inputt" type="number" id="nuevoStock-${vari.id}" placeholder="Nuevo stock">
            <button 
              class="boton-actualizar-stock" 
              onclick="modificarStock(${vari.id})">
              Actualizar Stock
            </button>
            <button 
              class="boton-eliminar-variacion" 
              style="
                margin-top: 6px; 
                background-color: crimson; 
                color: white; 
                border: none; 
                padding: 6px 12px; 
                border-radius: 6px; 
                cursor: pointer; 
                font-weight: bold;
                transition: background-color 0.3s ease;
              "
              onclick="eliminarProducto(${vari.id})">
              🗑️ Eliminar producto
            </button>
          </div>
        `;

        variantesContainer.appendChild(varianteDiv);

        // Remueve el onclick inline para evitar doble disparo (si quieres, puedes mover esa lógica a un addEventListener)
        const btnEliminar = varianteDiv.querySelector('.boton-eliminar-variacion');
        btnEliminar.removeAttribute('onclick');
        btnEliminar.addEventListener('click', () => eliminarProducto(vari.id));
      });

      toggleButton.addEventListener('click', () => {
        if (variantesContainer.style.display === 'none') {
          variantesContainer.style.display = 'grid';
          toggleButton.textContent = 'Ver Menos';
        } else {
          variantesContainer.style.display = 'none';
          toggleButton.textContent = 'Ver Más';
        }
      });

      productoDiv.appendChild(toggleButton);
      productoDiv.appendChild(btnAgregarProducto);
      productoDiv.appendChild(variantesContainer);
      container.appendChild(productoDiv);
    });

  } catch (error) {
    console.error('Error al obtener los productos:', error);
  }
}

// Función para verificar código empleado y mostrar opciones
function verificarCodigoEmpleado() {
  const codigoIngresado = document.getElementById('codigoEmpleado').value;
  const codigoCorrecto = '3425'; // Cambiar por código real

  if (codigoIngresado === codigoCorrecto) {
    esEmpleado = true;
    // Mostrar botones solo-empleado
    document.querySelectorAll('.solo-empleado').forEach(div => {
      div.style.display = 'block';
    });
    // Mostrar botones agregar producto
    document.querySelectorAll('.btn-agregar-producto').forEach(btn => {
      btn.style.display = 'block';
    });

    // Ocultar formulario verificación y mostrar botón cerrar
    document.getElementById('verificarEmpleado').style.display = 'none';
    if (!document.getElementById('cerrarEmpleadoBtn')) {
      const btnCerrar = document.createElement('button');
      btnCerrar.id = 'cerrarEmpleadoBtn';
      btnCerrar.textContent = 'CERRAR EMPLEADOS';
      btnCerrar.onclick = () => {
        esEmpleado = false;
        document.querySelectorAll('.solo-empleado').forEach(div => {
          div.style.display = 'none';
        });
        document.querySelectorAll('.btn-agregar-producto').forEach(btn => {
          btn.style.display = 'none';
        });
        document.getElementById('verificarEmpleado').style.display = 'block';
        btnCerrar.remove();
        document.getElementById('codigoEmpleado').value = '';
      };
      document.getElementById('botonCerrarEmpleadoContainer').appendChild(btnCerrar);
    }
  } else {
    alert('Código incorrecto');
  }
}

// Delegación


let idAEliminar = null; // o let idEliminar = null;

function eliminarProducto(id) {
  idAEliminar = id; // guardamos el id
  document.getElementById('confirmacion').style.display = 'flex';
}

document.getElementById('btn-cancelar').addEventListener('click', () => {
  document.getElementById('confirmacion').style.display = 'none';
  idAEliminar = null;
});

document.getElementById('btn-confirmar').addEventListener('click', () => {
  if (!idAEliminar) return;

  fetch(`https://mayorista-sinlimites-backend-production.up.railway.app/productos/variantes/${idAEliminar}`, {
    method: 'DELETE',
  })
  .then(response => {
    if (response.ok) {
      const div = document.getElementById(`variant-${idAEliminar}`);
      if (div) div.remove();
      mostrarAlerta('Producto eliminado');
    } else {
      alert('No se pudo eliminar este producto');
    }
    document.getElementById('confirmacion').style.display = 'none';
    idAEliminar = null;
  })
  .catch(error => {
    console.error('Error al eliminar:', error);
    alert('Error al conectar con el servidor');
    document.getElementById('confirmacion').style.display = 'none';
    idAEliminar = null;
  });
});

async function actualizarStock(id, stock) {
  const response = await fetch(`https://mayorista-sinlimites-backend-production.up.railway.app/productos/variantes/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ stock }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Error al actualizar el stock');
  }

  return response.json();
}

window.modificarStock = async function(id) {
  const input = document.getElementById(`nuevoStock-${id}`);
  const nuevoStockStr = input.value.trim();

  // Verificamos que sea entero positivo (0 o más)
  const nuevoStock = Number(nuevoStockStr);
  if (
    nuevoStockStr === '' || 
    isNaN(nuevoStock) || 
    !Number.isInteger(nuevoStock) || 
    nuevoStock < 0
  ) {
    alert("Stock inválido. Debe ser un número entero positivo.");
    return;
  }

  try {
    const data = await actualizarStock(id, nuevoStock);
    
    document.getElementById(`stock-${id}`).textContent = nuevoStock;
    input.value = '';
  } catch (error) {
    alert(`Error: ${error.message}`);
    console.error(error);
  }
};
function renderizarCarrito() {
  const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  const carritoItems = document.getElementById('carrito-items');
  const carritoTotal = document.getElementById('total-carrito');
  carritoItems.innerHTML = '';
  let total = 0;

  carrito.forEach(item => {
    const precioUnitario = parseFloat(item.precio) || 0;
    const subtotal = precioUnitario * item.cantidad;
    total += subtotal;

    const itemDiv = document.createElement('li');
    itemDiv.classList.add('tu-clase');
    itemDiv.dataset.id = item.id; // para referencia rápida

    itemDiv.innerHTML = `
      <img class="img-producto" style="width: 40%; height: 40%;" src="${item.imagen || 'path/to/default-image.jpg'}" alt="${item.nombre}">
      <div class="img-pro">
        <h6>${item.nombre}</h6>
        <h4>Precio unitario: $${precioUnitario}</h4>  
        <p class="cantidad">Cantidad:
          <button class="btn-cantidad restar" data-id="${item.id}">-</button> 
          <span class="cantidad-valor" id="cantidad-${item.id}">${item.cantidad}</span>
          <button class="btn-cantidad sumar" data-id="${item.id}">+</button>
        </p>
        <p class="cantidad">Subtotal: $${subtotal}</p>
        <button class="eliminar-item" data-id="${item.id}">Eliminar</button>
      </div>
    `;

    carritoItems.appendChild(itemDiv);
  });

  carritoTotal.textContent = `Total: $${total}`;
}

// Manejo rápido sin await en cada click, optimizando la experiencia
document.getElementById('carrito-items').addEventListener('click', async (e) => {
  const boton = e.target;
  const id = Number(boton.getAttribute('data-id'));
  if (!id) return;

  if (boton.classList.contains('sumar')) {
    const stockSpan = document.getElementById(`stock-${id}`);
    let stockActual = Number(stockSpan?.textContent) || 0;

  actualizarEstadoBotonAgregar(id, stockActual - 1);
    if (stockActual <= 0) {
      mostrarAlerta('No hay más stock disponible');
      return;
    }

    // Actualizar UI inmediatamente
    const cantidadSpan = document.getElementById(`cantidad-${id}`);
    let cantidadActual = Number(cantidadSpan.textContent);
    cantidadSpan.textContent = cantidadActual + 1;

    stockSpan.textContent = stockActual - 1;

    // Actualizar localStorage
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const producto = carrito.find(p => p.id === id);
    if (producto) producto.cantidad += 1;
    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarContadorCarrito();

    // Actualizar stock en backend (async, no bloquea UI)
    try {
      await actualizarStock(id, stockActual - 1);
    } catch (error) {
      console.error('Error actualizando stock:', error);
      mostrarAlerta('Error al actualizar stock en servidor');
      // Puedes revertir cambios UI/localStorage si quieres
    }

  } else if (boton.classList.contains('restar')) {
    const cantidadSpan = document.getElementById(`cantidad-${id}`);
    let cantidadActual = Number(cantidadSpan.textContent);
    

    if (cantidadActual <= 1) return; // No permitir cantidad 0 aquí (usa eliminar)

    // Actualizar UI inmediatamente
    cantidadSpan.textContent = cantidadActual - 1;

    const stockSpan = document.getElementById(`stock-${id}`);
    let stockActual = Number(stockSpan?.textContent) || 0;
    stockSpan.textContent = stockActual + 1;

  actualizarEstadoBotonAgregar(id, stockActual + 1);
    // Actualizar localStorage
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const producto = carrito.find(p => p.id === id);
    if (producto) producto.cantidad -= 1;
    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarContadorCarrito();

    // Actualizar stock en backend (async, no bloquea UI)
    try {
      await actualizarStock(id, stockActual + 1);
    } catch (error) {
      console.error('Error actualizando stock:', error);
      mostrarAlerta('Error al actualizar stock en servidor');
      // Puedes revertir cambios UI/localStorage si quieres
    }
  } else if (boton.classList.contains('eliminar-item')) {
    // Aquí puedes llamar a eliminarDelCarrito(id) que tienes
    await eliminarDelCarrito(id);
  }

  // Opcional: actualizar subtotal y total en UI sin rerender completo para más rapidez
  // Pero renderizarCarrito() completo también es válido
  renderizarCarrito();
});

// Función para actualizar el estado del botón "Agregar al carrito" según stock
function actualizarEstadoBotonAgregar(id, stock) {
  const boton = document.querySelector(`.agregar-carrito[data-id="${id}"]`);
  if (!boton) return;

  if (stock <= 0) {
    boton.disabled = true;
    boton.textContent = 'Sin stock';
    boton.style.backgroundColor = 'gray';
  } else {
    boton.disabled = false;
    boton.textContent = 'Agregar al carrito';
    boton.style.backgroundColor = '';
  }
}


async function actualizarCantidad(id, accion) {
  try {
    // Obtener stock actual desde backend
    const res = await fetch(`https://mayorista-sinlimites-backend-production.up.railway.app/productos/variantes/${id}`);
    const data = await res.json();
    let stockActual = Number(data.stock) || 0;

    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const producto = carrito.find(p => p.id === id);
    if (!producto) return;

    if (accion === 'sumar') {
      if (stockActual > 0) {
        producto.cantidad += 1;
        stockActual -= 1;
        await actualizarStock(id, stockActual);
        document.getElementById(`stock-${id}`).textContent = stockActual;

        if (stockActual === 0) {
          const boton = document.querySelector(`.agregar-carrito[data-id="${id}"]`);
          if (boton) {
            boton.disabled = true;
            boton.textContent = 'Sin stock';
            boton.style.backgroundColor = 'gray';
          }
        }
      } else {
        mostrarAlerta('No hay más stock disponible');
        return;
      }
    } else if (accion === 'restar' && producto.cantidad > 1) {
      producto.cantidad -= 1;
      stockActual += 1;
      await actualizarStock(id, stockActual);
      document.getElementById(`stock-${id}`).textContent = stockActual;

      const boton = document.querySelector(`.agregar-carrito[data-id="${id}"]`);
      if (boton && boton.disabled && stockActual > 0) {
        boton.disabled = false;
        boton.textContent = 'Agregar al carrito';
        boton.style.backgroundColor = '';
      }
    }

    localStorage.setItem('carrito', JSON.stringify(carrito));
    document.getElementById(`cantidad-${id}`).textContent = producto.cantidad;

    actualizarContadorCarrito();
    renderizarCarrito();

  } catch (error) {
    console.error('Error al actualizar cantidad:', error);
  }
}


async function eliminarDelCarrito(id) {
  id = Number(id); // asegurar que sea número

  let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

  // Buscar el producto a eliminar
  const productoAEliminar = carrito.find(item => item.id === id);
  if (productoAEliminar) {
    const stockElemento = document.getElementById(`stock-${productoAEliminar.id}`);
    let stockActual = Number(stockElemento?.textContent) || 0;
    const nuevoStock = stockActual + productoAEliminar.cantidad;

    try {
      await actualizarStock(productoAEliminar.id, nuevoStock);

      if (stockElemento) {
        stockElemento.textContent = nuevoStock;
      }

      // Habilitar el botón de agregar al carrito nuevamente
      const boton = document.querySelector(`.agregar-carrito[data-id="${productoAEliminar.id}"]`);
      if (boton) {
        boton.disabled = false;
        boton.textContent = 'Agregar al carrito';
        boton.style.backgroundColor = '';
      }

    } catch (error) {
      console.error('Error al actualizar stock al eliminar del carrito:', error);
      alert('No se pudo actualizar el stock en el servidor.');
      // Puedes decidir si continuar o abortar la eliminación
      return; // Opcional: salir para evitar inconsistencia
    }
  }

  // Eliminar el producto del carrito
  carrito = carrito.filter(item => item.id !== id);
  localStorage.setItem('carrito', JSON.stringify(carrito));
  actualizarContadorCarrito();
  renderizarCarrito();
}





document.getElementById('finalizar-compra').addEventListener('click', async () => {
  const carrito = JSON.parse(localStorage.getItem('carrito')) || [];

  const totalProductos = carrito.reduce((acc, item) => acc + item.cantidad, 0);
  if (totalProductos < 15) {
    mayorAlerta('Debes agregar al menos 15 productos para finalizar la compra.');
    return;
  }

  let productosSinStock = [];
for (const item of carrito) {
  try {
    const response = await fetch(`https://mayorista-sinlimites-backend-production.up.railway.app/productos/variantes/${item.id}`);
    if (!response.ok) {
      console.error('Respuesta no OK', response.status);
      throw new Error('Error al consultar stock');
    }

    const data = await response.json();
    console.log('Stock recibido para', item.nombre, data);

    const stockDisponible = parseInt(data.stock);

    if (isNaN(stockDisponible)) {
      mayorAlerta(`Error al obtener el stock del producto "${item.nombre}". Intenta de nuevo más tarde.`);
      return;
    }

    if (item.cantidad > stockDisponible) {
      productosSinStock.push(`"${item.nombre}" (Stock disponible: ${stockDisponible})`);
    }
  } catch (error) {
    console.error('Error en fetch:', error);
    mayorAlerta('Error al validar stock. Intenta de nuevo más tarde.');
    return;
  }
}


  // Si todo está OK, mostrar formulario con animación
  const formulario = document.getElementById('formulario-compra');
  formulario.style.display = 'flex';
  setTimeout(() => {
    formulario.classList.add('formulario-visible');
  }, 10);
});


function stockAlerta(mensaje) {
  // Buscar alerta existente o crearla
  let alerta = document.getElementById('stock-alerta');
  if (!alerta) {
    alerta = document.createElement('div');
    alerta.id = 'stock-alerta';
    alerta.className = 'stock-alerta';
    document.body.appendChild(alerta);
  }

alerta.innerHTML = `
  <p>${mensaje}</p>
  <div class="alerta-botones">
    <button id="btn-seguir-comprando">Seguir comprando</button>
  </div>
`;

alerta.style.display = 'flex';

// 🔴 Cerrar formulario al hacer clic en "Seguir comprando"
document.getElementById('btn-seguir-comprando').addEventListener('click', () => {
  alerta.style.display = 'none';

  const formulario = document.getElementById('formulario-compra');
  if (formulario) {
    formulario.classList.remove('formulario-visible');
    setTimeout(() => {
      formulario.style.display = 'none';
    }, 300);
  }
});


}

function mayorAlerta(mensaje) {
  const alerta = document.getElementById('alerta-personalizada');
  alerta.style.display = 'block';
  alerta.querySelector('p').textContent = mensaje;

  // Ocultar automáticamente después de 3 segundos (opcional)
  setTimeout(() => {
    alerta.style.display = 'none';
  }, 3000);
}

// Cerrar formulario con animación
document.getElementById('cerrar-formulario').addEventListener('click', () => {
  const formulario = document.getElementById('formulario-compra');
  formulario.classList.remove('formulario-visible');
  setTimeout(() => {
    formulario.style.display = 'none';
  }, 300);
});








// VALIDACIÓN DE STOCK Y FORMULARIO DE DATOS
// VALIDACIÓN DE STOCK Y FORMULARIO DE DATOS

document.getElementById('compra-form').addEventListener('submit', async function (e) {
  e.preventDefault();

  let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  const productosAjustados = [];

  try {
    for (let i = carrito.length - 1; i >= 0; i--) {
      const item = carrito[i];
      const res = await fetch(`https://mayorista-sinlimites-backend-production.up.railway.app/productos/variantes/${item.id}`);
      if (!res.ok) throw new Error('Error al consultar stock');

      const data = await res.json();
      const stockDisponible = data.stock;
      const cantidadDeseada = item.cantidad;

      if (cantidadDeseada > stockDisponible) {
        if (stockDisponible > 0) {
          const cantidadRemovida = cantidadDeseada - stockDisponible;
          item.cantidad = stockDisponible;
          productosAjustados.push(
            `"${item.nombre}" (Otro cliente compró recientemente este producto. Se eliminaron ${cantidadRemovida} unidades. Stock actual: ${stockDisponible})`
          );
        } else {
          productosAjustados.push(
            `"${item.nombre}" (Otro cliente compró recientemente este producto. Se eliminó del carrito porque ya no hay stock disponible)`
          );
          carrito.splice(i, 1);
        }
      }
    }

    if (productosAjustados.length > 0) {
      localStorage.setItem('carrito', JSON.stringify(carrito));
      actualizarContadorCarrito();
      renderizarCarrito();

      const mensaje = `⚠️ Algunos productos fueron ajustados por falta de stock:\n\n- ${productosAjustados.join('\n- ')}`;
      stockAlerta(mensaje);
      return;
    }

    const formulario = document.getElementById('formulario-compra');
    if (formulario) {
      formulario.style.display = 'flex';
      setTimeout(() => formulario.classList.add('formulario-visible'), 10);
    }

  } catch (error) {
    console.error(error);
    mayorAlerta('❌ Ocurrió un error al verificar el stock.');
  }
});




// FORMULARIO DE COMPRA Y DESCUENTO DE STOCK

document.getElementById('formulario-compra').addEventListener('submit', async function (e) {
  e.preventDefault();

  const carrito = JSON.parse(localStorage.getItem('carrito')) || [];

  // 1. Validación y descuento de stock final
  for (const item of carrito) {
    const res = await fetch(`https://mayorista-sinlimites-backend-production.up.railway.app/productos/variantes/${item.id}`);
    const data = await res.json();
    const stockDisponible = data.stock;

    if (item.cantidad > stockDisponible) {
      return;
    }

    const nuevoStock = stockDisponible - item.cantidad;
    const patchRes = await fetch(`https://mayorista-sinlimites-backend-production.up.railway.app/productos/variantes/${item.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stock: nuevoStock }),
    });

  }

  // 2. Obtener datos del formulario
  const nombreApellido = document.getElementById('nombre-apellido').value;
  const dni = document.getElementById('dni').value;
  const celular = document.getElementById('celular').value;
  const provincia = document.getElementById('provincia').value;
  const localidad = document.getElementById('localidad').value;
  const cp = document.getElementById('cp').value;
  const mail = document.getElementById('mail').value;
  const metodoEnvio = document.getElementById('metodo-envio').value;
  const cliente = { nombreApellido, dni, celular, provincia, localidad, cp, mail, metodoEnvio };
  localStorage.setItem('datosCliente', JSON.stringify(cliente));

  // 3. Generar PDF con jsPDF
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const logoUrl = 'logo2.jpg';
  doc.addImage(logoUrl, 'JPG', 10, 10, 20, 20);
  doc.setFontSize(18);
  doc.setTextColor(40, 90, 160);
  doc.text("Detalles de la Compra", 50, 20);
  doc.line(10, 35, 200, 35);

  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  let y = 45;

  const datosCliente = [
    { label: 'Nombre y Apellido', value: nombreApellido },
    { label: 'DNI', value: dni },
    { label: 'Celular', value: celular },
    { label: 'Provincia', value: provincia },
    { label: 'Localidad', value: localidad },
    { label: 'Código Postal', value: cp },
    { label: 'Correo Electrónico', value: mail },
    { label: 'Método de Envío', value: metodoEnvio }
  ];

  datosCliente.forEach((item) => {
    doc.text(`${item.label}:`, 10, y);
    doc.setFont("helvetica", "bold");
    doc.text(item.value, 60, y);
    doc.setFont("helvetica", "normal");
    y += 10;
  });

  y += 10;
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Productos en el carrito:", 10, y);
  doc.setFont("helvetica", "normal");
  y += 10;

  let totalCompra = 0;

  carrito.forEach((producto, index) => {
    if (y > 250) {
      doc.addPage();
      y = 20;
    }

    if (producto.imagen) {
      doc.addImage(producto.imagen, 'JPG', 10, y, 30, 30);
    }

    const textX = producto.imagen ? 50 : 10;

    doc.setFont("helvetica", "bold");
    doc.text(`${index + 1}. ${producto.nombre}`, textX, y + 10);
    doc.setFont("helvetica", "normal");
    doc.text(`Precio: $${producto.precio.toFixed(2)} - Cantidad: ${producto.cantidad}`, textX, y + 15);

    const subtotal = producto.precio * producto.cantidad;
    doc.text(`Subtotal: $${subtotal.toFixed(2)}`, textX, y + 20);
    totalCompra += subtotal;
    y += 40;
  });

  doc.line(10, y, 200, y);
  y += 10;
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(`Total de la compra: $${totalCompra.toFixed(2)}`, 10, y);
  y += 15;
  doc.setFontSize(15);
  doc.setFont("helvetica", "bolditalic");
  doc.setTextColor(60, 120, 180);
  doc.text("Gracias por tu compra. ¡Esperamos verte pronto!", 10, y);

  // Mostrar alerta animada
  document.getElementById("alertenviar").style.display = "block";
  document.getElementById("alertenviar").style.animation = "fadeIn 0.4s ease-in-out";

  // Subir PDF al backend
  const pdfBlob = doc.output('blob');
  const uniqueFileName = `pedido-${Date.now()}-${Math.random().toString(36).substring(2)}.pdf`;
  const formData = new FormData();
  formData.append('pdf', pdfBlob, uniqueFileName);

  fetch('https://mayorista-sinlimites-backend-production.up.railway.app/upload-pdf', {
    method: 'POST',
    body: formData
  })
    .then(res => res.json())
    .then(data => {
      if (data.url) {
        const whatsappUrl = `https://wa.me/5493329317141?text=Hola,%20quiero%20confirmar%20mi%20pedido%20aquí:%20${encodeURIComponent(data.url)}`;
        window.open(whatsappUrl, '_blank');
        finalizarProceso();
      } else {
        alert('Hubo un error, pero te damos otra solución');
        guardarBackupYRedirigir();
      }
    })
    .catch(err => {
      console.error(err);
      alert('Error al subir PDF');
      guardarBackupYRedirigir();
    });

  function guardarBackupYRedirigir() {
    const reader = new FileReader();
    reader.onload = function () {
      const pdfDataURL = reader.result;
      const pedidoBackup = {
        cliente,
        carrito,
        pdfDataURL
      };
      localStorage.setItem('pedidoBackup', JSON.stringify(pedidoBackup));
      window.location.href = 'resumen-error.html';
      finalizarProceso();
    };
    reader.readAsDataURL(pdfBlob);
  }

  function finalizarProceso() {
    localStorage.removeItem('carrito');
    const formulario = document.getElementById('formulario-compra');
    formulario.classList.remove('formulario-visible');
    setTimeout(() => {
      formulario.style.display = 'none';
    }, 300);
  }
});



document.getElementById("btnCerrarAlerta").addEventListener("click", cerrarAlerta);

function cerrarAlerta() {
  const alerta = document.getElementById("alertenviar");
  alerta.style.animation = "fadeOut 0.3s ease-in-out";
  setTimeout(() => {
    alerta.style.display = "none";
    alerta.style.animation = "";
  }, 300);
}




document.getElementById('vaciar-carrito').addEventListener('click', () => {
  let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

  carrito.forEach(item => {
    const stockElemento = document.getElementById(`stock-${item.id}`);
    if (stockElemento) {
      let stockActual = parseInt(stockElemento.textContent);
      const nuevoStock = stockActual + item.cantidad;

      actualizarStock(item.id, nuevoStock);

      stockElemento.textContent = nuevoStock;

     const boton = document.querySelector(`.agregar-carrito[data-id="${item.id}"]`);
if (boton) {
  boton.disabled = false;
  boton.textContent = 'Agregar al carrito';
  boton.style.backgroundColor = '';
}

    }
  });

  localStorage.removeItem('carrito');
  actualizarContadorCarrito();
  renderizarCarrito();
});

window.onload = () => {
  obtenerProductos();
  actualizarContadorCarrito();
  renderizarCarrito();
};





function mostrarAlerta(mensaje) {
  let alerta = document.querySelector('.alerta-stock');

  if (!alerta) {
    alerta = document.createElement('div');
    alerta.classList.add('alerta-stock');
    alerta.innerHTML = `<i class="fas fa-exclamation-triangle"></i> <span></span>`;
    document.body.appendChild(alerta);
  }

  alerta.querySelector('span').textContent = mensaje;
  alerta.classList.add('mostrar');

  setTimeout(() => {
    alerta.classList.remove('mostrar');
  }, 3000); // Desaparece después de 3 segundos
}

document.getElementById('btn-autocompletar').addEventListener('click', () => {
  const datosGuardados = JSON.parse(localStorage.getItem('datosCliente'));
  
  if (datosGuardados) {
    document.getElementById('nombre-apellido').value = datosGuardados.nombreApellido || '';
    document.getElementById('dni').value = datosGuardados.dni || '';
    document.getElementById('celular').value = datosGuardados.celular || '';
    document.getElementById('provincia').value = datosGuardados.provincia || '';
    document.getElementById('localidad').value = datosGuardados.localidad || '';
    document.getElementById('cp').value = datosGuardados.cp || '';
    document.getElementById('mail').value = datosGuardados.mail || '';
    document.getElementById('metodo-envio').value = datosGuardados.metodoEnvio || '';
  } else {
    alert('No hay datos guardados para autocompletar.');
  }
});
