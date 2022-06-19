class VistaProducto{
	static getItem(item){
		return `
            <div class="boxItem">
                <div class="fixBoxItem itemProducto" data-id="${item.id}">
                    <img src="${item.foto}" alt="${item.titulo}" width="100%" />
                    <h3 class="typeo regular spacing-100">${item.titulo}</h3>
                    <p class="typeo semibold precio">$ ${item.precio}</p>
                    <p class="typeo regular sku">Art: ${item.SKU}</p>
                </div>
            </div>
        `;
	}

    static getModal(item){
        return `
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content rounded-0">
                <div class="modal-header align-items-center">
                    <div class="typeo regular spacing-100 titulo mb-0">${item.titulo}</div>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="mt-2 p-4 content d-flex flex-row">
                    <div class="col-3">
                        <img src="${item.foto}" alt="${item.titulo}" class="foto w-100 d-block">
                    </div>
                    <div class="col-9 p-3 pt-0">
                        <div class="detalle">${item.detalle}</div>
                        <div class="precio typeo semibold">$ <span>${item.precio}</span></div>
                        <div class="SKU">Art: <span>${item.SKU}</span></div>
                        <div class="foto"></div>
                    </div>
                </div>
                <div class="mt-2 p-4 pt-0">
                    <div id="btnModalAddToCart" data-id="${item.id}" class="btnCart typeo light d-flex justify-content-center mt-1 btn-transition pointer addToCart">
                        <div class="icon"></div>
                        <div class="pt-1">AÑADIR AL CARRITO</div>
                    </div>
                </div>
                <div id="modalAddToCartLoading" class="d-none position-absolute top-0">
                    <span class="spinner-border" role="status" aria-hidden="true"></span>
                </div>
            </div>
        </div>
        `;
    }
}

export default VistaProducto;