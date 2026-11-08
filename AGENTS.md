# AGENTS.md — Kriti Blocks

**Version**: 1.1  
**Last Updated**: 2026-08-27  
**Purpose**: Architecture, standards, and guidelines for all Kriti Blocks development

---

## 📑 Table of Contents

1. [Quick Reference](#quick-reference)
2. [Project Overview](#project-overview)
3. [Core Philosophy](#core-philosophy)
4. [Technical Architecture](#technical-architecture-sections-3-9)
5. [Quality & Security Standards](#quality--security-standards-sections-10-25)
6. [Development Process](#development-process-sections-26-27)
7. [Agent-Specific Rules](#agent-specific-rules-sections-28-32)
8. [Block Development](#block-development-sections-33-3310)
9. [Related Documents](#related-documents)

---

## Quick Reference

### Before Starting Code
- [ ] Read sections 1-2 (Overview & Philosophy)
- [ ] Search existing codebase for similar features
- [ ] Review Architecture (section 4)
- [ ] Review Security requirements (section 10)
- [ ] Identify PHP/React boundaries for your feature

### During Development
- [ ] Use WordPress APIs (not custom replacements)
- [ ] Implement permission checks and nonces
- [ ] Add comprehensive error handling
- [ ] Write tests for important logic
- [ ] Preserve backward compatibility
- [ ] Handle accessibility requirements

### Before Submitting PR
- [ ] Use Definition of Done checklist (section 29)
- [ ] Use Agent Working Checklist (section 31)
- [ ] Test in WordPress editor if editor-related
- [ ] Run lint/build/test suite
- [ ] Document any API changes

---

## 1. Project Overview

Kriti Blocks is a WordPress plugin focused on improving the WordPress block editing and content-building experience.

The project is built around Gutenberg/WordPress block technology and provides reusable block-based building functionality. It should feel native to WordPress while adding capabilities that are difficult or cumbersome to achieve with the default editor.

Kriti Blocks should be treated as a production WordPress plugin, not as a standalone React application.

### Core principles

- WordPress remains the source of truth.
- Gutenberg/block APIs should be preferred over custom replacements.
- Reuse WordPress APIs and existing project abstractions before introducing new ones.
- Keep PHP responsible for WordPress integration, persistence, permissions, REST/API boundaries, and server-side behavior.
- Keep React/TypeScript responsible for interactive admin/editor interfaces.
- Do not introduce unnecessary dependencies.
- Preserve compatibility with existing Kriti Blocks installations.
- Keep the plugin modular so additional block, template, pattern, and editor features can be added without rewriting the core.

---

## Core Philosophy

### 2. Product Direction

Kriti Blocks should make it easier to create, organize, reuse, and manage WordPress block-based content.

The product should support a workflow around:

1. Discovering or selecting reusable block designs.
2. Previewing block content.
3. Inserting block content into the WordPress editor.
4. Editing inserted blocks using normal Gutenberg behavior.
5. Saving reusable content where the feature requires persistence.
6. Managing templates/patterns/categories/metadata through the plugin UI.
7. Providing a consistent experience across supported WordPress editor contexts.

The implementation should not lock the product to one theme, page builder, or third-party editor.

---

## Technical Architecture (Sections 3-9)

### 3. Technology Stack

### Backend

- PHP.
- WordPress core APIs.
- WordPress REST API.
- WordPress database APIs.
- WordPress Settings API where appropriate.
- WordPress block APIs.
- WordPress metadata APIs.
- WordPress filesystem APIs when file operations are required.
- WordPress capability and nonce APIs for authorization.

### Frontend

- React.
- JavaScript/TypeScript where already established by the project.
- `@wordpress/element`.
- `@wordpress/components`.
- `@wordpress/block-editor`.
- `@wordpress/blocks`.
- `@wordpress/data`.
- `@wordpress/core-data`.
- `@wordpress/api-fetch`.
- `@wordpress/icons`.
- `@wordpress/plugins`.
- `@wordpress/edit-post` where editor integration requires it.
- `@wordpress/i18n`.

The project has used WordPress Scripts and Font Awesome/React Font Awesome. Do not replace established UI dependencies without a concrete reason.

### Testing

Where configured by the project:

- PHPUnit for PHP logic.
- WordPress test environment.
- Playwright for browser/end-to-end testing.
- ESLint and project JavaScript/TypeScript checks.

---

## 4. Architecture

Use clear separation between:

```text
WordPress
   ↓
Kriti Blocks Application Layer
   ↓
Domain/Feature Services
   ↓
WordPress APIs / REST APIs
   ↓
Persistence / External integrations
```

For editor functionality:

```text
Gutenberg Editor
      ↓
Kriti Blocks React UI
      ↓
WordPress Data / REST API
      ↓
Kriti Blocks PHP Services
      ↓
WordPress Core
```

Do not put business logic directly inside React components when it belongs in a reusable service.

Do not put substantial UI logic inside PHP-rendered HTML when the feature is an interactive React interface.

---

## 5. Existing Code First

Before changing code:

1. Inspect the plugin bootstrap.
2. Identify how classes/services are loaded.
3. Inspect existing REST routes.
4. Inspect existing React entry points.
5. Inspect existing block registrations.
6. Inspect existing data stores and selectors.
7. Inspect existing CSS conventions.
8. Inspect existing database/storage mechanisms.
9. Search for an existing implementation before creating a new abstraction.

Never assume a class, hook, REST endpoint, utility, or component does not exist until the repository has been searched.

### Important rule

**Extend existing architecture before creating parallel architecture.**

Bad:

```text
Existing TemplateService
        +
New MyTemplateService
        +
AnotherTemplateManager
```

Preferred:

```text
Existing TemplateService
        ↓
Extend or compose the existing service
```

---

## 6. WordPress Block Principles

Kriti Blocks must use WordPress block APIs correctly.

Prefer:

- `register_block_type()`
- `register_block_type_from_metadata()`
- `register_block_pattern()`
- `register_block_pattern_category()`
- `parse_blocks()`
- `serialize_blocks()`
- `wp_insert_post()`
- `wp_update_post()`
- WordPress REST APIs
- WordPress data stores

Do not manually manipulate serialized Gutenberg markup when a WordPress block API can perform the operation safely.

Block markup is structured content. Preserve valid block comments and attributes.

Never blindly modify:

```html
<!-- wp:group -->
...
<!-- /wp:group -->
```

or serialized block JSON.

When transforming block content, prefer parsing into block structures, modifying the required data, and serializing it again.

---

## 7. Gutenberg Compatibility

Kriti Blocks must work with WordPress rather than fighting Gutenberg.

Do not:

- Replace the block editor unnecessarily.
- Override core block behavior globally without a strong reason.
- Modify WordPress core files.
- Depend on undocumented Gutenberg internals when a public API exists.
- Assume a specific theme's markup.
- Assume a specific editor layout.

When integrating with Gutenberg:

1. Use public WordPress APIs.
2. Respect block attributes.
3. Preserve user content.
4. Preserve undo/redo behavior where possible.
5. Avoid unnecessary editor reloads.
6. Avoid global event handlers when WordPress data subscriptions can be used.
7. Clean up subscriptions/listeners when components unmount.

---

## 8. React Rules

React components should be small and focused.

Prefer:

```text
Feature
├── components/
├── hooks/
├── services/
├── selectors/
├── actions/
└── index/
```

Do not create huge components containing:

- API calls
- data transformation
- state management
- rendering
- error handling
- business rules

all in one file.

Use WordPress data APIs where appropriate rather than duplicating WordPress state in local React state.

Avoid unnecessary re-renders.

Do not introduce a new state-management library unless there is a demonstrated architectural need.

---

## 9. REST API Rules

Every REST endpoint must have:

- A clear namespace.
- A predictable route.
- Permission checks.
- Input validation.
- Sanitization.
- Appropriate HTTP status codes.
- Consistent response structures.
- Useful error responses.

Example pattern:

```php
register_rest_route(
    'kriti-blocks/v1',
    '/templates',
    [
        'methods'             => WP_REST_Server::READABLE,
        'callback'            => [ $controller, 'get_templates' ],
        'permission_callback' => [ $controller, 'can_manage_templates' ],
    ]
);
```

Never expose administrative data through an endpoint without an explicit permission check.

Do not trust data coming from React.

All client input is untrusted.

---

## Quality & Security Standards (Sections 10-25)

### 10. Security

Follow WordPress security practices at every boundary.

### Always

- Check capabilities.
- Verify nonces where required.
- Sanitize input.
- Validate input.
- Escape output.
- Use `$wpdb->prepare()` for dynamic SQL values.
- Use WordPress APIs where possible.
- Avoid exposing internal filesystem paths.
- Avoid exposing secrets to JavaScript.
- Avoid storing credentials in source control.

### Database

Bad:

```php
$wpdb->get_results(
    "SELECT * FROM {$table} WHERE id = {$id}"
);
```

Preferred:

```php
$wpdb->get_results(
    $wpdb->prepare(
        "SELECT * FROM {$table} WHERE id = %d",
        $id
    )
);
```

Table names controlled by the plugin architecture may be concatenated only when they are trusted/plugin-controlled identifiers. Dynamic user values must be prepared.

---

## 11. Data and Persistence

Before introducing a custom table:

1. Determine whether WordPress posts/post meta/terms/options can represent the data.
2. Determine expected data volume.
3. Determine query patterns.
4. Determine whether indexing is required.
5. Determine migration requirements.
6. Determine uninstall behavior.

Use custom tables when the data is operational/high-volume and WordPress post storage is not an appropriate model.

Database schema changes must be versioned and upgrade-safe.

Never silently delete existing user data during an upgrade.

---

## 12. Templates, Patterns, and Reusable Content

Kriti Blocks may work with a large catalog of Gutenberg patterns/templates.

When dealing with imported or generated pattern data:

- Preserve valid block markup.
- Validate required metadata.
- Normalize data at the application boundary.
- Avoid loading very large catalogs into the browser unnecessarily.
- Prefer pagination, filtering, search, or server-side querying where appropriate.
- Do not duplicate the same pattern data in multiple storage systems without a reason.
- Keep import processes idempotent where possible.

For bulk imports:

```text
Input
 ↓
Validate
 ↓
Normalize
 ↓
Deduplicate
 ↓
Persist
 ↓
Index/cache if needed
```

A failed import should not leave the database in a partially corrupted state.

---

## 13. Performance

Kriti Blocks should remain lightweight on sites where its functionality is not being used.

### Admin/editor assets

Only enqueue assets where required.

Do not load large React bundles on every frontend page unless the feature genuinely requires them.

❌ Avoid:
```php
wp_enqueue_script( 'kriti-blocks-heavy-bundle' );
```

Prefer conditional loading based on:

- Admin screen (use `get_current_screen()`)
- Editor context (use WordPress editor hooks)
- Block presence (check post content before enqueuing)
- Feature requirement (conditional feature flags)

### Frontend performance targets

- **Admin bundle size**: < 150KB gzipped
- **Editor bundle size**: < 200KB gzipped
- **Block CSS per page**: < 50KB gzipped
- **Page load impact**: < 200ms additional time
- **Memory impact**: < 5MB per loaded block

### Database

Avoid:

- Unbounded queries without `LIMIT`
- N+1 queries (querying in loops)
- Repeated metadata queries inside loops
- Loading thousands of records when pagination applies

Use:

- Pagination for large result sets
- Appropriate database indexes
- WordPress transients for computed data
- WordPress query APIs (WP_Query, WP_Term_Query)
- Bulk operations where safe

### Query optimization checklist

```sql
-- ❌ Bad: N+1 problem
foreach ($template_ids as $id) {
    $template = get_post($id);
}

-- ✅ Good: Single query
$templates = get_posts([
    'post__in' => $template_ids,
    'posts_per_page' => -1,
]);
```

---

## 14. Caching

Cache only data that is safe to cache.

Always consider:

- Cache invalidation.
- User-specific data.
- Permissions.
- Site-specific configuration.
- Multisite behavior.

Never cache privileged/user-specific data in a shared cache without proper isolation.

---

## 15. JavaScript and PHP Boundaries

Keep the boundary explicit.

PHP should provide structured data.

Preferred:

```php
wp_localize_script();
```

or appropriate REST/data APIs for runtime data.

Do not generate large JavaScript strings in PHP.

Do not embed secrets into localized JavaScript variables.

Do not make the frontend depend on undocumented PHP-generated globals.

---

## 16. Internationalization

All user-facing strings must be translatable.

PHP:

```php
__( 'Block Templates', 'kriti-blocks' );
```

JavaScript:

```js
__( 'Block Templates', 'kriti-blocks' );
```

Do not concatenate translated strings when placeholders/interpolation can be used.

Use the plugin's established text domain consistently.

Do not introduce a second text domain.

---

## 17. Accessibility

Kriti Blocks admin/editor interfaces must be keyboard accessible.

Follow WordPress accessibility patterns.

Ensure:

- Buttons have accessible labels.
- Icon-only controls have labels/tooltips.
- Focus states are preserved.
- Modals manage focus correctly.
- Loading states are communicated.
- Error messages are accessible.
- Color is not the only indicator of state.
- Interactive controls use semantic elements.

Do not use clickable `<div>` elements when a `<button>` is appropriate.

---

## 18. Error Handling

Errors should be explicit and actionable.

### Backend

Always return structured error responses:

```php
return new WP_Error(
    'kriti_blocks_invalid_template',
    __( 'The template could not be loaded.', 'kriti-blocks' ),
    [ 'status' => 400 ]
);
```

Common error codes:
- `400` — Bad Request (validation failure)
- `403` — Forbidden (permission denied)
- `404` — Not Found (resource missing)
- `500` — Internal Server Error (unexpected failure)

### Frontend

Every API call should handle:

- **Loading state** — Show spinner/skeleton
- **Empty state** — Show message when no data
- **Success state** — Display result
- **Error state** — Show actionable error message
- **Retry option** — Allow user to retry on failure

Example React pattern:

```js
const { data, isLoading, error } = useQuery('templates');

if (isLoading) return <Spinner />;
if (error) return <ErrorMessage error={error} onRetry={refetch} />;
if (!data?.length) return <EmptyState />;
return <TemplateList items={data} />;
```

### Error Messages

User-facing errors should:
- Be specific and actionable
- Avoid technical jargon
- Suggest next steps
- Never expose credentials or internal paths

❌ Bad: `"Database connection failed at /var/www/html/wp-content/plugins/kriti-blocks/includes/class-kriti-blocks-plugin.php:147"`

✅ Good: `"Unable to load templates. Please check your connection and try again."`

### Logging Errors

Log all errors with context:

```php
error_log(
    sprintf(
        'Kriti Blocks: Failed to load template. Template ID: %d, Error: %s',
        $template_id,
        $error_message
    )
);
```

Do not silently swallow API errors in frontend code.

---

## 19. Backward Compatibility

Kriti Blocks is a WordPress plugin and may be installed on existing sites.

Do not casually:

- Rename database keys.
- Change stored data formats.
- Change REST response structures.
- Remove hooks.
- Rename public PHP functions/classes.
- Change block names.
- Change block attributes incompatibly.

When a breaking change is necessary, provide a migration path.

---

## 20. Multisite

Do not assume single-site operation.

When writing site-level data:

- Understand whether the setting is site-specific or network-wide.
- Use the appropriate WordPress APIs.
- Do not accidentally read/write another site's data.
- Be careful with activation and upgrade hooks.

Do not introduce multisite complexity into a feature unless required, but do not make assumptions that prevent future support.

---

## 21. Development Workflow

Before implementation:

```text
1. Understand the requested behavior.
2. Find the existing feature/code path.
3. Identify affected PHP/JS/CSS files.
4. Check existing tests.
5. Implement the smallest coherent change.
6. Run relevant lint/build/tests.
7. Test the WordPress editor manually when editor behavior changes.
8. Review security and compatibility.
```

Do not refactor unrelated code during a feature implementation.

---

## 22. Testing

Important functionality should have automated tests where practical.

### PHP tests

Test:

- Data normalization.
- Validation.
- Permission behavior.
- REST responses.
- Persistence.
- Import/export behavior.
- Edge cases.

### JavaScript tests

Test:

- Components with meaningful logic.
- Data transformations.
- Hooks.
- User interactions where practical.

### E2E

Use Playwright for workflows that depend on real WordPress/editor behavior.

Examples:

- Opening Kriti Blocks.
- Searching templates.
- Selecting a template.
- Inserting blocks.
- Saving content.
- Editor integration.
- Error states.

---

## 23. Build and Dependency Rules

Use the project's existing package manager and lockfile.

Do not:

- Replace `package-lock.json` with another package manager without a project-level decision.
- Upgrade every dependency just to fix one issue.
- Add duplicate packages that solve the same problem.
- Commit generated dependency directories such as `node_modules`.

Before upgrading WordPress packages, verify compatibility among:

- React.
- WordPress packages.
- `@wordpress/scripts`.
- WordPress target versions.
- Existing Kriti Blocks code.

Dependency upgrades should be intentional and tested.

---

## 24. CSS/UI Rules

Follow the existing Kriti Blocks UI system.

Before adding CSS:

1. Search for an existing class/component.
2. Reuse existing spacing, typography, controls, and states.
3. Avoid global selectors.
4. Scope plugin-specific styles.
5. Avoid modifying WordPress core editor styles globally.
6. Avoid `!important` unless there is a documented compatibility reason.

The UI should look like a WordPress product, not an unrelated application.

---

## 25. Logging and Debugging

Logs must contain useful diagnostic information without exposing sensitive information.

Never log:

- API keys.
- Passwords.
- Authentication tokens.
- Nonces.
- Private user data unnecessarily.
- Full request headers containing credentials.

Temporary debugging code must not be committed.

Avoid:

```php
var_dump();
print_r();
error_log( $secret );
```

in production code.

---

## Development Process (Sections 26-27)

## 26. Git and Commit Guidelines

Use small, focused commits.

Examples:

```text
feat(patterns): add pattern search
feat(template): add template insertion
fix(editor): preserve block attributes during insertion
fix(rest): validate template permissions
test(patterns): add pattern filtering tests
refactor(template): extract template repository
```

Avoid commits that mix unrelated features.

---

## 27. Pull Request Guidelines

Every PR should explain:

- What changed.
- Why it changed.
- Files/areas affected.
- Database changes.
- REST API changes.
- Security implications.
- Compatibility implications.
- Tests added.
- Manual testing performed.

Do not merge code that introduces secrets into source control or frontend bundles.

---

## Agent-Specific Rules (Sections 28-32)

## 28. AI Coding Agent Rules

When an AI coding agent works on Kriti Blocks:

1. Read `AGENTS.md` before making changes.
2. Inspect the existing architecture before adding abstractions.
3. Search the repository before creating new classes/functions/components.
4. Reuse existing services and utilities.
5. Do not duplicate business logic.
6. Do not bypass WordPress permission checks.
7. Do not expose secrets.
8. Do not modify unrelated files.
9. Follow WordPress coding standards.
10. Preserve existing public APIs where possible.
11. Do not invent WordPress APIs.
12. Verify WordPress APIs against current project requirements before implementation.
13. Treat REST/API input as untrusted.
14. Treat stored/imported block content as untrusted content.
15. Never execute arbitrary code contained in imported block content.
16. Do not automatically publish content unless the feature explicitly requires publishing.
17. Do not modify WordPress core.
18. Add tests for important new behavior.
19. Run the narrowest relevant validation first, then broader validation when needed.
20. Explain architectural trade-offs when introducing a significant new subsystem.

---

## 29. Definition of Done (MOVED)

**See Section 41 below** — Comprehensive checklist.

---

## 30. Most Important Architectural Rules (CONSOLIDATED)

**See Section 39 below** — These rules have been consolidated and expanded.

---

## 31. Agent Working Checklist (MOVED)

**See Section 40 below** — Updated checklist with additional items.

---

## 32. Guiding Philosophy

Kriti Blocks should remain:

**Native to WordPress.  
Native to Gutenberg.  
Modular.  
Secure.  
Performant.  
Backward-compatible.  
Easy to extend.  
Easy to maintain.**

When there is a choice between a clever abstraction and a straightforward WordPress-native implementation, prefer the straightforward implementation unless the abstraction provides a clear long-term benefit.

---

## Block Development (Sections 33-33.6)

## 33. Documentation Standards

Every code change should include appropriate documentation.

### README and Overview Files

- Block README should describe purpose, features, and usage
- Code comments should explain WHY, not WHAT (code is self-documenting)
- Complex logic requires inline documentation
- Deprecations must be documented with migration path

### API Documentation

REST endpoints must document:

```php
/**
 * Get templates
 *
 * @route GET /kriti-blocks/v1/templates
 * @param int $page    Page number (default: 1)
 * @param int $per_page Results per page (default: 20)
 *
 * @return array {
 *     @type object[] $items      Array of template objects
 *     @type int     $total       Total number of templates
 *     @type int     $pages       Total number of pages
 * }
 */
```

### Block Documentation Template

```markdown
# [Block Name]

## Description
What this block does and why users would use it.

## Features
- Feature 1
- Feature 2

## Attributes
- `attribute1` (string) — Description
- `attribute2` (boolean) — Description

## Usage
Example of typical block usage.

## Accessibility
How this block is accessible.

## Browser Support
Minimum browser versions.
```

---

## 34. Versioning & Release Process

### Semantic Versioning

Kriti Blocks follows semantic versioning: `MAJOR.MINOR.PATCH`

- **MAJOR**: Incompatible API changes (requires migration)
- **MINOR**: Backward-compatible new features
- **PATCH**: Backward-compatible bug fixes

### Breaking Changes Policy

When introducing breaking changes:

1. **Announce** in changelog 2 releases before removal
2. **Deprecate** the old behavior with warnings
3. **Document** migration path clearly
4. **Release** as MAJOR version bump
5. **Provide** migration script if applicable

### Changelog Requirements

Every release must include:

```markdown
## [Version] - YYYY-MM-DD

### Added
- New features

### Changed
- Modified features (with migration notes if applicable)

### Fixed
- Bug fixes

### Deprecated
- Soon-to-be-removed features (with removal timeline)

### Removed
- Removed features (link to migration guide)

### Security
- Security vulnerabilities addressed
```

---

## 35. Testing Standards

### PHP Test Requirements

Test these scenarios:

- Valid input → correct output
- Invalid input → proper error handling
- Edge cases (empty, null, boundary values)
- Permission checks (authorized vs. unauthorized)
- Database operations (create, read, update, delete)
- Integration with WordPress hooks

### JavaScript Test Requirements

Test these components:

- Component renders without error
- Props validation and defaults
- User interactions (clicks, keyboard)
- API calls and error handling
- State changes and side effects

### E2E Test Coverage

Critical workflows should have Playwright tests:

- Editor initialization
- Block insertion and configuration
- Template loading and application
- Settings saving/loading
- Error scenarios and recovery

### Minimum Test Coverage

- Critical business logic: 80%+ coverage
- Public APIs: 100% coverage
- UI components: 60%+ coverage
- Total project goal: 70%+ coverage

---

## 36. Code Review Process

### Review Checklist for Reviewers

- [ ] Does it follow AGENTS.md guidelines?
- [ ] Is it the smallest coherent change?
- [ ] Are there unrelated changes mixed in?
- [ ] Are permission checks present?
- [ ] Is input validation present?
- [ ] Is output escaped?
- [ ] Are there backward compatibility issues?
- [ ] Does it have tests?
- [ ] Is documentation updated?
- [ ] Are there console/error log warnings?

### Approval Requirements

- At least 1 approved review
- All CI checks passing
- No unresolved conversations
- Changelog entry added

---

## 37. Deployment & Environments

### Environment Configuration

| Environment | Purpose | Content | Updates |
|-------------|---------|---------|---------|
| Local | Development | Test data | Frequent |
| Staging | Pre-production | Production mirror | Weekly |
| Production | Live sites | Real user data | As needed |

### Pre-deployment Checklist

- [ ] Version number updated
- [ ] Changelog reviewed
- [ ] Database migrations tested
- [ ] Backup created
- [ ] Tests passing
- [ ] Performance benchmarks met
- [ ] Security audit passed
- [ ] Translations updated

---

## 38. Troubleshooting Guide

### Common Issues

#### "Block fails to render"

**Symptoms**: Block shows error in editor

**Diagnosis**:
1. Check browser console for JavaScript errors
2. Verify `block.json` is valid JSON
3. Check block attributes match schema
4. Look for PHP errors in debug.log

**Solution**:
- Fix JSON syntax
- Update attribute definitions
- Check for conflicts with other plugins

#### "Blocks not appearing in inserter"

**Symptoms**: Block registered but not visible

**Diagnosis**:
1. Check `"category"` in block.json
2. Verify `register_block_type()` was called
3. Check user capabilities

**Solution**:
- Verify block.json has `category`
- Ensure block is registered in correct hook (`init` or `enqueue_block_editor_assets`)
- Check user has `edit_posts` capability

#### "Performance degradation"

**Symptoms**: Editor slow, front-end slow

**Diagnosis**:
1. Profile JavaScript bundles (DevTools)
2. Check database queries (Query Monitor plugin)
3. Check for N+1 queries
4. Profile PHP execution time

**Solution**:
- Split large bundles
- Add database indexes
- Use `wp_cache_get/set`
- Optimize query patterns

---

## 39. Most Important Architectural Rules

### Rule 1 — WordPress first

Kriti Blocks is a WordPress plugin. Prefer WordPress APIs over custom replacements.

### Rule 2 — Existing architecture first

Before adding a new abstraction, find and understand the existing implementation.

### Rule 3 — Gutenberg data is structured data

Use `parse_blocks()` and `serialize_blocks()` rather than fragile string manipulation whenever block structures are being transformed.

### Rule 4 — Security at every boundary

Never trust browser input, imported data, REST requests, or stored content.

### Rule 5 — Small changes

Implement the smallest change that solves the problem without destabilizing unrelated functionality.

### Rule 6 — No silent breakage

Existing Kriti Blocks users and stored content must be protected from unnecessary breaking changes.

### Rule 7 — Do not over-engineer

Kriti Blocks should have a clean architecture, but abstractions must solve real problems. Prefer simple, maintainable code over speculative frameworks.

---

## 40. Agent Working Checklist

Before changing code:

- [ ] Read `AGENTS.md`.
- [ ] Locate the relevant feature.
- [ ] Search for existing implementations.
- [ ] Identify PHP/React/API boundaries.
- [ ] Identify data/storage implications.
- [ ] Identify permission/security requirements.
- [ ] Check compatibility implications.

Before finishing:

- [ ] Run relevant lint/build checks.
- [ ] Run relevant tests.
- [ ] Test the feature manually if it affects Gutenberg.
- [ ] Check browser console for errors.
- [ ] Check PHP/debug logs for new warnings.
- [ ] Check permissions and nonce handling.
- [ ] Check translations.
- [ ] Check accessibility.
- [ ] Confirm no unrelated files were modified.
- [ ] Confirm no secrets or debug code were added.

---

## 41. Definition of Done

A feature is complete only when applicable:

- Core implementation is complete.
- Existing architecture is respected.
- Capability checks are implemented.
- Nonces are implemented where required.
- Input is validated and sanitized.
- Output is escaped.
- REST endpoints are protected.
- Errors are handled.
- Loading/empty/error states exist in the UI.
- Important logic has tests.
- Existing functionality remains intact.
- Editor behavior has been manually verified when relevant.
- Internationalization is implemented.
- Accessibility has been considered.
- Performance impact is acceptable.
- Documentation is updated where necessary.

---

## Block Development (Sections 33-33.6)

## 33. Block Catalog

Kriti Blocks should provide a curated collection of reusable Gutenberg blocks.

Blocks should be developed incrementally. Do not implement the entire catalog
at once.

### Phase 1 — Core Layout and Content

- Container / Section
- Row
- Stack
- Grid
- Columns
- Spacer
- Divider
- Heading
- Text / Rich Text
- Button
- Button Group
- Image
- Icon
- Video
- Group
- Cover

### Phase 2 — Content Components

- Card
- Card Grid
- Feature
- Feature Grid
- Testimonial
- Testimonial Slider
- Team Member
- Team Grid
- Logo Grid
- Pricing Table
- Pricing Card
- Call To Action
- Alert / Notice
- Quote
- Accordion
- FAQ
- Tabs

### Phase 3 — Marketing and Conversion

- Hero
- Hero with Image
- Hero with Video
- CTA Banner
- Lead Capture
- Newsletter Signup
- Social Proof
- Review
- Rating
- Comparison Table
- Stats / Counter
- Benefits
- Process / Steps
- Timeline

### Phase 4 — Navigation and Layout

- Header
- Navigation
- Mega Menu
- Breadcrumbs
- Footer
- Modal
- Off-canvas / Drawer
- Sticky Section
- Back To Top

### Phase 5 — WordPress Dynamic Content

- Post Query
- Post Grid
- Post List
- Post Carousel
- Related Posts
- Author
- Author Box
- Categories
- Tags
- Search
- Pagination
- Archive Header

### Phase 6 — WooCommerce

WooCommerce blocks should only be implemented when WooCommerce is active.

- Product Grid
- Product List
- Product Carousel
- Product Categories
- Product Card
- Product Search
- Product Filters
- Add To Cart
- Mini Cart
- Cart
- Checkout
- Product Reviews
- Product Rating
- Product Price
- Sale Badge

### Phase 7 — Kriti Blocks Advanced Features

These are strategic features and should not be implemented before
the core block system is stable.

- Pattern Inserter
- Template Inserter
- Block Collection
- Block Presets
- Global Style Presets
- Design Sections
- AI Section Generator
- AI Block Generator
- AI Content Block
- Dynamic Content Block
- Responsive Visibility
- Conditional Content
- Query Builder
- Loop Builder

---

## 33.1 Block Development Rules

Every Kriti Blocks block must:

1. Be a valid Gutenberg block.
2. Use WordPress block APIs.
3. Define its attributes explicitly.
4. Provide editor and frontend behavior where required.
5. Support responsive behavior only when the feature actually requires it.
6. Avoid unnecessary custom JavaScript.
7. Avoid global CSS selectors.
8. Use `theme.json`/WordPress design tokens where appropriate.
9. Support WordPress accessibility requirements.
10. Support internationalization.
11. Avoid unnecessary dependencies.
12. Preserve block content during upgrades.
13. Avoid introducing breaking attribute changes.
14. Provide sensible default values.
15. Handle empty and invalid states gracefully.

---

## 33.2 Block Naming

Use the Kriti Blocks namespace:

```text
kriti-blocks/container
kriti-blocks/card
kriti-blocks/hero
kriti-blocks/testimonial
```

## 33.3 Block Architecture

Prefer:

```text
blocks/
├── container/
├── card/
├── hero/
├── testimonial/
└── ...
```

Each block should keep its implementation isolated.

A typical block may contain:

```text
block-name/
├── block.json
├── index.js
├── edit.js
├── save.js
├── style.scss
├── editor.scss
├── view.js
└── README.md
```

## 33.4 Block Composition

Prefer composing existing Kriti Blocks/Core blocks rather than duplicating functionality.

For example:

```text
Hero
 ├── Container
 │    ├── Heading
 │    ├── Text
 │    └── Button
```

rather than creating a monolithic Hero block containing a completely separate
implementation of heading, text, button, spacing, and layout.

Blocks should be composable.

## 33.5 Block Priority

When deciding what block to build next, prioritize:

1. Frequently reusable layout primitives.
2. Frequently used content components.
3. Blocks that enable other blocks.
4. Blocks that provide clear product differentiation.
5. Dynamic WordPress integrations.
6. WooCommerce integrations.
7. Advanced/experimental functionality.

Do not build a block merely because it is possible.

Every new block should have a clear user-facing purpose.

## 33.6 Avoid Block Explosion

Do not create separate blocks when block variations, patterns, styles,
or composition are sufficient.

For example, prefer:

```text
Button
 ├── Primary variation
 ├── Secondary variation
 └── Outline variation
```

instead of:

```text
Primary Button
Secondary Button
Outline Button
```

Likewise, use block patterns for predefined layouts when a new block would
only represent a fixed arrangement of existing blocks.

The goal is a powerful but maintainable block system, not hundreds of
slightly different blocks.

---

## 33.7 Common Block Options for Usability

Every Kriti Blocks block should support these standard controls for consistency and flexibility:

### Spacing Controls

```php
// Margin & Padding (responsive: desktop, tablet, mobile)
'margin' => [
    'top' => 'string',      // px, em, rem, %
    'bottom' => 'string',
    'left' => 'string',
    'right' => 'string',
]
'padding' => [
    'top' => 'string',
    'bottom' => 'string',
    'left' => 'string',
    'right' => 'string',
]
```

**Inspector Panel**: Show margin/padding controls for all four sides with responsive tabs (Desktop/Tablet/Mobile).

### Layout & Display

```php
'display' => 'flex|grid|block',           // Display type
'alignment' => 'left|center|right|justify', // Text/content alignment
'justifyContent' => 'flex-start|center|flex-end|space-between|space-around',
'alignItems' => 'flex-start|center|flex-end|stretch',
'gap' => 'string',                        // Spacing between items (flex/grid)
'direction' => 'row|column',              // Flex direction
```

### Typography Controls (for text-based blocks)

```php
'fontSize' => 'string',                   // px, em, rem
'fontFamily' => 'string',                 // Font family or WordPress preset
'fontWeight' => '400|500|600|700|800',   // Font weight
'lineHeight' => 'string',                 // em, unitless, px
'letterSpacing' => 'string',              // px, em, rem
'textDecoration' => 'none|underline|line-through|overline',
'textTransform' => 'none|uppercase|lowercase|capitalize',
'textAlign' => 'left|center|right|justify',
```

**Inspector Panel**: Typography controls in separate accordion panel with WordPress font presets integration.

### Color & Background

```php
'backgroundColor' => 'string',            // Color hex/rgb/preset name
'textColor' => 'string',                  // Text color
'borderColor' => 'string',                // Border color
'backgroundImage' => [
    'url' => 'string',
    'position' => 'left top|center|right bottom', // CSS background position
    'size' => 'cover|contain|auto',               // CSS background-size
    'repeat' => 'repeat|no-repeat',               // CSS background-repeat
    'opacity' => 'number',                        // 0-1
]
'gradient' => [                           // CSS gradient
    'type' => 'linear|radial',
    'angle' => 'number',                  // 0-360
    'colors' => 'array',                  // Color stops
]
```

**Inspector Panel**: Color picker with presets, opacity slider, gradient builder.

### Border & Outline

```php
'border' => [
    'width' => 'string',                  // px
    'style' => 'solid|dashed|dotted|double',
    'color' => 'string',
    'radius' => 'string',                 // Border radius (px, %)
]
'boxShadow' => [                          // CSS box-shadow
    'offsetX' => 'string',
    'offsetY' => 'string',
    'blur' => 'string',
    'spread' => 'string',
    'color' => 'string',
    'opacity' => 'number',
]
```

**Inspector Panel**: Border controls with radius for each corner, shadow preset selector.

### Sizing Controls

```php
'width' => [
    'desktop' => 'string',                // px, %, em, vw
    'tablet' => 'string',
    'mobile' => 'string',
]
'height' => [
    'desktop' => 'string',
    'tablet' => 'string',
    'mobile' => 'string',
]
'minHeight' => 'string',
'maxWidth' => 'string',
'aspectRatio' => '16/9|4/3|1/1|21/9',
```

**Inspector Panel**: Responsive dimension inputs with common presets.

### Visibility & Conditional Display

```php
'showOn' => [
    'desktop' => 'boolean',              // Show on desktop
    'tablet' => 'boolean',               // Show on tablet
    'mobile' => 'boolean',               // Show on mobile
]
'hideOn' => [
    'loggedIn' => 'boolean',             // Hide if user logged in
    'loggedOut' => 'boolean',            // Hide if user logged out
]
'displayCondition' => 'custom',          // Future ACF/dynamic content support
```

**Inspector Panel**: Device visibility toggles, user role conditional display.

### Effects & Animation

```php
'opacity' => 'number',                   // 0-1
'transform' => [
    'scale' => 'number',                 // Transform scale
    'rotate' => 'number',                // 0-360 degrees
    'skewX' => 'number',
    'skewY' => 'number',
]
'transition' => [
    'property' => 'all|opacity|transform|background-color',
    'duration' => 'string',              // ms
    'timingFunction' => 'ease|ease-in|ease-out|ease-in-out|linear',
]
'hoverEffect' => 'none|lift|grow|glow|tilt',  // Predefined hover effects
```

**Inspector Panel**: Opacity slider, transform controls, preset hover effects.

### Position & Layout Advanced

```php
'position' => 'static|relative|absolute|fixed|sticky',
'zIndex' => 'number',
'sticky' => [
    'enabled' => 'boolean',
    'offset' => 'string',                // px from top
]
```

**Inspector Panel**: Position selector, z-index input, sticky offset controls.

### Responsive Breakpoint References

Use these standard breakpoints for `responsive` controls:

```text
- Desktop:   1025px and above
- Tablet:    768px - 1024px
- Mobile:    0px - 767px
```

Ensure all responsive controls show three tabs: **Desktop**, **Tablet**, **Mobile**.

### Block-Specific Options Template

Every custom block should implement these sections:

```javascript
// block.json or block attributes
"attributes": {
  // Content attributes
  "content": { "type": "string" },
  
  // Layout attributes
  "layout": { 
    "type": "object",
    "properties": { "display", "direction", "gap", "alignment" }
  },
  
  // Spacing attributes
  "spacing": { 
    "type": "object",
    "properties": { "margin", "padding" }
  },
  
  // Typography attributes (if applicable)
  "typography": { 
    "type": "object",
    "properties": { "fontSize", "fontFamily", "fontWeight", "lineHeight" }
  },
  
  // Color & styling attributes
  "colors": { 
    "type": "object",
    "properties": { "textColor", "backgroundColor", "borderColor" }
  },
  
  // Advanced attributes
  "advanced": { 
    "type": "object",
    "properties": { "cssClass", "customCSS", "dataAttributes" }
  }
}
```

### Usability Best Practices

1. **Organize controls into accordion panels** by category (Spacing, Colors, Typography)
2. **Provide sensible defaults** for all attributes
3. **Show/hide advanced controls** behind "Advanced" toggle
4. **Use presets for common values** (e.g., font sizes, spacing scales)
5. **Display responsive indicators** showing which breakpoint is being edited
6. **Provide live preview** in the editor while adjusting controls
7. **Group related controls** (e.g., all padding/margin together)
8. **Use WordPress color/font pickers** instead of custom implementations
9. **Support keyboard navigation** in all controls
10. **Reset to defaults button** for each section
11. **Tooltips for complex controls** explaining expected values/units
12. **Undo/redo support** for all inspector changes

### Example Inspector Panel Structure

```text
Block Inspector Panel
├── Content Section
│   └── Editable fields specific to block
├── Layout Section (Accordion)
│   ├── Display Type
│   ├── Direction & Alignment
│   └── Gap/Spacing
├── Spacing Section (Accordion)
│   ├── Margin Controls (responsive)
│   └── Padding Controls (responsive)
├── Typography Section (Accordion) [if applicable]
│   ├── Font Family & Size
│   ├── Font Weight & Style
│   └── Line Height & Letter Spacing
├── Colors Section (Accordion)
│   ├── Text Color
│   ├── Background & Gradient
│   └── Border & Shadow
├── Advanced Section (Accordion)
│   ├── Position & Z-index
│   ├── Visibility (Responsive + Conditional)
│   ├── Effects & Hover
│   └── Custom CSS Class
└── Reset to Defaults Button
```

---

## Related Documents

For detailed block roadmap, code review standards, and troubleshooting guides, see:

- **BLOCK_ROADMAP.md** — Detailed phased block development plan with effort estimates
- **CODE_REVIEW_STANDARDS.md** — Code review checklists and approval workflow
- **TROUBLESHOOTING.md** — Common issues, debugging guides, and solutions

---

## Document History

| Version | Date | Changes |
|---------|------|---------|
| 1.1 | 2026-08-27 | Added TOC, Quick Reference, improved organization |
| 1.0 | Initial | Foundation document |