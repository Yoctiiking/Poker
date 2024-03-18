//

//Initialisation d'un paquet de 52 cartes
var paquetDeCartes = new Array();

for (var i = 0; i < 52; i++) {
  paquetDeCartes[i] = new Array(0, 0);
}

for (var i = 0; i < 52; i++) {
  paquetDeCartes[i][0] = (i % 13) + 1;
  if (i >= 0 && i <= 12) {
    paquetDeCartes[i][1] = "coeur";
  }
  if (i >= 13 && i <= 25) {
    paquetDeCartes[i][1] = "pique";
  }
  if (i >= 26 && i <= 38) {
    paquetDeCartes[i][1] = "carre";
  }
  if (i >= 39 && i <= 51) {
    paquetDeCartes[i][1] = "trefle";
  }
}

//Vérification du web storage
function Initialisation() {
  var estInscrit = localStorage.getItem("nom") != null;

  if (estInscrit == false) {
    do {
      var nom = prompt("Entrez votre nom SVP");
      if (nom != null && nom.length > 0) {
        estInscrit = true;
      }
    } while (estInscrit == false);

    localStorage.setItem("nom", nom);
    localStorage.setItem("solde", 1000);
  }
  document.getElementById("username").innerHTML = localStorage
    .getItem("nom")
    .toUpperCase();
  document.getElementById("mise").max = localStorage.getItem("solde");
  document.getElementById("argent").value = localStorage.getItem("solde");
  document.getElementById("mise").value = Math.min(
    localStorage.getItem("solde"),
    5
  );

  //Indiquer au joueur qu'il ne peut plus joueur parce qu'il n'a plus d'argent
  if (localStorage.getItem("solde") == 0) {
    var message1 = document.createElement("div");
    var message2 = document.createElement("div");
    var espaceDesBoutons = document.getElementById("boutons");
    espaceDesBoutons.replaceChildren(message1, message2);
    espaceDesBoutons.appendChild(message1).innerHTML = "Oups ! ";
    message1.setAttribute("class", "text-center fs-1 bg-danger text-light");
    espaceDesBoutons.appendChild(message2).innerHTML =
      "Vous n'avez plus d'argent.";
    message2.setAttribute("class", "text-center fs-3 bg-danger text-light");
    document.getElementById("mise").disabled = true;
  }
  console.log(paquetDeCartes);
}

//Brasser les cartes
function BrasserCarte(cartes) {
  var nbr = cartes.length;
  for (var i = 0; i < nbr; i++) {
    var randNbr = Math.floor(Math.random() * (nbr - i)) + i;
    var temp = cartes[i];
    cartes[i] = cartes[randNbr];
    cartes[randNbr] = temp;
  }
}

var cartesJoueur = new Array();

function Commencer() {
  var mise = parseInt(document.getElementById("mise").value);
  var argent = parseInt(document.getElementById("argent").value);

  if (mise <= argent) {
    BrasserCarte(paquetDeCartes);

    for (var i = 1; i < 6; i++) {
      document.getElementById("bouton" + i).disabled = false;
    }

    document.getElementById("boutonCommencer").disabled = true;
    document.getElementById("boutonValider").disabled = false;
    document.getElementById("boutonEchanger").disabled = false;

    document.getElementById("mise").disabled = true;

    argent -= mise;
    document.getElementById("argent").value = argent;
    localStorage.setItem("solde", argent);
    console.log(paquetDeCartes);

    for (var i = 0; i < 5; i++) {
      var imgCarte = document.getElementById("carte" + (i + 1));
      var carte = paquetDeCartes.shift();
      cartesJoueur.push(carte);

      imgCarte.src = "./images/Cartes/" + carte[0] + carte[1] + ".png";
      console.log(imgCarte.src);
      imgCarte.id = "carte" + (i + 1);
    }
  } else {
    alert("La mise doit être inférieure ou égale à votre solde");
  }
}

function garder(carte) {
  if (carte.style.border != "5px solid red") {
    carte.style.border = "5px solid red";
    carte.style.padding = "0px";
    carte.height = "160";
    carte.width = "100";
  } else {
    carte.style.border = "";
    carte.style.padding = "";
  }
}

function Echanger() {
  BrasserCarte(paquetDeCartes);

  for (var i = 0; i < 5; i++) {
    var carteImg = document.getElementById("carte" + (i + 1));
    var carte = cartesJoueur[i];
    if (carteImg.style.border != "5px solid red") {
      paquetDeCartes.push(carte);
      var nouvelleCarte = paquetDeCartes.shift();
      carteImg.src =
        "./images/Cartes/" + nouvelleCarte[0] + nouvelleCarte[1] + ".png";
      carte = nouvelleCarte;
      cartesJoueur[i] = nouvelleCarte;

      boutonEchanger.disabled = true;
    }
  }
}

function Couleur(cartes) {
  var couleur = cartes[0][1];
  for (var i = 1; i < cartes.length; i++) {
    if (cartes[i][1] != couleur) {
      return false;
    }
  }
  return true;
}

function Quinte(cartes) {
  cartes.sort((a, b) => a[0] - b[0]);
  for (var i = 0; i < cartes.length - 1; i++) {
    if (cartes[i][0] != cartes[i + 1][0] - 1) {
      return false; 
    }
  }
  return true;
}

