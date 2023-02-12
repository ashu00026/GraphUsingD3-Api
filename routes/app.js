const express=require('express')
const router=express.Router()
const {refreshProducts,demo,filterByRegion,filterBySector,getAllRegions}=require('../controllers/app')



router.route('/refreshProducts').get(refreshProducts)
router.route('/filterByRegion').get(filterByRegion)
router.route('/filterBySector').get(filterBySector)
router.route('/getAllRegions').get(getAllRegions)

router.route('/demo').get(demo)

module.exports=router