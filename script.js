//aside section 
const addFormBtn = document.querySelector("#add-form-btn");
const updateFormBtn = document.querySelector("#update-form-btn")

//form
const  addNewProductForm  = document.querySelector("#add-new-product-form");
const  updateProductForm  = document.querySelector("#update-product-form");

const productTitle = document.querySelector("#product-title");


//main
const productCount = document.querySelector("#product-count");
const clearCache = document.querySelector('#clear-cache');
const productTableBody = document.querySelector("#table-body");





const titleReg = /^[A-Za-z\d].{0,50}$/;    
const priceReg = /^[\d]+([.][\d]+){0,1}$/;
const stockReg = /^[\d]+$/;
const skuReg = /^([A-Z]+[-])+[\d]{3}$/




const showUpdatedList = ()=>{
    const productList = JSON.parse(localStorage.getItem('productList'))??[];
    productTableBody.innerHTML = "";
    productList !== null && productList.length>0 && productList.forEach((item ,index)=> {
        const Row = document.createElement("tr");
        Row.innerHTML =`
            <td class="table-cell-5">${index +1}</td>
            <td class="title">${item.title}</td>
            <td class="price">${item.price}</td>
            <td class="table-cell-15">${item.stock}</td>
            <td class="table-cell-20">${item.sku}</td>
            <td class="table-cell-20">
                <button onClick="deleteFromListHandler(event)" class="delete-btn" value="${item.id}">
                    <img src="Asset/svg/delete.svg" alt="delete-img" >
                </button>
                <button onClick="updateFromListHandler(event)" value="${item.id}">
                    <img src="Asset/svg/edit.svg" alt="edit-img" >
                </button>
            </td>
        `
        productTableBody.appendChild(Row);
    });
    if(productList === null ||productList.length === 0 ){
        const Row = document.createElement("tr");
        Row.innerHTML =`<td colspan=6 style="height: 50vh;  text-align: center;"
                            >No data add product or refresh page to get data 
                        </td>`
        productTableBody.appendChild(Row);
    }
    //for displaying total item at main 
    productCount.textContent = `${productList === null ?0: productList.length} items` 

    // for update form selction 
    productTitle.innerHTML = "";
    const titleList = productList === null ?[]: productList.map((item)=>item.title);
    titleList.unshift("None");

    titleList.forEach(title=>{
        const option = document.createElement("option");
        option.value = title;
        option.innerText = title;
        productTitle.appendChild(option);
    });
 
}

const fetchProducts = async ()=>{
    if(JSON.parse(localStorage.getItem('productList')) !== null && JSON.parse(localStorage.getItem('productList')).length !== 0){
        showUpdatedList();
        return;
    }
    try {
        const response = await fetch('https://dummyjson.com/products') ;
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }
        const data = await response.json();
        const productList = data.products;
        localStorage.setItem('productList',JSON.stringify(productList));
        
        showUpdatedList();
    } catch (e) {
        console.error(e);
    }
}
fetchProducts();



const addHandler = ()=>{
    addFormBtn.classList.remove('deactive-button');
    addFormBtn.classList.add('active-button');
    updateFormBtn.classList.add('deactive-button');
    updateFormBtn.classList.remove('active-button');
    addNewProductForm.classList.remove('hidden');
    updateProductForm.classList.add('hidden');
    

}
const updateHandler = ()=>{
    addFormBtn.classList.add('deactive-button');
    addFormBtn.classList.remove('active-button');
    updateFormBtn.classList.remove('deactive-button');
    updateFormBtn.classList.add('active-button');
    addNewProductForm.classList.add('hidden');
    updateProductForm.classList.remove('hidden');
    
}
const clearCacheHandler = ()=>{
    localStorage.removeItem('productList');
    showUpdatedList();
}
const deleteFromListHandler =(event)=>{
    const userConformation  = confirm("Are you sure ?");
    if(!userConformation){
        return;
    }
    const id =  Number(event.target.value);
    const productList = JSON.parse(localStorage.getItem('productList'))??[];
    const newProductList = productList.filter((item)=>item.id !== id);
    localStorage.setItem("productList",JSON.stringify(newProductList));
    showUpdatedList();
}
const updateFromListHandler=(event)=>{
    updateHandler();
    const selectedProduct = JSON.parse(localStorage.getItem('productList')).find((item)=>item.id === Number(event.target.value))??false;
    if(!selectedProduct){
        alert("some internal error ");
        return;
    }
    const [productTitle,title,price,stock,sku] = Array.from(updateProductForm.children).filter(item => item.id ==="product-title" || item.id === "update-title"  || item.id ==="update-price" || item.id  ==="update-stock" || item.id === "update-sku")
    productTitle.value = selectedProduct.title;
    title.value = selectedProduct.title;
    price.value = selectedProduct.price;
    stock.value = selectedProduct.stock;
    sku.value = selectedProduct.sku;
    updateProductForm.classList.add("aniamtion-class");
    setTimeout(()=> updateProductForm.classList.remove("aniamtion-class"),500);
}


