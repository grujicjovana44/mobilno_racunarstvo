export interface TravelDoc {
  id: string;
  ownerId: string;
  ownerName: string;
  drzava: string;
  grad: string;
  datumOd: string;
  datumDo: string;
  vrstaPrevoza: string;
  cenaPrevoza: number;
  vrstaSmestaja: string;
  cenaSmestaja: number;
  poseceno: boolean;
  participants: string[];
}

// Legacy class kept for compatibility
export class Travel {
  constructor(
    public id: string,
    public drzava: string,
    public grad: string,
    public datumOd: string,
    public datumDo: string,
    public vrstaPrevoza: string,
    public cenaPrevoza: number,
    public vrstaSmestaja: string,
    public cenaSmestaja: number,
    public poseceno: boolean = false
  ) {}
}
