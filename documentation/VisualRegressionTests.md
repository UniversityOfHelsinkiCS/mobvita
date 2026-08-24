## Visual Regression and UI Coverage Testing with Cypress

### Current challenge

Our application has a complex user interface with:

* Many pages and multiple states within each page
* A large number of reusable components
* Different user roles and modes, such as **Student** and **Teacher**
* Multiple interface localizations, including English and Russian
* Screens and UI states that can be difficult to reach manually, even for the designer

Currently, we have a small set of Cypress end-to-end tests used as part of the deployment process. These tests cover important user flows, but they do not provide comprehensive coverage of pages, UI states, user roles, components, or localization variants.

As a result, during a major UI redesign, it is difficult to verify all existing interface variations and ensure that previously available functionality and screens are not accidentally affected.

### Proposed solution

Create a separate Cypress configuration and a dedicated **UI coverage / visual regression test suite**.

The test suite systematically navigates through important pages and UI states and generates screenshots organized into a clear folder structure, for example by:

* User role: Student / Teacher
* Page or feature
* UI state
* Localization

Initially, the tests will focus on **automated screenshot generation** rather than visual comparison.

The generated screenshots will serve as a structured visual catalog of the application.

### Benefits

**Better UI visibility**

Developers and designers can quickly review existing pages, states, and interface variations without manually navigating through the application.

**Support for the redesign process**

The screenshots provide a visual reference of the current application and help ensure that important states or features are not overlooked during redesign.

**Improved test coverage**

The suite creates a structured list of important UI states. Over time, it can be extended with functional assertions to verify that elements are displayed and behave correctly.

**Foundation for visual regression testing**

In the future, screenshots can be used as a baseline for automated visual regression testing, allowing unexpected UI changes to be detected automatically.

**Local pre-release validation**

The test suite can also be executed locally before publishing a release. This allows developers to quickly review the application's visual state and detect unexpected changes before deployment.

### Summary

This approach is not intended to replace our existing Cypress end-to-end tests. Instead, it complements them with broader **UI state coverage and visual testing**.

The immediate goal is to create a reliable and repeatable visual overview of the application. In the future, the same test suite can gradually evolve into a more comprehensive combination of **functional UI testing and automated visual regression testing**.
