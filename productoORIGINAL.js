

import { stockProductos } from './productos-todos-1.js';

document.addEventListener("DOMContentLoaded", function () {

  // Y después el resto...
  const carritoIcono = document.getElementById('carrito-icono'); 
  const carritoContenido = document.getElementById('contenido-carrito'); 
  const vaciarCarritoBtn = document.getElementById('vaciar-carrito'); 
  const finalizarCompraBtn = document.getElementById('finalizar-compra'); 
  const carritoLista = document.getElementById('carrito-lista');
  const totalCarrito = document.getElementById('total-carrito'); 
  const contadorCarrito = document.getElementById('contador'); 
  // ...
  // Abrir el carrito flotante
  carritoIcono.addEventListener('click', function () {
    carritoContenido.classList.toggle('show'); // Cambiar el estado abierto/cerrado
  });


  let carrito = JSON.parse(localStorage.getItem('carrito')) || []; // Recuperar el carrito desde localStorage si existe



// Función para actualizar el contador del carrito y el total
  function actualizarCarrito() { contadorCarrito.textContent = carrito.length; let total = 0; 
    carrito.forEach(item => { total += item.precio * item.cantidad; }); 
    totalCarrito.textContent = `Total: $${total}`;
    
    actualizarListaCarrito();
    localStorage.setItem('carrito', JSON.stringify(carrito)); // Guardar el carrito en localStorage
    }
  
  
  
// Función para guardar el stock actualizado en localStorage
function guardarStockEnLocalStorage() {
  localStorage.setItem('stockProductos', JSON.stringify(stockProductos));
}

  
  
  
  function actualizarCantidadPorId(id, cambio) {
  const item = carrito.find(p => p.id === id);
  if (!item) return;

  const producto = stockProductos.find(p =>
    p.variantes.some(v => v.id === id)
  );
  const variante = producto?.variantes.find(v => v.id === id);
  if (!variante) return;

  if (cambio === 1) {
    if (variante.stock > 0) {
      item.cantidad += 1;
      variante.stock -= 1;
    }
  } else if (cambio === -1) {
    if (item.cantidad > 1) {
      item.cantidad -= 1;
      variante.stock += 1;
    } else {
      // Si la cantidad es 1 y se resta, se elimina del carrito
      const index = carrito.findIndex(p => p.id === id);
      if (index !== -1) {
        carrito.splice(index, 1);
        variante.stock += 1;
      }
    }
  }

  actualizarCarrito();
  actualizarStock(); // Si tenés una función que pinta los productos fuera del carrito
  guardarStockEnLocalStorage();
}

function actualizarListaCarrito() {
  carritoLista.innerHTML = '';

  carrito.forEach((item) => {
    const li = document.createElement('li');
    const producto = stockProductos.find(p =>
      p.variantes.some(v => v.id === item.id)
    );
    if (!producto) return;

    const variante = producto.variantes.find(v => v.id === item.id);
    if (!variante) return;

    li.classList.add('tu-clase');
    li.innerHTML = `
      <img class="img-producto" src="${variante.imagen}" alt="${item.nombre}" style="width: 40%; height: 40%;">
      <div class="img-pro">
        <h6>${item.nombre}</h6>
        <h4>$${item.precio}</h4>  
        <button class="eliminar" data-id="${item.id}">Eliminar</button>
        <button class="menos" data-id="${item.id}">-</button>  
        <span class="cantidad">${item.cantidad}</span>   
        <button class="mas" data-id="${item.id}">+</button>  
      </div>`;

    // Botón eliminar
    li.querySelector('.eliminar').addEventListener('click', function () {
      const id = parseInt(this.getAttribute('data-id'));
      eliminarDelCarritoPorId(id);
    });

// Botón más
li.querySelector('.mas').addEventListener('click', function () {
  const id = parseInt(this.getAttribute('data-id'));
  actualizarCantidadPorId(id, 1);

  const producto = stockProductos.find(p =>
    p.variantes.some(v => v.id === id)
  );
  if (!producto) return;

  const variante = producto.variantes.find(v => v.id === id);
  if (!variante) return;

  const btn = document.querySelector(`.agregar-carrito[data-producto="${producto.nombre}"][data-variant="${producto.variantes.indexOf(variante)}"]`);

  if (btn) {
    if (variante.stock > 0) {
      btn.disabled = false;
      btn.textContent = 'Agregar al carrito';
      btn.style.opacity = '1';
      btn.style.cursor = 'pointer';
      btn.style.backgroundColor = '';
      btn.style.color = '';
    } else {
      btn.disabled = true;
      btn.textContent = 'Sin stock';
      btn.style.backgroundColor = 'red';
      btn.style.color = 'white';
      btn.style.opacity = '0.6';
      btn.style.cursor = 'not-allowed';
     mostrarAlerta('No hay más stock disponible');
    }
  }
});

    // Botón menos
li.querySelector('.menos').addEventListener('click', function () {
  const id = parseInt(this.getAttribute('data-id'));
  actualizarCantidadPorId(id, -1);

  // Reactivar el botón "Agregar al carrito" sin revisar el stock (ya se devolvió uno)
  const btn = document.querySelector(`.agregar-carrito[data-producto="${producto.nombre}"][data-variant="${producto.variantes.indexOf(variante)}"]`);
  if (btn) {
    btn.disabled = false;
    btn.textContent = 'Agregar al carrito';
    btn.style.backgroundColor = '';
    btn.style.color = '';
    btn.style.cursor = 'pointer';
    btn.style.opacity = '1';
  }
});


    carritoLista.appendChild(li);
  });
}

  
  function agregarAlCarrito(id, productoNombre, precio, cantidad = 1, imagen) {
  const producto = stockProductos.find(p =>
    p.variantes.some(v => v.id === id)
  );
  const variante = producto?.variantes.find(v => v.id === id);
  if (!variante) return;

  const productoExistente = carrito.find(item => item.id === id);

  if (productoExistente) {
    productoExistente.cantidad += cantidad;
  } else {
    carrito.push({
      id,
      nombre: productoNombre,
      precio,
      cantidad,
      imagen,
    });
  }
  

  actualizarCarrito();
  actualizarStock();
  guardarStockEnLocalStorage();
}
  
  

// Función para vaciar el carrito
vaciarCarritoBtn.addEventListener('click', function () {
  carrito.forEach(item => {
    const producto = stockProductos.find(p =>
      p.variantes.some(v => v.id === item.id)
    );
    if (!producto) return;

    const variante = producto.variantes.find(v => v.id === item.id);
    if (!variante) return;

    variante.stock += item.cantidad; // Devolver al stock

    // Reactivar el botón si existe
    const variantIndex = producto.variantes.findIndex(v => v.id === item.id);
    const btn = document.querySelector(`.agregar-carrito[data-producto="${producto.nombre}"][data-variant="${variantIndex}"]`);
    if (btn) {
      btn.disabled = false;
      btn.textContent = 'Agregar al carrito';
      btn.style.backgroundColor = '';
      btn.style.color = '';
      btn.style.cursor = 'pointer';
      btn.style.opacity = '1';
    }
  });

  carrito = []; // Vaciar el carrito

  actualizarCarrito();
  actualizarStock();
  guardarStockEnLocalStorage(); // Persistencia
});
  
  
  function eliminarDelCarritoPorId(id) {
  const index = carrito.findIndex(p => p.id === id);
  if (index !== -1) {
    const item = carrito[index];

    // Devolver el stock
    const producto = stockProductos.find(p =>
      p.variantes.some(v => v.id === item.id)
    );
    const variante = producto?.variantes.find(v => v.id === item.id);
    if (variante) {
      variante.stock += item.cantidad;

      // Reactivar el botón si existe
      const variantIndex = producto.variantes.findIndex(v => v.id === item.id);
      const btn = document.querySelector(`.agregar-carrito[data-producto="${producto.nombre}"][data-variant="${variantIndex}"]`);
      if (btn) {
        btn.disabled = false;
        btn.textContent = 'Agregar al carrito';
        btn.style.backgroundColor = '';
        btn.style.color = '';
        btn.style.cursor = 'pointer';
        btn.style.opacity = '1';
      }
    }

    carrito.splice(index, 1);
    actualizarCarrito();
    actualizarStock();
    guardarStockEnLocalStorage();
  }
}
  

  // Función para actualizar el stock visible
  function actualizarStock() {
    stockProductos.forEach(producto => {
      producto.variantes.forEach((variante, index) => {
        const stockElement = document.getElementById(`stock-${producto.nombre}-${index}`);
        if (stockElement) {
          stockElement.textContent = `Stock: ${variante.stock}`;
        }
      });
    });
  }

  // Mostrar productos y permitir agregar al carrito
  stockProductos.forEach(producto => {
    const productoDiv = document.createElement('div');
    productoDiv.classList.add('producto');
    
    let variantesHTML = '';
    producto.variantes.forEach((variant, index) => {
      variantesHTML += `
        <div class="variant" style="display: none;">
          <img src="${variant.imagen}" alt="${producto.nombre}">
          <p>Precio: $${variant.precio}</p>
          <p id="stock-${producto.nombre}-${index}">Stock: ${variant.stock}</p>
          <button class="agregar-carrito" data-producto="${producto.nombre}" data-variant="${index}">Agregar al carrito</button>
        </div>
      `;
    });

    productoDiv.innerHTML = `
      <h3>${producto.nombre}</h3>
      <img src="${producto.imagen}" alt="${producto.nombre}">
      <button class="ver-mas-btn">Ver más</button>
      <div class="variantes">
        ${variantesHTML}
      </div>
    `;

    const verMasBtn = productoDiv.querySelector('.ver-mas-btn');
    const variantesDiv = productoDiv.querySelector('.variantes');

    verMasBtn.addEventListener('click', function() {
      const variantes = variantesDiv.querySelectorAll('.variant');
      variantes.forEach(variant => {
        variant.style.display = (variant.style.display === 'none' || variant.style.display === '') ? 'block' : 'none';
      });
      verMasBtn.textContent = (verMasBtn.textContent === 'Ver más') ? 'Ver menos' : 'Ver más';
    });
    
    
    
     // Función para agregar al carrito
    const agregarCarritoBtns = productoDiv.querySelectorAll('.agregar-carrito');
    agregarCarritoBtns.forEach(btn => {
      btn.addEventListener('click', function () {
  const productoNombre = btn.getAttribute('data-producto');
  const variantIndex = btn.getAttribute('data-variant');
  const variant = producto.variantes[variantIndex];

        

        
  if (variant.stock > 0) {
    agregarAlCarrito(variant.id, productoNombre, variant.precio, 1, variant.imagen, variant.stock);
    producto.variantes[variantIndex].stock -= 1;
    document.getElementById(`stock-${productoNombre}-${variantIndex}`).textContent = `Stock: ${variant.stock}`;
    actualizarCarrito();
  } else {
  mostrarAlerta('No hay stock disponible');
 
btn.textContent = 'Sin stock';
btn.style.backgroundColor = '#e74c3c'; // rojo
btn.style.color = 'white';
btn.style.cursor = 'not-allowed';
btn.style.opacity = '0.8';
btn.style.border = 'none';
btn.style.transition = 'background-color 0.3s ease, opacity 0.3s ease';
btn.disabled = true;    // opcional para estilo visual
}
});
    });

    document.getElementById('productos').appendChild(productoDiv);
  });

  // Inicializar el carrito al cargar la página
  actualizarCarrito();
});
// Función para guardar el stock actualizado en localStorage
function guardarStockEnLocalStorage() {
  localStorage.setItem('stockProductos', JSON.stringify(stockProductos));
}

