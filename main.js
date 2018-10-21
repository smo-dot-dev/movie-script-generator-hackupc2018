var datosBusqueda;
var datosMarkov;

/* Animate.css extension*/
$.fn.extend({
  animateCss: function(animationName, callback) {
    var animationEnd = (function(el) {
      var animations = {
        animation: 'animationend',
        OAnimation: 'oAnimationEnd',
        MozAnimation: 'mozAnimationEnd',
        WebkitAnimation: 'webkitAnimationEnd',
      };
      for (var t in animations) {
        if (el.style[t] !== undefined) {
          return animations[t];
        }
      }
    })(document.createElement('div'));
    this.addClass('animated ' + animationName).one(animationEnd, function() {
      $(this).removeClass('animated ' + animationName);

      if (typeof callback === 'function') callback();
    });

    return this;
  },
});

/*Another helper function for the intervals*/
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

//Devuelve JSON de resultados, dado un texto de busqueda
function pillarDatosBusqueda(url, callback) {
  axios.post('getPostedUrl_xml.php', {
      enlace: url,
    })
    .then(function (response) {
      datosBusqueda = response.data;
      console.log(response.data);
      callback();
    })
    .catch(function (error) {
      console.log(error);
    });
}

//Enviamos enlace de subtitulos, servidor los descarga, y devuleve texto de markov generado
function pillarDatosMarkov(url_subtitulos, callback) {
  axios.post('getPostedMarkov.php', {
      enlace: url_subtitulos,
    })
    .then(function (response) {
      datosMarkov = response.data;
      callback();
    })
    .catch(function (error) {
      console.log(error);
    });
}

//Actualiza el HTML para mostrar los resultados
function mostrarTablaResultados() {
  console.log(datosBusqueda);
  $("taulaResultat").show();
  document.getElementById("taulaResultat").innerHTML = "<table class=\"table table-condensed\"> <thead> <tr> <th>Film Name</th> <th>Select Film</th> </tr> </thead> <tbody id=\"filaResultat\">";
  for (var i = 0 ; i < datosBusqueda.items.item.length ;i++)
  {
    document.getElementById("filaResultat").innerHTML += "<tr class=\"fila-resultat\"> <td> <p>  "+ datosBusqueda.items.item[i].filename +"</p> </td> <td> <button class=\" btn btn-dark  \" value=\"" + i + "\" id=\"btn_peli\">Seleccionar</button> </td> </tr>";
  }
  document.getElementById("taulaResultat").innerHTML += "</tbody> </table>";
  $('#taulaResultat').animateCss('fadeInUp');
}

function mostrarMarkov(){
  document.getElementById("taulaResultat").innerHTML = "";
  document.getElementById("txt_buscar").innerHTML ="";
  document.body.innerHTML += "<center><p>"+datosMarkov+"</p></center><input type=\"button\" value=\"Return\" onClick=\"window.location.reload()\">";
  
  console.log(datosMarkov);
}


function curarEnlaceSubtitulos(enlace){
  var temp = "";
  for (let i = 0; i < enlace.split('/').length; i++) {
    if (i == 0) {
      temp += enlace.split('/')[i] + '//';
    }else if (i >= 2 && i <= 4) {
      temp += enlace.split('/')[i] + '/';
    }else if (i == 5){
      temp += 'download-subtitle/'+ enlace.split('/')[i];
    }
  }
  return temp;
}

//Construye el enlace de busqueda segun idioma
function curarEnlaceBusqueda(busqueda){
  return "http://subsmax.com/api/50/" + busqueda;
}

$(document).ready(function() {
  $("#btn_buscar").click(function (event) {
    event.preventDefault();
    pillarDatosBusqueda(curarEnlaceBusqueda(document.getElementById("txt_buscar").value.toLowerCase().split(' ').join('-')), mostrarTablaResultados)
  });
  //Al clickar en una peli, cogemos
  $(document).on("click", "#btn_peli", function(event){
    event.preventDefault();
    //Pillamos el enlace que corresponde al elemento del JSON con el mismo indice que btn_peli.value
    //Lo convertimos en enlace de descarga
    pillarDatosMarkov(curarEnlaceSubtitulos(datosBusqueda.items.item[$(this).val()].link), mostrarMarkov);
  });
});