/* Ensemble de fonctions pour defendre avec ordre de priorité et capacité d'action */

include("Attaque");
include("Outils/EffetsArmesPuces");

// Parcourir les CHIP par priorité pour les appliquer
function Defendre() {
	// CHIP_BANDAGE si la vie est réduite.
	var prioriteSoins = [CHIP_CURE, CHIP_BANDAGE];
	var soinUtilise = false;
	for (var soin in prioriteSoins) {
		if(soinUtilise) break; // 1 seul soin par tour
		if( (getCooldown(soin) == 0) 
		and (getLife() != getTotalLife()) ){
			debug("Dégats actuels : " + (getTotalLife() - getLife()) );
			if(SoinEstMaximumSurMoi(soin))
			{
				debug("Sort de soins : "+getChipName(soin));
				useChip(soin, getLeek());
				soinUtilise = true;
			}
		}
	}


	/*
	Lire les PM de l'adversaire pour anticiper son attaque et lancer les sorts de défense à l'avance
	*/
	//getAbsoluteShield(Nombre leek);
	//getResistance(Nombre leek);
	//getWeapons();
	//getChips();
	//getChipEffects(Nombre chip);
	//getWeaponEffects(Nombre weapon);
	//getCellsToUseChip(Nombre chip, Nombre leek);
	//getCellsToUseWeapon(Nombre weapon, Nombre leek);
	//getPathLength(Nombre cell1, Nombre cell2);
	//getMP();
	//getMP(Nombre leek);
	//moveTowardCell(Nombre cell);

	// L'ennemi tir approximativement si la portée de son arme et ses points de mouvements valent la distance qui nous sépare.
	var ennemiVaTirer = ( (getTotalMP(getNearestEnemy()) + SonArmeDePorteeMax(getNearestEnemy())) <= getPathLength(getCell(), getCell(getNearestEnemy())) );
	// CHIP_HELMET si la vie est réduite ...
	// ... ou si l'attaque est possible (car reciproque)
	var prioriteBoucliers = [CHIP_SHIELD, CHIP_HELMET];
	var bouclierUtilise = false;
	for (var bouclier in prioriteBoucliers) {
		//if(bouclierUtilise) break; // 1 seul bouclier par tour
		if( (getCooldown(bouclier) == 0) 
		and ((getLife() != getTotalLife()) or EnnemiAttaquable(null) or ennemiVaTirer ) ){
			debug("Sort de protection : "+getChipName(bouclier));
			useChip(bouclier, getLeek());
			bouclierUtilise = true;
		}
	}


	// Analyse si une attaque est possible
	var resultat = MeilleurArmeOuPucePourAttaquerApresDeplacement();
	var cr = resultat[0];
	var meilleureArme;
	if(cr == USE_SUCCESS) {
		meilleureArme = resultat[1];
	}
	// Attaque possible si arme capable de blesser ET MP suffisants
	var attaquePossible = ( (cr == USE_SUCCESS) and ((getChipCost(CHIP_PROTEIN) + getWeaponCost(meilleureArme)) < getTP()) );

	// CHIP_PROTEIN si l'attaque est possible et ...
	// qu'une attaque est possible avec les PT restants !
	if((getCooldown(CHIP_PROTEIN) == 0) and EnnemiAttaquable(null) and attaquePossible){
		debug("Sort d'attaque : "+getChipName(CHIP_PROTEIN));
		useChip(CHIP_PROTEIN, getLeek());
	}
}