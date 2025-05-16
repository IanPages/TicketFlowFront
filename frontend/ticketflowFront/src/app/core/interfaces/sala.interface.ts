export interface Sala{
    id: number;
    name: string;
    location: string;
    capacity: number;
    numberedSeats:boolean;
    filas:number;
    columnas: number;
}

export interface salaCreate{
    name: string;
    location: string;
    capacity: number;
    numberedSeats:boolean;
    filas: number;
    columnas: number;
}