// Imports de la app.
import Loading from './js/clases/Loading.js';
import Carrito from './js/clases/Carrito.js';
import VistaProducto from './js/vistas/VistaProducto.js';
import VistaCarrito from './js/vistas/VistaCarrito.js';
import $, * as tools from './js/tools.js';

/* Declaracion principal */
const mainPath = 'https://vanoyen.com.ar/'; // ruta principal de carga
const path = mainPath + 'api/fotos/'; // ruta fotos.
const myOffcanvasMenu = $("#offCanvasMenu");
const menu = new bootstrap.Offcanvas(myOffcanvasMenu);
const myOffcanvasCart = $("#offCanvasCart");
const canvasCart = new bootstrap.Offcanvas(myOffcanvasCart);
/* Almacena solo los productos de la sección temporalmente. */
let pageProducts;
let temporalPrices;

/* Banner Principal */
function mostrarBanner(estado = true){
    (estado)?$('.categoryHolder').classList.remove('d-none'):$('.categoryHolder').classList.add('d-none');
}
function validarBanner(param){
    (param != 'new')?mostrarBanner(false):mostrarBanner(true);
}

/* Productos */

async function getSeccionProductos(param = 'new') {
    Loading.show("#loading");
    try {
        await fetch(`${mainPath}${param}`)
        .then(response => response.json())
        .then(result => {
            crearProductos(result);
            validarBanner(param);
            Loading.hide("#loading");
        })
    } catch(error) {
        console.error(error);
        tools.changeInnerHtml('productsContainer', '<p class="vh-100 w-100 text-center">Lo sentimos, no hay productos para mostrar.</p>');
        Loading.hide("#loading");
    }
}

