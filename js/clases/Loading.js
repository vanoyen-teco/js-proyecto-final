class Loading {
  static show(element){
    const selector = document.querySelector(element);
    selector.classList.remove('d-none');
  }
  static hide(element){
    const selector = document.querySelector(element);
    selector.classList.add('d-none');
  }
}

export default Loading;