// Llamar a esta función después de actualizar el stock o al vaciar el carrito
guardarStockEnLocalStorage();





  // Primero va la función
 function cargarStockDesdeLocalStorage() {
   const stockGuardado = JSON.parse(localStorage.getItem('stockProductos'));

  if (stockGuardado && Array.isArray(stockGuardado)) {
    stockProductos.splice(0, stockProductos.length, ...stockGuardado);
  }
}
  // Ahora sí la llamás
  cargarStockDesdeLocalStorage();







function actualizarCantidad(index, incremento) {
  const item = carrito[index];
  const producto = stockProductos.find(p =>
    p.variantes.some(v => v.id === item.id)
  );
  const variante = producto?.variantes.find(v => v.id === item.id);
  if (!variante) return;

  // Incrementar
  if (incremento === 1) {
    if (variante.stock > 0) {
      item.cantidad += 1;
      variante.stock -= 1;
    }
  }

  // Decrementar
  if (incremento === -1) {
    if (item.cantidad > 1) {
      item.cantidad -= 1;
      variante.stock += 1;
    } else {
      carrito.splice(index, 1);
      variante.stock += 1;
    }
  }

  actualizarCarrito();
  actualizarStock();
  guardarStockEnLocalStorage();
}











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





function obtenerCantidadTotalDelCarrito() {
  const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  return carrito.reduce((acc, producto) => acc + producto.cantidad, 0);
}

