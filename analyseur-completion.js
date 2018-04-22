	function verifierListesObligatoires(cible)
	{
        //verifications = [false,false,false,false];
        for(position in listesObligatoires)
        {
            listesObligatoires[position] = false;
        }
        //console.log("Les listes obligatoires sont " + JSON.stringify(listesObligatoires));
        for(position in cible.childNodes)
        {
            contenu = cible.childNodes[position];
            if(contenu.className) listesObligatoires[contenu.className] = true;
        }
        console.log("Listes obligatoires utilisees : " + JSON.stringify(listesObligatoires));
        
        tous = true;
        for(position in listesObligatoires)
        {
            tous = tous && listesObligatoires[position];
        }
        return tous;
	}
	
	function verifierEtatDuJour(jour)
	{        
        console.log("verifierEtatDuJour("+jour+")");
        for(position in listesObligatoires)
        {
            listesObligatoires[position] = false;
        }
        //console.log("Les listes obligatoires sont " + JSON.stringify(listesObligatoires));

        //console.log("calendrier " + localStorage.getItem("calendrier"));
        calendrier = JSON.parse(localStorage.getItem("calendrier"));
        for(position in calendrier[jour])
        {
            tache = calendrier[jour][position];
            //console.log("tache.liste " + tache.liste);
            if(tache.liste) listesObligatoires[tache.liste] = true;
        }
        console.log("Listes obligatoires utilisees : " + JSON.stringify(listesObligatoires));
        
        nombre = 0;
        for(position in listesObligatoires)
        {
            if(listesObligatoires[position]) nombre++;
        }
        switch(nombre) // dependance sur nombre de categoriees == 4
        {
            case 0: return 'vide';
            case 1: case 2: case 3: return 'incomplet';
            case 4: return 'complet';
            
        }
	}

	function verifierListesManquantes(jour)
	{
        //alert(jour + jour);
        cible = jour.childNodes[1];
        //alert(cible);
        
        for(position in listesObligatoires)
        {
            listesObligatoires[position] = false;
        }
        //console.log("Les listes obligatoires sont " + JSON.stringify(listesObligatoires));
        
        for(position in cible.childNodes)
        {
            contenu = cible.childNodes[position];
            if(contenu.className) listesObligatoires[contenu.className] = true;
        }
        console.log("Listes obligatoires utilisees : " + JSON.stringify(listesObligatoires));
        
        manquantes = [];
        for(position in listesObligatoires)
        {
            if(!listesObligatoires[position]) manquantes[manquantes.length] = position;
        }
        return manquantes;
	}
	
	function effacerCompletion()
	{
        document.querySelector("#message").innerHTML = "&nbsp;";
	}
	
	function suggererCompletion(jour)
	{
        manquantes = verifierListesManquantes(jour);
        message = (manquantes.length != 0)?"Il vous manque " + JSON.stringify(manquantes) : "&nbsp;";
        console.log(message);
        document.querySelector("#message").innerHTML = message;
	}
