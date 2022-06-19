class Carrito{
	constructor(){
		this.localCart = [];
		this.getCart();
		this.total = '';
	}
	getCart(){
		if(localStorage.getItem('cart')) {
			try {
				this.localCart = JSON.parse(localStorage.getItem('cart'))
			} catch(e) {
				// En caso de fallas reinicia cart.
				localStorage.setItem('cart', JSON.stringify(this.localCart))
				console.error(e);
			}
		} else {
			this.actualizar();
		}
	}
	actualizar(){
		localStorage.setItem('cart', JSON.stringify(this.localCart));
	}
	hasItems(){
		return (this.localCart.length > 0)?true:false;
	}
	agregarProducto(id){
		let itemIndex = this.localCart.findIndex( item => item.id === id);
        if(itemIndex == -1){
            // primer ingreso del item, se agrega.
            this.localCart.push({id: id, cantidad: 1});
			this.actualizar();
        }else{
            // sumo uno ya que el item se encuentra en el "carro";
			// sumarProducto llamará a actualizar.
            this.sumarProducto(id);
        }		
	}
	quitarProducto(id){
		let itemIndex = this.localCart.findIndex( item => item.id === id);
		if(itemIndex != -1){
			this.localCart.splice(itemIndex, 1);
			this.actualizar();
			return true;
		}else{
			return false;
		}
	}
	sumarProducto(id){
		let itemIndex = this.localCart.findIndex( item => item.id === id);
		if(itemIndex != -1){
			this.localCart[itemIndex].cantidad += 1;
		}
		this.actualizar();
		return this.localCart[itemIndex].cantidad;
	}
	restarProducto(id){
		let itemIndex = this.localCart.findIndex( item => item.id === id);
		if(itemIndex != -1){
			if((this.localCart[itemIndex].cantidad - 1) > 0){
				this.localCart[itemIndex].cantidad -= 1;
				this.actualizar();
			}
			return this.localCart[itemIndex].cantidad;
		}
	}
	calcTotal(datos){
		if(Array.isArray(datos)){
			if(this.localCart.length > 0){
				let suma = 0;
				this.localCart.forEach(prod =>{
					let index = datos.findIndex(e => e.id == prod.id);
					suma += prod.cantidad * datos[index].precio;
				});
				this.total = suma;
				return true;
			}else{
				return false;
			}
		}else{
			return false;
		}
	}
	granTotal(precios){
		if(Array.isArray(precios)){
			let suma = 0;
			this.localCart.forEach(prod =>{
				let index = precios.findIndex(e => e.id == prod.id);
				suma += prod.cantidad * precios[index].precio;
			});
			return suma;
		}else{
			return 0;
		}
	}
	getTotal(){
		return this.total;
	}
	getIds(){
		return this.localCart.map((item)=>{ return item.id});
	}
	getItemCant(id){
		let itemIndex = this.localCart.findIndex( item => item.id === id);
        if(itemIndex != -1){
            return this.localCart[itemIndex].cantidad;
        }
	}
	checkout(){
		// vacio el storage simulando el final de la compra.
		localStorage.setItem('cart', JSON.stringify([]));
	}
}

export default Carrito;