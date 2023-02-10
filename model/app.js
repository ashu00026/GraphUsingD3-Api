const mongoose=require('mongoose')

const dataSchema=new mongoose.Schema({
            end_year:{

            },
            intensity: {
                type:Number,
                default:0

            },
            sector: {
                type:String,

            },
            topic: {

            },
            insight: {

            },
            url:{

            } ,
            region:{

            },
            start_year: {

            },
            impact: {

            },
            added:{

            },
            published:{

            },
            country:{

            } ,
            relevance:{
                type:Number,
                default:0

            },
            pestle:{

            },
            source:{

            },
            title:{

            },
            likelihood:{
                type:Number,
                default:0

            } 
})

const theDatabase=mongoose.model('dataBase',dataSchema)

module.exports={theDatabase}