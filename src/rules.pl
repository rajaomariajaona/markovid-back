zone_rouge(Lieu):- cas_confirme(Nombre,Lieu).
zone_rouge(Lieu):- cas_suspect(Nombre,Lieu), Nombre>10.
zone_jaune(Lieu):- cas_suspect(Nombre,Lieu),\+ zone_rouge(Lieu), Nombre=<10.