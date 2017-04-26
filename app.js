var express = require('express');
var app = express();
var bodyParser = require('body-parser')
var fs = require('fs')
var expressLayouts = require('express-ejs-layouts')


app.use(express.static('public')) // this is the new part
app.render('data.ejs')
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: false
}))


app.get('/', function(request, response) {
  response.render('data');
});
//the /form is the route for the page, form_data is the file
app.get('/form', function(request, response) {
  response.render('form_data');
});

app.post('/MLB', function(request, response) {
  // console.log(request.body.sportsTeam)
  var teamsListed = fs.readFileSync("teams.json")
  var teams = JSON.parse(teamsListed)
  var teamStatus = request.body
  // var obj = Object.values(teams)
  // console.log(teamStatus)
  var myTeam


  for (let i = 0; i < teams.length; i++) {
    if (teams[i].teamStatus[0] === teamStatus.sportsTeam) {
      console.log(teams[i])
      myTeam = teams[i]

    }
    // console.log(myTeam);
  }
  if (myTeam) {
    response.render('team-update', myTeam);
  } else {
    response.redirect("/")
  }

})

app.post('/team-update', function(request, response) {
  let responses = request.body
  //open the data.json file, and parse into a JSON Object
  var teamUpdates = undefined
  var rawFile = fs.readFileSync('teams.json')
  var teamUpdates = JSON.parse(rawFile)

  teamUpdates.push(responses)
  // console.log(responses)

  console.log(response)

  //time to save the data back to disk
  fs.writeFileSync('teams.json', JSON.stringify(teamUpdates))
  response.render('team-update', responses)
})


app.listen(3000, function() {
  console.log('Example app listening on port 3000!');
});
