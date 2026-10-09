import { describe, expect, it } from 'vitest';
import { formatLocation, parseLocation } from './location.js';

describe('parseLocation', () => {
  it('reads plain coordinates, with or without brackets', () => {
    expect(parseLocation('-6.2501638, 106.7913501')).toMatchObject({ lat: -6.2501638, lng: 106.7913501 });
    expect(parseLocation('(-6.2501638, 106.7913501)')).toMatchObject({ lat: -6.2501638, lng: 106.7913501 });
  });

  it('prefers the dropped pin over the map centre in a full link', () => {
    const loc = parseLocation(
      'https://www.google.com/maps/place/Taman+Suropati/@-6.1993,106.8320,17z/data=!3m1!4b1!4m6!3m5!1s0x0:0x0!8m2!3d-6.1998!4d106.8327',
    );
    expect(loc).toMatchObject({ lat: -6.1998, lng: 106.8327 });
    expect(loc.url).toBe('https://www.google.com/maps/search/?api=1&query=-6.1998,106.8327');
  });

  it('reads q= links and map-centre links', () => {
    expect(parseLocation('https://maps.google.com/?q=-6.2,106.8')).toMatchObject({ lat: -6.2, lng: 106.8 });
    expect(parseLocation('https://www.google.co.id/maps/@-6.21,106.84,15z')).toMatchObject({ lat: -6.21, lng: 106.84 });
  });

  it('keeps short share links as links', () => {
    const loc = parseLocation('Taman Suropati https://maps.app.goo.gl/AbCdEf123');
    expect(loc).toEqual({
      raw: 'Taman Suropati https://maps.app.goo.gl/AbCdEf123',
      lat: null,
      lng: null,
      url: 'https://maps.app.goo.gl/AbCdEf123',
    });
    expect(formatLocation(loc)).toBe('Open in Google Maps');
  });

  it('rejects anything that is not a map', () => {
    expect(parseLocation('')).toBeNull();
    expect(parseLocation('my house')).toBeNull();
    expect(parseLocation('https://evil.example/maps/@1,2')).toBeNull();
    expect(parseLocation('https://www.google.com/search?q=1,2')).toBeNull();
    expect(parseLocation('javascript:alert(1)')).toBeNull();
    expect(parseLocation('95, 10')).toBeNull();
  });
});
