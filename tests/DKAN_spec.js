import DKAN from '../src/dkan.js';

let dataset = {
  endpoint: 'http://demo.getdkan.com/api',
  url: 'http://demo.getdkan.com/api/3/action/datastore_search?=&resource_id=db114e1f-cf44-4cef-b4a7-b2451b039fb1',
  id: 'db114e1f-cf44-4cef-b4a7-b2451b039fb1'
}

describe('Test DKAN backend load', () => {
  it('Should load', () => {
    expect(DKAN.__type__).toEqual('dkan');
  });
});

describe('Test Async', () => {
  let d;
  beforeEach(done => {
    setTimeout(() => {
      d = {a: 'b'};
      done();
    }, 1000)
  });

  it('Should return data', done => {
    expect(typeof d).toEqual('object');
    done();
  });
});

describe('Test DKAN Backend Fetch', () => {
  let d;
  beforeEach(done => {
    DKAN.query({}, dataset).then(data => {
      d = data;
      done();
    })
    .catch((err) => {
      done();
    });
  });

  it('Should fetch and return valid data', done => {
    expect(d).not.toBe(undefined);
    expect(Array.isArray(d.hits)).toBe(true);
    expect(d.total).not.toBe(undefined);
    done();
  });
});
