# Consolidated Architectural Specification

**Status:** Revised architecture for review  
**Scope:** A reusable JavaScript framework with one shared kernel hosting multiple independent client-side applications  
**Implementation status:** Architecture document only. No project files were created or changed.

This specification combines the previously agreed kernel, application, EventBus, routing, capability, component-embedding, and Host Shell decisions with explicit separation of application functionality and presentation.

## 1. Agreed architectural decisions

- One shared kernel hosts multiple applications in the same trusted JavaScript environment.
- The Host Shell is a distinct layer. It provides the browser document, page structure, global layout and styling, bootstrap entry point, and rendering targets.
- The Host Shell supplies an **explicit outlet map** to the kernel during bootstrap.
- The kernel requires a bootstrap configuration and outlet registry, but does not mandate outlet names such as `main` or `sidebar`.
- The Host Shell does not manage application lifecycles. The **Kernel owns** application registration, startup, stopping, restarting, and disposal.
- The Kernel coordinates routing, applications, components, and outlet use. Applications provide their routes and functionality.
- Application functionality and application presentation are separate concerns. Presentation should be replaceable or substantially redesigned without changing business logic.
- The Host Shell owns global layout, typography, and shell-level styles. Applications own their component-specific presentation. A shell must not dictate the internal appearance or business behavior of an application.
- A shared design system is a possible future concern, not an initial implementation requirement.
- Applications may be mounted simultaneously. Their CSS must not accidentally affect other applications or the Host Shell. The isolation technology remains open.
- Each application owns its Store, services, business logic, and runtime instances.
- Applications communicate through centrally registered, versioned event contracts without direct knowledge of one another.
- There is one synchronous kernel-level EventBus. Failure in one handler must not prevent delivery to other subscribers.
- Event subscriptions have application or component ownership and are cleaned up when their owner stops or is disposed.
- Modules are explicitly registered during startup. Reusable definitions do not imply shared application state or service instances.
- Routes are application-prefixed, such as `/tasks/...` and `/dashboard/...`.
- Embedded components execute with provider-owned context and lifecycle. The host provides their location and documented inputs but does not own their internal state or services.
- Applications use explicit context APIs and service facades, not an unrestricted global service locator.
- Applications initially are trusted code in the same JavaScript environment. This does not provide a security sandbox.
- Stateful kernel services are minimized and require an explicit rationale and clear ownership.

## 2. Architectural overview

```text
Host Shell
├─ Browser document and initial structure
├─ Physical page layout and global styling
├─ Explicit outlet map
└─ Bootstrap entry point and configuration
       │ supplies outlet map/configuration
       ▼
Shared Framework Kernel
├─ Application Registry and Lifecycle Manager
├─ Shared EventBus and Event Contract Registry
├─ Module Registry and Loader
├─ Capability Registry
├─ Routing Coordinator and Outlet Registry
├─ Application Context Factory
├─ Common Component Lifecycle
└─ Error Handling Infrastructure
       │ hosts and coordinates
       ├─ Task Management
       │  ├─ Application functionality
       │  │  ├─ Business logic, state, services, routes
       │  │  └─ Events, capabilities, component behavior
       │  └─ Application presentation
       │     └─ Component structure, layout, themes, styles
       └─ Dashboard
          ├─ Application functionality
          ├─ Application presentation
          └─ May host provider-owned components
                 
Optional Shared Design System
├─ Design tokens and visual conventions
├─ Reusable visual components and CSS conventions
└─ Themes and responsive guidance
```

These are conceptual responsibilities. They do not require five separate projects or runtime systems.

### Responsibility matrix

