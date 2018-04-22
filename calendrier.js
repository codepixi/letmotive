    console.log(localStorage.getItem("calendrier"));
    var jourCalendrier = new Date();

    var listeCiblesJour = [];
    var calendrierParDefaut = {};
    var tableauCalendrier = calendrierParDefaut;
	function afficherCalendrier(jourCalendrier = new Date())
	{
	
        var calendrierEnregistre = JSON.parse(localStorage.getItem("calendrier"));	
        if(localStorage.getItem("taches") && localStorage.getItem("taches").length != 0)
        {
            tableauCalendrier = calendrierEnregistre;
        }
        else
        {
            localStorage.setItem("calendrier", JSON.stringify(calendrierParDefaut));
        }
        preparerSauvegardeCalendrier();
        //alert(JSON.stringify(tableauCalendrier));

        var vueCalendrier = document.getElementById("calendrier-jours");
        vueCalendrier.innerHTML = "";
        
        var jour = new Date(JSON.parse(JSON.stringify(jourCalendrier)));
        for(var jourSemaine = 0; jourSemaine < 7; jourSemaine++, jour.setDate(jour.getDate()+1))
        {
            var ladate = jour.getFullYear() + '-' + (jour.getMonth()+1) + '-' + jour.getDate();
            etat = verifierEtatDuJour("jour-"+ladate);
            console.log("Generation - etat = " + etat);
            //vueCalendrier.innerHTML += '<div class="jour" id="jour-' + ladate + '"><span class="date">' + ladate + '<span><ul class="plan"></ul></div>';
            var autreJour = document.createElement("div");
            autreJour.id = 'jour-' + ladate;
            autreJour.className = 'jour';
            autreJour.innerHTML = '<span class="date">' + ladate + '<span>';
            autreJour.onmouseover = function(){suggererCompletion(this)};
            autreJour.onmouseout = effacerCompletion;
            var planDeJournee = document.createElement('ul');
            planDeJournee.className = 'plan ' + etat;
            //alert(tableauCalendrier['jour-'+ladate]);
            //alert(tableauCalendrier[ladate].length);
            if(tableauCalendrier && tableauCalendrier['jour-'+ladate])
            for(var positionChoix = 0; positionChoix < tableauCalendrier['jour-'+ladate].length; positionChoix++)
            {
                console.log(JSON.stringify(descriptionTache));
                var descriptionTache = tableauCalendrier['jour-'+ladate][positionChoix];
                if(!descriptionTache['detail']) descriptionTache['detail'] = '';
                planDeJournee.innerHTML += '<li class="'+listeSelonTache[descriptionTache['nom']]+'"><span class="tache">'+descriptionTache['nom']+'</span><span class="detail" onclick="editerDetailTache(this)">'+descriptionTache['detail']+'</span></li>';
                //  onclick="appliquerGestures(this)"
            }
            
            autreJour.appendChild(planDeJournee);
            vueCalendrier.appendChild(autreJour);
            listeCiblesJour[listeCiblesJour.length] = planDeJournee;
        }
    }

    function voyagerTemps(pas)
    {
        //deplacements.destroy();
        
        console.log("avant " + jourCalendrier.getDate());
        jourCalendrier.setDate(jourCalendrier.getDate()+pas);
        console.log("apres " + jourCalendrier.getDate());
        afficherCalendrier(jourCalendrier);
        console.log("fin " + jourCalendrier.getDate());
        
        //alert(listeCiblesJour);
        //deplacements = dragula(listeCiblesJour.concat(lesQuatresSortes), optionsDeJournee).on("drop", atterrir);
        deplacements = picnic(listeCiblesJour.concat(lesQuatresSortes), /*optionsDeJournee,*/ atterrir);
    }

	function enregistrerDetailTache(obj)
	{
        //alert(obj);
        obj.parentNode.onclick = function (){editerDetailTache(this)};
        obj.parentNode.innerHTML = obj.getElementsByTagName('input')[0].value;
        localStorage.setItem("calendrier", JSON.stringify(exporterCalendrier())); // TODO optimiser 
        preparerSauvegardeCalendrier();
	}
	
	function editerDetailTache(obj)
	{
        //alert(obj.onclick);
        obj.innerHTML = '<form onsubmit="enregistrerDetailTache(this); return false;"><input type="text" value="'+obj.innerHTML+'"></form>';
        obj.onclick = {function() {enregistrerDetailTache(this.querySelector("form"))}};
        obj.getElementsByTagName('input')[0].focus();
	}
    
	function exporterCalendrier()
	{
		var calendrierPlan = {};
		var calendrier = document.getElementById('calendrier');
		var lesJour = calendrier.getElementsByClassName('jour');
		for(var positionJour = 0; positionJour < lesJour.length; positionJour++)
		{
			var jour = lesJour[positionJour];
			var lesChoix = jour.getElementsByTagName('li');
	
			calendrierPlan[jour.id] = [];
			
			for(var positionChoix = 0; positionChoix < lesChoix.length; positionChoix++)
			{
				var choix = lesChoix[positionChoix];
				var plan = {};
				plan['nom'] = choix.getElementsByClassName('tache')[0].innerHTML;
				plan['detail'] = choix.getElementsByClassName('detail')[0].innerHTML;
				plan['liste'] = choix.className;
				if(!plan['detail']) plan['detail'] = '';
				calendrierPlan[jour.id][calendrierPlan[jour.id].length] = plan;
				//calendrierPlan[jour.id][calendrierPlan[jour.id].length]['detail'] = choix.parentNode.getElementsByClassName('detail')[0].innerHTML;
			}
		}
		
		return calendrierPlan;
	}
    
	function preparerSauvegardeCalendrier()
	{
        console.log("preparerSauvegardeCalendrier()");
        //lien = document.createElement('a');
        json = localStorage.getItem("calendrier");
        //alert(json);
        lien = document.querySelector("#sauve-calendrier");
        //lien.appendChild(document.createTextNode('Telecharger'));
        lien.setAttribute('href', 'data:text/json;base64,' + window.btoa(json));
        //lien.setAttribute('href', 'data:text/json;charset=utf-8,content_encoded_as_url');
        lien.setAttribute('download','calendrier.json');
	}
	
    function importerLeCalendrier(evenement)
    {
        console.log("importerLeCalendrier(evenement)");
        if (!verifierTeleversement()) alert('Televersement impossible');
        //alert(evenement.target.files.length);
        fichier = evenement.target.files[0];
        //fichier = document.querySelector("#importe-calendrier span input[type=file]").files[0];
        //alert(fichier.name);
        lecteur = new FileReader();
        //alert("lecteur=" + lecteur);
        //lecteur.onload = (function(fichier) { return function(chargement) 
        lecteur.addEventListener("load", function (evenement) 
        {
            console.log("lecteur.onload()");
            json = this.result;
            //alert(json);
            tableauCalendrier = JSON.parse(json);
            //localStorage.setItem("calendrier", JSON.stringify(exporterCalendrier()));
            localStorage.setItem("calendrier", JSON.stringify(tableauCalendrier));
            afficherCalendrier();
            preparerSauvegardeCalendrier();
        });
        lecteur.readAsText(fichier); 
        //lecteur.readAsDataURL(fichier); 
        interdireImportDuCalendrier();
    }
    
    function permettreImportDuCalendrier()
    {
        console.log("permettreImportDuCalendrier()");
        document.querySelector("#importe-calendrier span").style.display = "block";
        document.querySelector("#importe-calendrier span input[type=file]").onchange = importerLeCalendrier;
    }
    
    function interdireImportDuCalendrier()
    {
        console.log("interdireImportDuCalendrier()");
        document.querySelector("#importe-calendrier span").style.display = "none";
        // document.querySelector("#importe-calendrier span input[type=file]")
    }
