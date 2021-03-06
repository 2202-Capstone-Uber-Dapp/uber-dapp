const router = require("express").Router();
const decodeToken = require("../auth");
const { createSession, verifySessionCookie } = require("../auth/authSession");
const {
  models: { Ride, User },
} = require("../db/");
module.exports = router;

router.use(verifySessionCookie);
//  Here we are "mounted on" (starts with) /api/ride

//Creating initial Ride request
router.post("/:userId", async (req, res, next) => {
  try {
    let userId = req.session.user_id;
    //Check Whether they have a ride already
    const rideBool = await Ride.findOne({
      where: { riderUserId: userId },
      // explicitly select only the isCompleted field
      attributes: ["isCompleted"],
    });
    //Ride is DNE or completed, allow for a new one
    if (rideBool === null || rideBool === true) {
      let rideRequest = await Ride.create(req.body);
      const user = await User.findOne({ where: { user_id: userId } });
      await rideRequest.setRider(user);
      res.status(201).json(rideRequest);
    }
    //User already has a pending request, disallow a new one
    else if (rideBool.dataValues.isCompleted === false) {
      throw new Error("Only one Ride Requested permitted at a time");
    }
  } catch (error) {
    next(error);
  }
});

// Updating isCompleted bool to true once driver accepts
router.put("/:userId", async (req, res, next) => {
  try {
    let { rideId } = req.body;
    let userId = req.session.user_id;
    const ride = await Ride.findByPk(rideId);
    const user = await User.findOne({ where: { user_id: userId } });
    await ride.setDriver(user);
    res.send(await ride.update({ isCompleted: true }));
  } catch (err) {
    next(err);
  }
});

//Driver Fetch All Non Fufilled Rides
router.get("/driver", async (req, res, next) => {
  try {
    const requestedRides = await Ride.findAll({
      where: { isCompleted: false, driverUserId: null },
    });
    console.log(requestedRides);
    res.status(201).json(requestedRides);
  } catch (error) {
    next(error);
  }
});

//Ride History
router.get("/:userId", async (req, res, next) => {
  try {
    let { userId } = req.params;
    // let userId = req.session.user_id;
    const userRides = await Ride.findAll({
      where: { isCompleted: true, riderUserId: userId },
    });
    res.status(201).json(userRides);
  } catch (error) {
    next(error);
  }
});