async function getProductosCarrito(prods) {
    let data = {ids: prods};
    Loading.show("#loading");
    try {
        const res = await fetch(`${mainPath}seleccionados`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        Loading.hide("#loading")
        return res;
    } catch(error) {
        console.error(error);
        Loading.hide("#loading");
    }
}

function crearProductos(productos){
    if(Array.isArray(productos)){
        let productosHtml = ''; // Vacia el contenedor
        pageProducts = productos.map((item)=>{
            // Adapta las propiedades para uso en la vista
            item.foto = path+item.foto;
            item.precio = tools.entero(item.precio);
            // Solicito la vista del protucto
            productosHtml += VistaProducto.getItem(item);
            return item;
        });
        tools.changeInnerHtml('productsContainer', productosHtml);
    }
}
async function escribirProducto(item){
    // Completa los datos del producto en la ventana modal.
    tools.changeInnerHtml('modalAddToCart', VistaProducto.getModal(item));
}

/* Modales del carrito */
const prodModal = new bootstrap.Modal(document.getElementById('modalAddToCart'), {
    keyboard: false
});
const finalModal = new bootstrap.Modal(document.getElementById('modalCompra'), {
    keyboard: false
});
  


async function openModalAddToCart(id){
    Loading.show("#loading");
    try {
        let prodId = pageProducts.findIndex(e => e.id == id);
        if(prodId != -1){
            await escribirProducto(pageProducts[prodId]).then(()=>{
                prodModal.show();
                Loading.hide("#loading");
            });
        }else{
            throw "Producto no encontrado";
        }
    } catch(error) {
        console.error(error);
        Loading.hide("#loading");
    }
}

function showCanvasCart(){
    if(cart.hasItems()){
        getProductosCarrito(cart.getIds())
        .then(response => response.json())
        .then(result => {
            if(cart.calcTotal(result)){
                fillCanvasCart(result);
            }else{
                cleanCanvasCart();
            }
        })
        .then(() => {
            canvasCart.show();
        });
    }else{
        cleanCanvasCart();
        canvasCart.show();
    }    
}
function fillCanvasCart(items){
    temporalPrices = items;
    let elements = '';
    items.forEach(prod =>{
        prod['precio'] = tools.entero(prod['precio']);
        prod['foto'] = path+prod['foto'];
        const cantidad = cart.getItemCant(prod.id);
        const subtotal = cantidad * prod['precio'];
        elements += VistaCarrito.items(prod, cantidad, subtotal);
    });
    $('#cartPreview').innerHTML = VistaCarrito.cartContainer();
    $('#cartPreview .cartItemsContainer').innerHTML = elements;
    $('#cartPreview .footerContainer').innerHTML =  VistaCarrito.footer(cart.getTotal(items));
}
function cleanCanvasCart(){
    tools.changeInnerHtml("cartPreview", VistaCarrito.clean());
}

// Funciones del nav.
function setActiveSection(seccion){
    tools.all('.btnCallSection').forEach(item => {item.classList.remove('active')});
    seccion.classList.add('active');
}

//Funciones del footer
function sendFormNews(){
    const email = $('.inpFormNews').value;
    if(tools.isEmail(email)){
        formNewsAlerts('alert-success', 'Muchas gracias por suscribirte!' );
        $('.inpFormNews').value = '';
    }else{
        formNewsAlerts('alert-warning', 'Por favor, revisa el email ingresado.' );
    }
}
function formNewsAlerts(estado, mensaje){
    $('.alertsFormNews').innerHTML = mensaje;
    $('.alertsFormNews').classList.add(estado);
    $('.alertsFormNews').classList.remove('d-none');
    window.setInterval(formNewsHide, 3500, estado);
}
function formNewsHide(estado){
    $('.alertsFormNews').classList.add('d-none');
    $('.alertsFormNews').classList.remove(estado);
}

/* Listeners y clicks */
tools.all('.btnCallSection').forEach(btn => {
  btn.addEventListener('click', function handleClick(e) {
    e.preventDefault();
    getSeccionProductos(this.getAttribute("href"));
    setActiveSection(e.target);
  });
});

$(".btnCartPreview").onclick = () => {showCanvasCart()};

$("#productos").addEventListener('click', function (e){
    if(e.target.parentNode.className.search('itemProducto') != -1){
        openModalAddToCart(e.target.parentNode.dataset.id);
    }
});
$("#modalAddToCart").addEventListener('click', function (e){
    const element = e.target.closest('.addToCart');
    if(element != null){
        let id = element.dataset.id;
        Loading.show("#modalAddToCartLoading");
        cart.agregarProducto(id);
        refreshIconCart();
        Loading.hide("#modalAddToCartLoading");
        prodModal.hide();
        showCanvasCart();
    }
});
$("#cartPreview").addEventListener('click', function (e){
    if(e.target.closest('.cartItem') != -1){
        const cartItem = e.target.closest('.cartItem');
        if(e.target.closest('.trash') !== null){
            if (cart.quitarProducto(cartItem.dataset.id)) cartItem.remove();
            if (cart.hasItems() === false){
                cleanCanvasCart();
                refreshIconCart();
            }else{
                $('.granTotal').innerHTML = '$'+cart.granTotal(temporalPrices);
            }
        }
        if(e.target.closest('.sumar') !== null){
            let cantidad = cart.sumarProducto(cartItem.dataset.id);
            cartItem.querySelector('.cantidad').innerHTML = cantidad;
            cartItem.querySelector('.subto').innerHTML = '$'+refreshPrices(cantidad, cartItem.dataset.precio);
        }
        if(e.target.closest('.restar') !== null){
            let cantidad = cart.restarProducto(cartItem.dataset.id);
            cartItem.querySelector('.cantidad').innerHTML = cantidad;
            cartItem.querySelector('.subto').innerHTML = '$'+refreshPrices(cantidad, cartItem.dataset.precio);
        }
    }
    if(e.target.closest('.finalCompra') !== null){
        cart.checkout();
        canvasCart.hide();
        finalModal.show();
    }
});

$(".sendFormNews").onclick = () => {sendFormNews()};
$(".btnReiniciar").onclick = () => {location.reload()};

/* Menu Mobile */
$(".myToggle").onclick = () =>{menu.show()};

/* Inicializo objetos*/
const cart = new Carrito();

/* Funciones del sitio basadas en objetos */
function refreshIconCart(){
    (cart.hasItems())?$(".accesos .cart").classList.add('fill'):$(".accesos .cart").classList.remove('fill');
}
function refreshPrices(cantidad, precio){
    $('.granTotal').innerHTML = '$'+cart.granTotal(temporalPrices);
    return tools.entero(cantidad * precio);
}
refreshIconCart();
getSeccionProductos();