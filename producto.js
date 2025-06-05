
  window.verificarCodigo = function() {
    const codigoIngresado = document.getElementById('codigoEmpleado').value;
    const codigoCorrecto = '3425'; // Cambia por tu código real

    if (codigoIngresado === codigoCorrecto) {
     

      // Mostrar inputs y botones solo para empleados
      document.querySelectorAll('.solo-empleado').forEach(div => {
        div.style.display = 'block';
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

async function obtenerProductos() {
  try {
    const response = await fetch('https://mayorista-sinlimites-backend-production.up.railway.app/productos');
    if (!response.ok) throw new Error('No se pudieron obtener los productos');

    const productos = await response.json();
    const container = document.getElementById('productos');
    container.innerHTML = '';

    function agregarAlCarrito(event) {
      const id = event.target.getAttribute('data-id');
      const nombre = event.target.getAttribute('data-nombre');
      const precio = parseFloat(event.target.getAttribute('data-precio')) || 0;
      const imagen = event.target.getAttribute('data-imagen');

      let stockElemento = document.getElementById(`stock-${id}`);
      let stock = parseInt(stockElemento.textContent);

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

        actualizarStock(id, stock).catch(error => console.error('Error al actualizar el stock:', error));

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

      const variantesContainer = document.createElement('div');
      variantesContainer.classList.add('variantes');
      variantesContainer.style.display = 'none';
producto.variantes.forEach(vari => {
  const stock = vari.stock !== undefined ? vari.stock : 0;
  const precio = vari.precio !== undefined ? vari.precio : 0;

 const varianteDiv = document.createElement('div');
varianteDiv.classList.add('variant');
varianteDiv.id = `variant-${vari.id}`;  // <--- Importante para eliminarlo después
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

  </div>
  `;

  variantesContainer.appendChild(varianteDiv);
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
      productoDiv.appendChild(variantesContainer);
      container.appendChild(productoDiv);
    });

    // Agregar event listeners a los botones AGREGAR AL CARRITO después de renderizar todo
    const botonesAgregarCarrito = document.querySelectorAll('.agregar-carrito');
    botonesAgregarCarrito.forEach(boton => {
      boton.addEventListener('click', agregarAlCarrito);
    });

  } catch (error) {
    console.error('Error al obtener los productos:', error);
  }
}




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
    const itemDiv = document.createElement('li');
    itemDiv.classList.add('tu-clase');

    const precioUnitario = parseFloat(item.precio) || 0;
    const subtotal = precioUnitario * item.cantidad;
    total += subtotal;

    itemDiv.innerHTML = `
      <img class="img-producto" style="width: 40%; height: 40%;" src="${item.imagen || 'path/to/default-image.jpg'}" alt="${item.nombre}">
      <div class="img-pro">
        <h6>${item.nombre}</h6>
       
        <h4>Precio unitario: $${precioUnitario}</h4>  
         <p class="cantidad">Cantidad:
        <button class="btn-cantidad" data-id="${item.id}" data-accion="restar">-</button> <span  id="cantidad-${item.id}">${item.cantidad}</span>
        <button class="btn-cantidad" data-id="${item.id}" data-accion="sumar">+</button></p>
        <p class="cantidad">Subtotal: $${subtotal}</p>
        <button class="eliminar-item" data-id="${item.id}">Eliminar</button>
      </div>
    `;

    carritoItems.appendChild(itemDiv);
  });


  carritoTotal.textContent = `Total: $${total}`;

  // Manejar los botones "+" y "-" para cambiar la cantidad
  const botonesCantidad = document.querySelectorAll('.btn-cantidad');
  botonesCantidad.forEach(boton => {
    boton.addEventListener('click', (e) => {
      const id = e.target.getAttribute('data-id');
      const accion = e.target.getAttribute('data-accion');
      actualizarCantidad(id, accion);
    });
  });

  // Manejar los botones de eliminar
  const botonesEliminar = document.querySelectorAll('.eliminar-item');
  botonesEliminar.forEach(boton => {
    boton.addEventListener('click', (e) => {
      const id = e.target.getAttribute('data-id');
      eliminarDelCarrito(id);
    });
  });
}



async function actualizarCantidad(id, accion) {
  try {
    const res = await fetch(`https://mayorista-sinlimites-backend-production.up.railway.app/productos/variantes/${id}`);
    const data = await res.json();
    let stockActual = data.stock;

    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const producto = carrito.find(p => p.id === id);

    if (!producto) return;

    if (accion === 'sumar') {
      // Permitir sumar solo si hay stock disponible
      if (stockActual > 0) {
        producto.cantidad += 1;
        stockActual -= 1; // Reducimos stock localmente
        await actualizarStock(id, stockActual); // Actualizar DB con nuevo stock
        document.getElementById(`stock-${id}`).textContent = stockActual; // Actualizar UI

        // Si stock llega a 0, deshabilitar botón y alertar
        if (stockActual == 0) {
          
          const boton = document.querySelector(`.agregar-carrito[data-id="${id}"]`);
          if (boton) {
            boton.disabled = true;
            boton.textContent = 'Sin stock';
            boton.style.backgroundColor = 'gray';
          }
        }
      } else {
        
     mostrarAlerta('No hay más stock disponible');
      }
    } else if (accion === 'restar' && producto.cantidad > 1) {
      producto.cantidad -= 1;
      stockActual += 1; // Incrementamos stock localmente
      await actualizarStock(id, stockActual); // Actualizar DB
      document.getElementById(`stock-${id}`).textContent = stockActual; // UI

      // Si se suma stock, reactivar botón si estaba deshabilitado
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




function eliminarDelCarrito(id) {
  let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

  // Buscar el producto a eliminar
  const productoAEliminar = carrito.find(item => item.id === id);
  if (productoAEliminar) {
    const stockElemento = document.getElementById(`stock-${productoAEliminar.id}`);
    let stockActual = parseInt(stockElemento.textContent);
    const nuevoStock = stockActual + productoAEliminar.cantidad;

    // Actualizar el stock en la base de datos
    actualizarStock(productoAEliminar.id, nuevoStock);

    stockElemento.textContent = nuevoStock;

    // Habilitar el botón de agregar al carrito nuevamente
   const boton = document.querySelector(`.agregar-carrito[data-id="${productoAEliminar.id}"]`);
if (boton) {
  boton.disabled = false;
  boton.textContent = 'Agregar al carrito';
  boton.style.backgroundColor = '';
}

  }

  // Eliminar el producto del carrito
  carrito = carrito.filter(item => item.id !== id);
  localStorage.setItem('carrito', JSON.stringify(carrito));
  actualizarContadorCarrito();
  renderizarCarrito();
}




// Mostrar formulario con animación al hacer click en Finalizar Compra
document.getElementById('finalizar-compra').addEventListener('click', () => {
  const carrito = JSON.parse(localStorage.getItem('carrito')) || [];

  // Sumar la cantidad total de productos
  const totalProductos = carrito.reduce((acc, item) => acc + item.cantidad, 0);

  // Si hay menos de 15, mostrar alerta y no abrir el formulario
  if (totalProductos < 15) {
    mayorAlerta('Debes agregar al menos 15 productos para finalizar la compra.');
    return;
  }

  // Mostrar formulario si se cumple la condición
  const formulario = document.getElementById('formulario-compra');
  formulario.style.display = 'flex';
  setTimeout(() => {
    formulario.classList.add('formulario-visible');
  }, 10);
});


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

// Manejar envío del formulario
document.getElementById('compra-form').addEventListener('submit', function (e) {
  e.preventDefault();

  // Obtener datos del formulario
  const nombreApellido = document.getElementById('nombre-apellido').value;
  const dni = document.getElementById('dni').value;
  const celular = document.getElementById('celular').value;
  const provincia = document.getElementById('provincia').value;
  const localidad = document.getElementById('localidad').value;
  const cp = document.getElementById('cp').value;
  const mail = document.getElementById('mail').value;
  const metodoEnvio = document.getElementById('metodo-envio').value;

  // Obtener carrito
  const carrito = JSON.parse(localStorage.getItem('carrito')) || [];

  const productosSinStock = carrito.filter(producto => producto.cantidad > producto.stock);

  if (productosSinStock.length > 0) {
    let mensaje = 'No hay stock suficiente para los siguientes productos:\n';
    productosSinStock.forEach(prod => {
      mensaje += `- ${prod.nombre} (Stock disponible: ${prod.stock}, Cantidad solicitada: ${prod.cantidad})\n`;
    });
    alert(mensaje);
    return;
  }

  // Guardar datos del cliente para autocompletar la próxima vez
  const cliente = {
    nombreApellido,
    dni,
    celular,
    provincia,
    localidad,
    cp,
    mail,
    metodoEnvio
  };
  localStorage.setItem('datosCliente', JSON.stringify(cliente));
  



  // Crear PDF con jsPDF
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // Agregar logo (ajustar la ruta y formato si hace falta)
  const logoUrl = 'logo2.jpg'; 
  doc.addImage(logoUrl, 'JPG', 10, 10, 20, 20);

  // Título
  doc.setFontSize(18);
  doc.setTextColor(40, 90, 160);
  doc.text("Detalles de la Compra", 50, 20);

  // Línea decorativa
  doc.setLineWidth(0.5);
  doc.line(10, 35, 200, 35);

  // Datos del cliente
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

  // Espacio antes productos
  y += 10;
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Productos en el carrito:", 10, y);
  doc.setFont("helvetica", "normal");
  y += 10;

  let totalCompra = 0;

  carrito.forEach((producto, index) => {
    if (y > 250) { // Nueva página si se pasa
      doc.addPage();
      y = 20;
    }

    // Imagen si existe
    if (producto.imagen) {
      doc.addImage(producto.imagen, 'JPG', 10, y, 30, 30);
    }

    let textX = producto.imagen ? 50 : 10;

    doc.setFont("helvetica", "bold");
    doc.text(`${index + 1}. ${producto.nombre}`, textX, y + 10);

    doc.setFont("helvetica", "normal");
    doc.text(`Precio: $${producto.precio.toFixed(2)} - Cantidad: ${producto.cantidad}`, textX, y + 15);

    const subtotal = producto.precio * producto.cantidad;
    doc.text(`Subtotal: $${subtotal.toFixed(2)}`, textX, y + 20);

    totalCompra += subtotal;
    y += 40;
  });

  // Línea antes total
  doc.setLineWidth(0.5);
  doc.line(10, y, 200, y);

  // Total
  y += 10;
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(`Total de la compra: $${totalCompra.toFixed(2)}`, 10, y);

y += 15;  // un poco más de espacio arriba
doc.setFontSize(15);
doc.setFont("helvetica", "bolditalic");  // negrita + cursiva para destacar
doc.setTextColor(60, 120, 180);  // un azul suave, más agradable que negro puro
doc.text("Gracias por tu compra. ¡Esperamos verte pronto!", 10, y);


  // Mostrar alerta o feedback (opcional)
  document.getElementById("alertenviar").style.display = "block";
  document.getElementById("alertenviar").style.animation = "fadeIn 0.4s ease-in-out";

  // Crear FormData para enviar archivo al backend
  const pdfBlob = doc.output('blob');
  const formData = new FormData();
  formData.append('pdf', pdfBlob, 'comprobante.pdf');

  // Enviar al backend
  fetch('https://mayorista-sinlimites-backend-production.up.railway.app/uplod-pdf', {
    method: 'POST',
    body: formData
  })
  .then(res => res.json())
  .then(data => {
    if(data.url){
      // data.url es el link público del PDF alojado
      console.log('PDF alojado en:', data.url);

    // Ahora podés armar el link para WhatsApp con ese URL
    const whatsappUrl = `https://wa.me/5493329317141?text=Hola,%20quiero%20confirmar%20mi%20pedido%20aquí:%20${encodeURIComponent(data.url)}`;
    
    // Abrir WhatsApp con el mensaje prearmado
    window.open(whatsappUrl, '_blank');
    
   
  } else { 
   mostrarAlert('Hubo un error, pero te damos otra solución');
  }
})  
.catch(err => {
    console.error(err);
mostrarAlert('Hubo un error, pero te damos otra solución');

    // Plan B: guardar datos y redirigir al HTML alternativo
    const reader = new FileReader();
    reader.onload = function () {
      const pdfDataURL = reader.result;

      const pedidoBackup = {
        cliente: {
          nombreApellido,
          dni,
          celular,
          provincia,
          localidad,
          cp,
          mail,
          metodoEnvio
        },
        carrito,
        pdfDataURL
      };

      localStorage.setItem('pedidoBackup', JSON.stringify(pedidoBackup));
      window.location.href = 'resumen-error.html';
    };
    reader.readAsDataURL(pdfBlob);
  });


  // Limpiar carrito
  localStorage.removeItem('carrito');

  // Cerrar formulario con animación
  const formulario = document.getElementById('formulario-compra');
  formulario.classList.remove('formulario-visible');
  setTimeout(() => {
    formulario.style.display = 'none';
  }, 300);
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