| Concern | Responsibility |
|---|---|
| **Host Shell** | Browser document, physical page layout, global typography/design conventions, shell-level navigation and styles, bootstrap, and outlet declarations |
| **Kernel** | Shared infrastructure, application lifecycle, application coordination, routing, EventBus, module and capability registries, and outlet use |
| **Application functionality** | Business logic, data handling, application state, services, routes, events, component behavior, capabilities, and structural interfaces used by presentation |
| **Application presentation** | Component appearance and visual structure, application layout within allocated space, styling, themes, and responsive behavior |
| **Shared Design System** | Optional shared visual tokens, reusable presentation resources, themes, and styling conventions |
| **Application definition** | Registered metadata and factories describing an application |
| **Application context** | Isolated runtime resources belonging to one running app |
| **Module definition** | Reusable registered code or functionality |
| **Module instance** | Runtime instance owned by an application or capability |
| **Event contract** | Stable, versioned message definition for decoupled communication |
| **Capability** | Discoverable function or service an app exposes |
| **Component** | Visual element an app may expose for another app to host |
| **Outlet** | Host-provided rendering target made available to the kernel |

Events, capabilities, and components are distinct integration mechanisms: events communicate facts, capabilities expose operations or functionality, and components provide visual surfaces.

## 3. Host Shell

The Host Shell provides the page environment and tells the kernel where rendering may occur. It does not contain application business logic or manage application lifecycle.

### Responsibilities

- Provide the browser document and initial page structure.
- Define physical page layout and shell-level navigation.
- Own global typography, layout, and shell-level styling.
- Declare rendering outlets, such as `header`, `navigation`, `main`, `sidebar`, or `notifications`.
- Provide the kernel bootstrap entry point.
- Supply an explicit outlet map during bootstrap.

### Bootstrap boundary

A bootstrap configuration should supply the kernel’s required configuration and outlet registry. The kernel should not assume specific outlet names. A thin shell-specific adapter may translate the shell’s DOM into the agreed map.

For example, one shell may map:

```js
{
  main: document.querySelector("#content"),
  sidebar: document.querySelector("#right-rail")
}
```

A different shell may use entirely different DOM structure and mapping while hosting the same kernel and applications.

**Recommendation:** Keep the bootstrap API stable and small. Treat outlet names as configuration shared between shell and app route/component declarations, rather than as built-in kernel constants.

If an application requests an unavailable outlet, the kernel reports a clear error scoped to that route or component. Other applications and outlets continue operating.

### Replaceability

The same kernel and application definitions should eventually work in a full business shell, a minimal standalone shell, or an embedding shell integrated into another website. These are future architectural possibilities; the initial implementation only needs a simple shell and a few outlets.

## 4. Kernel structure and responsibilities

The kernel is shared infrastructure. It owns application lifecycle policy and coordination, but not application business behavior or shell layout.

### Application Registry and Lifecycle Manager

Registers and validates application definitions, tracks lifecycle state, creates contexts, and cleans up failed or stopped apps.

### Event Contract Registry and EventBus

Registers event metadata; synchronously dispatches events; tracks subscription ownership; isolates handler failures; and removes subscriptions when lifecycle scopes end.

### Module Registry and Loader

Stores explicit module definitions, resolves dependencies by registered IDs, and separates reusable definitions from runtime instances.

### Capability Registry

Tracks capabilities exposed by applications. It supports discovery separately from invocation or mounting.

### Routing Coordinator and Outlet Registry

Own browser history coordination, resolve application-prefixed routes, map route destinations to shell-provided outlets, and prevent stale async results from committing.

### Application Context Factory

Creates a fresh context for each application start, including app-owned state and services plus limited facades to shared kernel infrastructure.

### Component Lifecycle and Error Infrastructure

Provide lifecycle conventions, context injection, cancellation, cleanup, and contextual error reporting.

The kernel must not own application-specific Stores, services, business rules, component styling, or physical page layout.

## 5. Application functionality and presentation

This separation allows application developers and web designers to work independently.

### Application functionality

An application owns:

- business logic and behavior
- data handling and application state
- services and routes
- component behavior
- event publishing and subscription
- capability and component exposure
- structural interfaces that its presentation uses

The functionality layer should describe meaningful UI structure and state, but should not hard-code final visual design choices.

### Application presentation

The presentation layer owns:

- component visual structure and appearance
- typography, colors, spacing, and application-specific layout
- responsive behavior
- themes and visual variations
- application-specific styles

It should be replaceable or substantially redesigned without changing business logic.

