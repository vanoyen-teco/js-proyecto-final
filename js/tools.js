export default (query)=>{ return document.querySelector(query) }

export function all (query){
    return document.querySelectorAll(query);
}

export function changeInnerHtml(id, datos){
    document.getElementById(`${id}`).innerHTML = datos;   
}

export function entero(x){
	return Number.parseFloat(x).toFixed();
}

export function isEmail(email) {
    const regex = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
}