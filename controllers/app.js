const { theDatabase } = require("../model/app");
const data = require("../jsondata");

const refreshProducts = async (req, res) => {
  try {
    // console.log('here')
    const otherSectors = { sector: "" };
    const otherTopics = { topic: "" };
    const otherCountries = { country: "" };
    const otherRegions = { region: "" };
    await theDatabase.deleteMany();
    await theDatabase.create(data);
    await theDatabase.updateMany(
      { sector: "Aerospace & defence" },
      { sector: "Aerospace And defence" }
    );
    await theDatabase.updateMany(
      { sector: "Food & agriculture" },
      { sector: "Food And agriculture" }
    );
    await theDatabase.updateMany(otherRegions, { region: "others" });
    await theDatabase.updateMany(otherCountries, { country: "others" });
    await theDatabase.updateMany(otherSectors, { sector: "others" });
    await theDatabase.updateMany(otherTopics, { topic: "others" });
    res.send({ msg: "done" });
  } catch (e) {
    console.log(e);
  }
};
const demo = async (req, res) => {
  try {
    const { endYear, topic, sector, region, pestle, source, country } =
      req.query;
    const queryParameters = {};
    if (endYear) {
      queryParameters.end_year = Number(endYear);
    }
    if (topic) {
      queryParameters.topic = topic;
    }
    if (sector) {
      queryParameters.sector = sector;
    }
    if (region) {
      queryParameters.region = region;
    }
    if (pestle) {
      queryParameters.pestle = pestle;
    }
    if (source) {
      queryParameters.source = source;
    }
    if (country) {
      queryParameters.country = country;
    }
    // console.log('wait')
    // console.log(queryParameters)
    const records = await theDatabase.find(queryParameters);
    // console.log(records)
    res.json({ data: records });
  } catch (e) {
    console.log(e);
  }
};