function QuinteFlushRoyale(cartes) {
  cartes.sort(function (a, b) {
    return a[0] - b[0];
  });

  if (
    cartes[0][0] == 1 &&
    cartes[1][0] == 10 &&
    cartes[2][0] == 11 &&
    cartes[3][0] == 12 &&
    cartes[4][0] == 13 &&
    Couleur(cartes)
  ) {
    return true;
  } else {
    return false;
  }
}

function QuinteFlush(cartes) {
  if (Quinte(cartes) && Couleur(cartes)) {
    return true;
  }
}

function Carre(cartes) {
  var compteur = {};
  for (var i = 0; i < cartes.length; i++) {
    var valeur = cartes[i][0];
    compteur[valeur] = (compteur[valeur] || 0) + 1;
  }

  for (var valeur in compteur) {
    if (compteur.hasOwnProperty(valeur) && compteur[valeur] == 4) {
      return true;
    }
  }
  return false;
}

function Brelan(cartes) {
  var compteur = {};
  for (var i = 0; i < cartes.length; i++) {
    var valeur = cartes[i][0];
    compteur[valeur] = (compteur[valeur] || 0) + 1;
  }

  for (var valeur in compteur) {
    if (compteur.hasOwnProperty(valeur) && compteur[valeur] == 3) {
      return true;
    }
  }
  return false;
}

function Paires(cartes, paires) {
  var compteur = {};

  for (var i = 0; i < cartes.length; i++) {
    var valeur = cartes[i][0];
    if (!compteur[valeur]) {
      compteur[valeur] = 1;
    } else {
      compteur[valeur]++;
    }
  }

  var nombrePaires = 0;
  for (var valeur in compteur) {
    if (compteur.hasOwnProperty(valeur)) {
      if (compteur[valeur] == 2) {
        nombrePaires++;
      }
    }
  }
  return nombrePaires == paires;
}

var gain = 0;

function ValiderJeu() {
  for (var i = 1; i < 6; i++) {
    document.getElementById("bouton" + i).disabled = true;
  }

  var mise = parseInt(document.getElementById("mise").value);
  var argent = parseInt(document.getElementById("argent").value);
  var combinaison;
  //Verification de la combinaison gagnante
  if (QuinteFlushRoyale(cartesJoueur)) {
    combinaison = "Quinte Flush Royale";
    gain = mise * 251;
  } else if (QuinteFlush(cartesJoueur)) {
    combinaison = "Quinte Flush (Straight Flush)";
    gain = mise * 51;
  } else if (Carre(cartesJoueur)) {
    combinaison = "Carre";
    gain = mise * 26;
  } else if (Couleur(cartesJoueur)) {
    combinaison = "Couleur (Flush)";
    gain = mise * 6;
  } else if (Quinte(cartesJoueur)) {
    combinaison = "Quinte (Straight)";
    gain = mise * 5;
  } else if (Brelan(cartesJoueur) && Paires(cartesJoueur, 1)) {
    combinaison = "Full House";
    gain = mise * 11;
  } else if (Brelan(cartesJoueur)) {
    combinaison = "Brelan";
    gain = mise * 4;
  } else if (Paires(cartesJoueur, 2)) {
    combinaison = "Deux Paires";
    gain = mise * 3;
  } else if (Paires(cartesJoueur, 1)) {
    combinaison = "Paire";
    gain = mise * 2;
  } else {
    combinaison = "Carte isolée";
    gain = mise * 0;
  }

  argent += gain;
  localStorage.setItem("solde", argent);
  document.getElementById("argent").value = argent;

  var message1 = document.createElement("div");
  var message2 = document.createElement("div");
  var espaceDesBoutons = document.getElementById("boutons");
  espaceDesBoutons.replaceChildren(message1, message2);

  if (gain > mise) {
    espaceDesBoutons.appendChild(message1).innerHTML = "Bravo &#127881!!!";
    message1.setAttribute("class", "text-center fs-1 text-success");
    espaceDesBoutons.appendChild(message2).innerHTML =
      "Vous avez réussi une combinaison &quot;" + combinaison + "&quot;.";
    message2.setAttribute("class", "text-center fs-3");
  } else {
    espaceDesBoutons.appendChild(message1).innerHTML = "Ouye &#129301!!";
    message1.setAttribute("class", "text-center fs-1 text-danger");
    espaceDesBoutons.appendChild(message2).innerHTML = "Vous avez perdu.";
    message2.setAttribute("class", "text-center fs-3");
  }

  var temps = 5000;
  var decompte = document.createElement("div");
  document.getElementById("header").appendChild(decompte);
  decompte.setAttribute("class", "text-center bg-warning-subtle");

  function miseAJourDecompte() {
    decompte.innerHTML =
      "La page va se rafraîchir dans " + temps / 1000 + " secondes...";
  }

  miseAJourDecompte();

  var decompteInterval = setInterval(function () {
    temps -= 1000;
    if (temps <= 0) {
      clearInterval(decompteInterval);
      location.reload();
    } else {
      miseAJourDecompte();
    }
  }, 1000);
}
