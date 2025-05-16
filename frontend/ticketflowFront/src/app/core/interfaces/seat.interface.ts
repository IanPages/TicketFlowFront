export interface Seat {
    id: number;
    fila: number;
    numero: number;
    tipo: 'normal' | 'vip';
    ocupado: boolean;
}