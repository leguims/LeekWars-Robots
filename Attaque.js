/* Ensemble de fonctions pour attaquer avec ordre de priorité et capacité d'action */
include("Outils/Commun");
include("Outils/Log");
include("Outils/EffetsArmesPuces");
include("Outils/Terrain");

function AttaquerEnnemi(ennemi) {
	// Trouve la meilleur arme en fonction de la position, actions dispo, bouclier adversaire ...
	var meilleureArme = MeilleurArmeOuPucePourAttaquerApresDeplacement();
	var cr = meilleureArme[0];
	
	if(cr == USE_SUCCESS) {
		AttaquerAvecArmeEnnemi(meilleureArme[1], ennemi);
	}
}

function AttaquerEnnemi___deprecated(ennemi) {
	// Par ordre de priorité, vérifie si une arme ou un sortilège est utilisable.
	var priorite = [WEAPON_MACHINE_GUN, CHIP_ROCK, WEAPON_PISTOL, CHIP_SPARK];
	//var listeArmes = ListeArmeOuPuceAvecEffet(EFFECT_DAMAGE);
	//var priorite = [CHIP_ROCK, CHIP_SPARK];
	
	debug("Priorité des armes : ");
	for (var arme in priorite) {debug(isWeapon(arme)?getWeaponName(arme):getChipName(arme));}
	
	for (var arme in priorite) {
    	if(isWeapon(arme) and canUseWeapon(arme, ennemi)) {
			AttaquerAvecArmeEnnemi(arme, ennemi);
		}
		else if(isChip(arme) and canUseChip(arme, ennemi)) {
			AttaquerAvecArmeEnnemi(arme, ennemi);
		}
	}
}

function EnnemiAttaquable(ennemi) {
	// Par ordre de priorité, vérifie si une arme ou un sortilège est utilisable.
	var priorite = ListeArmeOuPuceAvecEffet(EFFECT_DAMAGE);
	//var priorite = [CHIP_ROCK, CHIP_SPARK];
	
	if(not ennemi) ennemi = getNearestEnemy();
	for (var arme in priorite) {
    	if(isWeapon(arme) and canUseWeapon(arme, ennemi)) {
			debug("Ennemi attaquable avec : " + getWeaponName(arme));
			return true;
		}
		else if(isChip(arme) and canUseChip(arme, ennemi)) {
			debug("Ennemi attaquable avec : " + getChipName(arme));
			return true;
		}
	}
	debug("Ennemi non attaquable.");
	return false;
}

function AttaquerAvecArmeEnnemi(arme, ennemi) {
	// Utilise le sort si les TP sont suffisants.
	var attaqueResultat = USE_SUCCESS;
	var ennemiBlessable = EnnemiBlesseParArme(arme, ennemi);
	var equiper = 0;
	var nomArme;
  
	if(isWeapon(arme)){
		nomArme = getWeaponName(arme);
		debug("Ordre d'attaque avec " + nomArme);
		var setWeaponCost = 1;
		equiper = getWeapon()!=arme?setWeaponCost:0;
		if(ennemiBlessable){
			while( (attaqueResultat == USE_SUCCESS)
			and (getTP() >= (getWeaponCost(arme) + equiper)) ) {
				if(getWeapon()!=arme) setWeapon(arme);
				attaqueResultat = useWeapon(ennemi);
			}
		}
	}
	else if(isChip(arme)){
		nomArme = getChipName(arme);
		debug("Ordre d'attaque avec " + nomArme);
		if(ennemiBlessable){
			while( (attaqueResultat == USE_SUCCESS)
			and (getTP() >= getChipCost(arme)) ) {
				attaqueResultat = useChip(arme, ennemi);
			}
		}
	}
	if(ennemiBlessable){
		if(attaqueResultat != USE_SUCCESS)
			debug("Echecs avec l'arme ("+ log_Use_(attaqueResultat)+")");
		else
			debug("Pas assez de PT ("+getTP()+" < "+(getWeaponCost(arme)+equiper)+") pour " + nomArme);
	}
	else
		debug("Arme (" + nomArme + ") inoffensive");
}


// Retourne la meilleure arme en considerant le prochain déplacement
// Si les armes sont inoffensives : retourne [USE_CRITICAL, null]
// Si aucune arme ne peut etre utilisée (hors de portée ou non degainable) : retourne [USE_FAILED, null]
// Sinon, retourne la meilleure arme/puce : retourne [USE_SUCCESS, Arme/Puce]
function MeilleurArmeOuPucePourAttaquerApresDeplacement() {
	// Liste des armes et puces équipées
	var armesPucesEquipees = arrayConcat(getWeapons(), getChips());
	//debug("armesPucesEquipees=");arrayIter(armesPucesEquipees, log_ArmePuce);
	
	// Lire le bouclier de l'adversaire et ne pas utiliser d'arme inférieure
	var armesPucesPuissantes = arrayFilter(armesPucesEquipees, ProcheEnnemiBlesseParArme);
	debug("Liste des armes/puces assez puissantes pour perforer le bouclier : "); arrayIter(armesPucesPuissantes, log_ArmePuce);
	
	// Fuire si aucune arme n'est efficace
	if (isEmpty(armesPucesPuissantes)) {
		return [USE_CRITICAL, null];
		/*debugC("Aucune arme assez puissante contre lui, fuyons tant qu'il est encore temps !", COLOR_FUCHSIA);
		if(isOnSameLine(getCell(), getCell(getNearestEnemy())))
			moveAwayFromLine(getCell(), getCell(getNearestEnemy()));
		moveAwayFrom(getNearestEnemy());*/
	}
	
	// A partir de la position actuelle, du nombre de cases de mobilité restantes et de la portee de l'arme, selectionne les armes qui peuvent toucher l'ennemi le plus proche
	var armesPucesEnPortee = arrayFilter(armesPucesPuissantes, ProcheEnnemiAttaquableAvecArme);
	debug("Liste des armes/puces en portée : "); arrayIter(armesPucesEnPortee, log_ArmePuce);

	// Filtrer les armes trops gourmandes en actions (TP)
	var armesPucesDegainables = arrayFilter(armesPucesEnPortee, AssezTPPourUtiliserArme);
	debug("Liste des armes/puces dégainables : "); arrayIter(armesPucesDegainables, log_ArmePuce);
	
	// Définir les puissances des armes (rapport DEGATS/TP)
	var armesPucesTauxDegats = [];
	//for (var cle : var arme in armesPucesDegainables) {
	for (var arme in armesPucesDegainables) {
		armesPucesTauxDegats[arme] = TauxDeDegatMaxArme(arme);
	}
	debug("Liste des puissances des armes/puces : "); arrayIter(armesPucesTauxDegats, log_TableauClefArmePuce);
	
	if(not isEmpty(armesPucesTauxDegats)) {
		// Trouver la puissance Max, déduire l'arme/puce associée
		//debug("Max="+arrayMax(armesPucesTauxDegats)); log_ArmePuce(armePuceFinale);
		return [USE_SUCCESS, search(armesPucesTauxDegats, arrayMax(armesPucesTauxDegats))];
	}
	return [USE_FAILED, null];
}