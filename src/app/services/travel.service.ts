import { Injectable } from '@angular/core';
import { Travel } from '../models/travel.model';

@Injectable({
    providedIn: 'root'
})
export class TravelService {

    public putovanja: Travel[] = [];

    constructor() { }

    addPutovanje(p: Travel) {
        this.putovanja.push(p);
    }

    editPutovanje(p: Travel) {
        const index = this.putovanja.findIndex(item => item.id === p.id);
        if (index !== -1) {
            this.putovanja[index] = p;
        }
    }

    deletePutovanje(id: string) {
        this.putovanja = this.putovanja.filter(item => item.id !== id);
    }
}