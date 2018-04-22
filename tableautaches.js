    function fermerTableauTaches()
    {
        var vueDuTableau = document.querySelector('#tableau-des-taches');
        vueDuTableau.style.display = "none";
        document.querySelector('#action-tableau-des-taches-fermer').style.display = "none";
        document.querySelector('#action-tableau-des-taches-ouvrir').style.display = "";
    }

    function ouvrirTableauTaches()
    {
        var vueDuTableau = document.querySelector('#tableau-des-taches');
        vueDuTableau.style.display = "";
        document.querySelector('#action-tableau-des-taches-fermer').style.display = "";
        document.querySelector('#action-tableau-des-taches-ouvrir').style.display = "none";
    }
    
    function ecrireListe(listeTaches)
    {
        //alert(listeTaches.id);
        var vueDeListe = '';
        for(numeroTache in listeTaches)
        {
            vueDeListe += '<li>'+listeTaches[numeroTache]+'</li>'
        }
        return vueDeListe + actionAjouter;
    }    
    
    function afficherTableauTaches()
    {
        var tachesParDefaut = {"exercer":["natation","danse","film"],"etudier":["internet","herboristerie","survie","irlandais"],"creer":["formation","page web","arbre"],"construire":["menage","reno","produit"]};
        var tachesEnregistrees = JSON.parse(localStorage.getItem("taches"));	
        tableauTaches = tachesParDefaut;
        if(localStorage.getItem("taches") && localStorage.getItem("taches").length != 0)
        {
            tableauTaches = tachesEnregistrees;
        }
        else
        {
            localStorage.setItem("taches", JSON.stringify(tachesParDefaut));
            preparerSauvegardeTaches();
        }
        afficherTableauAvecTaches(tableauTaches); 
    }

    var actionAjouter = '<li class="action" onClick="ajouterTache(this.parentNode)">+</li>';
    var tableauTaches;
    
    var listeSelonTache = [];
    function afficherTableauAvecTaches(tableauTaches)
    {
        var vueDuTableau = document.querySelector('#taches');
        vueDuTableau.innerHTML = "";
        for(nomListe in tableauTaches)
        {
            var listeTaches = tableauTaches[nomListe];        
            vueDuTableau.innerHTML += '<ul id="'+ nomListe+'" class="liste-taches" title="'+nomListe+'">'+ecrireListe(listeTaches) + '</ul>';
            for(position in listeTaches)
            {
                //alert(listeTaches[position]);
                listeSelonTache[listeTaches[position]] = nomListe;
            }
        }
        //alert(JSON.stringify(listeSelonTache));
    }
    
    function permettreImportDesTaches()
    {
        console.log("permettreImportDesTaches()");
        document.querySelector("#importe-tache span").style.display = "block";
        document.querySelector("#importe-tache span input[type=file]").onchange = importerLesTaches;
    }
    
    function interdireImportDesTaches()
    {
        console.log("interdireImportDesTaches()");
        document.querySelector("#importe-tache span").style.display = "none";
        // document.querySelector("#importe-tache span input[type=file]")
    }
    
	function sauvegarderTaches()
	{
	}
		
    function exporterTaches()
    {
        var donnees = {};
        donnees["exercer"] = lireListe("exercer");
        donnees["etudier"] = lireListe("etudier");
        donnees["creer"] = lireListe("creer");
        donnees["construire"] = lireListe("construire");
        return donnees;
    }
    function lireListe(liste)
    {
        if(!document.getElementById(liste)) return;
    
        var donneesListe = [];
        lesTachesExercer = document.getElementById(liste).getElementsByTagName("li");
        for(var position = 0; position < lesTachesExercer.length; position++)
        {
            var tache = lesTachesExercer[position];
            if(tache.className.indexOf("action") == -1) donneesListe[donneesListe.length] = tache.innerHTML;
        }
        return donneesListe;
    }
    var listeEnEdition = "";
    
    function ajouterTache(liste)
    {
        var boite = document.querySelector("#formulaire-nouvelle-tache");
        boite.style.display = "block";
        boite.style.position = "absolute";
        //boite.style.x = event.clientX;
        //boite.style.y = event.clientY;
		document.getElementById("nouvelle-tache-nom").focus();
        listeEnEdition = liste;
    }
    function enregistrerTaches()
    {
        console.log("enregistrerTaches()");
        var boite = document.querySelector("#formulaire-nouvelle-tache");
        boite.style.display = "none";
        lesTaches = JSON.parse(localStorage.getItem("taches"));
        lesTaches[listeEnEdition.id][lesTaches[listeEnEdition.id].length] = document.querySelector("#nouvelle-tache-nom").value;
        //alert(lesTaches[listeEnEdition.id]);
        listeEnEdition.innerHTML = ecrireListe(lesTaches[listeEnEdition.id]);
        localStorage.setItem("taches", JSON.stringify(lesTaches));
        preparerSauvegardeTaches();
        document.querySelector("#nouvelle-tache-nom").value = "";
        
        return false;
    }
        
    function importerLesTaches(evenement)
    {
        console.log("importerLesTaches(evenement)");
        if (!verifierTeleversement()) alert('Televersement impossible');
        //alert(evenement.target.files.length);
        fichier = evenement.target.files[0];
        //fichier = document.querySelector("#importe-tache span input[type=file]").files[0];
        //alert(fichier.name);
        lecteur = new FileReader();
        //alert("lecteur=" + lecteur);
        //lecteur.onload = (function(fichier) { return function(chargement) 
        lecteur.addEventListener("load", function (evenement) 
        {
            console.log("lecteur.onload()");
            json = this.result;
            //alert(json);
            tableauTaches = JSON.parse(json);
            afficherTableauAvecTaches(tableauTaches);
            //localStorage.setItem("taches", JSON.stringify(exporterTaches()));
            localStorage.setItem("taches", JSON.stringify(tableauTaches));
        });
        lecteur.readAsText(fichier); 
        //lecteur.readAsDataURL(fichier); 
        interdireImportDesTaches();
    }

	function preparerSauvegardeTaches()
	{
        console.log("preparerSauvegardeTaches()");
        //lien = document.createElement('a');
        json = localStorage.getItem("taches");
        //alert(json);
        lien = document.querySelector("#sauve-tache");
        //lien.appendChild(document.createTextNode('Telecharger'));
        lien.setAttribute('href', 'data:text/json;base64,' + window.btoa(json));
        //lien.setAttribute('href', 'data:text/json;charset=utf-8,content_encoded_as_url');
        lien.setAttribute('download','taches.json');	
	}
	
	var listesObligatoires = {'exercer':false,'etudier':false,'creer':false,'construire':false}; // TODO rendre dynamique
	

    