const filterByRegion = async (req, res) => {
  // console.log("header ---------",req.headers)

  const { region } = req.body;
  const countries = new Set([]);
  const sectors = new Set([]);
  let countryData = [];
  let data = {};
  let dummy = {};
  const theRecordsWithRegion = await theDatabase.find({ region: region });
  // console.log(theRecordsWithRegion)
  theRecordsWithRegion.forEach((record) => {
    const theSector = record.sector;
    const theCountry = record.country;
    // if(theSector==''){ return }
    sectors.add(theSector);
    countries.add(theCountry);
  });
  // console.log("coutries present in that region",countries);
  // console.log("all sectors of that region",sectors);
  const theCountries = [...countries];
  const theSectors = [...sectors];

  // console.log(theCountries)

  for (let j = 0; j < theSectors.length; j++) {
    const presentSector = theSectors[j];
    // console.log(presentSector)
    const theCountryRecords = theRecordsWithRegion.filter(
      (ele) => ele.sector == presentSector
    );
    let count = 0;
    let addedIntensity = 0;
    let addedRelevence = 0;
    let addedLikelihood = 0;
    let meanIntensity = 0;
    let meanLikelihood = 0;
    let meanRelevence = 0;

    for (let i = 0; i < theCountries.length; i++) {
      let country = theCountries[i];
      // console.log(country)
      let theRecords = theCountryRecords.filter(
        (ele) => ele.country == country
      );
      count = 0;
      addedIntensity = 0;
      addedRelevence = 0;
      addedLikelihood = 0;
      meanIntensity = 0;
      meanLikelihood = 0;
      meanRelevence = 0;
      countryData = [];
      // console.log(theRecords)
      if (theRecords.length == 0) {
        addedIntensity = 0;
        addedRelevence = 0;
        addedRelevence = 0;
        count = 1;
      } else {
        theRecords.forEach((record) => {
          count++;
          addedIntensity = addedIntensity += Number(record.intensity);
          addedRelevence = addedRelevence += Number(record.relevance);
          addedLikelihood = addedLikelihood += Number(record.likelihood);
        });
      }
      meanIntensity = addedIntensity / count;
      meanRelevence = addedRelevence / count;
      meanLikelihood = addedLikelihood / count;
      countryData.push(Math.ceil(meanIntensity));
      countryData.push(Math.ceil(meanRelevence));
      countryData.push(Math.ceil(meanLikelihood));
      dummy[country] = countryData;
      data[presentSector] = dummy;
    }

    dummy = {};
  }
  // console.log(data)
  let finalCountryIntensities = [];
  let finalCountryRelevaces = [];
  let finalCountryLiklihoods = [];
  for (let i = 0; i < theCountries.length; i++) {
    let intensities = [];
    let relevances = [];
    let liklihoods = [];
    for (let j = 0; j < theSectors.length; j++) {
      const theCountryNow = theCountries[i];
      const theSectorNow = theSectors[j];
      const theObject = data[theSectorNow];
      const theArray = theObject[theCountryNow];
      intensities.push(theArray[0]);
      relevances.push(theArray[1]);
      liklihoods.push(theArray[2]);
    }
    finalCountryIntensities.push(intensities);
    finalCountryRelevaces.push(relevances);
    finalCountryLiklihoods.push(liklihoods);
  }
  // console.log(finalCountryIntensities)
  // console.log(finalCountryLiklihoods)
  // console.log(finalCountryRelevaces)
  // const finalSectors=Object.keys(data)
  // const aSector=finalSectors[0];
  // const finalIntensities=[]
  // const finalRelevences=[]
  // const finalLikelihoods=[]

  // // console.log(aSector)
  // // console.log(data[aSector])
  // const resultToGet=data[aSector];
  // const finalCountries=Object.keys(resultToGet)
  // for(let i=0;i<finalSectors.length;i++){
  //     const sectorNow=finalSectors[i]
  //     console.log(sectorNow)
  //     const theObject=data[sectorNow]
  //     console.log(theObject)
  //     const intensitiesShort=[]
  //     const liklihoodsShort=[]
  //     const relevencesShort=[]
  //     for(let j=0;j<theCountries.length;j++){
  //         const countryNow=theCountries[j];
  //         const theArray=theObject[countryNow]
  //         intensitiesShort.push(theArray[0])
  //         relevencesShort.push(theArray[1])
  //         liklihoodsShort.push(theArray[2])
  //     }
  //     finalIntensities.push(intensitiesShort)
  //     finalRelevences.push(relevencesShort)
  //     finalLikelihoods.push(liklihoodsShort)
  // }

  // console.log("sectors",finalSectors)
  // console.log("countries",finalCountries)
  // console.log("finalIntensities",finalIntensities)
  // console.log("finalRelevences",finalRelevences)
  // console.log("final liklihoods",finalLikelihoods)

  // res.json({data,finalSectors,finalCountries,finalIntensities,finalRelevences,finalLikelihoods})
  res.json({
    finalCountryRelevaces,
    finalCountryLiklihoods,
    finalCountryIntensities,
    data,
    theCountries,
    theSectors,
  });
};

