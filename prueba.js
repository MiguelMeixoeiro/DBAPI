// Definir la URL base de la API de Dragon Ball
const baseURL = "https://dragonball-api.com/api/characters";

// Función para obtener el array de transformaciones
async function prueba() {
    try {
        const response = await fetch("https://dragonball-api.com/api/transformations");
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error al obtener datos de transformaciones", error);
        return [];
    }
}

// Función para mostrar los datos en la interfaz
function displayData(data) {
    // Obtener el contenedor de datos en el HTML
    const dataContainer = document.getElementById("data-container");

    // Limpiar el contenedor antes de agregar nuevos elementos
    dataContainer.innerHTML = "";

    // Verificar si data es un array y no está vacío
    if (Array.isArray(data) && data.length > 0) {
        // Iterar sobre los personajes y mostrarlos en tarjetas
        data.forEach(character => {
            const card = document.createElement("div");
            card.classList.add("card");

            // Verificar si los campos necesarios existen antes de mostrarlos
            const imageUrl = character.image || 'URL_POR_DEFECTO';
            console.log(character.image);
            const altText = character.name || 'Nombre Desconocido';
            const description = character.description || 'Descripción no disponible';

            // Puedes personalizar cómo se muestran los datos en las tarjetas
            card.innerHTML = `
        <div class="ficha">
        <img src="${imageUrl}" alt="${altText}">
        </div>
        <div class ="heroe">
        <h3>${altText}</h3></div>
        <div class="descrip"><p>${description}</p>
        <button onclick="transfor('${altText}')">Ver Transformaciones</button>`;

            // Agregar la tarjeta al contenedor
            dataContainer.appendChild(card);
        });
    } else {
        // Mostrar un mensaje en caso de que no haya datos
        dataContainer.innerHTML = "No se encontraron datos.";
    }
}

// Función para mostrar las transformaciones usando Swiper
function showTransformationsCarousel(characterName, transformationsArray) {
    // Filtrar el array de transformaciones por el nombre del personaje
    const characterTransformations = transformationsArray.filter(transform => transform.name && transform.name.toLowerCase().includes(characterName.toLowerCase()));

    if (characterTransformations.length > 0) {
        // Crear elementos del carrusel
        const swiperContainer = document.createElement("div");
        swiperContainer.classList.add("swiper-container", "hidden"); // Inicialmente oculto

        const swiperWrapper = document.createElement("div");
        swiperWrapper.classList.add("swiper-wrapper");

        characterTransformations.forEach(transform => {
            const swiperSlide = document.createElement("div");
            swiperSlide.classList.add("swiper-slide");

            const transformationImage = document.createElement("img");
            transformationImage.src = transform.image || 'URL_POR_DEFECTO';
            transformationImage.alt = transform.name || 'Nombre Desconocido';

            swiperSlide.appendChild(transformationImage);
            swiperWrapper.appendChild(swiperSlide);
        });

        swiperContainer.appendChild(swiperWrapper);

        // Agregar botón de cerrar al carrusel
        const closeButton = document.createElement("button");
        closeButton.textContent = "Cerrar";
        closeButton.addEventListener("click", () => {
            swiperContainer.classList.add("hidden");
        });
        swiperContainer.appendChild(closeButton);

        document.body.appendChild(swiperContainer);

        // Iniciar la reproducción de la música al mostrar el carrusel
        const audioPlayer = document.getElementById("audioPlayer");
        audioPlayer.play();

        // Inicializar Swiper
        const swiper = new Swiper('.swiper-container', {
            // Configuración de Swiper (puedes personalizar según tus necesidades)
            slidesPerView: 1,
            slidesPerGroup:1,
            spaceBetween: 100,

            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
        });

        // Mostrar el carrusel
        swiperContainer.classList.remove("hidden");
    } else {
        console.error("No se encontraron transformaciones para el nombre de personaje proporcionado");
    }
}

// Función para mostrar las transformaciones
async function transfor(characterName) {
    try {
        // Obtener el array de transformaciones usando la función prueba
        const transformationsArray = await prueba();

        // Mostrar las transformaciones en un carrusel en lugar de alert
        showTransformationsCarousel(characterName, transformationsArray);
    } catch (error) {
        console.error("Error en la función transfor:", error);
    }
}

// Función para realizar la solicitud a la API con búsqueda
async function search(query) {
    try {
        // Construir la URL completa con la consulta de búsqueda
        const url = `${baseURL}?name=${query}`;
        console.log(url);
        // Realizar la solicitud GET a la API
        const response = await fetch(url);

        // Verificar si la solicitud fue exitosa (código 200)
        if (response.ok) {
            try {
                // Convertir la respuesta a formato JSON
                const responseData = await response.json();

                // Imprimir la respuesta completa en la consola
                console.log(responseData);

                // Mostrar los datos en la interfaz
                displayData(responseData);

                // Devolver el nombre para usarlo en la función transfor
                return responseData[0].name;
            } catch (jsonError) {
                // Manejar errores de análisis JSON
                console.error("Error al analizar la respuesta JSON:", jsonError);
            }
        } else {
            // Manejar errores de la API
            console.error("Error al obtener datos de la API");
        }
    } catch (error) {
        // Manejar errores de red u otros errores
        if (error instanceof TypeError && error.message === "Failed to fetch") {
            console.error("Error de red: No se pudo conectar a la API");
        } else {
            console.error("Error desconocido:", error);
        }
    }
    // Si hay un error o la búsqueda no es exitosa, devolver una cadena vacía
    return "";
}


// Obtener el botón de búsqueda
const searchButton = document.getElementById("search-button");

// Asociar la función handleSearch al evento de clic del botón de búsqueda
searchButton.addEventListener("click", handleSearch);

// Función para manejar la búsqueda
async function handleSearch() {
    // Obtener el valor de la barra de búsqueda
    const searchInput = document.getElementById("search-input");
    const query = searchInput.value.trim();

    // Realizar la búsqueda solo si hay un término de búsqueda
    if (query !== "") {
        // Realizar la búsqueda con el término ingresado y obtener el nombre
        const characterName = await search(query);

        // Realizar la búsqueda de transformaciones con el nombre del personaje
        await transfor(characterName);
    } else {
        // Mostrar un mensaje de error o simplemente no hacer nada si no hay término de búsqueda
        console.error("Ingresa un término de búsqueda válido");
    }
}
