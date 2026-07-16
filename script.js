//aside section 
const AddFormBtn = document.querySelector("#add-form-btn");
const UpdateFormBtn = document.querySelector("#update-form-btn")

//form
const  AddNewProductForm  = document.querySelector("#add-new-product-form");
const  UpdateProductForm  = document.querySelector("#update-product-form");

const ProductTitle = document.querySelector("#product-title");


//main
const ProductCount = document.querySelector("#product-count");
const ClearCache = document.querySelector('#clear-cache');
const ProductTableBody = document.querySelector("#table-body");





const titleReg = /^[A-Za-z\d].{0,50}$/;    
const priceReg = /^[\d]+([.][\d]+){0,1}$/;
const stockReg = /^[\d]+$/;
const skuReg = /^([A-Z]+[-])+[\d]{3}$/




const showUpdatedList = ()=>{
    const productList = JSON.parse(localStorage.getItem('productList'));
    console.log("Showing product list from local storage ",productList  );
    ProductTableBody.innerHTML = "";
    productList !== null && productList.length>0 && productList.forEach(item => {
        const Row = document.createElement("tr");
        Row.innerHTML =`
            <td class="table-cell-5">${item.id}</td>
            <td class="title">${item.title}</td>
            <td class="price">${item.price}</td>
            <td class="table-cell-15">${item.stock}</td>
            <td class="table-cell-15">${item.sku}</td>
            <td class="table-cell-20">
                <button onClick="deleteFromListHandler(event)" class="delete-btn" value="${item.id}">❌ Delete</button>
                <button onClick="updateFromListHandler(event)" value="${item.id}">✏️ Edit</button>
            </td>
        `
        ProductTableBody.appendChild(Row);
    });
    if(productList === null ||productList.length === 0 ){
        const Row = document.createElement("tr");
        Row.innerHTML =`<td colspan=6 style="height: 50vh;  text-align: center;"
                            >No data add product or refresh page to get data 
                        </td>`
        console.log("here");
        ProductTableBody.appendChild(Row);
    }
    //for displaying total item at main 
    ProductCount.textContent = `${productList === null ?0: productList.length} items` 

    // for update form selction 
    ProductTitle.innerHTML = "";
    const titleList = productList === null ?[]: productList.map((item)=>item.title);
    titleList.unshift("None");

    console.log(titleList); 
    titleList.forEach(title=>{
        const option = document.createElement("option");
        option.value = title;
        option.innerText = title;
        ProductTitle.appendChild(option);
    });
 
}

const fetchProducts = async ()=>{
    if(JSON.parse(localStorage.getItem('productList')) !== null && JSON.parse(localStorage.getItem('productList')).length !== 0){
        console.log("data is already present");
        showUpdatedList();
        return;
    }
    console.log("fetching data...");
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
    console.log("clicked add button");
    AddFormBtn.classList.remove('deactive-button');
    AddFormBtn.classList.add('active-button');
    UpdateFormBtn.classList.add('deactive-button');
    UpdateFormBtn.classList.remove('active-button');
    AddNewProductForm.classList.remove('hidden');
    UpdateProductForm.classList.add('hidden');
    

}
const updateHandler = ()=>{
    console.log("clicked update button");
    AddFormBtn.classList.add('deactive-button');
    AddFormBtn.classList.remove('active-button');
    UpdateFormBtn.classList.remove('deactive-button');
    UpdateFormBtn.classList.add('active-button');
    AddNewProductForm.classList.add('hidden');
    UpdateProductForm.classList.remove('hidden');
    
}
const ClearCacheHandler = ()=>{
    localStorage.removeItem('productList');
    console.log("removed the cache",JSON.parse(localStorage.getItem('productList')));
    showUpdatedList();
}
const deleteFromListHandler =(event)=>{
    const id =  Number(event.target.value);
    const productList = JSON.parse(localStorage.getItem('productList'));
    console.log("here",productList)
    console.log(typeof(id))
    const newProductList = productList.filter((item)=>item.id !== id);
    console.log("new",newProductList)
    localStorage.setItem("productList",JSON.stringify(newProductList));
    showUpdatedList();
}
const updateFromListHandler=(event)=>{
    console.log(event.target.value);
    updateHandler();
    const selectedProduct = JSON.parse(localStorage.getItem('productList')).find((item)=>item.id === Number(event.target.value));
    console.log(selectedProduct);
    const [ProductTitle,Title,Price,Stock,Sku] = Array.from(UpdateProductForm.children).filter(item => item.id ==="product-title" || item.id === "update-title"  || item.id ==="update-price" || item.id  ==="update-stock" || item.id === "update-sku")
    console.log(Title,Price,Stock,Sku);
    ProductTitle.value = selectedProduct.title;
    Title.value = selectedProduct.title;
    Price.value = selectedProduct.price;
    Stock.value = selectedProduct.stock;
    Sku.value = selectedProduct.sku;
    UpdateProductForm.classList.add("aniamtion-class");
    setTimeout(()=> UpdateProductForm.classList.remove("aniamtion-class"),500);
}


