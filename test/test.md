## Testing
### --- Ryan Donnelly ---
Testing was done throughout the completion of the project. In order to test the routes I made were working, I simply attempted to navigate to the website url which would tell me if the routes were correct or not. Testing was also done using Jest (A JavaScript testing framework). Tests were written for the MoPI system, the security features in the application and also the validation methods used to ensure user input to the database was in the correct format. These Jest tests can be seen in a testing table below:

| Type of test  |  Expected Outcome |  Actual Outcome | Pass/Fail  |
| --------------| ------------------| ----------------|------------|
| Unit test  | MoPI methods ‘yearToMiliseconds()’ and ‘reviewFlag()’ work as expected  |  Both methods worked as expected | Pass  |
| Unit test  | Security methods ‘encrypt’ and ‘decrypt’ work as expected  |  Both methods worked as expected |  Pass |
| Unit test  | All validation methods work as expected  | All methods worked as expected  | Pass  |


All the testing files can be seen below:
[MoPI Testing File](https://imgur.com/a/JSRqbaW)
[Security Testing File](https://imgur.com/a/CobKcRE)
[Validation Testing File](https://imgur.com/a/JxB9IGl)

### -------

### Mopi
To test the MoPi functionality I had to use the external DB to edit review dates in order to xcheck the required outcome is complete. tests were carried out using these MoPi Seetings.

```JSON
{
    "Group1": {
        "Review": "10",
        "Delete": "100",
        "Auto": false
    },
    "Group2": {
        "Review": "6",
        "Delete": "100",
        "Auto": false
    },
    "Group3": {
        "Review": "6",
        "Delete": "20",
        "Auto": true
    }
}
```
#### Table of results:
| Type of test      | Expected Outcome     | Actual Outcome     | Pass/Fail |
| :------------- | :---------- | :----------- | :----------- |
|  Group 1 Current | Not shown | Not Shown | Pass |
| Group 1 (5 Years)| Not shown | Not Shown | Pass |
|  Group 1 (10 years) | shown | Shown | Pass |
| Group 1 (100 Years)| shown | Shown | Pass |
|  Group 2 Current | Not shown | Not Shown | Pass | 
| Group 2 (5 Years)| Not shown | Not Shown | Pass |
|  Group 2 (6 years) | shown | Shown | Pass |
| Group 2 (100 Years)| Deleted | Deleted | Pass |
|  Group 1 Current | Not shown | Not Shown | Pass |
| Group 1 (5 Years)| Not shown | Not Shown | Pass |
|  Group 1 (6 years) | shown | Shown | Pass |
| Group 1 (20 Years)| Deleted | Deleted | Pass |