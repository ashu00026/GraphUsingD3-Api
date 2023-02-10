const express=require('express')
const router=express.Router()
const {refreshProducts,demo,filterByRegion,filterBySector}=require('../controllers/app')



router.route('/refreshProducts').get(refreshProducts)
router.route('/filterByRegion').get(filterByRegion)
router.route('/filterBySector').get(filterBySector)

router.route('/demo').get(demo)

module.exports=router