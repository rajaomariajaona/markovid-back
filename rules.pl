cas_suspect(Nombre,Lieu).
cas_confirmee(Nombre,Lieu).
zone_rouge(Lieu):- cas_confirmee(Nombre,Lieu).
zone_rouge(Lieu):- cas_suspect(Nombre,Lieu),Nombre>10.
zone_jaune(Lieu):- cas_suspect(Nombre,Lieu),Nombre=<10.
zone_risque(Lieu,Heure_debut, Heure_fin):- aglomeration(Lieu,Heure_debut,Heure_fin).