**Recommendation:** Keep the functional interface between behavior and presentation explicit. Components should expose stable semantic structure, state, inputs, and events for presentation to render. Avoid making business behavior depend on CSS class names or visual layout.

This is a separation of responsibilities, not necessarily a requirement for separate repositories, packages, or runtime modules.

### Shared Design System

A future shared design system may provide design tokens, reusable visual components, CSS conventions, light/dark themes, and responsive guidance.

Applications may use shared resources while retaining the ability to extend or override their presentation. The design system should not become a kernel dependency or dictate application business behavior.

A complex design-system package is deliberately not an initial implementation requirement.

### CSS isolation

Because multiple apps can render simultaneously, app styling must not accidentally collide with other apps or the shell.

Possible approaches include:

- scoped naming conventions, such as app/component prefixes
- CSS custom properties for tokens and app-level theming
- stylesheets scoped by application root selectors
- Shadow DOM for components that need stronger style encapsulation

These approaches can be combined. Shadow DOM offers stronger boundaries but changes style inheritance, theming, slots, and developer workflows. It should not be mandated everywhere.

**Agreed requirement:** CSS collisions must be avoided.  
**Open implementation choice:** Which scoping techniques to use per component or app.

## 6. Application definitions, contexts, and lifecycle

An application definition describes how the kernel registers and starts an app. It is not itself a running app instance.

Each application context contains:

- stable app ID and lifecycle scope
- app-owned Store and services
- app-scoped EventBus facade
- route/navigation facade
- module and capability facades
- component ownership scope
- error reporting context

Applications must not receive another app’s context or access its private services.

Illustrative definition:

```js
const taskManagement = {
  id: "tasks",
  version: "1.0.0",
  modules: ["tasks.pages"],
  routes: taskRoutes,

  createServices(context) {
    return {
      tasks: new TaskService(context.kernel.http)
    };
  },

  async start(context) {
    // Initialize app-owned resources and subscriptions.
  }
};
```

Recommended lifecycle:

```text
registered → starting → running → stopping → stopped
                  ↘ failed
registered or stopped → disposed
```

- **Register:** Validate ID and definition. No runtime context is required yet.
- **Start:** Create a fresh context, Store, and services; establish subscriptions; resolve registered modules; mount into available outlets.
- **Stop:** Prevent new route work, abort supported pending operations, unmount active views, and dispose app-owned scopes and subscriptions.
- **Restart:** Stop and start again with a fresh context and app-owned resources by default.
- **Dispose:** Permanently release app resources and registration state. Disposal is idempotent.

The kernel lifecycle manager owns these operations. The Host Shell provides rendering targets but does not start, stop, or dispose applications. Partial startup failure must unwind acquired resources without stopping unrelated apps.

## 7. Shared EventBus and contracts

### Ownership and cleanup

There is one EventBus in the kernel. Each app receives a scoped facade that tags subscriptions with its identity. Components and capability instances can create child scopes.

Each subscription records the contract ID/version, handler, owning app, optional component/capability owner, and lifecycle scope. Disposing a scope removes only its subscriptions. Apps cannot clear other apps’ subscriptions.

### Dispatch

Dispatch is synchronous initially. Each handler is invoked independently; an exception is reported for that subscriber and does not interrupt other handlers.

```js
context.events.publish("task.created", {
  task: { id: "task-123", title: "Prepare release" }
});
```

Dashboard consumes the event without knowing who published it:

```js
context.events.subscribe("task.created", event => {
  context.store.set("latestTask", event.task);
});
```

### Event contracts

Contracts are centrally registered and discoverable, with stable names and versions. Runtime payload validation can be added later. Contracts should represent facts, use plain data, and avoid exposing private app classes or Store objects.

**Recommendation:** The kernel may attach event ID, timestamp, and source app ID as metadata, but consumers should not need publisher identity for normal handling.

## 8. Application Store and state isolation

Each application context receives its own Store instance. Store implementation code may be shared; state and listeners are app-owned.

```text
Tasks Store: tasks, filters, editing state
Dashboard Store: widgets, summaries, layout preferences
```

Recommended Store semantics:

