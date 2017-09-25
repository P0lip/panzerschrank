import serializers from 'src/serializers/date';

const [date] = serializers;

describe('Date serializer', () => {
  test('matches instance', () => {
    expect(new Date() instanceof date).toBe(true);
    expect(new class extends Date {} instanceof date).toBe(true);
  });

  test('clones properly', () => {
    const d = new Date();
    expect(date.serializer(d)).not.toBe(d);
    expect(date.serializer(d)).toEqual(d);
    expect(new (class extends Date {})(0)).toEqual(new Date(0));
  });
});
