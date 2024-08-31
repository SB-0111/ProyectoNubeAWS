const spaceId = '';
const accessToken = '';
const environment = '';
const entryId = '';

async function fetchContent() {
    const spaceId = '';
    const accessToken = '';
    const environment = '';
    const entryId = '';
    
    const url = `https://cdn.contentful.com/spaces/${spaceId}/environments/${environment}/entries/${entryId}?access_token=${accessToken}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        const contentElement = document.getElementById('content');
        
        // Acceso al tÃ­tulo y color
        const title = data.fields.heroBannerHeadline ? data.fields.heroBannerHeadline : 'TÃ­tulo no disponible';
        const titleColor = data.fields.heroBannerHeadlineColor ? data.fields.heroBannerHeadlineColor : '#000';
        
        // Acceso a la imagen del banner
        const imageId = data.fields.heroBannerImage?.sys?.id;
        const imageUrl = imageId ? await fetchImageUrl(imageId) : '';

        // ConstrucciÃ³n del HTML con ajustes de CSS
        const contentHTML = `
            <div style="text-align: center; position: relative; overflow: hidden;">
                <img src="${imageUrl}" alt="Hero Banner" style="width: 100%; height: auto; max-height: 600px;">
                <h1 style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: ${titleColor}; font-size: 3em;">${title}</h1>
            </div>
        `;
        
        contentElement.innerHTML = contentHTML;

        // Renderizar productos
        const products = data.fields.products || [];
        await renderProducts(products, contentElement);

    } catch (error) {
        console.error('Error fetching content:', error);
    }
}

// FunciÃ³n para obtener la URL de una imagen
async function fetchImageUrl(imageId) {
    const url = `https://cdn.contentful.com/spaces/${spaceId}/environments/${environment}/assets/${imageId}?access_token=${accessToken}`;
    const response = await fetch(url);
    const data = await response.json();
    return data.fields.file.url;
}

// FunciÃ³n para renderizar productos
async function renderProducts(products, contentElement) {
    let productsHTML = '<h2>Trending now</h2><div style="display: flex; justify-content: space-around; flex-wrap: wrap;">';

    for (let product of products) {
        const productId = product?.sys?.id;
        
        if (!productId) {
            console.error('Product ID is missing:', product);
            continue;  // Saltar este producto si no tiene ID vÃ¡lido
        }

        const productData = await fetchProductData(productId);
        const productImageId = productData.fields.featuredProductImage?.sys?.id || 
                               (productData.fields.productImages && productData.fields.productImages[0]?.sys?.id);
        const productImageUrl = productImageId ? await fetchImageUrl(productImageId) : '';
        const productTitle = productData.fields.name || 'Sin tÃ­tulo';
        const productPrice = productData.fields.price || 'N/A';
        const productSlug = productData.fields.slug || productId;

        // Crear un enlace al producto
        const productLink = `product.html?slug=${productSlug}`;

        productsHTML += `
            <div style="margin: 10px; text-align: center;">
                <a href="${productLink}">
                    <img src="${productImageUrl}" alt="${productTitle}" style="width: 150px; height: 200px; object-fit: cover;">
                    <h3>${productTitle}</h3>
                </a>
                <p>$${productPrice}</p>
            </div>
        `;
    }

    productsHTML += '</div>';
    contentElement.innerHTML += productsHTML;
}

// FunciÃ³n para obtener datos de un producto
async function fetchProductData(productId) {
    const url = `https://cdn.contentful.com/spaces/${spaceId}/environments/${environment}/entries/${productId}?access_token=${accessToken}`;
    const response = await fetch(url);
    return response.json();
}

fetchContent();