- `set()` and `setState()` notify through one consistent update path.
- Nested update behavior is explicit.
- Path subscriptions may be supported.
- Notifications may include current/previous values and changed paths.
- Direct mutation of returned state is unsupported.
- Changed branches are replaced rather than deeply compared where practical.

Cross-app data belongs in an explicit kernel service or event contract, not in a shared Store.

## 9. Module registration and loading

Modules are explicitly registered during startup using stable IDs. The loader resolves registered IDs and does not derive import paths from route text.

A module definition may declare routes, components, capabilities, dependencies, and load/factory functions.

- Definitions may be reused across applications.
- Runtime instances, state, services, and subscriptions belong to an application or capability instance.
- Stateful kernel singletons are exceptional and must be explicitly declared.

Dynamic remote discovery and complex dependency resolution are not initial requirements.

## 10. Routing and outlets

Application route ownership and rendering outlet selection are separate:

- `/tasks/...` identifies Task Management as route owner.
- A route’s outlet selects where its visual result is rendered.

The kernel owns browser history coordination. Apps register route tables and do not attach competing global `popstate` handlers.

```js
const taskRoutes = [
  { path: "/tasks", component: "tasks.list", outlet: "main" },
  { path: "/tasks/notifications", component: "tasks.notifications", outlet: "notifications" }
];
```

The kernel parses the URL, resolves the app prefix and app route, loads the registered module, resolves the requested outlet from the shell-supplied map, then commits only if the navigation remains current.

Navigation generations prevent stale async route or module loads from replacing newer content. Abort signals should cancel supported fetches, but generation checks are still needed for uncancellable work.

If a route requests an unavailable outlet, report an error for that route without stopping unrelated apps or outlets. The kernel does not guarantee the existence of a particular named outlet.

## 11. Capabilities and component embedding

### Capabilities

A capability is a declared function or service surface exposed by an app. Discovery and use are separate:

1. Discover metadata from the capability registry.
2. Select a stable capability ID/version.
3. Invoke or mount it through a facade.
4. Receive a result or handle that can be disposed.

Consumers rely on contracts, not provider internals. Capability discovery is not a permissions system; the initial environment trusts its apps.

### Components

A component is a visual capability. Dashboard may host a Task Management component in a shell-provided outlet or Dashboard-owned slot.

The provider owns construction, internal context, state, services, and component lifecycle. The host owns the location and supplies documented inputs. The kernel coordinates cleanup if either the embedding ends or the provider stops.

```js
const handle = await context.capabilities.mountComponent(
  "tasks.task-list",
  {
    target: dashboardSlot,
    props: { filter: "assigned-to-me" }
  }
);

// On host teardown:
await handle.dispose();
```

Embedding does not transfer the provider’s state or services to the host. Missing or withdrawn capabilities should produce a scoped, clear outcome.

## 12. Component lifecycle and context injection

Components receive their owning application context before initialization. They do not use a global service locator.

```text
created → context assigned → initializing → ready
                            ↘ failed
ready/initializing → disposing → disposed
```

A component scope owns subscriptions and cleanup. It receives an abort signal for supported async work. Disposal cancels pending work, removes subscriptions, and prevents post-disposal DOM updates.

The existing `loadData() → render() → wireEvents()` hooks can remain as a migration layer, with reconnection and re-render behavior clearly defined. Template loading should check HTTP status and report failures through the component error boundary.

Presentation can change independently so long as it respects the component’s documented functional inputs, outputs, and semantic structure.

## 13. Error handling and isolation

Errors should include app ID, module ID, route, outlet, component/capability ID, lifecycle phase, and original cause where available.

- EventBus errors are isolated per subscriber.
- Startup errors clean up partially created resources.
- Unmatched routes are not-found outcomes; loader and outlet failures are distinct errors.
- Component errors clean up partial initialization and may use an app-specific fallback.
- Expected business outcomes remain app-level behavior.
- One application’s failure should not stop other applications or outlets.

The kernel provides reporting infrastructure; applications may choose user-facing error presentation.

## 14. Security and CSS boundaries

