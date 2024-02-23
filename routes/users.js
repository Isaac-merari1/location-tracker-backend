var express = require('express');
var router = express.Router();

const app = express()
const port = 3001

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

app.get('/', function(req, res, next) {
  console.log("hello");
  res.send('hello');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

module.exports = router;
