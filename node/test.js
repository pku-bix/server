// bix API test
//
var request = require('request');
var ip      = "121.40.72.197"

function get(path){
  request({ 
      url:  "http://"+ip+path,
    },
    function(error,res,body){
        if(error){
          console.log('GET error(raw):', error)
          console.log('GET error(parsed):', JSON.stringify(JSON.parse(error), null, 4))
        } 
        else{
          console.log('GET success(raw):', body)
          console.log('GET success(parsed):', JSON.stringify(JSON.parse(body), null, 4))
        }
      }
  )
}

get('/api/piles')
get('/api/pile/54277ee1106a83fa0ab1c8c1')