const addProductHandler= (e)=>{
    e.preventDefault();
    const productList = JSON.parse(localStorage.getItem('productList'))??[];

    const [title, price, stock, sku] = Array.from(addNewProductForm.children).filter(item => item.id === "title"  || item.id ==="price" || item.id  ==="stock" || item.id === "sku");
    if(!(titleReg.test(title.value) &&  priceReg.test(price.value) && stockReg.test(stock.value) && skuReg.test(sku.value))){
        if(!titleReg.test(title.value)){
            alert("Title lenght must be between 0 to 50, first character can only be a number or a letter.");
        } 
        if (!priceReg.test(price.value)){
            alert("Valid price are in formate 1 or 1.0 or 34.00 or so on.");
        }
        if(! stockReg.test(stock.value)){
            alert("Stock shoud be positive and no decimal allowed.");
        }
        if(!skuReg.test(sku.value)){
            alert("Make sure SKU value follow the formate APL-001 or APL-ABC-000 and so on.");
        }        
    }else if(productList.find(item=>item.sku === sku.value)){
        alert("sku can not have same value");
    }else{
        const newItem = {id:1+(productList[productList.length-1]?.id??0),title:title.value,price:price.value,stock:stock.value,sku:sku.value };
        productList.push(newItem);
        localStorage.removeItem('productList');
        localStorage.setItem('productList',JSON.stringify(productList));
        showUpdatedList();
        title.value = "";
        price.value = ""; 
        stock.value = "";
        sku.value = "";
        
    }
    
}

const productUpdateByTitleHandler = (e)=>{
    const selectedProduct = JSON.parse(localStorage.getItem('productList')).find((item)=>item.title === e.target.value)??false;
    if(!selectedProduct){
        alert("Some Internal Error");
        return ; 
    }
    const [title,price,stock,sku] = Array.from(updateProductForm.children).filter(item => item.id === "update-title"  || item.id ==="update-price" || item.id  ==="update-stock" || item.id === "update-sku")
    title.value = selectedProduct.title;
    price.value = selectedProduct.price;
    stock.value = selectedProduct.stock;
    sku.value = selectedProduct.sku;
}

const updateProductHandler=(e)=>{
    e.preventDefault();
    const productList = JSON.parse(localStorage.getItem('productList'))??[];
    const [title,price,stock,sku] = Array.from(updateProductForm.children).filter(item => item.id === "update-title"  || item.id ==="update-price" || item.id  ==="update-stock" || item.id === "update-sku")
    if(!(titleReg.test(title.value) &&  priceReg.test(price.value) && stockReg.test(stock.value) && skuReg.test(sku.value))){
        if(!titleReg.test(title.value)){
            alert("Title lenght must be between 0 to 50, first character can only be a number or a letter.");
        } 
        if (!priceReg.test(price.value)){
            alert("Valid price are in formate 1 or 1.0 or 34.00 or so on.");
        }
        if(! stockReg.test(stock.value)){
            alert("Stock shoud be positive and no decimal allowed.");
        }
        if(!skuReg.test(sku.value)){
            alert("Make sure SKU value follow the formate APL-001 or APL-ABC-000 and so on.");
        }
    }
    else{
        const newProductList=productList.map(item=>item.sku === sku.value?{...item,title:title.value,price:price.value,stock:stock.value,sku:sku.value}:item);
        if(newProductList.filter(item=>item.sku === sku.value).length >1){
            alert("we can't have two same sku value aborting update");
            return;
        }
        localStorage.removeItem('productList');
        localStorage.setItem('productList',JSON.stringify(newProductList));
        title.value = "";
        price.value = ""; 
        stock.value = "";
        sku.value = "";
        showUpdatedList();
    }
}


//form
addFormBtn.addEventListener("click",()=>addHandler());
updateFormBtn.addEventListener("click",()=>updateHandler());


addNewProductForm.addEventListener("submit",(e)=>addProductHandler(e));

productTitle.addEventListener("change",(e)=>productUpdateByTitleHandler(e))
updateProductForm.addEventListener("submit",(e)=>updateProductHandler(e));



//main top
clearCache.addEventListener("click", ()=>clearCacheHandler());
