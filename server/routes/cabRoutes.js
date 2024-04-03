const express = require('express');
const router = express.Router();
const Cab = require('../models/Cab');

// GET /cabs
router.get('/', async (req, res) => {
  try {
    const cabs = await Cab.find({ busyDuration: { $lt: Date.now() } });
    res.status(200).json(cabs);
  } catch (error) {
    res.status(500).json({ error: 'Could not retrieve cabs.' });
  }
});

// GET /cabs/:id
router.get('/:id', async (req, res) => {
  try {
    const cab = await Cab.findById(req.params.id);
    if (!cab) {
      return res.status(404).json({ error: 'Cab not found.' });
    }
    res.status(200).json(cab);
  } catch (error) {
    res.status(500).json({ error: 'Could not retrieve the cab.' });
  }
});

// PUT /cabs/:id
router.put('/:id', async (req, res) => {
  try {
    const cabId = req.params.id;
    const { name } = req.body;
    const updateCab = await Cab.findByIdAndUpdate(
      cabId,
      { $set: { name: name } },
      { new: true }
  );
    res.status(200).json(updateCab);
  } catch (error) {
    res.status(500).json({ error: 'Could not update the cab.' });
  }
});
// DELETE /cabs/:id
router.delete('/:id', async (req, res) => {
  try {
    const deletedCab = await Cab.findByIdAndDelete(req.params.id);
    if (!deletedCab) {
      return res.status(404).json({ error: 'Cab not found.' });
    }
    res.status(200).json({
      status: 'success',
      message: 'Cab deleted successfully.',
    });
  } catch (error) {
    res.status(500).json({ error: 'Could not delete the cab.' });
  }
});

router.put('/free/:id',async(req,res)=>{

  try{
    const updatedBooking = await Cab.findByIdAndUpdate(req.params.id, {
      $set: {
        busyDuration: new Date().getTime(),
      },
    });
    // sendCabBookingCancellation();
    return res.status(200).json(updatedBooking);
    
  }catch(err){
    res.status(500).json({ error: 'Could not free the cab.' });
  }
})


module.exports = router;
