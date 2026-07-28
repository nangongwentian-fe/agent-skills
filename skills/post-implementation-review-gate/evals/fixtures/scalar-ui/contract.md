# Frozen API documentation UI contract

- The full-screen documentation route must provide an in-app control that returns to the main application, including when opened directly without useful browser history.
- The operation content must scroll for long specifications.
- Desktop and mobile navigation must remain usable while scrolling.
- Global `body` styles must be restored when leaving the documentation route.
- Tests must exercise rendered behavior rather than infer it only from source strings.
