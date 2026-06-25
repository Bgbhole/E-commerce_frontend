let giftCards=[];
let editIndex=null;

function addGiftCard(){

let value=document.getElementById("giftInput").value;

if(editIndex!=null){
giftCards[editIndex]=value;
editIndex=null;
}
else{
giftCards.push(value);
}

document.getElementById("giftInput").value="";
loadGiftCards();

}

function loadGiftCards(){

let html="";

giftCards.forEach((gift,index)=>{

html+=`
<div class="card">

<h3>${gift}</h3>

<button onclick="editGiftCard(${index})">
Edit
</button>

<button onclick="deleteGiftCard(${index})">
Delete
</button>

</div>
`;

});

document.getElementById("giftList").innerHTML=html;

}

function editGiftCard(index){

document.getElementById("giftInput").value=giftCards[index];

editIndex=index;

}

function deleteGiftCard(index){

giftCards.splice(index,1);

loadGiftCards();

}