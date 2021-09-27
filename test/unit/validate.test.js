// created by Ryan Donnelly

const validation = require("../../validation")

//a series of tests to ensure all the validation methods in validation/index.js are working as intended - Ryan Donnelly 

test('check if ints are accepted as first name', () => {
    expect(validation.validateFirstName(5)).toBe(false);
});

test('check if "" is accepted as last name', () => {
    expect(validation.validateLastName("")).toBe(false)
});

test('check if "23/01/2020" is accepted as date', () => {
    expect(validation.validateDate("23/01/2020")).toBe(true)
});

test('check if "half past 4" is accepted as time', () => {
    expect(validation.validateTime("half past 4")).toBe(false)
});

test('check if "NE4 5TG" is accepted as postcode', () => {
    expect(validation.validatePostcode("NE4 5TG")).toBe(true)
});

test('check if "Group 2" is accepted as classification', () => {
    expect(validation.validateClassification("Group 2")).toBe(true)
});

test('check if "50" is accepted as age', () => {
    expect(validation.validateBuild(50)).toBe(true)
});

test('check if "insert" is accepted as build', () => {
    expect(validation.validateBuild("insert")).toBe(false)
});

test('check if "<" is accepted as clothes', () => {
    expect(validation.validateClothes("<")).toBe(false)
});

test('check if ">" is accepted as distinguishing features', () => {
    expect(validation.validateDistinguishingFeatures(">")).toBe(false)
});

test('check if "1000000" is accepted as elevation', () => {
    expect(validation.validateElevation("1000000")).toBe(false)
});

test('check if "!" is accepted as face', () => {
    expect(validation.validateFace("!")).toBe(false)
});

test('check if "delete" is accepted as hair', () => {
    expect(validation.validateHair("delete")).toBe(false)
});

test('check if "script" is accepted as gait', () => {
    expect(validation.validateHair("script")).toBe(false)
});

test('check if "female" is accepted as sex', () => {
    expect(validation.validateHair("female")).toBe(true)
});