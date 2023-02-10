const { theDatabase } = require("../model/app")
const data=require('../jsondata')

const refreshProducts=async (req,res)=>{
    try{
        console.log('here')
        const otherSectors={sector:''}
        const otherTopics={topic:''}
        const otherCountries={country:''}
        await theDatabase.deleteMany()
        await theDatabase.create(data)
        await theDatabase.updateMany(otherCountries,{country:'others'})
        await theDatabase.updateMany(otherSectors,{sector:'others'})
        await theDatabase.updateMany(otherTopics,{topic:'others'})
        res.send({msg:'done'})
    }catch(e){
        console.log(e)
    }
}
const demo=async(req,res)=>{
    try{
        const {endYear,topic,sector,region,pestle,source,country}=req.query;
        const queryParameters={}
        if(endYear){
            queryParameters.end_year=Number(endYear)

        }
        if(topic){
            queryParameters.topic=topic

        }
        if(sector){
            queryParameters.sector=sector

        }
        if(region){
            queryParameters.region=region

        }
        if(pestle){
            queryParameters.pestle=pestle

        }
        if(source){
            queryParameters.source=source

        }
        if(country){
            queryParameters.country=country

        }
        // console.log('wait')
        console.log(queryParameters)
        const records=await theDatabase.find(queryParameters)
        console.log(records)
        res.json({data:records})

    }catch(e){
        console.log(e)

    }
}

const filterByRegion=async(req,res)=>{
    const {region}=req.query
    const countries=new Set([])
    const sectors=new Set([])
    let countryData=[]
    let data={}
    let dummy={}
    const theRecordsWithRegion=await theDatabase.find({region:region});
    // console.log(theRecordsWithRegion)
    theRecordsWithRegion.forEach((record)=>{
        const theSector=record.sector
        const theCountry=record.country
        // if(theSector==''){ return }
        sectors.add(theSector)
        countries.add(theCountry)
    })
    // console.log("coutries present in that region",countries);
    // console.log("all sectors of that region",sectors);
    const theCountries=[...countries]
    const theSectors=[...sectors]

    // console.log(theCountries)

    for(let j=0;j<theSectors.length;j++){
        const presentSector=theSectors[j]
        // console.log(presentSector)
        const theCountryRecords= await theRecordsWithRegion.filter((ele)=>(ele.sector==presentSector))
            let count=0;
            let addedIntensity=0;
            let addedRelevence=0;
            let addedLikelihood=0;
            let meanIntensity=0;
            let meanLikelihood=0;
            let meanRelevence=0;

        for(let i=0;i<theCountries.length;i++){
            let country=theCountries[i];
            // console.log(country)
            let theRecords= theCountryRecords.filter((ele)=>(ele.country==country))
            count=0;
            addedIntensity=0;
            addedRelevence=0;
            addedLikelihood=0;
            meanIntensity=0;
            meanLikelihood=0;
            meanRelevence=0;
            countryData=[];
            // console.log(theRecords)
            if(theRecords.length==0){
                addedIntensity=0;
                addedRelevence=0;
                addedRelevence=0;
                count=1;
            }else{
                theRecords.forEach((record)=>{
                    count++;
                    addedIntensity=(addedIntensity += Number(record.intensity))
                    addedRelevence=(addedRelevence+= Number(record.relevance))
                    addedLikelihood=(addedLikelihood+= Number(record.likelihood))
                })
            }
            meanIntensity=addedIntensity/count;
            meanRelevence=addedRelevence/count;
            meanLikelihood=addedLikelihood/count;
            countryData.push(Math.ceil(meanIntensity))
            countryData.push(Math.ceil(meanRelevence))
            countryData.push(Math.ceil(meanLikelihood))
            dummy[country]=countryData
            data[presentSector]=dummy
        }

        dummy={}   
        }
        // console.log(data)
        res.json(data)
    }

const filterBySector=async(req,res)=>{
    const {region,sector}=req.query
    // console.log(sector)
    let addedLikelihood=0;
    let addedRelevence=0;
    let addedIntensity=0;
    let meanIntensity=0
    let meanLikelihood=0
    let meanRelevence=0
    let data={}
    let countries=new Set([])
    let topics=new Set([])
    const theRecordsWithRegion=await theDatabase.find({region:region})
    theRecordsWithRegion.forEach((record)=>{
        const theCountry=record.country;
        countries.add(theCountry)
    })
    const theRegionAndSectorData=theRecordsWithRegion.filter((record)=>{
        return record.sector==sector
    })
    theRegionAndSectorData.forEach((e)=>{
        const theTopic=e.topic
        topics.add(theTopic)
    })
    // console.log("topics:",topics)
    countries=[...countries]
    topics=[...topics]
    // console.log("countries",countries)
    // console.log("topics",topics)
    for(let i=0;i<countries.length;i++){
        const theCountry=countries[i]
        // console.log(theCountry)
        let dummy={}
            const theRecords=theRegionAndSectorData.filter((ele)=>{
                return (ele.country==theCountry)
            })
            // console.log(theRecords)
            for(let j=0;j<topics.length;j++){
                theDataArray=[]
                let count=0
                let theTopic=topics[j]
                // console.log(theTopic)
                let finalRecords= theRecords.filter((ele)=>{
                    return (ele.topic==theTopic)
                })
                // console.log("FinalRecords",finalRecords,theCountry,theTopic)
                // console.log("final records",finalRecords)
        
            if(finalRecords.length==0){
                addedIntensity=0;
                addedRelevence=0;
                addedLikelihood=0;
                count=1
            }else{
                // console.log("the country",theCountry,"theTopic",theTopic)
                    finalRecords.forEach((record)=>{
                    count=count+1
                    addedIntensity=((addedIntensity)+Number(record.intensity))
                    addedRelevence=((addedRelevence)+Number(record.relevance))
                    addedLikelihood=((addedLikelihood)+Number(record.likelihood))
                })
                // console.log(addedIntensity,addedRelevence,addedLikelihood)
            }
            // console.log(count)
            meanIntensity=addedIntensity/count;
            meanLikelihood=addedLikelihood/count;
            meanRelevence=addedRelevence/count;
            // console.log(meanIntensity)
            // console.log(meanRelevence)
            // console.log(meanLikelihood)
            theDataArray.push(Math.ceil(meanIntensity))
            theDataArray.push(Math.ceil(meanRelevence))
            theDataArray.push(Math.ceil(meanLikelihood))
            dummy[theTopic]=theDataArray
            // console.log(dummy)
            count=0;
        }
        // console.log(dummy)
        data[theCountry]=dummy
        // console.log(data)
    }
    // console.log("data",data)
    res.json(data)
}

module.exports={refreshProducts,demo,filterByRegion,filterBySector}
