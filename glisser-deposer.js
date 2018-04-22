	function atterrirDansListe(obj, cible)
	{
        console.log("atterrirDansListe()");
        
        var tachesEnregistrees = JSON.parse(localStorage.getItem("taches"));
        localStorage.setItem("taches", JSON.stringify(exporterTaches())); // TODO optimiser
        preparerSauvegardeTaches();
        
        cible.removeChild(obj);
        action = cible.querySelector(".action");
		cible.insertBefore(obj, action);

	}
	function resterDansListe(obj, liste)
	{
        console.log("resterDansListe()");
        //var li = document.createElement('li');
        //li.innerHTML = obj.innerHTML;
        //li.addEventListener('click', function(){appliquerGestures(this)}, false);
		//liste.appendChild(li);
		action = liste.querySelector(".action");
		liste.insertBefore(obj, action);
	}
	function quitterUneListe(obj, liste)
	{
        console.log("quitterUneListe()");
		var objEnDestruction = null;
		var listeTaches = liste.getElementsByTagName('li');
		for(var position = 0; position < listeTaches.length; position++)
		{
			var tache = listeTaches[position];
			if(tache.innerHTML == obj.innerHTML) objEnDestruction = tache;
		}
		//alert(objEnDestruction);
		liste.removeChild(objEnDestruction);
		//delete tableauTaches[liste.id][tache.innerHTML];
	}
	function quitterUneJournee(obj, plan)
	{
        console.log("quitterUneJournee()");
		var objEnDestruction = null;
		var listeTaches = plan.getElementsByTagName('li');
		for(var position = 0; position < listeTaches.length; position++)
		{
			var tache = listeTaches[position];
			if(tache.innerHTML == obj.innerHTML) objEnDestruction = tache;
		}
		if(objEnDestruction) if(tableauCalendrier[plan.parentNode.id][objEnDestruction.innerHTML]) delete tableauCalendrier[plan.parentNode.id][objEnDestruction.innerHTML];
		if(plan.contains(objEnDestruction))plan.removeChild(objEnDestruction);
        localStorage.setItem("calendrier", JSON.stringify(exporterCalendrier())); // TODO optimiser 	
        preparerSauvegardeCalendrier();
        console.log("id de la journee a quittee " + plan.parentNode.id);
        etat = verifierEtatDuJour(plan.parentNode.id);
        console.log("la journee est maintenant" + etat);
        plan.className = "plan " + etat;
	}
		
	function atterrirDansJournee(obj, cible)
	{
        console.log("atterrirDansJournee()");
        //var calendrierPlan = JSON.parse(localStorage.getItem("calendrier"));
		//alert(JSON.stringify(exporterCalendrier());
		//var testTache = obj.childNodes[0];
		//if(testTache.className && testTache.className.indexOf('tache') == 0)
        var clone = document.createElement('li');
        clone.className = obj.parentNode.id; // pour la logique des 4 categories par jour
        //clone.addEventListener('click', function(){appliquerGestures(this)}, false);
        clone.innerHTML = '<span class="tache">'+obj.innerHTML+'</span><span class="detail" onclick="editerDetailTache(this)">&nbsp;</span>';
        picnicJoin(clone);
        cible.appendChild(clone);
        localStorage.setItem("calendrier", JSON.stringify(exporterCalendrier())); // TODO optimiser 	
        
        completion = verifierListesObligatoires(cible);
        if(completion) cible.className = "plan complet";
        else cible.className = "plan incomplet";
	}
	
	
	function atterrirDansPoubelle(obj)
	{
        console.log("atterrirDansPoubelle(obj)");
        cible.removeChild(obj);
        localStorage.setItem("taches", JSON.stringify(exporterTaches())); // TODO optimiser 
        preparerSauvegardeTaches();
    }
	
	function fusionnerDansListe(obj, liste)
	{
		if(liste.contains(obj)) liste.removeChild(obj);
	}
        
    function atterrir(obj, cible, origine)
    {
        console.log("atterrir()");
        if(!cible) return false;
		console.log('DRAG & DROP == DEBUT ==');
		console.log('origine : ' + origine + ':' + origine.id + ':' + origine.className + ' ' + origine.innerHTML);
		console.log('obj : ' + obj + ':' + obj.id + ':' + obj.className + ' ' + obj.innerHTML);
		console.log('cible : ' + cible + ':' + cible.id + ':' + cible.className + ' ' + cible.innerHTML);
		console.log('DRAG & DROP == FIN ==');
		
		if(cible.id == "poubelle-tache" && origine.className.indexOf('liste-taches') != -1)
		{
            atterrirDansPoubelle(obj);
		}
		else if(obj.className.indexOf('action') != -1)
		{
			resterDansListe(obj, origine);
		}
		else if(origine.className.indexOf('plan') != -1 && cible.className.indexOf('plan') != -1)
		{
			quitterUneJournee(obj, origine);
			atterrirDansJournee(obj, cible);
		}
		else if(origine.className.indexOf('plan') != -1)
		{
			quitterUneJournee(obj, origine);
			fusionnerDansListe(obj, cible);
		}
		else if(origine.className.indexOf('liste-taches') != -1 && cible.className.indexOf('plan') != -1)
		{
			resterDansListe(obj, origine);
			atterrirDansJournee(obj, cible);
		}
		else if(cible.className.indexOf('liste-taches') != -1)
		{
			//quitterUneListe(obj, origine);
			atterrirDansListe(obj, cible);
		}
		else if(cible.className.indexOf('plan') != -1)
		{
			atterrirDansJournee(obj, cible);
		}
		else if(cible.parentNode.className.indexOf('plan') != -1)
		{
			resterDansListe(obj, origine);
			atterrirDansJournee(obj, cible.parentNode);
		}
		else if(cible.className.indexOf('tache') != -1 || cible.className.indexOf('detail') != -1)
		{
			resterDansListe(obj, origine);
			atterrirDansJournee(obj, cible.parentNode.parentNode);
		}
		else
		{
			resterDansListe(obj, origine);
            // cible.removeChild(obj);
            // nepasAtterrir();
		}		
    }
