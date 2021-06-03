$('#body-row .collapse').collapse('hide'); 

// Collapse/Expand icon
$('#collapse-icon').addClass('fa-angle-double-left'); 

// Collapse click
$('[data-toggle=sidebar-colapse]').click(function() {
    SidebarCollapse();
});

function SidebarCollapse () {
    $('.menu-collapsed').toggleClass('d-none');
    $('.sidebar-submenu').toggleClass('d-none');
    $('.submenu-icon').toggleClass('d-none');
    $('#sidebar-container').toggleClass('sidebar-expanded sidebar-collapsed');
    
    // Treating d-flex/d-none on separators with title
    var SeparatorTitle = $('.sidebar-separator-title');
    if ( SeparatorTitle.hasClass('d-flex') ) {
        SeparatorTitle.removeClass('d-flex');
    } else {
        SeparatorTitle.addClass('d-flex');
    }
    
    // Collapse/Expand icon
    $('#collapse-icon').toggleClass('fa-angle-double-left fa-angle-double-right');
}

function mostrarPanelRestricciones() {
    element = document.getElementById("content");
    check = document.getElementById("check");
    if (check.checked) {
        element.style.display = 'block';
    } else {
        element.style.display = 'none';
    }
};

function selectSignoParaFuncion() {
    var cod = document.getElementById("signo").value;
    return cod;
};
var ri = 1;
var ari = [];
function llenarHidden(){

    var izq = document.getElementById("inputLadoIzq").value;
    var der = document.getElementById("inputLadoDer").value;
    var sig = document.getElementById("signo").value;
    var equa = document.getElementById("restriccionCompleta").value += izq + sig + der;

    var padre = document.getElementById("restric");
    var input = document.createElement("INPUT");         
    input.type = 'text';
    input.name ='restrict'+ri;
    input.id ='restrict'+ri;
    input.style = "margin-top: 5px";

    padre.appendChild(input);
    document.getElementById ("restrict"+ri).value = equa;
    ari.push(equa);
    document.getElementById("ri").value = "";
    document.getElementById("ri").value = ri;
    document.getElementById("ari").value = ari;
    ri = ri+1;
    document.getElementById("inputLadoIzq").value="";
    document.getElementById("inputLadoDer").value="";
    document.getElementById("restriccionCompleta").value = "";
    signo.selectedIndex = 0;
};

function eliminarRestriccion(){
    var elem = document.getElementById("restrict"+(ri-1));
    elem.parentNode.removeChild(elem);
};

function alerta(){
    var mensaje;
    var opcion = confirm("Clicka en Aceptar o Cancelar");
    if (opcion == true) {
        mensaje = "Has clickado OK";
    } else {
        mensaje = "Has clickado Cancelar";
    }
    document.getElementById("ejemplo").innerHTML = mensaje;
};  
