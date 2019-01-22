/* Ensemble de fonctions pour s'approcher de l'adversaire */

include("Outils/Commun");
include("Outils/Log");
include("Outils/EffetsArmesPuces");
include("Outils/Terrain");
include("Attaque");

// Chercher une case dégagée pour tirer
//getPathLength
//getCellsToUseWeapon

function ApprocheProcheEnnemi() {
	// Trouve la meilleur arme en fonction de la position, actions dispo, bouclier adversaire ...
	var meilleureArme = MeilleurArmeOuPucePourAttaquerApresDeplacement();
	var cr = meilleureArme[0];
	
	if (cr == USE_CRITICAL) {
		debugC("Aucune arme assez puissante contre lui, fuyons tant qu'il est encore temps !", COLOR_FUCHSIA);
		if(isOnSameLine(getCell(), getCell(getNearestEnemy())))
			moveAwayFromLine(getCell(), getCell(getNearestEnemy()));
		moveAwayFrom(getNearestEnemy());
		return;
	}

	if(cr == USE_SUCCESS) {
		// Trouver la puissance Max, déduire l'arme/puce associée
		var armePuceFinale = meilleureArme[1];
	
		// Rejoindre la case la plus proche pour tirer à l'arme la plus puissante
		debugC("Arme finalement prise : ", COLOR_FUCHSIA); log_ArmePuceC(armePuceFinale, COLOR_FUCHSIA);
		moveTowardCell( PlusProcheCellule( CellulesProcheEnnemiAttaquableAvecArme(armePuceFinale) ) );
	}
	else {
		// Pas d'arme au final, on avance vers l'adversaire
		debugC("Pas d'attaque utile, on avance betement ...", COLOR_FUCHSIA);
		moveToward(getNearestEnemy());
	}
}

function ApprocheEnnemi(ennemi) {
	var monArme = WEAPON_PISTOL;
	var porteeArme = getWeaponMaxRange(monArme);

	var maCell = getCell();
	var ennemiCell = getCell(ennemi);
	
	// Approche avec maintien de la distance
	debug("Ecart  : " + getDistance(maCell, ennemiCell) + " cases");
	debug("Portée : " + porteeArme + " cases");
	if( getMP() 
		and ( 
			(getDistance(maCell, ennemiCell) > porteeArme) 
			or not canUseWeapon(ennemi) ) )
	{
		// On avance vers l'ennemi
		var avancer = min(getMP(), ceil(getDistance(maCell, ennemiCell) - porteeArme));
		
		debug("Approche de " + avancer + " cases");
		moveToward(ennemi, avancer);
		if(not canUseWeapon(ennemi)) moveToward(ennemi);
	}
	else
		debug("Pas de déplacement");
}
