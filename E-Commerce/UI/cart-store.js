(function(){
  const KEY = 'lc_cart_items';
  function getCart(){
    try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch(e){ return []; }
  }
  function setCart(items){
    localStorage.setItem(KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent('cart-updated'));
  }
  function seedIfEmpty(){
    if(getCart().length === 0){
      setCart([
        {id:'tray-table', name:'Tray Table', color:'Black', price:19, qty:2, img:'tray-black'},
        {id:'tray-table', name:'Tray Table', color:'Red', price:19, qty:2, img:'tray-red'},
        {id:'table-lamp', name:'Table Lamp', color:'Gold', price:39, qty:1, img:'lamp-gold'}
      ]);
    }
  }
  function updateQty(id,color,qty){
    const items = getCart().map(it => (it.id===id && it.color===color) ? Object.assign({},it,{qty: Math.max(1,qty)}) : it);
    setCart(items);
  }
  function removeItem(id,color){
    setCart(getCart().filter(it => !(it.id===id && it.color===color)));
  }
  function addItem(item){
    const items = getCart();
    const existing = items.find(it=>it.id===item.id && it.color===item.color);
    if(existing){ existing.qty += item.qty||1; setCart(items); }
    else { setCart(items.concat([Object.assign({qty:1},item)])); }
  }
  function subtotal(items){ return items.reduce((s,it)=>s+it.price*it.qty,0); }
  function count(items){ return items.reduce((s,it)=>s+it.qty,0); }
  window.CartStore = {getCart,setCart,seedIfEmpty,updateQty,removeItem,addItem,subtotal,count,KEY};
})();