function mostrarAlertaPersonalizada(mensaje) {
  const alerta = document.getElementById('alerta-personalizada');
  alerta.querySelector('p').textContent = mensaje;
  alerta.style.display = 'block';

  setTimeout(() => {
    alerta.style.display = 'none';
  }, 3000);
}

document.getElementById('finalizar-compra').addEventListener('click', function () {
  const cantidadTotal = obtenerCantidadTotalDelCarrito();

  if (cantidadTotal < 15) {
    mostrarAlertaPersonalizada('La compra debe ser mayor de 15 productos.');
    return;
  }

  const formulario = document.getElementById('formulario-compra');
  formulario.style.display = 'block';
  formulario.classList.add('fadeIn');
});




// Función para cerrar el formulario (por si el usuario quiere cerrar el formulario)
document.getElementById('cerrar-formulario').addEventListener('click', function() { 
  const formulario = document.getElementById('formulario-compra'); 
  formulario.classList.remove('fadeIn');
  formulario.style.display = 'none'; });





document.getElementById('compra-form').addEventListener('submit', function (e) {
    e.preventDefault();

    // Obtener los datos del formulario
    const nombreApellido = document.getElementById('nombre-apellido').value;
    const dni = document.getElementById('dni').value;
    const celular = document.getElementById('celular').value;
    const provincia = document.getElementById('provincia').value;
    const localidad = document.getElementById('localidad').value;
    const cp = document.getElementById('cp').value;
    const mail = document.getElementById('mail').value;

    // Obtener carrito del localStorage
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    // Crear el PDF
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Agregar logo (asegúrate de que la imagen esté en la carpeta correcta)
    const logoUrl = 'logo2.jpg';
    doc.addImage(logoUrl, 'JPG', 10, 10, 20, 20); // Logo cuadrado

    // Encabezado del PDF
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
    ];

    datosCliente.forEach((item) => {
        doc.text(`${item.label}:`, 10, y);
        doc.setFont("helvetica", "bold");
        doc.text(item.value, 60, y);
        doc.setFont("helvetica", "normal");
        y += 10;
    });

    // Espaciado antes de los productos
    y += 10;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Productos en el carrito:", 10, y);
    doc.setFont("helvetica", "normal");

    y += 10;
    let totalCompra = 0;

   

carrito.forEach((producto, index) => {
    if (y > 250) { // Evita que se salga de la página
        doc.addPage();
        y = 20;
    }
    
    // Agregar imagen del producto
    if (producto.imagen) {
        doc.addImage(producto.imagen, 'JPG', 10, y, 30, 30); // (imagen, formato, x, y, width, height)
    }

    // Agregar texto con margen después de la imagen
    let textX = producto.imagen ? 50 : 10; // Si hay imagen, el texto empieza más a la derecha
    
    doc.setFont("helvetica", "bold"); 
    doc.text(`${index + 1}. ${producto.nombre}`, textX, y + 10);
    
    doc.setFont("helvetica", "normal");
    doc.text(`Precio: $${producto.precio.toFixed(2)} - Cantidad: ${producto.cantidad}`, textX, y + 15);
    
    totalCompra += producto.precio * producto.cantidad;
    y += 40; // Aumentamos más espacio para evitar que las imágenes se sobrepongan
});



    // Línea de separación antes del total
    doc.setLineWidth(0.5);
    doc.line(10, y, 200, y);

    // Total de la compra
    y += 10;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(`Total de la compra: $${totalCompra}`, 10, y);

    // Mensaje de agradecimiento
    y += 10;
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.text("Gracias por tu compra. ¡Esperamos verte pronto!", 10, y);

    // Enlace a WhatsApp
    y += 15;
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
   const whatsappLink = "https://wa.me/5493329317141?text=Hola,%20quiero%20confirmar%20mi%20pedido%20Adjunto%20mi%20compra%20aquí";
    doc.text("Enviar por WhatsApp:", 10, y);
    doc.setTextColor(0, 102, 0);
    doc.textWithLink("Click aquí para enviar tu pedido por WhatsApp", 60, y, { url: whatsappLink });

// Mostrar alerta personalizada y cerrar a los 3 segundos
document.getElementById("alertenviar").style.display = "block";

// Animación de entrada (opcional si ya la tenés en CSS)
document.getElementById("alertenviar").style.animation = "fadeIn 0.4s ease-in-out";



// Guardar PDF
doc.save("comprobante.pdf");

// Limpiar el carrito de compras en el localStorage
localStorage.removeItem('carrito');

// Ocultar el formulario después de enviarlo
document.getElementById('formulario-compra').style.display = 'none';
  
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