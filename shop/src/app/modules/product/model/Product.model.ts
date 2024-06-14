
export interface Product {
    _id:number;
    title:string;
    description: string;
    category: string;
    type: string;
    sizes?: string[];
    size?:string;
    images: string[];
    stock: string;
    storeLocation:String;
    price: number;
    
newprice: number;
    prevprice:number;
    pointProduct:number;
    qty?:number;
    discount?:number;
    totalprice?:number;
    rating: {
      rate: number;
      count: number;
    }
}


