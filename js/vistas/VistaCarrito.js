class VistasCarrito{
	static clean(){
		return `
		<div class="d-flex mainTitle py-1 text-center">
			<div class="col-12 pt-1 ps-1">Tu carrito está vacío</div>
		</div>
		<div class="btnBlack text-center typeo light pt-2 mt-4" data-bs-dismiss="offcanvas" aria-label="Close">SEGUIR COMPRANDO</div>
		`;
	}
	static items(item, cantidad, subtotal){
		if(typeof item === 'object'){
			return `
			<div class="cartItem d-flex py-2" data-id="${item.id}" data-precio="${item.precio}">
				<div class="col-8 d-flex">
					<div class="col-3 ps-2">
						<img src="${item.foto}" class="w-100">
					</div>
					<div class="col-9 typeo regular ps-2">
						<p>${item.titulo}</p>
						<p>$${item.precio}</p>
						<p class="sku typeo light">Art: ${item.SKU}</p>
					</div>
				</div>
				<div class="col-4 pt-1 d-flex flex-wrap flex-row">
					<div class="subto flex-grow-1">$${subtotal}</div>
					<button class="trash mx-1 me-2" data-id="${item.id}"></button>
					<div class="col-12">
						<div class="btn-group btn-group-sm" role="group">
							<button type="button" class="btn btn-outline-dark restar">-</button>
							<span type="button" class="btn border-dark cantidad">${cantidad}</span>
							<button type="button" class="btn btn-outline-dark sumar">+</button>
						</div>
					</div>
				</div>
			</div>
			`;
		}
	}
	static cartContainer(){
		return `
			<div class="d-flex mainTitle py-1">
				<div class="col-9 pt-1 ps-1">PRODUCTO</div>
				<div class="col-3 pt-1">SUBTOTAL</div>
			</div>
			<div class="cartItemsContainer mt-3" tabindex="0"></div>
			<div class="footerContainer"></div>
		`;
	}
	static footer(total){
		return `
			<div class="totales lineTop d-flex justify-content-between py-3 px-2 typeo regular mt-3">
				<div class="spacing-100">TOTAL</div>
				<div class="granTotal">$${total}</div>
			</div>
			<div class="btnBlack text-center typeo light pt-2 finalCompra">INICIAR COMPRA</div>
		`;
	}
}


export default VistasCarrito;