const addProductHandler= (e)=>{
    e.preventDefault();
    const productList = JSON.parse(localStorage.getItem('productList'))??[];

    const [Title, Price, Stock, Sku] = Array.from(AddNewProductForm.children).filter(item => item.id === "title"  || item.id ==="price" || item.id  ==="stock" || item.id === "sku");
    console.log(Title.value,Price.value,Sku.value,Stock.value);
    console.log(titleReg.test(Title.value) &&  priceReg.test(Price.value) && stockReg.test(Stock.value) && skuReg.test(Sku.value));
    if(!(titleReg.test(Title.value) &&  priceReg.test(Price.value) && stockReg.test(Stock.value) && skuReg.test(Sku.value))){
        alert('please make sure you enter all values, no negative value allowed, title length<40 and follow the examples');
        
    }else if(productList.find(item=>item.sku === Sku.value)){
        alert("sku can not have same value");
    }else{
        console.log("value is here",1+(productList[productList.length-1]?.id??0) ,typeof(productList[productList.length-1]?.id??0));
        const newItem = {id:1+(productList[productList.length-1]?.id??0),title:Title.value,price:Price.value,stock:Stock.value,sku:Sku.value };
        productList.push(newItem);
        localStorage.removeItem('productList');
        localStorage.setItem('productList',JSON.stringify(productList));
        showUpdatedList();
        Title.value = "";
        Price.value = ""; 
        Stock.value = "";
        Sku.value = "";
        console.log(titleReg.test(Title.value));
        console.log(priceReg.test(Price.value));
        console.log(stockReg.test(Stock.value));
        console.log(stockReg.test(Sku.value));
    }
    
}

const productUpdateByTitleHandler = (e)=>{
    const selectedProduct = JSON.parse(localStorage.getItem('productList')).find((item)=>item.title === e.target.value);
    const [Title,Price,Stock,Sku] = Array.from(UpdateProductForm.children).filter(item => item.id === "update-title"  || item.id ==="update-price" || item.id  ==="update-stock" || item.id === "update-sku")
    Title.value = selectedProduct.title;
    Price.value = selectedProduct.price;
    Stock.value = selectedProduct.stock;
    Sku.value = selectedProduct.sku;
}

const updateProductHandler=(e)=>{
    e.preventDefault();
    const productList = JSON.parse(localStorage.getItem('productList'));
    const [Title,Price,Stock,Sku] = Array.from(UpdateProductForm.children).filter(item => item.id === "update-title"  || item.id ==="update-price" || item.id  ==="update-stock" || item.id === "update-sku")
    console.log("here",titleReg.test(Title.value) ,  priceReg.test(Price.value) , stockReg.test(Stock.value) ,skuReg.test(Sku.value));
    if(!(titleReg.test(Title.value) &&  priceReg.test(Price.value) && stockReg.test(Stock.value) && skuReg.test(Sku.value))){
        alert('please make sure you enter all values, no negative value allowed, title length<40 and follow the examples');
    }
    else{
        const newProductList=productList.map(item=>item.sku === Sku.value?{...item,title:Title.value,price:Price.value,stock:Stock.value,sku:Sku.value}:item);
        console.log("here", newProductList.filter(item=>item.sku === Sku.value).length >1);
        if(newProductList.filter(item=>item.sku === Sku.value).length >1){
            alert("we can't have two same sku value aborting update");
            return;
        }
        localStorage.removeItem('productList');
        localStorage.setItem('productList',JSON.stringify(newProductList));
        Title.value = "";
        Price.value = ""; 
        Stock.value = "";
        Sku.value = "";
        showUpdatedList();
    }
}


//form
AddFormBtn.addEventListener("click",()=>addHandler());
UpdateFormBtn.addEventListener("click",()=>updateHandler());


AddNewProductForm.addEventListener("submit",(e)=>addProductHandler(e));

ProductTitle.addEventListener("change",(e)=>productUpdateByTitleHandler(e))
UpdateProductForm.addEventListener("submit",(e)=>updateProductHandler(e));



//main top
ClearCache.addEventListener("click", ()=>ClearCacheHandler());
