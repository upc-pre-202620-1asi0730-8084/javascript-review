# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2026-08-27

### Added
- New `PurchaseOrderId` Value Object in the Shared Bounded Context to standardize identifier management.
- Rich domain methods to the `Supplier` entity: `changeName`, `updateEmail`, and `recordOrder`.
- `toString()` method to all Value Objects (`SupplierId`, `PurchaseOrderId`, `ProductId`, `Currency`) for better string representation.
- Comprehensive `.gitignore` file tailored for JavaScript and WebStorm environments.
- ESLint and Prettier configurations (`eslint.config.js`, `.prettierrc`) to the repository.
- `CHANGELOG.md` to track project history.

### Changed
- Implemented deep immutability for all Value Objects (`Money`, `DateTime`, `SupplierId`, etc.) using `Object.freeze` and defensive cloning.
- Refactored `PurchaseOrder` and `PurchaseOrderItem` to use `PurchaseOrderId` instead of raw strings.
- Improved encapsulation in `PurchaseOrder` by using private fields (`#`) and returning read-only copies of internal state.
- Updated `package.json` with improved metadata, scripts (`dev`, `lint`, `format`), and updated dependencies.
- Refactored `docs/user-stories.md` to follow Given-When-Then format and remove UI details.
- Updated `docs/class-diagram.puml` to reflect the new DDD-aligned architecture.
- Replaced the placeholder `test` script with `npm run lint`.
- Updated UUID generation to use version 7.

### Fixed
- Standardized validation logic across all domain objects to ensure they are valid upon creation.
- Fixed inconsistent currency handling when recording order totals for suppliers.
