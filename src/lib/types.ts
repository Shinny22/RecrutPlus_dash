// Types centralisés pour toutes les entités
export interface Domaine {
  IdDom: number;
  LibDom: string;
}

export interface Diplome {
  IdDiplome: number;
  Designation: string;
  IdDom: number; // FK Domaine
}

export type CampagneEtat = "Planifiée" | "En cours" | "Clôturée";
export interface Campagne {
  CodAnne: string;
  Description: string;
  DatDebut: string; // ISO date string
  DatFin: string;
  Etat: CampagneEtat;
}

export type Genre = "M" | "F";
export type Sitmat = "Célibataire" | "Marié" | "Divorcé";
export interface Candidat {
  IdCandidat: number;
  NomCand: string;
  PrenCand: string;
  Genre: Genre;
  DatNais: string;
  LieuNais: string;
  Telphone1: string;
  Telphone2?: string;
  Email: string;
  Photo?: string;
  Sitmat: Sitmat;
  IdDiplome: number;
}

export type EtatDde = "En attente" | "Acceptée" | "Refusée";
export interface Demande {
  IdDde: number;
  DatDde: string;
  CV: string;
  Diplome: string;
  AnneObtDip: number;
  EtatDde: EtatDde;
  Reponse?: string;
  CodAnne: string; // FK Campagne
  IdCandidat: number; // FK Candidat
}
