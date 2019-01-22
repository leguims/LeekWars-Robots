// Chercher une case cachée pour s'abriter'

// Se sauver
function FuireEnnemi(ennemi) {
	var maCell = getCell();
	var ennemiCell = getCell(ennemi);
	
	if(getMP() and canUseWeapon(ennemi))
	{
		debug("Fuire");
		moveAwayFromLine(maCell, ennemiCell);
		//moveAwayFrom(ennemi);
	}
}