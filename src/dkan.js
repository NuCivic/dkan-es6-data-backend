const DKAN = {};
const API_ENDPOINT = 'http://datahub.io/api';
const CKAN_TYPES_MAP = {
  'int4': 'integer',
  'int8': 'integer',
  'float8': 'float'
};
DKAN.__type__ = 'dkan';


DKAN.fetch = (dataset) => {
  return new Promise((resolve, reject) => {
    var wrapper;
    if (dataset.endpoint) {
      wrapper = new DataStore(dataset.endpoint);
    } else {
      let out = DKAN._parseCkanResourceUrl(dataset.url);
      dataset.id = out.resource_id;
      wrapper = new DataStore(out.endpoint);
    }
    let request = wrapper.search({resource_id: dataset.id, limit: 0});
    request
      .then((response) => response.json())
      .then(function(results) {
        let fields = results.result.fields.map(function(field) {
          field.type = field.type in CKAN_TYPES_MAP ? CKAN_TYPES_MAP[field.type] : field.type;
          return field;
        });
        let out = {
          fields: fields,
          useMemoryStore: false
        };
        resolve(out);
      }).catch((err) => {
        reject(err);
      });
  });
};
DKAN._normalizeQuery = (queryObj, dataset) => {
  let actualQuery = {
    resource_id: dataset.id,
    q: queryObj.q || '',
    filters: {},
    limit: queryObj.size || 10,
    offset: queryObj.from || 0
  };

  if (queryObj.sort && queryObj.sort.length > 0) {
    var _tmp = queryObj.sort.map(function(sortObj) {
      return sortObj.field + ' ' + (sortObj.order || '');
    });
    actualQuery.sort = _tmp.join(',');
  }

  if (queryObj.filters && queryObj.filters.length > 0) {
    _.each(queryObj.filters, function(filter) {
      if (filter.type === "term") {
        actualQuery.filters[filter.field] = filter.term;
      }
    });
  }
  return actualQuery;
};

DKAN.query = (queryObj, dataset) => {
  return new Promise((resolve, reject) => {
    let wrapper;
    let out;
    if (dataset.endpoint) {
      wrapper = new DataStore(dataset.endpoint);
    } else {
      out = DKAN._parseCkanResourceUrl(dataset.url);
      dataset.id = out.resource_id;
      wrapper = DKAN.DataStore(out.endpoint);
    }
    let actualQuery = DKAN._normalizeQuery(queryObj, dataset);
    let request = wrapper.search(actualQuery);
    request
      .then((response) => response.json())
      .then((results) => {
        out = {
          total: results.result.total,
          hits: results.result.records
        };
        resolve(out);
      })
      .catch((err) => {
        reject(err);
      });
  })
};

DKAN._parseCkanResourceUrl = function(url) {
  parts = url.split('/');
  let len = parts.length;
  return {
    resource_id: parts[len-1],
    endpoint: parts.slice(0,[len-4]).join('/') + '/api'
  };
};

class DataStore {

  constructor(endpoint) {
    this.endpoint = endpoint || API_ENDPOINT;
  }

  search(data) {
    var filters = '';
    if (data.filters) {
      for (var filter in data.filters) {
        filters = '&filters[' + filter + ']=' + data.filters[filter];
      }
    }
    var searchUrl = this.endpoint + '/3/action/datastore_search?=' + this._objToQuery(data) + filters;
    return fetch(searchUrl);
  }

  _objToQuery(obj) {
    let str = '';
    for (let p in obj) {
      if (obj.hasOwnProperty(p)) {
        if (typeof obj[p] !== 'object') {
          str += '&' + p + '=' + obj[p] ;
        }
      }
    }
    return str;
  }
}

export default DKAN;