/* Ensemble de fonctions liées aux effets des armes et sorts (puces) */

function ListeArmeOuPuceAvecEffet(effet) {
	var armesPucesEquipees = arrayConcat(getWeapons(), getChips());
	var armesPucesAttaque = arrayFilter(armesPucesEquipees, ProcheEnnemiBlesseParArme);
	
	var armeOuPuce = [];
	for(var arme in armesPucesAttaque) {
		var allEffects = EffetArmeOuPuce(arme);
		var type       = allEffects[0][0];
		if(type == effet)
			push(armeOuPuce, arme);
	}
	// debug("ListeArmeOuPuceAvecEffet()="+armeOuPuce);
	return armeOuPuce;
}

function EffetArmeOuPuce(arme) {
	if(arme != null){
		if(isWeapon(arme))
			return getWeaponEffects(arme);
		else if(isChip(arme))
			return getChipEffects(arme);
	}
	return [];
}

function EnnemiBlesseParArme(arme, ennemi) {
	var allEffects;
	var nomArme;
  if(isWeapon(arme)){
		//debug("Arme d'attaque ("+getWeaponName(arme)+") : " + getWeaponEffects(arme));
		allEffects = getWeaponEffects(arme);
		nomArme = getWeaponName(arme);
	}
	else if(isChip(arme)){
		//debug("Sort d'attaque ("+getChipName(arme)+") : " + getChipEffects(arme));
		allEffects = getChipEffects(arme);
		nomArme = getChipName(arme);
	}
  
  for(var effects  in allEffects) {
    var type    = effects[0];
    var min     = effects[1];
    var max     = effects[2];
    var turns   = effects[3];
    var targets = effects[4];

    if(type == EFFECT_DAMAGE) {
      var degatFinalMin = round(min * (1 + getStrength() / 100));
      var degatFinalMax = round(max * (1 + getStrength() / 100));
      //debug("dégat final : "+ degatFinalMin +"-" + degatFinalMax);
      
      // Dégâts finaux sur cible = (Dégâts de base) * (1 - Bouclier relatif / 100) - Bouclier absolu
      var degatFinalEnnemiMin = round(degatFinalMin * (1 - getRelativeShield(ennemi) / 100) - getAbsoluteShield(ennemi));
      var degatFinalEnnemiMax = round(degatFinalMax * (1 - getRelativeShield(ennemi) / 100) - getAbsoluteShield(ennemi));
      debug("Dégat final "+ nomArme +" sur ennemi : "+ degatFinalEnnemiMin +"-" + degatFinalEnnemiMax);
      
      return (degatFinalEnnemiMin >= 0);
    }
  }
  return false;
}

function ProcheEnnemiBlesseParArme(arme) {
  return EnnemiBlesseParArme(arme, getNearestEnemy());
}


function SoinEstMaximum(soin, ami) {
	var allEffects;
	if(isChip(soin)){
		debug("Sort de soin ("+getChipName(soin)+") : " + getChipEffects(soin));
		allEffects = getChipEffects(soin);
	}
	
	for(var effects  in allEffects) {
		var type    = effects[0];
		var min     = effects[1];
		var max     = effects[2];
		var turns   = effects[3];
		var targets = effects[4];

		if(type == EFFECT_HEAL) {
		  var soinFinalMin = round(min * (1 + getWisdom() / 100));
		  var soinFinalMax = round(max * (1 + getWisdom() / 100));
		  debug("Soin final : "+ soinFinalMin +"-" + soinFinalMax);

		  return (soinFinalMax <= (getTotalLife(ami) - getLife(ami)));
		}
	}
	return false;
}

function SoinEstMaximumSurMoi(soin) {
	return SoinEstMaximum(soin, getLeek());
}

function AssezTPPourUtiliserArme(arme) {
	if(isWeapon(arme)){
		var equiper = getWeapon()!=arme?1:0;
		return (getTP() >= (getWeaponCost(arme) + equiper));
	}
	else if(isChip(arme)){
		return (getTP() >= getChipCost(arme));
	}
	return false;
}

function TauxDeDegatMinArme(arme) {
	var allEffects;
	var cost;
	
	if(isWeapon(arme)){
		allEffects = getWeaponEffects(arme);
		cost = getWeaponCost(arme);
	}
	else if(isChip(arme)){
		allEffects = getChipEffects(arme);
		cost = getChipCost(arme);
	}
	
	for(var effects  in allEffects) {
		var type    = effects[0];
		var min     = effects[1];
		var max     = effects[2];
		var turns   = effects[3];
		var targets = effects[4];

		if(type == EFFECT_DAMAGE) return min/cost;
	}
  return 0;
}

function TauxDeDegatMaxArme(arme) {
	var allEffects;
	var cost;
	
	if(isWeapon(arme)){
		allEffects = getWeaponEffects(arme);
		cost = getWeaponCost(arme);
	}
	else if(isChip(arme)){
		allEffects = getChipEffects(arme);
		cost = getChipCost(arme);
	}
	
	for(var effects  in allEffects) {
		var type    = effects[0];
		var min     = effects[1];
		var max     = effects[2];
		var turns   = effects[3];
		var targets = effects[4];

		if(type == EFFECT_DAMAGE) return max/cost;
	}
  return 0;
}

function SonArmeDePorteeMax(id) {
	var armesEquipees = getWeapons(id);
	var armesAttaque = arrayFilter(armesEquipees, ProcheEnnemiBlesseParArme);
	
	var porteeArmes = [];
	for(var arme in armesAttaque) {
		porteeArmes[arme] = PorteeMaxArmePuce(arme);
	}
	// debug("ArmeDePorteeMax()="+search(porteeArmes, arrayMax(porteeArmes)));
	
	return search(porteeArmes, arrayMax(porteeArmes));
}

function MonArmeDePorteeMax() {
	return SonArmeDePorteeMax(getLeek());
}

function MonArmeOuPuceDePorteeMax() {
	var armesPucesEquipees = arrayConcat(getWeapons(), getChips());
	var armesPucesAttaque = arrayFilter(armesPucesEquipees, ProcheEnnemiBlesseParArme);
	
	var porteeArmes = [];
	for(var arme in armesPucesAttaque) {
		porteeArmes[arme] = PorteeMaxArmePuce(arme);
	}
	// debug("ArmeDePorteeMax()="+search(porteeArmes, arrayMax(porteeArmes)));
	
	return search(porteeArmes, arrayMax(porteeArmes));
}

function PorteeMaxArmePuce(arme) {
	if (arme == null)
		return 0;
	else if(isWeapon(arme)){
		//debug("getWeaponMaxRange(arme)="+getWeaponMaxRange(arme));
		return getWeaponMaxRange(arme);
	}
	else if(isChip(arme)){
		//debug("getChipMaxRange(arme)="+getChipMaxRange(arme));
		return getChipMaxRange(arme);
	}
	return 0;
}
