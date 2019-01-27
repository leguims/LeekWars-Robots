//--------------------------------
//------- Code de base -----------
//--------------------------------

include("Outils/Log");
include("Outils/EffetsArmesPuces");
include("Approche");
include("Attaque");
include("Defense");
include("Fuite");

// Message de début de partie
var debut = [	"Salut !",
				"Hey, on s'est pas déjà vu ?",
				"GL",
				"Good Luck",
				"Qui va gagner ?",
				"To win or not to win, that's the question.",
				"Hou hou ! Il y a quelqu'un ?",
				"Il y a quelqu'un ? Je viens en paix. hi hi hi !",
				"Je parie que tu ne vas pas me toucher !"];
if(getTurn() == 1) {
	shuffle(debut);
	say(debut[0]);
}


// On prend l'arme avec la plus grande portée
if(getWeapon() == null) setWeapon(MonArmeDePorteeMax()); // Attention : coûte 1 PT
var ennemi = getNearestEnemy();// On récupère l'ennemi le plus proche


ApprocheProcheEnnemi();
//ApprocheEnnemi(ennemi);
Defendre();
AttaquerEnnemi(ennemi);
FuireEnnemi(ennemi);

if(getTP()) debugW("PT inutilisés : " + getTP());

// Message de victoire
var fin = [	"Bien joué !",
			"Yes ! Beau match.",
			"GG",
			"Good Game",
			"Ha ha ha ! Je suis trop fort !",
			"Faudrait penser à te lancer dans le jardinage peut-être ...",
			"Voilà comment on finit en soupe !",
			"Mais qui peut m'arreter ?"];
var pessimiste = [	"Bon, ça sent mauvais ...",
			"Je patoge dans ma soupe. :(",
			"T'es trop fort",
			"C'est quoi ton point faible ?",
			"Tu triches ou quoi ?!"];
var optimiste = [	"Je la sens bien cette partie !",
			"C'est peinard.'",
			"Tranquile le chat.",
			"J'en ai encore pour 5 minutes ...",
			"Tu commences à faiblir ?"];
if(isDead(ennemi)) {
	shuffle(fin); say(fin[0]);
}
else if (getTP() > 0) {
	if ( (getLife() / getTotalLife()) < (getLife(ennemi) / getTotalLife(ennemi)) ) {
		shuffle(pessimiste); say(pessimiste[0]);
	}
	else {shuffle(optimiste); say(optimiste[0]);}
}