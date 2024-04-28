/* 
socketClient.on("products", (data) => {
    render(data);
});
  */
const socketClient = io();
socketClient.on("sendProducts", (object)=>{
    updateProductsList(object)

});

function updateProductsList(productList){
const productsDiv = document.getElementById("list-products");
let productsHTML = "";

productList.forEach( product => {
    productsHTML += `  <div class="border border-dark card h-100 bg-white mx-4 my-3" style="max-width:30rem">
                             <div class="card-header bg-secondary text-white">
                                 <i class="bi bi-tag"></i>Code: ${product.code}
                             </div>
                            <div class="card-body">
                                <h5 class="card-title text-black">${product.title}</h5>
                                <ul class="card-text">
                                    <li class="fw-normal"><i class="fw-bold ">  ID: </i> ${product._id}</li>
                                    <li class="fw-normal"><i class="fw-bold ">  Descripcion: </i>${product.description}</li>
                                    <li class="fw-normal"><i class="fw-bold ">  Precio: </i>$${product.price}</li>
                                    <li class="fw-normal"><i class="fw-bold ">  Categoria: </i>${product.category}</li>
                                    <li class="fw-normal"><i class="fw-bold ">  Estado: </i>${product.status}</li>
                                    <li class="fw-normal"><i class="fw-bold ">  Stock: </i>${product.stock}</li>
                                   
                                        <i class="fw-bold "> Imagen: </i> <img src="${product.thumbnail}" class="img-thumbnail img-fluid mt-2">
                                  
                                </ul>

                                <div class=d-flex justify-content-between mb-4>
                                    <button class= "btn btn-danger delete-btn p-3 mx-5" onclick="deleteProduct(${product._id})">Eliminar</button>
                                    <button class= "btn btn-warning delete-btn mx-5" onclick="updateProduct(${product._id})">Modificar</button>

                                </div>
                            </div>
                        </div>
    `
    
});
productsDiv.innerHTML = productsHTML;
}

////////agregar un producto///////////

let form = document.getElementById("formProduct");
    form.addEventListener("submit", (e) => {
    e.preventDefault();

    let title = form.elements.title.value;//esto vienen del name del formulario
    let description = form.elements.description.value;
    let stock = form.elements.stock.value;
    let thumbnail = form.elements.thumbnail.value;
    let category = form.elements.category.value;
    let price = form.elements.price.value;
    let code = form.elements.code.value;
    let status= form.elements.status.checked;

    socketClient.emit("addProduct", {
        title,
        description,
        stock,
        thumbnail,
        category,
        price,
        code,
        status
    });

form.reset();//esto es para que quede el formulario vacio

})

////////eliminar  un producto///////////
//elimino por ID
document.getElementById("delete-id-btn").addEventListener('click', function(){
    const inputTheId = document.getElementById("id-prod")//esto viene del form en realTimePrioducts.handlebars
   const deleteId = (inputTheId.value).toString();
   socketClient.emit("deleteProduct", deleteId)
   inputTheId.value = "";

  
})
//elimino por unidad
function deleteProduct(productId){
    socketClient.emit("deleteProduct", productId)
}
////////actualizar   un producto///////////
/* 
document.getElementById("update-id-btn").addEventListener('click', function(){
    const inputTheId = document.getElementById("id-prod");
    const updateId = (inputTheId.value).toString();
    // Aquí puedes agregar lógica para obtener los nuevos valores de los campos del producto que deseas actualizar
    const updatedProduct = {
        // Aquí asigna los nuevos valores de los campos del producto
        // Por ejemplo:
        name: document.getElementById("name").value,
        price: parseFloat(document.getElementById("price").value),
        // Agrega los demás campos según sea necesario
    };
    socketClient.emit("updateProduct", { id: updateId, updatedProduct });
    inputTheId.value = ""; */
/* });
 */