Applications are trusted code in one JavaScript environment. This is not a security sandbox. The framework should still validate registered identifiers, avoid route-derived imports, treat event data as untrusted input, render user data safely, and enforce authorization in services/backend APIs.

Visual isolation is required to prevent accidental CSS interference, but it is not security isolation. Shadow DOM is one possible style boundary, not a security boundary.

## 15. Proposed high-level directory structure

```text
/
├─ index.html                    # Initial Host Shell document
├─ host-shell/
│  ├─ bootstrap.js               # Creates kernel and supplies outlet map
│  ├─ adapters/
│  │  └─ dom-outlets.js          # Optional DOM-to-outlet adapter
│  └─ styles/                    # Global layout and typography
├─ framework/
│  ├─ kernel.js
│  ├─ application-registry.js
│  ├─ lifecycle-manager.js
│  ├─ application-context.js
│  ├─ event-bus.js
│  ├─ event-contract-registry.js
│  ├─ store.js
│  ├─ module-registry.js
│  ├─ capability-registry.js
│  ├─ routing/
│  │  ├─ coordinator.js
│  │  ├─ route-resolver.js
│  │  └─ outlet-manager.js
│  ├─ components/
│  │  ├─ component-base.js
│  │  └─ page-base.js
│  └─ errors/
├─ apps/
│  ├─ task-management/
│  │  ├─ definition.js
│  │  ├─ events.js
│  │  ├─ routes.js
│  │  ├─ functionality/
│  │  │  ├─ services/
│  │  │  └─ modules/
│  │  └─ presentation/
│  │     ├─ components/
│  │     ├─ templates/
│  │     └─ styles/
│  └─ dashboard/
│     ├─ definition.js
│     ├─ events.js
│     ├─ routes.js
│     ├─ functionality/
│     └─ presentation/
├─ modules/
│  └─ shared/
└─ design-system/                 # Future optional package/area
   ├─ tokens/
   ├─ themes/
   └─ components/
```

This is a conceptual structure. `functionality/` and `presentation/` may initially be logical groupings within the existing app layout rather than separate packages.

## 16. Existing implementation and migration

The file references below match the current project structure:

- [`index.html`](D:/research/javascript/spa_web/index.html) is the existing Host Shell document. It currently defines `#app`; it can evolve to declare a small number of outlets and load the bootstrap module.
- [`app/main.js`](D:/research/javascript/spa_web/app/main.js) is the existing bootstrap entry point. It can create one kernel, supply an outlet map, register both applications, and ask the kernel to start them.
- [`app/application.js`](D:/research/javascript/spa_web/app/application.js) currently creates infrastructure and a demo app together. Kernel infrastructure creation should move into kernel composition; app-owned Stores and services should be created through application contexts.
- [`app/core/app.js`](D:/research/javascript/spa_web/app/core/app.js) is a service registry prototype. Its app-scoped use can inform context design, but it should not become cross-app global lookup.
- [`app/core/eventBus.js`](D:/research/javascript/spa_web/app/core/eventBus.js) has a basic publish/subscribe API and unsubscribe callback. Extend it with ownership scopes, contracts, and isolated handler errors.
- [`app/core/store.js`](D:/research/javascript/spa_web/app/core/store.js) can inform the app-owned Store. Its `set()` currently does not notify subscribers, so update semantics need alignment.
- [`app/core/router.js`](D:/research/javascript/spa_web/app/core/router.js), [`app/core/routeResolver.js`](D:/research/javascript/spa_web/app/core/routeResolver.js), and [`app/core/navigation.js`](D:/research/javascript/spa_web/app/core/navigation.js) are the current routing files. They can inform a kernel routing coordinator with app-prefixed routes, outlet mapping, and stale-navigation protection.
- [`app/core/routeRegistry.js`](D:/research/javascript/spa_web/app/core/routeRegistry.js) is a starting point for module lookup, but its current dynamic import path is built from a route module name. Replace that with explicit registration.
- [`app/core/componentBase.js`](D:/research/javascript/spa_web/app/core/componentBase.js) and [`app/core/pageBase.js`](D:/research/javascript/spa_web/app/core/pageBase.js) are the current component and page bases. They can be adapted for context injection, cancellation, cleanup scopes, and error boundaries.
- [`app/ui/app/components/app-view.js`](D:/research/javascript/spa_web/app/ui/app/components/app-view.js) is an initial rendering view. It can evolve into an outlet-aware renderer coordinated by the kernel.
- [`app/modules/test/manifest.js`](D:/research/javascript/spa_web/app/modules/test/manifest.js) can evolve into an explicitly registered module definition.
- [`app/services/testService.js`](D:/research/javascript/spa_web/app/services/testService.js) is app-specific service behavior. [`app/services/apiClient.js`](D:/research/javascript/spa_web/app/services/apiClient.js) might be shareable infrastructure if designed as stateless, but should only be kernel-owned by explicit decision.
- The current `styles/` directory can inform shell-global styling. Application-specific component styles should be separated or scoped as the app structure develops.

