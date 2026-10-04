# JavaScript Application Framework

A lightweight, modular JavaScript application framework built around **Web Components, ES Modules and modern browser APIs**.

This project started as a learning and experimentation project while investigating the architecture of a larger client-side payment application. It is now evolving into something more ambitious: a **small, understandable framework for building JavaScript applications**, while also providing a practical foundation for teaching modern web development.

> **The goal is not to hide JavaScript behind a large framework. The goal is to provide useful application structure while keeping the underlying technologies understandable.**

---

## 🚧 Project Status

**Early development / experimental**

The framework is currently being developed through a working demonstration application.

The architecture is deliberately being built incrementally. Features are added only after their purpose and responsibilities have been understood and tested.

Expect the structure and APIs to change as the project develops.

---

## Why?

Modern JavaScript applications can become difficult to understand because application architecture, build systems, frameworks, state management and third-party libraries can all become intertwined.

This project explores a simpler approach.

The framework provides a small amount of application infrastructure while allowing developers to work primarily with familiar web technologies:

- JavaScript
- HTML
- CSS
- Web Components
- ES Modules
- Browser APIs

The intention is that a developer working on an application module **should not need to understand the internals of the framework**.

---

## Architecture

The application is divided into three main areas:

```text
Application
│
├── Core
│   ├── App
│   ├── Router
│   ├── RouteResolver
│   ├── RouteRegistry
│   ├── Navigation
│   ├── Store
│   ├── EventBus
│   ├── ComponentBase
│   └── PageBase
│
├── Services
│   ├── ApiClient
│   └── Application services
│
└── Modules
    ├── Test
    ├── Payment
    ├── Customers
    └── ...
```

### Core

The **Core** contains generic application infrastructure.

Core code should not contain business-specific functionality.

For example:

- routing
- navigation
- application state
- events
- component lifecycle
- module loading

---

### Services

**Services provide capabilities to application modules.**

For example:

```text
Module
   ↓
Service
   ↓
API / SSE / External provider
```

A module should not need to know how a service is implemented.

For example, a payment page might eventually use:

```text
PaymentView
    ↓
PaymentApi
    ↓
ApiClient
    ↓
HTTP API
```

---

### Modules

Modules contain application functionality.

A module is intended to be relatively self-contained:

```text
modules/
└── test/
    ├── manifest.js
    │
    ├── components/
    │   ├── test-view.js
    │   └── test-search-view.js
    │
    └── templates/
        ├── test.html
        └── test-search.html
```

The framework should provide the infrastructure required by the module without requiring the module developer to modify framework code.

---

## Module Manifests

Each module can provide a `manifest.js` which acts as its entry point and describes the functionality exposed by the module.

For example:

```javascript
import "./components/test-view.js";
import "./components/test-search-view.js";

export default {
    name: "test",

    routes: {
        view: "test-view",
        search: "test-search-view"
    }
};
```

This allows the framework to discover and load a module without `Application` or the main application view needing to know the individual components contained within it.

---

## Routing

Routes are represented as structured data rather than being hard-coded into the application's main view.

For example:

```text
?route=test/test/view&testField=hello
```

is resolved into:

```javascript
{
    application: "test",
    module: "test",
    page: "view",
    values: {
        testField: "hello"
    }
}
```

The framework can therefore separate:

**URL parsing**

from:

**route registration**

from:

**displaying the resulting component**

This keeps application-specific routing information out of the core routing infrastructure.

---

## Component Lifecycle

Pages are built using Web Components.

The current lifecycle is:

```text
loadData()
    ↓
render()
    ↓
wireEvents()
```

`PageBase` provides the common lifecycle while individual pages override the parts they need.

For example:

```javascript
async loadData() {
    const testService = this.app.get("testService");

    this.payment = await testService.getPayment();
}
```

The page can therefore concentrate on what it needs to display rather than implementing the application lifecycle itself.

---

## Error Handling

The framework distinguishes between **unexpected errors** and **expected application outcomes**.

Unexpected errors, such as an API failure or an unexpected exception during page loading, are handled by `PageBase`.

```text
Page
  ↓
loadData()
  ↓
Service
  ↓
ApiClient
  ↓
Exception
  ↓
PageBase
  ↓
Error View
```

This means individual pages do not need to repeat the same error-handling code.

Error presentation is kept separate from the page lifecycle so that the appearance and wording of an error can be changed without modifying the framework's core page-handling code.

Not every failure is necessarily an exception.

For example, a payment being declined is an expected outcome of a payment operation rather than an application crash. Such outcomes can be handled by the relevant application service or module and presented appropriately to the user.

The framework therefore aims to distinguish between:

- **Unexpected errors** — handled by common framework error handling.
- **Expected application outcomes** — handled by the relevant application functionality.
- **User validation** — handled by the relevant UI.

Logging and user-facing error messages are treated as separate concerns. Technical information may be useful for logging without necessarily being appropriate to display to the user.

---

## Current Demonstration

The current demonstration application contains a small **Test module**.

It demonstrates:

- Web Components
- ES Modules
- Application services
- Routing
- Route registration
- Module manifests
- Page lifecycle
- HTML templates
- Application state
- EventBus
- A fake API
- Service → API client communication

The fake API currently provides test payment data so that the application can demonstrate the architecture without requiring a real backend.

---

## No Build Framework Required

One of the aims of this project is to explore how much useful application architecture can be achieved using **modern browser capabilities directly**.

The current demonstration does not depend on a large JavaScript framework.

The project uses native:

- ES Modules
- Web Components
- `fetch`
- browser history
- `URLSearchParams`
- modern JavaScript language features

This is intentional.

---

## Learning Through the Project

The framework is also being developed as a **teaching project**.

The intention is to explain not just *how* something works, but *why* a particular piece of architecture exists.

For example:

```text
Why have a Store?
Why have an EventBus?
Why have Services?
Why separate RouteResolver from RouteRegistry?
Why use a module manifest?
Why use Web Components?
```

The demonstration application provides a concrete environment in which these questions can be explored.

---

## Future Direction

The project is expected to explore:

- More complete API client functionality
- API error handling
- Loading states
- Server communication
- Server-Sent Events (SSE)
- Event-driven application updates
- More sophisticated state management
- Authentication
- Multiple applications within a single application suite
- Pages composed from multiple modules
- Reusable UI components
- Better developer documentation
- Examples and tutorials

A longer-term goal is to make it possible for developers to create functionality **inside a module without needing to modify the framework itself**.

---

## Design Philosophy

The project is guided by a few principles:

### Keep the framework small

If something can be achieved with a standard browser API, there should be a good reason to introduce another abstraction.

### Separate responsibilities

Core infrastructure, services and application modules should have clearly defined responsibilities.

### Prefer conventions over configuration

The framework should make the common case simple without preventing developers from doing something different when necessary.

### Don't hide the web

Developers using the framework should still understand JavaScript, HTML, CSS and browser APIs.

### Build incrementally

Architecture should emerge from real requirements and experiments rather than from trying to design the entire framework before writing any code.

---

## Repository Structure

```text
/
├── app/
│   ├── core/
│   ├── services/
│   └── modules/
│
├── index.html
└── ...
```

The structure will evolve as the framework develops.

---

## Contributing

The project is currently experimental, but contributions, ideas and discussion are welcome.

If you are interested in extending the framework, **start by looking at the demonstration Test module**. It is intended to show how application developers interact with the framework without needing to understand its internal implementation.

---

## Licence

*TBD*