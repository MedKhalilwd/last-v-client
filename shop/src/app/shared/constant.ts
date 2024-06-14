

// export const breadcrumbsMenu=[
//     {
//         label:'Categories',
//         path:'/categories',
//         children:[
//             {
//                 path:':category'
//             },
//             {
//                 path:'/product/:id'
//             }
//         ]
//     }
// ];

// export const MENU:{
//     title:string;
//     path:string;
// }[]
// =[
   
//     {
//         title:'Épicerie',
//         path:'/categories/Men'
//     },
//     {
//         title:'boisson',
//         path:'/categories/Women'
//     },
//     {
//         title:'Nuttela',
//         path:'/categories/Groceries'
//     },
   
// ]

export const breadcrumbsMenu=[
    {
        label:'Categories',
        path:'/categories',
        children:[
            {
                path:':category'
            },
            {
                path:'/product/:id'
            }
        ]
    }
];

export const MENU:{
    title:string;
    path:string;
}[]
=[
   
    {
        title:'Home',
        path:'/'
    },
    {
        title:'Products',
        path:'/categories/Women'
    },
    // {
    //     title:'Reward',
    //     path:'/categories/Groceries'
    // },
    {
        title:'recempense',
        path:'/recempense'
    },
    {
        title:'offers',
        path:'/offers'
    }
]