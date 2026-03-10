let task=document.querySelector(".form-control");
let add=document.querySelector(".btn-primary");
let list=document.getElementById("list");
let form = document.querySelector("form");
let delBtn=document.createElement("button");

form.addEventListener("submit",(event)=>{
    event.preventDefault()
    delBtn.innerText="delete";
    let text=document.createElement("li");
    text.innerText=task.value;
    text.append(delBtn);
    list.append(text);
    delBtn.addEventListener("click", () => {
    text.remove();
});
});
