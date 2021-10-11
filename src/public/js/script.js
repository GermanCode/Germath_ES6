var restrictionsinput = 1;
var arrayrestrictionsinput = [];

function mostrarPanelRestricciones() {
  document.querySelector('footer').style.visibility = 'hidden';
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

function llenarHidden() {
  var izq = document.getElementById("inputLadoIzq").value;
  var der = document.getElementById("inputLadoDer").value;
  var sig = document.getElementById("signo").value;
  var equa = document.getElementById("restriccionCompleta").value += izq + sig + der;

  var padre = document.getElementById("restric");
  var input = document.createElement("INPUT");
  input.type = 'text';
  input.name = 'restrict' + restrictionsinput;
  input.id = 'restrict' + restrictionsinput;
  input.style = "margin-top: 5px";
  input.readOnly = true;

  padre.appendChild(input);
  document.getElementById("restrict" + restrictionsinput).value = equa;
  arrayrestrictionsinput.push(equa);
  document.getElementById("restrictionsinput").value = "";
  document.getElementById("restrictionsinput").value = restrictionsinput;
  document.getElementById("arrayrestrictionsinput").value = arrayrestrictionsinput;
  restrictionsinput = restrictionsinput + 1;
  document.getElementById("inputLadoIzq").value = "";
  document.getElementById("inputLadoDer").value = "";
  document.getElementById("restriccionCompleta").value = "";
  signo.selectedIndex = 0;
};

function eliminarRestriccion() {
  var elem = document.getElementById("restrict" + (restrictionsinput - 1));
  elem.parentNode.removeChild(elem);
};

function pr() {
  arrayrestrictionsinput = [];
}


function loading() {
  var contenedor = document.getElementById('cont_carga');
  contenedor.style.display = 'block';
  var inputs = document.getElementById("formOptimization").elements;

  for (i = 0; i < inputs.length; i++) {
    if (inputs[i].type === "text") {
      inputs[i].setAttribute("readonly", "");
    }
  }
}

function alerta(){
  let a = confirm('¿Desea descargar el archivo?');
  if ( a == true){
    var element = document.getElementById('uno');
    var opt = {
      margin:       3,
      filename:     'result_GerMathJS.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 3, letterRendering: true },
      jsPDF:        { unit: 'cm', format: 'a5', orientation: 'landscape', pagesplit: false }
    }; 
    // New Promise-based usage:
    html2pdf(element, opt);
}
}

function mostrarExportar(){
  document.getElementById('allpage').style.display = 'none';
  document.getElementById('exportar').style.display = 'block'
}

function ocultarExportar(){
  document.getElementById('allpage').style.display = 'block';
  document.getElementById('exportar').style.display = 'none';
}

function llenarEst() {
  var est = document.getElementById("selectEstado");
  var idest = est.value;
  alert('¿Esta seguro de realizar esta acción?');
  document.getElementById("hiddenEst").value = idest;
};

function llenarRol() {
  var rol = document.getElementById("selectRol");
  var idrol = rol.value;
  alert('¿Esta seguro de realizar esta acción?');
  document.getElementById("hiddenRol").value = idrol;
};

function alerta2(){
  alert("Click en Aceptar para desactivar el Usuario.");
};  