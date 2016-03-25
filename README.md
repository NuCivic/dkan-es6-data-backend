# DKAN Backend for es6
Fetch and query DKAN data from its API.

# Quickstart
```javascript
import DKAN from 'dkan-es6-data-backend';
let dataset = {
  endpoint: 'http://demo.getdkan.com/api',
  url: 'http://demo.getdkan.com/api/3/action/datastore_search?=&resource_id=db114e1f-cf44-4cef-b4a7-b2451b039fb1',
  id: 'db114e1f-cf44-4cef-b4a7-b2451b039fb1'
};

DKAN.query({size: 10, from: 0}, dataset).then(data => {
    // data is formatted:
    {
      fields: ['field1', 'field2', ...],
      records: [{ field1: 'value'}, ...]
    }
});
```

