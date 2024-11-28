async function cargarProductos() {
    const spreadsheetId = '12oG09ajTEdaXgB7O_7LFwsd1yjQUEkVZhzz3tgXO9cQ';
    const range = "Hoja1!A2:E";
    const apiKey = 'AIzaSyApzol_-jVIGb9br6ukbdjLTB0x5iQ-e-k';
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.values) {
            const productos = data.values;
            const productList = document.getElementById('product-list');

            productos.forEach((producto) => {
                const [id, nombre, descripcion, precio, imagen] = producto;

                const productCard = document.createElement('div');
                productCard.classList.add('product-card');
                productCard.innerHTML = `
                    <img src="${imagen}" alt="${nombre}">
                    <h3>${nombre}</h3>
                    <p>${descripcion}</p>
                    <p><strong>$${precio}</strong></p>
                    <button onclick="comprarProducto('${nombre}', ${precio})">Comprar</button>
                `;
                productList.appendChild(productCard);
            });
        } else {
            console.error("No se encontraron datos en la hoja.");
        }
    } catch (error) {
        console.error("Error al conectarse a Google Sheets:", error);
    }
}

async function comprarProducto(nombre, precio) {
    const cantidad = 1; // Puedes permitir modificar esta cantidad si lo deseas.

    try {
        const response = await fetch('http://localhost:3000/crear-preferencia', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nombre, precio, cantidad }),
        });

        const data = await response.json();

        // Redirigir al cliente a Mercado Pago
        window.location.href = data.init_point;
    } catch (error) {
        console.error('Error al procesar el pago:', error);
    }
}

cargarProductos();

//https://sheets.googleapis.com/v4/spreadsheets/12oG09ajTEdaXgB7O_7LFwsd1yjQUEkVZhzz3tgXO9cQ/values/Hoja1!A2:E?key=AIzaSyApzol_-jVIGb9br6ukbdjLTB0x5iQ-e-k
