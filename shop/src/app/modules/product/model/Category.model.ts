
export interface Category {
    _id:number;
    title:string;
    products:string[];
}

export interface CategoryFilter {
    label:string;
    value:string|number;
    checked:boolean;
    id:number;
}