No file renames are implied by this mapping.

## 17. Revised implementation plan

Each milestone should leave a runnable example.

1. **Kernel composition, Host Shell bootstrap, and two-app registration**  
   Keep the shell simple. Have `index.html` declare a few targets and `app/main.js` create one kernel, pass the explicit outlet map, register Task Management and Dashboard, and start them.
2. **Application contexts and lifecycle management**  
   Add per-app Stores/services, startup/stop/restart/disposal, fresh restart contexts, and partial-startup cleanup.
3. **Shared EventBus and ownership**  
   Add central event contracts, app/component scopes, cleanup, synchronous isolated dispatch, and demonstrate `task.created`.
4. **Application Stores and explicit module registration**  
   Align Store notifications and register modules during startup.
5. **Routing and multiple outlets**  
   Add app-prefixed paths, route coordination, outlet mapping, and stale-navigation protection.
6. **Capability registration and discovery**  
   Expose and discover capability metadata independently from consumption.
7. **Dashboard embeds a Task Management component**  
   Use provider-owned execution, documented inputs, host targets, and cleanup tied to both lifecycles.
8. **Error handling, cancellation, tests, and documentation**  
   Add contextual errors and tests for isolation, ownership cleanup, route races, embedding cleanup, and missing outlets.

The architecture accommodates independent presentation, CSS isolation, and design-system integration, but these should not complicate the initial kernel milestones. A basic CSS scoping convention can be used early; a full design system and final encapsulation technology can be decided later.

## 18. Future enhancements deliberately excluded initially

- Multiple interchangeable shell implementations.
- A complex shell framework or layout abstraction.
- A comprehensive shared design system.
- Mandatory Shadow DOM.
- Sandboxing untrusted applications.
- Remote app downloads or dynamic discovery.
- Distributed or persistent event delivery.
- Runtime event payload validation.
- General-purpose permissions framework.
- Complex dependency injection or module dependency solving.
- Store persistence and restart state restoration.
- Event replay, retries, and delivery guarantees.
- Complex cross-app component orchestration.

## 19. Genuinely unresolved implementation details

1. **CSS isolation strategy:** naming/scoped selectors, Shadow DOM, or a combination. The requirement to prevent accidental collisions is agreed; the implementation technique is not.
2. **Functional-to-presentation interface:** how app components expose structural state and behavior to replaceable presentation code.
3. **Outlet error fallback:** whether a missing outlet only reports an error or may use a configured fallback target.
4. **Outlet map updates:** whether outlets are fixed at bootstrap or can be added/removed while apps are running.
5. **Event version compatibility and envelope fields.**
6. **Route conflict policy** for duplicate app prefixes or overlapping app routes.
7. **Capability visibility** for registered but stopped applications.
8. **Behavior of an embedded component** when its provider stops or withdraws that capability.
9. **Component props contract** for exposed visual capabilities.
10. **Which, if any, stateless services** should be shared kernel-wide.

The agreed architecture now cleanly separates the shell’s layout, the kernel’s coordination, application functionality, application presentation, and optional shared visual resources—without requiring those concerns to become separate runtime systems or delaying the initial kernel implementation.