const filterBySector = async (req, res) => {
  // console.log("header ---------",req.headers)
  let { region, sector } = req.body;
  const operatorMap = {
    "&": "And",
  };
  const regEx = /\b(&)\b/g;
  sector = sector.replace(regEx, (match) => `${operatorMap[match]}`);

  // console.log(sector)
  // console.log(region)
  // console.log(sector)
  let addedLikelihood = 0;
  let addedRelevence = 0;
  let addedIntensity = 0;
  let meanIntensity = 0;
  let meanLikelihood = 0;
  let meanRelevence = 0;
  let data = {};
  let countries = new Set([]);
  let topics = new Set([]);
  const theRecordsWithRegion = await theDatabase.find({ region: region });
  theRecordsWithRegion.forEach((record) => {
    const theCountry = record.country;
    countries.add(theCountry);
  });
  const theRegionAndSectorData = theRecordsWithRegion.filter((record) => {
    return record.sector == sector;
  });
  theRegionAndSectorData.forEach((e) => {
    const theTopic = e.topic;
    topics.add(theTopic);
  });
  // console.log("topics:",topics)
  countries = [...countries];
  topics = [...topics];
  // console.log("countries",countries)
  // console.log("topics",topics)
  for (let i = 0; i < countries.length; i++) {
    const theCountry = countries[i];
    // console.log(theCountry)
    let dummy = {};
    const theRecords = theRegionAndSectorData.filter((ele) => {
      return ele.country == theCountry;
    });
    // console.log(theRecords)
    for (let j = 0; j < topics.length; j++) {
      theDataArray = [];
      let count = 0;
      let theTopic = topics[j];
      // console.log(theTopic)
      let finalRecords = theRecords.filter((ele) => {
        return ele.topic == theTopic;
      });
      // console.log("FinalRecords",finalRecords,theCountry,theTopic)
      // console.log("final records",finalRecords)

      if (finalRecords.length == 0) {
        addedIntensity = 0;
        addedRelevence = 0;
        addedLikelihood = 0;
        count = 1;
      } else {
        // console.log("the country",theCountry,"theTopic",theTopic)
        finalRecords.forEach((record) => {
          count = count + 1;
          addedIntensity = addedIntensity + Number(record.intensity);
          addedRelevence = addedRelevence + Number(record.relevance);
          addedLikelihood = addedLikelihood + Number(record.likelihood);
        });
        // console.log(addedIntensity,addedRelevence,addedLikelihood)
      }
      // console.log(count)
      meanIntensity = addedIntensity / count;
      meanLikelihood = addedLikelihood / count;
      meanRelevence = addedRelevence / count;
      // console.log(meanIntensity)
      // console.log(meanRelevence)
      // console.log(meanLikelihood)
      theDataArray.push(Math.ceil(meanIntensity));
      theDataArray.push(Math.ceil(meanRelevence));
      theDataArray.push(Math.ceil(meanLikelihood));
      dummy[theTopic] = theDataArray;
      // console.log(dummy)
      count = 0;
    }
    // console.log(dummy)
    data[theCountry] = dummy;
    // console.log(data)
  }
  let finalIntensities = [];
  let finalRelevances = [];
  let finalLikelihoods = [];
  // console.log("data",data)
  // res.json(data)
  for (let i = 0; i < countries.length; i++) {
    let intensities = [];
    let relevances = [];
    let liklihoods = [];
    for (let j = 0; j < topics.length; j++) {
      const theCountry = countries[i];
      const theTopic = topics[j];
      const theObject = data[theCountry];
      const theArray = theObject[theTopic];
      intensities.push(theArray[0]);
      relevances.push(theArray[1]);
      liklihoods.push(theArray[2]);
    }
    finalIntensities.push(intensities);
    finalRelevances.push(relevances);
    finalLikelihoods.push(liklihoods);
  }
  // console.log("finalIntensities",finalIntensities)
  // console.log("finalLikelihoods",finalLikelihoods)
  // console.log("finalRelevances",finalRelevances)
  // console.log("topics",topics)
  // console.log("countries",countries)

  res
    .status(200)
    .json({
      finalIntensities,
      finalLikelihoods,
      finalRelevances,
      topics,
      countries,
      data,
    });
};

const getAllRegions = async (req, res) => {
  try {
    // console.log(req.headers)
    console.log("Hit Backend");
    // console.log("the way")
    const theRecords = await theDatabase.find();
    let theRegions = new Set([]);
    theRecords.forEach((record) => {
      const theRegion = record.region;
      theRegions.add(theRegion);
    });
    // console.log(theRegions)
    const allRegions = [...theRegions];
    res.json({ allRegions });
  } catch (e) {
    console.log(e);
  }
};
module.exports = {
  refreshProducts,
  demo,
  filterByRegion,
  filterBySector,
  getAllRegions,
};
