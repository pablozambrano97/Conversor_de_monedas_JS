// constantes
const input=document.getElementById("input_valor");
const select=document.getElementById("select_moneda");
const resultado=document.getElementById("resultado");
const ctx = document.getElementById('myChart');
const boton=document.getElementById("boton_convertir");
let html="<option value='selected' >Seleccione</option>";
let indicador_grafica=null;
let ultimo_valor=null;
let fechas=[];
let valores=[];
let myChart;
function renderizar_divisas(divisa){
    let nombre_divisa=Object.keys(divisa);
    nombre_divisa.splice(0,3);
    nombre_divisa.forEach(moneda=>{
        html+=`<option value="${moneda}">${moneda}</option>`;
    });
    select.innerHTML=html;
};

async function request_api(){
try {
    const endpoint= await fetch("https://mindicador.cl/api");
    const res= await endpoint.json();
    await renderizar_divisas(res);
} catch (error) {
    alert(error.message);
}
};
boton.addEventListener("click",async (Event)=>{
    if(select.value==='selected'){
        alert("Debes seleccionar una divisa");
    }else if(input.value>0 && input.value!== ""){
        let monto=parseInt(input.value);
        let resultado_final=(monto/ultimo_valor).toFixed(2);
        resultado.innerHTML=`$ ${resultado_final}`;
        renderizar_grafica();
        input.value="";
    }else{
        alert("Debes ingresar un monto");
        input.focus();
    }
});

async function ultimos10Valores(moneda){
    try {
        const indicador=await fetch (`https://mindicador.cl/api/${moneda}`);
        const data=await indicador.json();
        indicador_grafica= await data.serie.slice(0,10).reverse();
        ultimo_valor=Number(parseInt(indicador_grafica[indicador_grafica.length-1]['valor']));
        fechas=[];
        valores=[];
        indicador_grafica.forEach(elemento=>{
            fechas.push(elemento.fecha);
            valores.push(parseInt(elemento.valor));
        });
        for(let i=0; i<fechas.length;i++){
            fechas[i]=fechas[i].slice(0,10).split("-").reverse().join("-");
        }
    } catch (error) {
        alert(error.message);
    }
};
select.addEventListener("change", (Event)=>{
    let moneda= select.value;
    let valores= ultimos10Valores(moneda);
});

function renderizar_grafica(){
        if (myChart) {
            myChart.destroy();
        }
        myChart =new Chart(ctx, {
    type: 'line',
    data: {
    labels: fechas,
    datasets: [{
        label: 'Historial de precios',
        data: valores,
        borderWidth: 1
    }]
    }
    });
}
request_api();