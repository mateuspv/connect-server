var FB = require('fb');
FB.setAccessToken('CAAKC8G2aZCt0BALuQL6DdArLxVUaAtwhCBb51ULO2kOeOVqFHiboBvFHvHMTf8v31VxUN0n8H6WXlT8TbOhpmIMLNk1ZAAdbdZBlKA8IGFM3rZC2HZCh7ZCv3zIbusXZCkbZAi4DTXw0shnEeoEZB5sf6J9ei7t23b7JEo3ytp8thZCDO6tQ9h837RoFPe6ZAlxTyO4CS41Jr5NwlgSQx20oOqB');

FB.api('me', function (res) {
  if(!res || res.error) {
   console.log(!res ? 'error occurred' : res.error);
   return;
  }
  console.log(res);
});