    var picnicFinishCallback;
    var origine;
    var traveler;
    var cible;
    function picnicStart(evenement)
    {
        traveler = evenement.target;
        origine = evenement.target.parentNode;
        //alert('traveler ' + traveler);
        //alert(evenement.target.innerHTML);
    }
    function picnicStop(evenement)
    {
        evenement.preventDefault();
    }
    function picnicFinish(evenement)
    {
        evenement.preventDefault();
        //var data = evenement.dataTransfer.getData("text");
        //evenement.target.appendChild(document.getElementById(data));
        cible = evenement.target;
        cible.appendChild(traveler);
        picnicFinishCallback(traveler, cible, origine);
    }
    
    function picnic(listeZones, atterrir)
    {
        for(positionZone = 0; positionZone < listeZones.length; positionZone++)
        {
            zone = listeZones[positionZone];
            listeObjets = zone.childNodes;
            for(positionObjet = 0; positionObjet < listeObjets.length; positionObjet++)
            {
                objet = listeObjets[positionObjet];
                objet.draggable = true;
                objet.ondragstart = picnicStart;
            }
            zone.ondragover = picnicStop;
            zone.ondrop = picnicFinish;
            picnicFinishCallback = atterrir;
        }
    }
    
    function picnicJoin(objet)
    {
          objet.draggable = true;
          objet.ondragstart = picnicStart;    
    }
    
    function picnicHost(zone)
    {
        zone.ondragover = picnicStop;
        zone.ondrop = picnicFinish;
    }
    
    
