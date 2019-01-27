/* Ensemble de fonctions liées au terrain (cells) */

// Indique si l'arme peut le toucher le plus proche ennemi apres déplacement
function ProcheEnnemiAttaquableAvecArme(arme) {
	var cells = CellulesProcheEnnemiAttaquableAvecArme(arme);
	
	return inArray(arrayFilter(cells, CelluleAtteignable), true);
}

function CellulesProcheEnnemiAttaquableAvecArme(arme) {
	var ennemi = getNearestEnemy();
	
	if(isWeapon(arme)){
		return getCellsToUseWeapon(arme, ennemi);
	}
	else if(isChip(arme)){
		return getCellsToUseChip(arme, ennemi);
	}
	return [];
}

// Indique si la cellule est atteignable dans le tour
function CelluleAtteignable(cellule) {
	//debug("CelluleAtteignable : getCell()="+getCell()+" cellule="+cellule+" getPathLength(getCell(), cellule)="+getPathLength(getCell(), cellule)+" getMP()="+getMP()+" === "+(getPathLength(getCell(), cellule) <= getMP()));
	return (getPathLength(getCell(), cellule) <= getMP());
}

function PlusProcheCellule(cellules) {
	var longueurChemin = [];
	for (var cellule in cellules) {
		push(longueurChemin, getPathLength(getCell(), cellule));
	}
	var indexPlusCourtChemin = search(longueurChemin, arrayMin(longueurChemin));
	debug("Plus court chemin : index="+indexPlusCourtChemin+" longueur="+arrayMin(longueurChemin) + " cellule="+cellules[indexPlusCourtChemin]);
	return cellules[indexPlusCourtChemin];
}

