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