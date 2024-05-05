// scripts.js

document.addEventListener('DOMContentLoaded', () => {
    const listarProductosBtn = document.getElementById('listar-productos-btn');
    const crearProductoForm = document.getElementById('crear-producto-form');

    listarProductosBtn.addEventListener('click', listarTodosLosProductos);
    crearProductoForm.addEventListener('submit', crearNuevoProducto);
})

function listarTodosLosProductos() {
    fetch('http://localhost:8080/productos')
        .then(handleResponse)
        .then(displayProductos)
        .catch(handleError);
}

function crearNuevoProducto(event) {
    event.preventDefault();
    const formData = {
        nombre: document.getElementById('nombre').value,
        precio: parseFloat(document.getElementById('precio').value),
        stock: parseInt(document.getElementById('stock').value)
    };

    fetch('http://localhost:8080/productos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
    })
    .then(handleResponse)
    .then(data => {
        console.log('Nuevo producto creado:', data);
        event.target.reset();
        listarTodosLosProductos();
    })
    .catch(handleError);
}

function handleResponse(response) {
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    if (response.status === 204) {
        return {};
    }
    return response.json();
}

function displayProductos(productos) {
    const productosListDiv = document.getElementById('productos-list');
    productosListDiv.innerHTML = '';
    productos.forEach(producto => {
        const productoDiv = document.createElement('div');
        productoDiv.innerHTML = `
            <h3 contenteditable="true" data-field="nombre">${producto.nombre}</h3>
            <p>Precio: $<span contenteditable="true" data-field="precio">${producto.precio}</span></p>
            <p>Stock: <span contenteditable="true" data-field="stock">${producto.stock}</span></p>
            <button class="actualizar-btn" data-producto-id="${producto.id}">Actualizar</button>
            <button class="eliminar-btn" data-producto-id="${producto.id}">Eliminar</button>
        `;
        productosListDiv.appendChild(productoDiv);
    });

    // Add event listeners to the buttons
    const actualizarBtns = document.querySelectorAll('.actualizar-btn');
    actualizarBtns.forEach(btn => {
        btn.addEventListener('click', actualizarProducto);
    });

    const eliminarBtns = document.querySelectorAll('.eliminar-btn');
    eliminarBtns.forEach(btn => {
        btn.addEventListener('click', eliminarProducto);
    });
}

function actualizarProducto(event) {
    const productoId = event.target.getAttribute('data-producto-id');
    const productoDiv = event.target.parentNode;
    const nombre = productoDiv.querySelector('[data-field="nombre"]').textContent;
    const precio = parseFloat(productoDiv.querySelector('[data-field="precio"]').textContent);
    const stock = parseInt(productoDiv.querySelector('[data-field="stock"]').textContent);

    const datosActualizados = {
        nombre: nombre,
        precio: precio,
        stock: stock
    };

    fetch(`http://localhost:8080/productos/${productoId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(datosActualizados),
    })
    .then(handleResponse)
    .then(data => console.log('Producto actualizado:', data))
    .catch(handleError);
}

function eliminarProducto(event) {
    const productoId = event.target.getAttribute('data-producto-id');

    fetch(`http://localhost:8080/productos/${productoId}`, {
        method: 'DELETE',
    })
    .then(handleResponse)
    .then(() => {
        console.log('Producto eliminado exitosamente');
        event.target.parentNode.remove();
    })
    .catch(handleError);
}


function handleError(error) {
    console.error('Error:', error);
    alert('Error occurred. Please try again later.');
}
