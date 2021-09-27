// created by Kieran Watson

const MoPi = require("../../MoPi")

// milisecond converter
test('Checks that 1 years is equal to 31556952000', () => {
    expect(MoPi.yearToMiliseconds(1)).toBe(31556952000);
});

test('Checks that 4 years is equal to 31556952000', () => {
    expect(MoPi.yearToMiliseconds(4)).toBe(126227808000);
});

test('Checks that 6.25 years is equal to 31556952000', () => {
    expect(MoPi.yearToMiliseconds(6.25)).toBe(197230950000);
});

test('Checks that 20 years is equal to 315569520000', () => {
    expect(MoPi.yearToMiliseconds(10)).toBe(315569520000);
});

test('Checks that 100 years is equal to 3155695200000', () => {
    expect(MoPi.yearToMiliseconds(100)).toBe(3155695200000);
});

// flag
test('Checks date 1999, with a 0 year review to return true', () => {
    expect(MoPi.reviewFlag(new Date(1999, 1), 0)).toBe(true);
});

test('Checks date 2023, with a 0 year review to return false', () => {
    expect(MoPi.reviewFlag(new Date(2023, 4), MoPi.yearToMiliseconds(0))).toBe(false);
});