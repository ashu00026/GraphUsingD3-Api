const express=require('express')
const router=express.Router()
const {refreshProducts,demo,filterByRegion,filterBySector,getAllRegions}=require('../controllers/app')


//localhost:3000/home

router.route('/refreshProducts').get(refreshProducts)
router.route('/filterByRegion').post(filterByRegion)
router.route('/filterBySector').post(filterBySector)
router.route('/getAllRegions').get(getAllRegions)

router.route('/demo').get(demo)

module.exports=router