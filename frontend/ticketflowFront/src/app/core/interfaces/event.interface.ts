import { Sala } from "./sala.interface";
import { Seat } from "./seat.interface";
import { TypeEvent } from "./typeEvent.interface";

export interface Event {
    id: number;
    name: string;
    description: string;
    image1: string;         
    image2: string;       
    date: Date;           
    location: string;
    capacity: number;
    normalPrice: number;
    vipPrice: number;       
    normalCapacity: number; 
    vipCapacity: number;    
    genre: TypeEvent;
    sala?: Sala | null;
    seats: Seat[] | null;    

}

export interface EventCreate{
    name: string;
    description: string;
    date: Date;
    location: string;
    capacity: number;
    normalPrice: number;
    vipPrice?: number;
    genreId: number;
    salaId?: number;
    image1: File;
    image2: File;
}